const inputs = document.querySelectorAll("input");

inputs.forEach((input) => {
  input.addEventListener("click", (event) => {
    harmony = event.target.value;
  });
});

const colorBox = document.querySelector(".colour-box");

let height = colorBox.offsetHeight,
  width = colorBox.offsetWidth;

window.addEventListener("resize", () => {
  height = colorBox.offsetHeight;
  width = colorBox.offsetWidth;
  console.log(height, width);
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

const elementA = document.getElementsByClassName("colour--main");
const elementB = document.getElementsByClassName("colour--dark");
const elementC = document.getElementsByClassName("colour--light");

const hueGradient = document.querySelector(".hue-gradient");
const lightGradient = document.querySelector(".light-gradient");

let xToHue = 0,
  saturation = 60,
  yToLight = 0,
  hsls,
  updating = true;

function updateColour() {
  if (updating) {
    const [hueB, hueC] = setHue(xToHue);

    hslA = `hsl(${xToHue}, ${saturation}%, ${yToLight}%)`;
    hslB = `hsl(${hueB}, ${saturation}%, ${100 - yToLight}%)`;
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
}

const textOnMain = Array.from(document.getElementsByClassName("text-on-main"));

colorBox.addEventListener("mousemove", (event) => {
  if (updating) {
    xToHue = Math.round((event.clientX / width) * 360);
    yToLight = Math.round((event.clientY / height) * 100);
    updateColour();
    const tooLight = yToLight > 58;
    textOnMain.forEach(
      (element) => (element.style.color = tooLight ? "black" : "white")
    );
  }
});

const labels = document.querySelectorAll("label");
const pageText = document.getElementsByClassName("page-text");

const copied = document.querySelector(".copied");

function setSat(key) {
  saturation =
    key === "a" ? Math.min(saturation + 1, 100) : Math.max(saturation - 1, 0);
  satText.textContent = saturation + "%";
}

const keys = ["a", "z"];
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

  if (event.key === " ") {
    updating = !updating;
  }
});

window.addEventListener("keyup", (event) => {
  const changeSat = keys.includes(event.key);
  if (changeSat) {
    keyArrows[keys.indexOf(event.key)].style.background = "hsl(0, 0%, 90%)";
    keyArrows[keys.indexOf(event.key)].style.color = "black";
  }
});
