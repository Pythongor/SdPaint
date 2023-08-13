import { ConfigType } from "storage";

export const extractDataFromConfig = ({
  seed,
  steps,
  batch_size,
  cfg_scale,
  prompt,
  negative_prompt,
  controlnet_units: [{ module, model }],
  width,
  height,
  tiling,
}: ConfigType) => ({
  seed,
  steps,
  cfg_scale,
  negative_prompt,
  prompt,
  module,
  model,
  batch_size,
  width,
  height,
  tiling,
});

export const deepCopy = <T>(target: T): T => {
  if (target === null) {
    return target;
  }
  if (target instanceof Date) {
    return new Date(target.getTime()) as any;
  }
  if (target instanceof Array) {
    const cp = [] as any[];
    (target as any[]).forEach((v) => {
      cp.push(v);
    });
    return cp.map((n: any) => deepCopy<any>(n)) as any;
  }
  if (typeof target === "object") {
    const cp = { ...(target as { [key: string]: any }) } as {
      [key: string]: any;
    };
    Object.keys(cp).forEach((k) => {
      cp[k] = deepCopy<any>(cp[k]);
    });
    return cp as T;
  }
  return target;
};

export const addBase64Prefix = (decodedData: string) =>
  `data:image/png;base64,${decodedData}`;
