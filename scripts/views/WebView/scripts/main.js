const brushWidthMap = [1, 2, 3, 5, 10, 15, 20, 30, 40, 50];

const state = {
  mouseX: 0,
  mouseY: 0,
  isDrawing: false,
  left: 0,
  top: 0,
  brushWidth: 2,
  erasing: false,
};

const setMouseCoordinates = (event) => {
  state.mouseX = event.clientX - state.left;
  state.mouseY = event.clientY - state.top;
};

const onload = async () => {
  const paintingCanvas = document.getElementById("paintingArea");
  const context = paintingCanvas.getContext("2d");
  const previewCanvas = document.getElementById("previewActions");
  const previewContext = previewCanvas.getContext("2d");
  context.lineWidth = 2;
  context.lineJoin = "round";
  previewContext.lineWidth = 2;
  previewContext.lineJoin = "round";

  const resize = () => {
    const { left, top } = paintingCanvas.getBoundingClientRect();
    state.left = left;
    state.top = top;
  };

  resize();
  window.addEventListener("resize", resize);
  window.addEventListener("scroll", resize);

  previewCanvas.addEventListener("mousedown", (event) => {
    setMouseCoordinates(event);
    context.fillStyle = state.erasing ? "white" : "black";
    state.isDrawing = true;
    context.beginPath();
    context.ellipse(
      state.mouseX,
      state.mouseY,
      context.lineWidth / 2,
      context.lineWidth / 2,
      0,
      0,
      2 * Math.PI
    );
    context.fill();
    context.beginPath();
    context.moveTo(state.mouseX, state.mouseY);
  });

  previewCanvas.addEventListener("mousemove", (event) => {
    setMouseCoordinates(event);
    context.strokeStyle = state.erasing ? "white" : "black";
    previewContext.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
    previewContext.fillStyle = state.erasing ? "white" : "black";
    previewContext.strokeStyle = state.erasing ? "black" : "white";
    previewContext.beginPath();
    previewContext.ellipse(
      state.mouseX,
      state.mouseY,
      previewContext.lineWidth / 2,
      previewContext.lineWidth / 2,
      0,
      0,
      2 * Math.PI
    );
    previewContext.stroke();
    previewContext.fill();

    if (state.isDrawing) {
      context.lineTo(state.mouseX, state.mouseY);
      context.stroke();
    }
  });

  previewCanvas.addEventListener("mouseup", (event) => {
    setMouseCoordinates(event);
    state.isDrawing = false;
    context.fillStyle = state.erasing ? "white" : "black";
    context.beginPath();
    context.ellipse(
      state.mouseX,
      state.mouseY,
      context.lineWidth / 2,
      context.lineWidth / 2,
      0,
      0,
      2 * Math.PI
    );
    context.fill();
    if (getSettings().fastMode) {
      generate();
    }
  });

  previewCanvas.addEventListener("mouseout", () => {
    previewContext.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
    state.isDrawing = false;
  });

  const resultCanvas = document.getElementById("result");
  const modal = document.getElementById("modal");
  resultCanvas.addEventListener("click", () => {
    if (resultCanvas.classList.contains('empty')) return
    document.body.classList.add("scrollLock");
    modal.classList.remove("hide");
  })
  modal.addEventListener("click", () => {
    document.body.classList.remove("scrollLock");
    modal.classList.add("hide");
  });

  document.addEventListener("keydown", (event) => {
    const { code, ctrlKey, shiftKey, altKey } = event;
    const { brushSlider } = getBrushElements();
    const hotkeyMap = {
      Enter: () => generate(),
      Equal: () => {
        if (+state.brushWidth < brushWidthMap.length) {
          setBrushWidth(+state.brushWidth + 1);
        }
        brushSlider.value = +state.brushWidth;
      },
      Minus: () => {
        if (+state.brushWidth > 0) {
          setBrushWidth(+state.brushWidth - 1);
        }
        brushSlider.value = +state.brushWidth;
      },
      Backspace: ({ shiftKey }) => shiftKey && clearCanvas(),
      KeyD: ({ shiftKey }) => shiftKey && downloadImage(),
    };
    hotkeyMap[code] && hotkeyMap[code]({ ctrlKey, shiftKey, altKey });
  });

  initializeToolsPanel();
  initializeFormElements();
  await initializeModels();
  await initializeModules();
};

window.addEventListener("load", onload, false);
