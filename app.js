const blockWrap = document.querySelector(".block-field");
const blockTopHint = document.querySelector(".game-hint__top");
const blockLeftHint = document.querySelector(".game-hint__left");
const popupContent = document.querySelector(".popup-content");
const statBlock = document.querySelector(".stat-content");

const state = {
  activeMatrix: mock1[randomNumber(mock1.length)],
  maxHint: {
    top: [],
    left: [],
  },
  collections: {
    cells: [],
  },
  interval: "",
  timer: false,
  audio: {
    click: true,
    context: true,
    win: true,
  },
};

const modal = new Modal(state);
const popup = new Popup();
let gameBlock = new GameBlock(state);
// add components
function startClock() {
  blockWrap.addEventListener("click", () => {
    if (state.timer) return;
    state.timer = true;
    state.interval = clock();
  });
}
startClock();
function clock(countOne = 0, countTwo = 0, countThree = 0, countFour = 0) {
  const oneNumber = document.querySelector(".time-one");
  const twoNumber = document.querySelector(".time-two");
  const threeNumber = document.querySelector(".time-three");
  const fourNumber = document.querySelector(".time-four");

  return setInterval(() => {
    countFour++;
    if (countFour === 10) {
      countFour = 0;
      countThree++;
    }
    if (countThree === 6) {
      countTwo++;
      countThree = 0;
    }
    if (countTwo === 10) {
      countOne++;
      countTwo = 0;
    }
    oneNumber.innerText = countOne;
    twoNumber.innerText = countTwo;
    threeNumber.innerText = countThree;
    fourNumber.innerText = countFour;
  }, 1000);
}
// logic
function butLogic() {
  function logicSolve() {
    document.querySelector(".game-solve").addEventListener("click", () => {
      state.collections.cells.forEach((item) => {
        const valueItem = item.getAttribute("value");

        if (valueItem === "1") {
          item.classList.remove("incorrect");
          item.classList.add("correct");
        } else {
          item.classList.remove("correct");
        }
      });
      body.classList.add("disactive");
      setTimeout(() => {
        body.classList.remove("disactive");
        modal.openModal(titleForModal.solve);
      }, 900);
    });
  }
  function logicRandom() {
    document.querySelector(".game-random").addEventListener("click", () => {
      const newQuestion = mockData[randomNumber(mockData.length)];
      
      restartGame(newQuestion);
      modal.closeModal();
      popup.closePopup();
    });
  }
  function logicReset() {
    document.querySelector(".game-reset").addEventListener("click", () => {
      state.collections.cells.forEach((item) => {
        item.classList.remove("correct");
        item.classList.remove("incorrect");
      });
      modal.openModal(titleForModal.reset);
    });
  }
  function logicSave() {
    document.querySelector(".game-save").addEventListener("click", () => {
      const obj = {
        gameId: state.activeMatrix.id,
        time: getTime(),
        collections: state.collections.cells.map((item) => item.className),
      };

      setLocalStorage("save", obj);
      alert("Игра сохранена. Если что сохраняется только одна игра.");
    });
  }

  function logicReload() {
    document.querySelector(".game-reload").addEventListener("click", () => {
      clearInterval(state.interval);
      restartGame(state.activeMatrix);
    });
  }
  function logicContinueGame() {
    document.querySelector(".last-game").addEventListener("click", () => {
      const objSaved = getLocalStorage("save");
      if (objSaved) {
        const mockGame = mockData.find((item) => item.id === objSaved.gameId);
        restartGame(mockGame, objSaved.time);
        state.collections.cells.forEach((item, index) => {
          if (objSaved.collections[index]) {
            item.classList.add(objSaved.collections[index]);
          }
        });
      } else {
        alert("у вас нету сохраненных игр... к сожалению");
      }
    });
  }
  function clickChoiceGame() {
    const button = document.querySelector(".popup-button");
    button.addEventListener("click", () => {
      document.querySelectorAll(".popup-item").forEach((nodeItem) => {
        if (nodeItem.className.includes("active")) {
          let newQuestion;
          if (nodeItem.getAttribute("num") === "random") {
            newQuestion = mockData[randomNumber(mockData.length)];
          } else {
            newQuestion = mockData.find(
              (data) => data.id === Number(nodeItem.getAttribute("num"))
            );
          }

          restartGame(newQuestion);
          modal.closeModal();
          popup.closePopup();
        }
      });
    });
  }
  function clickRestartModal() {
    const butRestart = document.querySelector(".modal-restart");
    butRestart.addEventListener("click", () => {
      restartGame(state.activeMatrix);
    });
  }
  function logicClearStat() {
    document.querySelector(".clear-stat").addEventListener("click", () => {
      setLocalStorage("stat", null);
      statBlock.innerHTML = "";
      gameBlock.createStat();
    });
  }
  function themeLogic() {
    const button = document.querySelector(".theme-but");
    const body = document.querySelector("#body");
    button.addEventListener("click", () => {
      if (body.getAttribute("theme") === "light") {
        body.setAttribute("theme", "dark");
        button.innerText = "dark";
      } else {
        body.setAttribute("theme", "light");
        button.innerText = "light";
      }
    });
  }
  function disActiveSound() {
    document.querySelectorAll(".header__sound-item").forEach((item) => {
      item.classList.add("active");
      item.addEventListener("click", () => {
        item.classList.toggle("active");
        // if(!item.className.includes('active')){
        state.audio[item.getAttribute("audio")] =
          !state.audio[item.getAttribute("audio")];
        // }
      });
    });
  }
  clickChoiceGame();
  logicReload();
  logicReset();
  logicContinueGame();
  logicRandom();
  logicSolve();
  logicSave();

  logicClearStat();

  clickRestartModal();
  themeLogic();
  disActiveSound();
}

function checkField() {
  const countHaveTrue = state.collections.cells.filter((item) => {
    return item.getAttribute("value") === "1" && item.className === "correct";
  }).length;
  const countHaveFalse = state.collections.cells.filter((item) => {
    return item.getAttribute("value") === "0" && item.className === "correct";
  }).length;

  const countNeedTrue = state.collections.cells.filter((item) => {
    return item.getAttribute("value") === "1";
  }).length;

  if (countHaveTrue === countNeedTrue && countHaveFalse === 0) {
    const audio = new Audio("./audio/win.mp3");
    if (state.audio.finish) {
      audio.play();
    }

    modal.openModal(titleForModal.win(state.activeMatrix.name, getTime()));
    const objGame = {
      gameName: state.activeMatrix.name,
      time: getTime(),
      type: state.activeMatrix.type,
      id: state.activeMatrix.id,
    };
    const dataLS = getLocalStorage("stat");
    if (dataLS) {
      let indexForExchange;
      const haveInLS = dataLS.find((item, index) => {
        indexForExchange = index;
        return item.id === objGame.id;
      });
      if (haveInLS) {
        if (timeToNumber(haveInLS.time) > timeToNumber(objGame.time)) {
          dataLS.splice(indexForExchange, indexForExchange + 1, objGame);
        }
      } else {
        dataLS.push(objGame);
      }
      setLocalStorage("stat", dataLS);
    } else {
      setLocalStorage("stat", [objGame]);
    }
  }
}
function restartGame(game, time = null) {
  gameBlock.destroy();
  state.activeMatrix = game;
  state.collections.cells = [];
  state.maxHint.left = [];
  state.maxHint.top = [];
  gameBlock = new GameBlock(state);
  modal.closeModal();
  popup.closePopup();
  clearInterval(state.interval);
  if (time) {
    const props = time
      .replace(":", "")
      .split("")
      .map((item) => Number(item));
    state.interval = clock(...props);
  } else {
    clearClockNode()
    state.timer = false;
    startClock();
  }
}
// additional
function randomNumber(max) {
  return Math.floor(Math.random() * max);
}
function setLocalStorage(game, value) {
  return localStorage.setItem(game, JSON.stringify(value));
}
function getLocalStorage(value) {
  const data = localStorage.getItem(value);
  return JSON.parse(data);
}
function clearClockNode() {
  const timeBlock = document.querySelector(".time");
  timeBlock.querySelectorAll("span").forEach((item) => {
    if (item.className.includes("tab")) return;
    item.innerHTML = "0";
  });
}
function getTime() {
  const time = document.querySelector(".time").innerText;
  return time.replace(/\n/g, "");
}
function timeToNumber(str) {
  return Number(str.replace(":", ""));
}

butLogic();
// кнопка рандома

// не забудь удалить нажатие на оверфлоу

// localStorage.clear()
