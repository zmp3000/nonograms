const body = document.querySelector("#body");

function createBase() {
  const modals = createElem("div", "modals");
  const container = createElem("div", "container");
  function createHead() {
    const header = createElem("div", "header");
    const theme = createElem("div", "theme-but", "light");

    const time = createElem("div", "time");
    time.appendChild(createElem("span", "time-one", "0"));
    time.appendChild(createElem("span", "time-two", "0"));
    time.appendChild(createElem("span", "tab", ":"));
    time.appendChild(createElem("span", "time-three", "0"));
    time.appendChild(createElem("span", "time-four", "0"));

    const nameGame = createElem("div", "header__name-game");
    const soundBlock = createElem("div", "header__sound");
    const butHeaderClick = createElem("div", "header__sound-item", "click");
    butHeaderClick.setAttribute("audio", "click");
    const butHeaderClickContext = createElem(
      "div",
      "header__sound-item",
      "click context"
    );
    butHeaderClickContext.setAttribute("audio", "context");
    const butHeaderWin = createElem("div", "header__sound-item", "win");
    butHeaderWin.setAttribute("audio", "win");
    soundBlock.appendChild(butHeaderClick);
    soundBlock.appendChild(butHeaderClickContext);
    soundBlock.appendChild(butHeaderWin);
    header.appendChild(theme);
    header.appendChild(time);
    header.appendChild(nameGame);
    header.appendChild(soundBlock);

    return header;
  }
  function createGameBlock() {
    const gameBlock = createElem("div", "game-block");

    const hintTop = createElem("div", "game-hint__top");
    const hintLeft = createElem("div", "game-hint__left");
    const blockField = createElem("div", "block-field");
    blockField.appendChild(createElem("div", "border-global"));

    gameBlock.appendChild(hintTop);
    gameBlock.appendChild(hintLeft);
    gameBlock.appendChild(blockField);
    return gameBlock;
  }
  function createActionsBlock() {
    const blockActions = createElem("div", "block-actions");
    const reloadBut = createElem("div", "actions-item", "reload");
    reloadBut.classList.add("game-reload");
    blockActions.appendChild(reloadBut);
    const resetBut = createElem("div", "actions-item", "reset");
    resetBut.classList.add("game-reset");
    blockActions.appendChild(resetBut);
    const saveBut = createElem("div", "actions-item", "save");
    saveBut.classList.add("game-save");
    blockActions.appendChild(saveBut);
    const randomBut = createElem("div", "actions-item", "random game");
    randomBut.classList.add("game-random");
    blockActions.appendChild(randomBut);
    const solveBut = createElem("div", "actions-item", "solve");
    solveBut.classList.add("game-solve");
    blockActions.appendChild(solveBut);
    return blockActions;
  }
  function createStatBlock() {
    const blockStat = createElem("div", "block-stat");
    const statTitle = createElem("div", "stat-title", "Statistic");
    statTitle.appendChild(createElem("span", "clear-stat", "clear stat"));
    blockStat.appendChild(statTitle);
    blockStat.appendChild(createElem("div", "stat-content"));
    return blockStat;
  }

  container.appendChild(createHead());
  container.appendChild(createGameBlock());
  container.appendChild(createActionsBlock());
  container.appendChild(
    createElem("div", "last-game", "Сontinue the last saved game.")
  );
  container.appendChild(createStatBlock());
  function createModalAndPopup() {
    const overlay = createElem("div", "modal-overlay");
    const modal = createElem("div", "modal");
    const popup = createElem("div", "popup");
    popup.appendChild(createElem("div", "popup-content"));
    popup.appendChild(createElem("button", "popup-button", "Change"));
    // popup.appendChild(createElem("button"));

    modal.appendChild(popup);
    modal.appendChild(createElem("h2", "a"));
    modal.appendChild(createElem("button", "open-popup", "Change game"));
    modal.appendChild(createElem("button", "modal-restart", "Restart"));
    overlay.appendChild(modal);
    return overlay;
  }
  modals.appendChild(createModalAndPopup());
  body.appendChild(container);
  body.appendChild(modals);
}

function createElem(elementName, className, inner = "") {
  const element = document.createElement(elementName);
  element.classList.add(className);
  element.innerHTML = inner;
  return element;
}
createBase();

{
  /* <div class="modal-overlay">
  <div class="modal">
    <div class="popup">
      <div class="popup-content"></div>
      <button class="popup-button">Change</button>
    </div>
    <h2></h2>
    <button class="open-popup modal-choice">Change game</button>
    <button class="modal-restart">Restart</button>
  </div>
</div>; */
}
