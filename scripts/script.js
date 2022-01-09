let side;
let rectColor;
let step;
let borderColor;
let borderWidth;
let texturePath;
let Play_message;
let Stop_message;
let Start_message;
let Close_message;
let Reload_message;
let Collision_message = "Square collided with border";
let OutOfBorder_message = "Square is out of border";
let old_content;

function readTextFile(file, callback) {
  let xhr = new XMLHttpRequest();
  xhr.overrideMimeType("application/json");
  xhr.open("GET", file, false);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status == "200") {
      callback(xhr.responseText);
    }
  };
  xhr.send();
}

function getJson() {
  readTextFile("data.json", function (text) {
	console.log(text);
    let parsedJson = JSON.parse(text);
    side = parsedJson["side"];
    rectColor = parsedJson["square_color"];
    step = parsedJson["step"];
    borderColor = parsedJson["border_color"];
    borderWidth = parsedJson["border_width"];
    texturePath = parsedJson["background"];
    Play_message = parsedJson["messagePlayButton"];
    Stop_message = parsedJson["messageStopButton"];
    Start_message = parsedJson["messageStartButton"];
    Close_message = parsedJson["messageCloseButton"];
    Reload_message = parsedJson["messageReloadButton"];
  });
}

function getFormattedDate() {
  let d = new Date();
  d =
    d.getFullYear() +
    "-" +
    ("0" + (d.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + d.getDate()).slice(-2) +
    " " +
    ("0" + d.getHours()).slice(-2) +
    ":" +
    ("0" + d.getMinutes()).slice(-2) +
    ":" +
    ("0" + d.getSeconds()).slice(-2) + 
    ":" + d.getMilliseconds();
  return d;
}

function messagesManage(message) {
  localStorage.setItem(
    "message" + (localStorage.length + 1),
    getFormattedDate() + " " + message
  );
  document.getElementById("controls_messages").textContent = message;
}

function detectOutsideAnim() {
  let rect = document.getElementById("rect");
  let anim = document.getElementById("anim");
  if (
    rect.offsetLeft + rect.offsetWidth < 0 ||
    rect.offsetLeft - rect.offsetWidth > anim.offsetWidth ||
    rect.offsetTop + rect.offsetHeight < 0 ||
    rect.offsetTop - rect.offsetHeight > anim.offsetHeight
  ) {
    messagesManage(OutOfBorder_message);
    return true;
  }
  return false;
}

function detectCollision() {
  let rect = document.getElementById("rect");
  let anim = document.getElementById("anim");
  if (
    (rect.offsetLeft <= 0 && rect.offsetLeft + rect.offsetWidth >= 0) ||
    (rect.offsetLeft >= anim.offsetWidth &&
      rect.offsetLeft - rect.offsetWidth <= anim.offsetWidth) ||
    (rect.offsetTop <= 0 && rect.offsetTop + rect.offsetHeight >= 0) ||
    (rect.offsetTop >= anim.offsetHeight &&
      rect.offsetTop - rect.offsetHeight <= anim.offsetHeight)
  ) {
    messagesManage(Collision_message);
    return true;
  }
  return false;
}

function play() {
  let item1 = document.querySelector(".class1");
  let text = document.querySelector(".class1_content");
  old_content = text.cloneNode(true);
  item1.removeChild(text);

  getJson();

  let work = document.createElement("div");
  work.id = "work";
  work.style.width = "100%";
  work.style.height = "100%";
  work.style.position = "relative";

  let anim = document.createElement("div");
  anim.id = "anim";
  anim.style.width = "calc(100% - 10px)";
  anim.style.height = "calc(100% - 50px)";
  anim.style.position = "absolute";
  anim.style.bottom = "0px";
  anim.style.borderColor = `${borderColor}`;
  anim.style.borderWidth = `${borderWidth}px`;
  anim.style.borderStyle = "solid";
  anim.style.backgroundImage = `url(${texturePath})`;
  anim.style.backgroundRepeat = "repeat";

  let controls = document.createElement("div");
  controls.id = "controls";
  controls.style.position = "relative";

  let controls_buttons = document.createElement("div");
  controls_buttons.id = "controls_buttons";
  controls_buttons.style.position = "absolute";
  controls_buttons.style.top = "0px";
  controls_buttons.style.left = "3%";
  controls_buttons.style.margin = "0";

  let controls_messages = document.createElement("div");
  controls_messages.id = "controls_messages";
  controls_messages.style.position = "absolute";
  controls_messages.style.top = "0px";
  controls_messages.style.right = "3%";
  controls_messages.style.margin = "0";

  let rect = document.createElement("div");
  rect.id = "rect";
  rect.style.width = `${side}px`;
  rect.style.height = `${side}px`;
  rect.style.backgroundColor = `${rectColor}`;
  rect.style.position = "absolute";
  rect.style.top = `calc(50% - ${side/2}px)`;
  rect.style.left = `calc(50% - ${side/2}px)`;

  let Close_button = document.createElement("button");
  Close_button.id = "Close_button";
  Close_button.textContent = "Close";
  Close_button.addEventListener("click", closeAnim);

  let Start_button = document.createElement("button");
  Start_button.id = "Start_button";
  Start_button.textContent = "Start";
  Start_button.addEventListener("click", startAnim);

  controls_buttons.appendChild(Close_button);
  controls_buttons.appendChild(Start_button);
  controls.appendChild(controls_buttons);
  controls.appendChild(controls_messages);
  anim.appendChild(rect);
  work.appendChild(controls);
  work.appendChild(anim);

  item1.appendChild(work);

  messagesManage(Play_message);
}

function startAnim() {
  messagesManage(Start_message);

  let controls_buttons = document.getElementById("controls_buttons");
  let Start_button = document.getElementById("Start_button");
  controls_buttons.removeChild(Start_button);

  let Stop_button = document.createElement("button");
  Stop_button.id = "Stop_button";
  Stop_button.textContent = "Stop";
  Stop_button.addEventListener("click", stopAnim);
  controls_buttons.appendChild(Stop_button);

  let rect = document.getElementById("rect");
  rect.style.top = `calc(50% - ${side/2}px)`;
  rect.style.left = `calc(50% - ${side/2}px)`;
  let direction = "r";
  let currentStep = Number.parseInt(step);
  let left = rect.offsetLeft;
  let top =  rect.offsetTop;
  function makeMove(direction, currentStep, step, left, top, rect) {
    setTimeout(() => {
      switch (direction) {
        case "l":
          left -= currentStep;
          rect.style.left = `${left}px`;
          break;
        case "b":
          top += currentStep;
          rect.style.top = `${top}px`;
          break;
        case "r":
          left += currentStep;
          rect.style.left = `${left}px`;
          break;
        case "t":
          top -= currentStep;
          rect.style.top = `${top}px`;
          break;
      }
      switch (direction) {
        case "r":
          direction = "b";
          break;
        case "b":
          direction = "l";
          break;
        case "l":
          direction = "t";
          break;
        case "t":
          direction = "r";
      }
      currentStep += step;
      if (detectCollision()) {
        if (document.getElementById("Reload_button") == null) {
          let controls_buttons = document.getElementById("controls_buttons");
          let Stop_button = document.getElementById("Stop_button");
          controls_buttons.removeChild(Stop_button);

          let Reload_button = document.createElement("button");
          Reload_button.id = "Reload_button";
          Reload_button.textContent = "Reload";
          Reload_button.addEventListener("click", reloadAnim);
          controls_buttons.appendChild(Reload_button);
        }
      }
      if (!detectOutsideAnim() && document.getElementById("Start_button") == null)
        makeMove(direction, currentStep + step, step, left, top, rect);
    }, 250);
  }
  makeMove(direction, currentStep, Number.parseInt(step), left, top, rect);
}

function reloadAnim() {
  messagesManage(Reload_message);

  reloadPressed=true;

  let controls_buttons = document.getElementById("controls_buttons");
  let Reload_button = document.getElementById("Reload_button");
  controls_buttons.removeChild(Reload_button);

  let Start_button = document.createElement("button");
  Start_button.id = "Start_button";
  Start_button.textContent = "Start";
  Start_button.addEventListener("click", startAnim);
  controls_buttons.appendChild(Start_button);

  let rect = document.getElementById("rect");
  rect.style.top = `calc(50% - ${side/2}px)`;
  rect.style.left = `calc(50% - ${side/2}px)`;
}

function stopAnim() {
  messagesManage(Stop_message);

  stopPressed=true;

  let controls_buttons = document.getElementById("controls_buttons");
  let Stop_button = document.getElementById("Stop_button");
  controls_buttons.removeChild(Stop_button);

  let Start_button = document.createElement("button");
  Start_button.id = "Start_button";
  Start_button.textContent = "Start";
  Start_button.addEventListener("click", startAnim);
  controls_buttons.appendChild(Start_button);
}

function closeAnim() {
  reloadPressed=true;
  messagesManage(Close_message);
  let item1 = document.querySelector(".class1");
  let work = document.getElementById("work");
  item1.removeChild(work);
  item1.appendChild(old_content);

  let log = document.getElementById("log");
  let oldList = document.getElementById("showAllMessages");
  if (oldList != null) {
    log.removeChild(oldList);
  }

  let allMessages = document.createElement("ul");
  allMessages.id = "showAllMessages";
  for (let i = 0; i < localStorage.length; i++) {
    let li = document.createElement("li");
    li.appendChild(
      document.createTextNode(localStorage.getItem(`message${i + 1}`))
    );
    allMessages.appendChild(li);
  }
  log.appendChild(allMessages);

  localStorage.clear();
}

document.getElementById("playButton").addEventListener("click", play);

