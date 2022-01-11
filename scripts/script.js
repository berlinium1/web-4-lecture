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
    ":" +
    d.getMilliseconds();
  return d;
}

function messagesManage(message) {
  localStorage.setItem(
    "msg" + (localStorage.length + 1),
    getFormattedDate() + " " + message
  );
  document.getElementById("controls_messages").textContent = message;
}

function detectOutsideAnim(x, y) {
  let width = canvas.width;
  let height = canvas.height;
  let sides = Number.parseInt(side);
  if (
    x + sides < 0 ||
    y - sides > height ||
    x - sides > width ||
    y + sides < 0
  ) {
    messagesManage(OutOfBorder_message);
    return true;
  }
  return false;
}

function detectCollision(x, y) {
  let width = canvas.width;
  let height = canvas.height;
  let sides = Number.parseInt(side);
  if (
    (x + sides >= 0 && x - sides <= 0) ||
    (y - sides <= height && y + sides >= height) ||
    (x - sides <= width && x + sides >= width) ||
    (y + sides >= 0 && y - sides <= 0)
  ) {
    messagesManage(Collision_message);
    return true;
  }
  return false;
}

function drawRect(arcX, arcY, canvas) {
  let ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.fillStyle = rectColor;
  ctx.fillRect(arcX-side/2, arcY-side/2, side, side);
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

  let canvas = document.createElement("canvas");
  canvas.id = "canvas";
  canvas.style.position = "absolute";
  canvas.style.bottom = "0";
  canvas.style.borderColor = `${borderColor}`;
  canvas.style.borderWidth = `${borderWidth}px`;
  canvas.style.borderStyle = "solid";
  canvas.style.backgroundImage = `url(${texturePath})`;
  canvas.style.backgroundRepeat = "repeat";

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
  work.appendChild(controls);
  work.appendChild(canvas);

  item1.appendChild(work);

  canvas.width = work.offsetWidth - 10;
  canvas.height = work.offsetHeight - 50;
  drawRect(canvas.width / 2, canvas.height / 2, canvas);
  x = canvas.width / 2;
  y = canvas.height / 2;

  messagesManage(Play_message);
}

let x;
let y;

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

  let direction = "r";
  let currentStep = Number.parseInt(step);
  let canvas = document.getElementById("canvas");
  drawRect(canvas.offsetWidth / 2, canvas.offsetHeight / 2, canvas);
  x = canvas.width / 2;
  y = canvas.height / 2;

  function makeMove(direction, currentStep, step, canvas, x, y) {
    setTimeout(() => {
      switch (direction) {
        case "r":
          x += currentStep;
          drawRect(x, y, canvas);
          break;
        case "b":
          y += currentStep;
          drawRect(x, y, canvas);
          break;
		    case "l":
		      x -= currentStep;
		      drawRect(x, y, canvas);
		      break;
        case "t":
          y -= currentStep;
          drawRect(x, y, canvas);
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
      if (detectCollision(x, y)) {
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
      if (
        !detectOutsideAnim(x, y) &&
        document.getElementById("Start_button") == null
      )
        makeMove(direction, currentStep + step, step, canvas, x, y);
    }, 250);
  }
  makeMove(direction, currentStep, Number.parseInt(step), canvas, x, y);
}

function reloadAnim() {
  messagesManage(Reload_message);

  let controls_buttons = document.getElementById("controls_buttons");
  let Reload_button = document.getElementById("Reload_button");
  controls_buttons.removeChild(Reload_button);

  let Start_button = document.createElement("button");
  Start_button.id = "Start_button";
  Start_button.textContent = "Start";
  Start_button.addEventListener("click", startAnim);
  controls_buttons.appendChild(Start_button);

  let canvas = document.getElementById("canvas");
  drawRect(canvas.offsetWidth / 2, canvas.offsetHeight / 2, canvas);
}

function stopAnim() {
  messagesManage(Stop_message);

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
      document.createTextNode(localStorage.getItem(`msg${i + 1}`))
    );
    allMessages.appendChild(li);
  }
  log.appendChild(allMessages);

  localStorage.clear();
}

document.getElementById("playButton").addEventListener("click", play);