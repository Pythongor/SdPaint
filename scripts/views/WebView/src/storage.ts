import { AudioSignalType } from "store/types";

export type ConfigType = typeof defaultConfig;
export type SettingsType = typeof defaultSettings;

export const defaultConfig = {
  enable_hr: false,
  prompt: "dark unexplored dungeon",
  seed: 3456789904,
  sampler_name: "Euler a",
  batch_size: 1,
  steps: 15,
  cfg_scale: 7,
  width: 512,
  height: 512,
  negative_prompt: "",
  controlnet_units: [
    {
      weight: 1.0,
      module: "none",
      model: "control_v11p_sd15_scribble",
      guessmode: false,
      input_image: "",
    },
  ],
};

export const defaultSettings = {
  instantMode: true,
  zenMode: false,
  audioEnabled: false,
  audioSignalType: "ringtone" as AudioSignalType,
  canvasSize: [512, 512] as [number, number],
  resultImagesCount: 4,
  isMultipleImagesModeOn: false,
};

export const storage = {
  set: (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  get: (key: string, defaultValue: any) => {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : defaultValue;
  },
  remove: (key: string) => {
    localStorage.removeItem(key);
  },
};

export const getStorageConfig = () =>
  storage.get("SdPaint_config", defaultConfig) as ConfigType;

export const syncStorageConfig = (config: Partial<ConfigType>) =>
  storage.set("SdPaint_config", { ...defaultConfig, ...config });

export const getSettings = () =>
  storage.get("SdPaint_settings", defaultSettings) as SettingsType;

export const syncSettings = (settings: Partial<SettingsType>) =>
  storage.set("SdPaint_settings", { ...defaultSettings, ...settings });
