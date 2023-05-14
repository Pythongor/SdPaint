const url = "http://127.0.0.1:8000";

const getModels = () => {
  return fetch(`${url}/models`);
};

const getModules = () => fetch(`${url}/modules`);

const retryRequest = async (func, progressFunc, retries = null) => {
  const result = await fetch(`${url}/server_status`);
  const data = await result.json();
  progressFunc(data)
  if (data) {
    if (!retries) {
      retries = 1;
    } else if (retries >= 500) {
      retries = 500;
    } else retries = retries * 2;
    setTimeout(
      async () => await retryRequest(func, progressFunc, retries),
      retries
    );
  } else func();
};

const sendImage = (image) => {
  const config = getConfig();
  config.controlnet_units[0].input_image = image;
  const { syncJSON } = getSettings();
  return fetch(`${url}/paint_image`, {
    method: "post",
    body: JSON.stringify({ config, sync_json: syncJSON }),
  });
};

const getImage = async () => {
  const response = await fetch(`${url}/cn_image`);
  const blob = await response.blob();
  const imageBitMap = await createImageBitmap(blob);
  return { blob, imageBitMap };
};
