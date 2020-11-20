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
  const hueB =
      hue < 180 + harmonies[harmony]
        ? hue + (180 - harmonies[harmony])
        : hue - (180 + harmonies[harmony]),
    hueC =
      hue > 180 - harmonies[harmony]
        ? hue - (180 - harmonies[harmony])
        : hue + (180 + harmonies[harmony]);

  return [hueB, hueC];
}

const hueText = document.getElementById("hue"),
  satText = document.getElementById("sat"),
  lightText = document.getElementById("light");

function setHslText(hue, saturation, lightness) {
  hueText.textContent = hue;
  satText.textContent = saturation + "%";
  lightText.textContent = lightness + "%";
}

const elementA = document.getElementsByClassName("colour--a");
const elementB = document.getElementsByClassName("colour--b");
const elementC = document.getElementsByClassName("colour--c");

const hueGradient = document.querySelector(".hue-gradient");
const lightGradient = document.querySelector(".light-gradient");

let xToHue = 0,
  saturation = 60,
  yToLight = 0,
  hsls;

function updateColour() {
  const [hueB, hueC] = setHue(xToHue);

  hslA = `hsl(${xToHue}, ${saturation}%, ${yToLight}%)`;
  hslB = `hsl(${hueB}, ${saturation}%, ${yToLight}%)`;
  hslC = `hsl(${hueC}, ${saturation}%, ${yToLight}%)`;
  hsls = `body {
  --a: ${hslA};
  --b: ${hslB};
  --c: ${hslC};
}`;

  Array.from(elementA).forEach((element) => {
    element.style.background = hslA;
  });
  Array.from(elementB).forEach((element) => {
    element.style.background = hslB;
  });
  Array.from(elementC).forEach((element) => {
    element.style.background = hslC;
  });
  hueGradient.style.background = `linear-gradient(
    90deg,
    hsl(0, ${saturation}%, ${yToLight}%) 0%,
    hsl(36, ${saturation}%, ${yToLight}%) 10%,
    hsl(72, ${saturation}%, ${yToLight}%) 20%,
    hsl(108, ${saturation}%, ${yToLight}%) 30%,
    hsl(144, ${saturation}%, ${yToLight}%) 40%,
    hsl(180, ${saturation}%, ${yToLight}%) 50%,
    hsl(216, ${saturation}%, ${yToLight}%) 60%,
    hsl(252, ${saturation}%, ${yToLight}%) 70%,
    hsl(288, ${saturation}%, ${yToLight}%) 80%,
    hsl(324, ${saturation}%, ${yToLight}%) 90%,
    hsl(360, ${saturation}%, ${yToLight}%) 100%
  )`;
  lightGradient.style.background = `linear-gradient(
    0deg, 
    hsl(${xToHue}, ${saturation}%, 100%) 0%, 
    hsl(${xToHue}, ${saturation}%, 50%) 50%, 
    hsl(${xToHue}, ${saturation}%, 0%) 100%)`;
  setHslText(xToHue, saturation, yToLight);
}

window.addEventListener("mousemove", (event) => {
  xToHue = Math.floor((event.clientX / width) * 120);
  yToLight = Math.floor((event.clientY / height) * 100);
  updateColour();
  const tooLight = yToLight > 52;
  document.querySelector(".hsl-text--hue").style.color = tooLight
    ? "black"
    : "white";
});

const labels = document.querySelectorAll("label");
const pageText = document.getElementsByClassName("page-text");

const copied = document.querySelector(".copied");

function setSat(key) {
  saturation =
    key === "ArrowUp"
      ? Math.min(saturation + 1, 100)
      : Math.max(saturation - 1, 0);
  satText.textContent = saturation + "%";
}

const keys = ["ArrowUp", "ArrowDown"];
const keyArrows = document.querySelectorAll(".keys");

window.addEventListener("keydown", (event) => {
  const changeSat = keys.includes(event.key);
  if (changeSat) {
    setSat(event.key);
    updateColour();
    keyArrows[keys.indexOf(event.key)].style.background = "black";
    keyArrows[keys.indexOf(event.key)].style.color = "hsl(0, 0%, 90%)";
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

window.addEventListener("keyup", (event) => {
  const changeSat = keys.includes(event.key);
  if (changeSat) {
    keyArrows[keys.indexOf(event.key)].style.background = "hsl(0, 0%, 90%)";
    keyArrows[keys.indexOf(event.key)].style.color = "black";
  }
});
