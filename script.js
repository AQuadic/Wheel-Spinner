const prizes = [
    {
      text: "Microwave 10",
      color: "hsl(197 30% 43%)",
      reaction: "dancing",
      image: "./images/zmm20d38gb-fr-1500x1500 (1) (1).png"  
    },
    { 
      text: "Microwave 15",
      color: "hsl(173 58% 39%)",
      reaction: "shocked",
      image: "./images/zmm20d38gb-fr-1500x1500 (1) (1).png"  
    },
    { 
      text: "Microwave 20",
      color: "hsl(43 74% 66%)",
      reaction: "shocked",
      image: "./images/zmm20d38gb-fr-1500x1500 (1) (1).png"  
    },
    {
      text: "Microwave 25",
      color: "hsl(27 87% 67%)",
      reaction: "shocked",
      image: "./images/zmm20d38gb-fr-1500x1500 (1) (1).png"  
    },
    {
      text: "Microwave 30 pro",
      color: "hsl(12 76% 61%)",
      reaction: "dancing",
      image: "./images/zmm20d38gb-fr-1500x1500 (1) (1).png"  
    },
    {
      text: "10% Off",
      color: "hsl(350 60% 52%)",
      reaction: "laughing",
      image: "./images/zmm20d38gb-fr-1500x1500 (1) (1).png"  
    },
    {
      text: "10% Off",
      color: "hsl(91 43% 54%)",
      reaction: "laughing",
      image: "./images/zmm20d38gb-fr-1500x1500 (1) (1).png"  
    },
    {
      text: "10% Off",
      color: "hsl(140 36% 74%)",
      reaction: "dancing",
      image: "./images/zmm20d38gb-fr-1500x1500 (1) (1).png"  
    }
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
  
  const createPrizeNodes = () => {
    prizes.forEach(({ text, color, reaction, image }, i) => {
      const rotation = ((prizeSlice * i) * -1) - prizeOffset;
  
      spinner.insertAdjacentHTML(
        "beforeend",
        `<li class="prize" data-reaction=${reaction} style="--rotate: ${rotation}deg">
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
  
  const spinertia = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
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
    const selected = Math.floor(rotation / prizeSlice);
    prizeNodes[selected].classList.add(selectedClass);
    reaper.dataset.reaction = prizeNodes[selected].dataset.reaction;
  };
  
  trigger.addEventListener("click", () => {
    if (reaper.dataset.reaction !== "resting") {
      reaper.dataset.reaction = "resting";
    }
  
    trigger.disabled = true;
    rotation = Math.floor(Math.random() * 360 + spinertia(2000, 5000));
    prizeNodes.forEach((prize) => prize.classList.remove(selectedClass));
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
    selectPrize();
    wheel.classList.remove(spinClass);
    spinner.style.setProperty("--rotate", rotation);
});

setupWheel();

// Power 
// const button = document.querySelector(".btn-spin");
// const powerRectangle = document.querySelector(".power-rectangle");

// let holdStartTime = 0;
// let intervalId = null;

// const updatePowerIndicator = () => {
// const maxHoldDuration = 2000;
// const holdDuration = Date.now() - holdStartTime;
// const power = Math.min(100, (holdDuration / maxHoldDuration) * 100);

// powerRectangle.style.width = `${power}%`;
// powerRectangle.style.backgroundColor = `rgba(0, 128, 0, ${power / 100})`; 
// };

// button.addEventListener("mousedown", () => {
// holdStartTime = Date.now();
// powerRectangle.style.width = '0'; 
// powerRectangle.style.backgroundColor = 'rgba(0, 128, 0, 0)'; 

// intervalId = setInterval(updatePowerIndicator, 50);
// });

// button.addEventListener("mouseup", () => {
// clearInterval(intervalId);
// powerRectangle.style.width = '0';
// powerRectangle.style.backgroundColor = 'rgba(0, 128, 0, 0)'; 
// });

// button.addEventListener("mouseleave", () => {
// clearInterval(intervalId);
// powerRectangle.style.width = '0';
// powerRectangle.style.backgroundColor = 'rgba(0, 128, 0, 0)';
// });
const rangeSlider = document.querySelector(".power-indicator input[type='range']");

const startSpinFromSlider = () => {
    if (reaper.dataset.reaction !== "resting") {
        reaper.dataset.reaction = "resting";
    }

    trigger.disabled = true;
    const sliderValue = rangeSlider.value;
    rotation = Math.floor(sliderValue * 360 / 100) + spinertia(2000, 5000);
    prizeNodes.forEach((prize) => prize.classList.remove(selectedClass));
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

spinner.addEventListener("transitionend", () => {
    cancelAnimationFrame(tickerAnim);
    trigger.disabled = false;
    trigger.focus();
    rotation %= 360;
    selectPrize();
    wheel.classList.remove(spinClass);
    spinner.style.setProperty("--rotate", rotation);
});

setupWheel();
