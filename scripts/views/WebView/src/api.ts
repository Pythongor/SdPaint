import { getConfig, getSettings } from "./storage";
export const url = "http://127.0.0.1:8000";

export const catchError = (error: Error) => {
  const { name, message } = error;
  console.error(`${name}: ${message}`);
  return { error };
};

export const getModels = () => {
  return fetch(`${url}/models`).then(
    (response) => response.json().then((data) => ({ list: data })),
    catchError
  );
};

export const getModules = () =>
  fetch(`${url}/modules`).then(
    (response) =>
      response.json().then((data) => ({
        list: data.module_list,
        details: data.module_detail,
      })),
    catchError
  );

export const retryRequest = async (
  func: () => void,
  progressFunc: (data: any) => void,
  retries: number | null = null
) => {
  fetch(`${url}/server_status`).then((result) => {
    result.json().then((data) => {
      progressFunc(data);
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
    }, catchError);
  }, catchError);
};

export const sendImage = (image: string) => {
  const config = getConfig();
  config.controlnet_units[0].input_image = image;
  const { syncJSON } = getSettings();
  return fetch(`${url}/paint_image`, {
    method: "post",
    body: JSON.stringify({ config, sync_json: syncJSON }),
  });
};

export const getImage = async () => {
  const response = await fetch(`${url}/cn_image`);
  const blob = await response.blob();
  const imageBitMap = await createImageBitmap(blob);
  return { blob, imageBitMap };
};
