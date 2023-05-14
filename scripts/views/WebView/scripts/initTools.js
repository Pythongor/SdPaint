const getCanvases = () => {
  const paintingCanvas = document.getElementById("paintingArea");
  const resultCanvas = document.getElementById("result");
  const previewCanvas = document.getElementById("previewActions");
  return {
    paintingCanvas,
    resultCanvas,
    previewCanvas,
    context: paintingCanvas.getContext("2d"),
    resultContext: resultCanvas.getContext("2d"),
    previewContext: previewCanvas.getContext("2d"),
  };
};

const downloadImage = () => {
  const { resultCanvas } = getCanvases();
  const canvasDataURL = resultCanvas.toDataURL();
  const a = document.createElement("a");
  a.href = canvasDataURL;
  a.download = `sd_gen_${new Date().toJSON()}.png`;
  a.click();
};

const getBrushElements = () => {
  const brushSampleWrapper = document.getElementById("brushSample");
  return {
    brushSampleWrapper,
    brushSample: brushSampleWrapper.firstElementChild,
    brushSlider: document.getElementById("brushSize"),
    eraser: document.getElementById("eraser"),
  };
};

const setBrushWidth = (value) => {
  const { context, previewContext } = getCanvases();
  const { brushSample } = getBrushElements();
  const width = brushWidthMap[value - 1];
  context.lineWidth = width;
  previewContext.lineWidth = width;
  brushSample.style.width = `${width}px`;
  brushSample.style.height = `${width}px`;
  state.brushWidth = value;
};

const setEraser = () => {
  const { eraser, brushSampleWrapper, brushSample } = getBrushElements();
  eraser.addEventListener("input", (event) => {
    if (event.target.checked) {
      state.erasing = true;
      brushSampleWrapper.style.backgroundColor = "black";
      brushSample.style.backgroundColor = "white";
    } else {
      state.erasing = false;
      brushSampleWrapper.style.backgroundColor = "white";
      brushSample.style.backgroundColor = "black";
    }
  });
};

const setUpBrush = () => {
  setEraser();
  const { brushSample, brushSlider } = getBrushElements();
  brushSample.style.backgroundColor = "black";
  brushSample.style.width = "2px";
  brushSample.style.height = "2px";
  brushSlider.addEventListener("input", (event) =>
    setBrushWidth(event.target.value)
  );
};

const clearCanvas = () => {
  const { context, paintingCanvas } = getCanvases();
  context.clearRect(0, 0, paintingCanvas.width, paintingCanvas.height);
};

const toggleLoader = (loaderState) => {
  const { resultCanvas } = getCanvases();
  const action = loaderState ? "remove" : "add";
  const loader = resultCanvas.parentNode;
  loader.classList[action]("hide");
};

const generate = async () => {
  const { paintingCanvas, resultContext, resultCanvas } = getCanvases();
  const modal = document.getElementById("modal")
  const modalImage = modal.getElementsByClassName("modal_image")[0];
  const { fastMode } = getSettings();
  !fastMode && toggleLoader(true);
  const config = getConfigFromForm();
  syncConfig(config);
  const imageUrl = paintingCanvas.toDataURL();
  await sendImage(imageUrl);
  await retryRequest(async () => {
    const { imageBitMap, blob } = await getImage();
    modalImage.src = URL.createObjectURL(blob);
    resultContext.drawImage(imageBitMap, 0, 0, 512, 512);
    resultCanvas.classList.remove('empty')
    !fastMode && toggleLoader(false);
  }, (data) => {
    const progressBar = document.getElementById("cnProgress");
    progressBar.value = data * 100
  });
};

const initializeCheckboxes = () => {
  const syncJSONInput = document.getElementById("syncJSON");
  const fastModeInput = document.getElementById("fastMode");
  const { syncJSON, fastMode } = getSettings();
  syncJSONInput.checked = syncJSON;
  fastModeInput.checked = fastMode;
  syncJSONInput.addEventListener("input", (event) =>
    syncSettings({ syncJSON: event.target.checked })
  );
  fastModeInput.addEventListener("input", (event) =>
    syncSettings({ fastMode: event.target.checked })
  );
};

const initializeToolsPanel = () => {
  initializeCheckboxes();
  setUpBrush();
  const generateButton = document.getElementById("generate");
  const clearButton = document.getElementById("clear");
  const downloadButton = document.getElementById("downloadImage");
  generateButton.addEventListener("click", generate);
  clearButton.addEventListener("click", clearCanvas);
  downloadButton.addEventListener("click", downloadImage);
};
