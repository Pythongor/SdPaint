import { getStorageConfig, getSettings } from "./storage";
import { CnConfigType } from "store/types";
export const url = "http://127.0.0.1:8000";

type CustomError = {
  error: Error;
  ok: false;
};

export const catchError = (error: Error): CustomError => {
  const { name, message } = error;
  console.error(`${name}: ${message}`);
  return { error, ok: false };
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

export const getCnConfig = () => {
  return fetch(`${url}/config`).then(
    (response) => response.json().then((data) => data),
    catchError
  );
};

export const sendCnConfig = async (config: CnConfigType) => {
  const { modules, models, ...cleanConfig } = config;
  try {
    return await fetch(`${url}/config`, {
      method: "post",
      body: JSON.stringify(cleanConfig),
    });
  } catch (error) {
    return catchError(error as Error);
  }
};

type RetryRequestConfig = {
  progressFunc: (data: any) => boolean;
  retries?: number | null;
  timeout?: number;
  finalFunc: (data: any) => void;
  fetchFunc?: () => Promise<any>;
};

const retry = ({
  progressFunc,
  retries = null,
  timeout = 1,
  finalFunc,
  fetchFunc,
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
  const result = await fetchFunc().catch((error) => catchError(error));
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
