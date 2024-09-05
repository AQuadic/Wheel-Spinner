const prizes = [
  { text: "Microwave 10", color: "hsl(197 30% 43%)", reaction: "dancing", image: "./images/zmm20d38gb-fr-1500x1500.png", weight: 1 },
  { text: "Microwave 15", color: "hsl(173 58% 39%)", reaction: "shocked", image: "./images/zmm20d38gb-fr-1500x1500.png", weight: 0 }, 
  { text: "Microwave 20", color: "hsl(43 74% 66%)", reaction: "shocked", image: "./images/zmm20d38gb-fr-1500x1500.png", weight: 0 }, 
  { text: "Microwave 25", color: "hsl(27 87% 67%)", reaction: "shocked", image: "./images/zmm20d38gb-fr-1500x1500.png", weight: 2 }, 
  { text: "Microwave 30 pro", color: "hsl(12 76% 61%)", reaction: "dancing", image: "./images/zmm20d38gb-fr-1500x1500.png", weight: 4 }, 
  { text: "10% Off", color: "hsl(350 60% 52%)", reaction: "laughing", image: "./images/zmm20d38gb-fr-1500x1500.png", weight: 0 }, 
  { text: "10% Off", color: "hsl(91 43% 54%)", reaction: "laughing", image: "./images/zmm20d38gb-fr-1500x1500.png", weight: 0 }, 
  { text: "10% Off", color: "hsl(140 36% 74%)", reaction: "dancing", image: "./images/zmm20d38gb-fr-1500x1500.png", weight: 0 } 
];

const wheel = document.querySelector(".deal-wheel");
const spinner = wheel.querySelector(".spinner");
const trigger = wheel.querySelector(".btn-spin");
const ticker = wheel.querySelector(".ticker");
const reaper = wheel.querySelector(".grim-reaper");
const prizeSlice = 360 / prizes.length;
const prizeOffset = Math.floor(180 / prizes.length);
const spinClass = "is-spinning";
const selectedClass = "selected";
const spinnerStyles = window.getComputedStyle(spinner);
let tickerAnim;
let rotation = 0;
let currentSlice = 0;
let prizeNodes;
let selectedPrize;

const createPrizeNodes = () => {
  prizes.forEach(({ text, color, reaction, image }, i) => {
    const rotation = ((prizeSlice * i) * -1) - prizeOffset;
    spinner.insertAdjacentHTML(
      "beforeend",
      `<li class="prize" data-reaction="${reaction}" style="--rotate: ${rotation}deg">
        <span class="text">${text}</span>
        <img src="${image}" alt="${text}" />
      </li>`
    );
  });
};

const createConicGradient = () => {
  spinner.setAttribute(
    "style",
    `background: conic-gradient(
        from -90deg,
        ${prizes
            .map(({ color }, i) => `${color} 0 ${(100 / prizes.length) * (prizes.length - i)}%`)
            .reverse()
        }
    );`
  );
};

const setupWheel = () => {
  createConicGradient();
  createPrizeNodes();
  prizeNodes = wheel.querySelectorAll(".prize");
};

const runTickerAnimation = () => {
  const values = spinnerStyles.transform.split("(")[1].split(")")[0].split(",");
  const a = values[0];
  const b = values[1];
  let rad = Math.atan2(b, a);

  if (rad < 0) rad += (2 * Math.PI);

  const angle = Math.round(rad * (180 / Math.PI));
  const slice = Math.floor(angle / prizeSlice);

  if (currentSlice !== slice) {
    ticker.style.animation = "none";
    setTimeout(() => ticker.style.animation = null, 10);
    currentSlice = slice;
  }

  tickerAnim = requestAnimationFrame(runTickerAnimation);
};

const selectPrize = () => {
  const totalWeight = prizes.reduce((acc, prize) => acc + prize.weight, 0);

  let random = Math.random() * totalWeight;

  console.log(`Random value for selection: ${random}`);

  const selectedPrize = prizes.find(({ weight }) => (random -= weight) < 0);

  if (!selectedPrize) {
    console.error('No prize selected');
    return;
  }

  const selectedIndex = prizes.indexOf(selectedPrize);

  console.log(`Selected prize: ${selectedPrize.text}, Index: ${selectedIndex}`);

  return { prize: selectedPrize, index: selectedIndex };
};

const displayPrize = (selectedPrize) => {
  const congratsMessage = document.getElementById("congratulations");
  const congratsText = document.getElementById("congratulations-text");
  const congratsImage = document.getElementById("congratulations-image");

  if (congratsMessage && congratsText && congratsImage) {
    congratsText.innerText = `Congratulations! You won ${selectedPrize.text}!`;
    congratsImage.src = selectedPrize.image;
    congratsMessage.style.display = 'flex';
    congratsMessage.style.flexDirection = 'column';
    congratsMessage.style.alignItems = 'center';    
  }
};

trigger.addEventListener("click", () => {
  if (reaper.dataset.reaction !== "resting") {
    reaper.dataset.reaction = "resting";
  }

  trigger.disabled = true;
  prizeNodes.forEach((prize) => prize.classList.remove(selectedClass));

  const { prize, index } = selectPrize() || {};
  if (!prize) return;

  selectedPrize = prize;
  const rotationPerSlice = 360 / prizes.length;
  const randomOffset = Math.floor(Math.random() * rotationPerSlice);
  const targetRotation = index * rotationPerSlice + randomOffset;

  rotation = 360 * 5 + targetRotation; 
  wheel.classList.add(spinClass);
  spinner.style.setProperty("--rotate", rotation);
  ticker.style.animation = "none";
  runTickerAnimation();
});

spinner.addEventListener("transitionend", () => {
  cancelAnimationFrame(tickerAnim);
  trigger.disabled = false;
  trigger.focus();
  rotation %= 360;
  wheel.classList.remove(spinClass);
  spinner.style.setProperty("--rotate", rotation);

  if (selectedPrize) {
    const selectedIndex = prizes.findIndex(prize => prize.text === selectedPrize.text);
    prizeNodes[selectedIndex].classList.add(selectedClass);
    displayPrize(selectedPrize);
    selectedPrize = null;
  }

  resetSlider();
});

const rangeSlider = document.querySelector(".power-indicator input[type='range']");

const startSpinFromSlider = () => {
  if (reaper.dataset.reaction !== "resting") {
    reaper.dataset.reaction = "resting";
  }

  trigger.disabled = true;
  prizeNodes.forEach((prize) => prize.classList.remove(selectedClass));

  const { prize, index } = selectPrize() || {};
  if (!prize) return;

  selectedPrize = prize;
  const rotationPerSlice = 360 / prizes.length;
  const randomOffset = Math.floor(Math.random() * rotationPerSlice);
  const targetRotation = index * rotationPerSlice + randomOffset;

  rotation = 360 * 5 + targetRotation; 
  wheel.classList.add(spinClass);
  spinner.style.setProperty("--rotate", rotation);
  ticker.style.animation = "none";
  runTickerAnimation();
};

const handleSliderRelease = () => {
  startSpinFromSlider();
};

rangeSlider.addEventListener("mouseup", handleSliderRelease);
rangeSlider.addEventListener("touchend", handleSliderRelease);

const resetSlider = () => {
  rangeSlider.value = 100;
};

setupWheel();
