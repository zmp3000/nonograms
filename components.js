class Modal {
  constructor(state) {
    this.modalOverlay = document.querySelector(".modal-overlay ");
    this.modal = document.querySelector(".modal");
    this.state = state;
    document.querySelectorAll(".open-modal").forEach((el) => {
      el.addEventListener("click", (e) => {
        this.modal.classList.add("modal--visible");
        this.modalOverlay.classList.add("modal-overlay--visible");
      });
    });

    // this.modalOverlay.addEventListener("click", (e) => {
    //   if (e.target === this.modalOverlay) {
    //     this.modalOverlay.classList.remove("modal-overlay--visible");
    //     this.modal.classList.remove("modal--visible");
    //   }
    // });
  }
  openModal(title) {
    document.querySelector("h2").innerText = title;
    this.modal.classList.add("modal--visible");
    this.modalOverlay.classList.add("modal-overlay--visible");
    clearInterval(state.interval);
  }
  closeModal() {
    this.modalOverlay.classList.remove("modal-overlay--visible");
    this.modal.classList.remove("modal--visible");
  }
}

class Popup {
  constructor() {
    this.popupBlock = document.querySelector(".popup");
    this.buttons = document.querySelectorAll(".open-popup");
    this.buttons.forEach((item) => {
      item.addEventListener("click", () => {
        this.popupBlock.classList.add("active");
      });
    });
  }
  create() {}
  openPopup() {
    this.popupBlock.classList.add("active");
  }
  closePopup() {
    this.popupBlock.classList.remove("active");
  }
}
class GameBlock {
  constructor(state) {
    this.state = state;
    setMaxHint();
    document.querySelector(".header__name-game").innerHTML =
      state.activeMatrix.name;
    this.createField();
    this.createBorderField();

    this.createHintBlocks();
    this.createPopupContent();
    this.createStat();
  }
  createField() {
    function contextClickCell(event) {
      event.preventDefault();
      const audio = new Audio("./audio/clickContext.mp3");
      if (state.audio.context) {
        audio.play();
      }
      event.target.classList.remove("correct");
      event.target.classList.toggle("incorrect");
      checkField();
    }
    function clickCell(event) {
      const audio = new Audio("./audio/click.mp3");
      if (state.audio.click) {
        audio.play();
      }
      event.target.classList.remove("incorrect");
      event.target.classList.toggle("correct");
      checkField();
    }
    blockWrap.style.gridTemplateColumns = `repeat(${this.state.activeMatrix.matrix[0].length}, 1fr)`;
    this.state.activeMatrix.matrix.forEach((itemRow) => {
      itemRow.forEach((item) => {
        const div = document.createElement("div");
        const span = document.createElement("span");
        div.classList.add("block-item");
        span.setAttribute("value", item);

        // span.innerText = item;
        span.addEventListener("click", clickCell);
        span.addEventListener("contextmenu", contextClickCell);
        div.appendChild(span);
        state.collections.cells.push(span);
        blockWrap.appendChild(div);
      });
    });
  }
  createBorderField() {
    // document.querySelector(".border-global");
    const blockBorder = document.createElement("div");
    blockBorder.classList.add("border-global");

    blockBorder.style.gridTemplateColumns = `repeat(${
      this.state.activeMatrix.matrix[0].length / 5
    }, 1fr)`;
    for (
      let index = (this.state.activeMatrix.matrix[0].length / 5) ** 2;
      index > 0;
      index--
    ) {
      const div = document.createElement("div");
      div.classList.add("border-global__item");
      blockBorder.appendChild(div);
    }
    blockWrap.appendChild(blockBorder);
  }
  createHintBlocks() {
    blockTopHint.style.gridTemplateColumns = `repeat(${this.state.activeMatrix.matrix[0].length}, 1fr)`;
    blockLeftHint.style.gridTemplateRows = `repeat(${this.state.activeMatrix.matrix[0].length}, 1fr)`;
    // create top

    this.state.maxHint.top.forEach((block) => {
      const div = document.createElement("div");
      div.classList.add("hint-top__item");
      block.forEach((number) => {
        const span = document.createElement("span");
        span.classList.add("hint-number");
        if (number !== 0) {
          span.innerHTML = number;
        }

        div.appendChild(span);
      });
      blockTopHint.appendChild(div);
    });

    // create left

    this.state.maxHint.left.forEach((block) => {
      const div = document.createElement("div");
      div.classList.add("hint-left__item");
      block.forEach((number) => {
        const span = document.createElement("span");
        span.classList.add("hint-number");
        if (number !== 0) {
          span.innerHTML = number;
        }

        div.appendChild(span);
      });

      blockLeftHint.appendChild(div);
    });
  }
  createPopupContent() {
    let prevItem;
    mockData.forEach((item) => {
      const div = document.createElement("div");
      div.classList.add("popup-item");
      div.setAttribute("num", item.id);
      div.addEventListener("click", () => {
        if (prevItem) {
          prevItem.classList.remove("active");
        }

        div.classList.add("active");
        prevItem = div;
      });
      div.innerHTML = `${item.name} : ${item.type}`;
      popupContent.appendChild(div);
    });
    const div = document.createElement("div");
    div.classList.add("popup-item");
    div.setAttribute("num", "random");
    div.innerHTML = "random";
    div.addEventListener("click", () => {
      if (prevItem) {
        prevItem.classList.remove("active");
      }

      div.classList.add("active");
      prevItem = div;
    });
    popupContent.appendChild(div);
  }
  createStat() {
    const statArray = getLocalStorage("stat");

    if (statArray) {
      statArray.sort((a, b) => timeToNumber(a.time) - timeToNumber(b.time));

      statArray.forEach((item, index) => {
        if (index > 4) return;
        const div = document.createElement("div");
        div.classList.add("stat-item");
        const span = {
          one: document.createElement("span"),
          two: document.createElement("span"),
          three: document.createElement("span"),
        };
        span.one.classList.add("stat-item_name");
        span.two.classList.add("stat-item_time");
        span.three.classList.add("stat-item_type");

        span.one.innerText = item.gameName;
        span.two.innerText = item.time;
        span.three.innerText = item.type;
        div.appendChild(span.one);
        div.appendChild(span.two);
        div.appendChild(span.three);
        statBlock.appendChild(div);
      });
    } else {
      statBlock.innerHTML = "пока нечего вам показать товарищ";
    }
  }
  destroy() {
    blockWrap.innerHTML = "";
    blockLeftHint.innerHTML = "";
    blockTopHint.innerHTML = "";
    popupContent.innerHTML = "";
    statBlock.innerHTML = "";
  }
}

function setMaxHint() {
  let count = 0;
  let maxTop = 0;
  for (let i = 0; i < state.activeMatrix.matrix.length; i++) {
    const arr = [];
    state.activeMatrix.matrix.forEach((row, index) => {
      if (row[i] === 1) {
        count++;
      } else {
        if (count !== 0) {
          arr.push(count);
          count = 0;
        }
      }
      // для последней итерации
      if (index === state.activeMatrix.matrix.length - 1) {
        if (count !== 0) {
          arr.push(count);
          count = 0;
        }
      }
    });
    state.maxHint.top.push(arr);
    if (maxTop < arr.length) {
      maxTop = arr.length;
    }
  }
  //   заполнение для нужной длинны верх
  state.maxHint.top = state.maxHint.top.map((item) => {
    const iteration = maxTop - item.length;
    for (let i = 0; i < iteration; i++) {
      item.unshift(0);
    }
    return item;
  });

  let maxLeft = 0;
  for (let i = 0; i < state.activeMatrix.matrix.length; i++) {
    const arr = [];
    state.activeMatrix.matrix[i].forEach((row, index) => {
      if (row === 1) {
        count++;
      } else {
        if (count !== 0) {
          arr.push(count);

          count = 0;
        }
      }
      // для последней итерации
      if (index === state.activeMatrix.matrix.length - 1) {
        if (count !== 0) {
          arr.push(count);
          count = 0;
        }
      }

      if (maxLeft < arr.length) {
        maxLeft = arr.length;
      }
    });
    state.maxHint.left.push(arr);
    // state.maxHint.left = maxLeft;
  }
  //   заполнение для нужной длинны лево
  state.maxHint.left = state.maxHint.left.map((item) => {
    const iteration = maxLeft - item.length;
    for (let i = 0; i < iteration; i++) {
      item.unshift(0);
    }
    return item;
  });
  //   }
}
