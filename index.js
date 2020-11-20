const inputs = document.querySelectorAll("input");

inputs.forEach((input) => {
  input.addEventListener("click", (event) => {
    harmony = event.target.value;
  });
});

let height = document.body.offsetHeight,
  width = document.body.offsetWidth / 3;

window.addEventListener("resize", () => {
  height = document.body.offsetHeight;
  width = document.body.offsetWidth / 3;
});

const harmonies = { split: 30, triad: 60, analogous: 150 };
let harmony = "triad";

function setHue(hue) {
  let hueLeft, hueRight;
  hueLeft =
    hue < 180 + harmonies[harmony]
      ? hue + (180 - harmonies[harmony])
      : hue - (180 + harmonies[harmony]);
  hueRight =
    hue > 180 - harmonies[harmony]
      ? hue - (180 - harmonies[harmony])
      : hue + (180 + harmonies[harmony]);

  return [hueLeft, hueRight];
}

const hueText = document.getElementById("hue"),
  satText = document.getElementById("sat"),
  lightText = document.getElementById("light");

function setHslText(hue, saturation, lightness) {
  hueText.textContent = hue;
  satText.textContent = saturation + "%";
  lightText.textContent = lightness + "%";
}

const blocks = document.querySelectorAll(".block");

let xToHue = 0,
  saturation = 60,
  yToLight = 0;

blocks.forEach((block, index) => {
  const left = index > 0 ? index - 1 : 2;
  const right = index < 2 ? index + 1 : 0;

  window.addEventListener("mousemove", (event) => {
    xToHue = Math.floor((event.clientX / width) * 120);
    yToLight = Math.floor((event.clientY / height) * 100);

    const [hueLeft, hueRight] = setHue(xToHue);

    hslLeft = `hsl(${hueLeft}, ${saturation}%, ${yToLight}%)`;
    hsl = `hsl(${xToHue}, ${saturation}%, ${yToLight}%)`;
    hslRight = `hsl(${hueRight}, ${saturation}%, ${yToLight}%)`;

    blocks[left].style.background = hslLeft;
    block.style.background = hsl;
    blocks[right].style.background = hslRight;

    hsls = `body {
  --a: ${hsl};
  --b: ${hslLeft};
  --c: ${hslRight};
}`;
  });
});

const labels = document.querySelectorAll("label");
const pageText = document.getElementsByClassName("page-text");
const rules = document.querySelector(".rules");

const text = [...labels, ...pageText, rules];

const article = document.querySelector("article");

window.addEventListener("mousemove", (event) => {
  setHslText(xToHue, saturation, yToLight);
  const darkBg = event.clientY / height < 0.57;
  text.forEach((element) => {
    element.style.color = darkBg ? "white" : "black";
  });
  article.style.backgroundColor = darkBg ? "white" : "black";
  article.style.color = darkBg ? "black" : "white";
});

rules.addEventListener("click", (event) => {
  article.style.opacity = "1";
});

const copied = document.querySelector(".copied");

function setSat(key) {
  saturation =
    key === "ArrowUp"
      ? Math.min(saturation + 1, 100)
      : Math.max(saturation - 1, 0);
  satText.textContent = saturation + "%";
}

window.addEventListener("keydown", (event) => {
  const changeSat = event.key === "ArrowUp" || event.key === "ArrowDown";
  if (changeSat) {
    setSat(event.key);
  }

  if (event.key === "Enter") {
    copied.style.opacity = ".75";
    setTimeout(() => {
      copied.style.opacity = "0";
    }, 1500);
    const cssVars = document.createElement("textarea");
    cssVars.innerHTML = hsls;
    document.body.appendChild(cssVars);
    cssVars.select();
    document.execCommand("copy");
    document.body.removeChild(cssVars);
  }
});
