const defaultConfig = {
  enable_hr: false,
  prompt: "dark unexplored dungeon",
  seed: "3456789904",
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
    },
  ],
};

const defaultSettings = { syncJSON: true, fastMode: true };

const storage = {
  set: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  get: (key, defaultValue) => {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : defaultValue;
  },
  remove: (key) => {
    localStorage.removeItem(key);
  },
};

const getConfig = () => storage.get("SdPaint_config", defaultConfig);

const syncConfig = (config) =>
  storage.set("SdPaint_config", { ...defaultConfig, ...config });

const getSettings = () => storage.get("SdPaint_settings", defaultSettings);

const syncSettings = (settings) =>
  storage.set("SdPaint_settings", { ...defaultSettings, ...settings });
