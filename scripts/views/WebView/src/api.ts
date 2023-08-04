import { addBase64Prefix, extractDataFromConfig } from "helpers";
import { getStorageConfig } from "./storage";
import { CnConfigType, ResultInfoType, ResultType } from "store/types";
import { addPopup } from "store/actions";

type AddPopupAction = typeof addPopup;

export const url = "http://127.0.0.1:8000";

type CustomError = {
  error: Error;
  ok: false;
};

export const catchError = (
  error: Error,
  addPopup: AddPopupAction
): CustomError => {
  const { name, message } = error;
  console.error(`${name}: ${message}`);
  addPopup({ message: `${name}: ${message}`, popupType: "error" });
  return { error, ok: false };
};

export const getModels = (addPopup: AddPopupAction) => {
  return fetch(`${url}/models`).then(
    (response) => response.json().then((data) => ({ list: data })),
    (error: Error) => catchError(error, addPopup)
  );
};

export const getModules = (addPopup: AddPopupAction) =>
  fetch(`${url}/modules`).then(
    (response) =>
      response.json().then((data) => ({
        list: data.module_list,
        details: data.module_detail,
      })),
    (error: Error) => catchError(error, addPopup)
  );

export const getCnConfig = (addPopup: AddPopupAction) => {
  return fetch(`${url}/config`).then(
    (response) => response.json().then((data) => extractDataFromConfig(data)),
    (error: Error) => catchError(error, addPopup)
  );
};

export const skipRendering = (addPopup: AddPopupAction) => {
  return fetch(`${url}/skip`, { method: "post" }).then(
    (response) => response.json(),
    (error: Error) => catchError(error, addPopup)
  );
};

export const sendCnConfig = async (
  config: CnConfigType,
  addPopup: AddPopupAction
) => {
  const { modules, models, ...cleanConfig } = config;
  try {
    return await fetch(`${url}/config`, {
      method: "post",
      body: JSON.stringify(cleanConfig),
    });
  } catch (error) {
    return catchError(error as Error, addPopup);
  }
};

type RetryRequestConfig = {
  progressFunc: (data: any) => boolean;
  retries?: number | null;
  timeout?: number;
  finalFunc: (data: any) => void;
  fetchFunc?: () => Promise<any>;
  addPopup: AddPopupAction;
};

const retry = ({
  progressFunc,
  retries = null,
  timeout = 1,
  finalFunc,
  fetchFunc,
  addPopup: AddPopupAction,
}: RetryRequestConfig) => {
  if (timeout >= 500) {
    timeout = 500;
  } else timeout = timeout * 2;
  return new Promise((resolve, reject) => {
    setTimeout(
      async () =>
        resolve(
          await retryRequest({
            progressFunc,
            retries: retries ? retries - 1 : null,
            timeout,
            finalFunc,
            fetchFunc,
            addPopup,
          })
        ),
      timeout
    );
  });
};

export const retryRequest = async (config: RetryRequestConfig) => {
  const {
    fetchFunc = async () => (await fetch(`${url}/server_status`)).json(),
  } = config;
  const result = await fetchFunc().catch((error) =>
    catchError(error, config.addPopup)
  );
  if (config.retries === 0) return config.finalFunc(result);
  if (result && result?.ok === false) {
    return retry(config);
  } else {
    const needRetry = config.progressFunc(result);
    if (needRetry) {
      return retry(config);
    } else return config.finalFunc(result);
  }
};

export const sendImage = (image: string) => {
  const config = getStorageConfig();
  config.controlnet_units[0].input_image = image;
  return fetch(`${url}/paint_image`, {
    method: "post",
    body: JSON.stringify({ config }),
  });
};

export const getImage = async (addPopup: AddPopupAction) => {
  const response = await fetch(`${url}/cn_image`);
  const json = (await response.json()) as Omit<ResultType, "info"> & {
    info: string;
  };
  try {
    console.log(json);
    JSON.parse(json.info);
  } catch (error) {
    return catchError(error as Error, addPopup);
  }
  const parsedInfo = JSON.parse(json.info) as ResultInfoType;
  const images: string[] = [];
  if ("image" in json) {
    images.push(addBase64Prefix(json.image as string));
  } else if ("batch_images" in json) {
    const batch_images = json.batch_images as string[];
    images.push(...batch_images.map((image) => addBase64Prefix(image)));
  }
  return { ...json, info: parsedInfo, images };
};
