const getFormElements = () => ({
  seedInput: document.getElementById("seed"),
  promptInput: document.getElementById("prompt"),
  stepsInput: document.getElementById("steps"),
  cfgInput: document.getElementById("cfg_scale"),
  batchInput: document.getElementById("batch_size"),
  negativePrompt: document.getElementById("negativePrompt"),
  modelSelect: document.getElementById("model"),
  moduleSelect: document.getElementById("module"),
});

const initializeSelect = async ({
  inputName,
  getFunc,
  listName,
  unitField,
}) => {
  const input = getFormElements()[inputName];
  const response = await getFunc();
  const data = await response.json();
  const config = getConfig();
  const currentValue = config.controlnet_units[0][unitField];
  const options = (data[listName] ?? data).map((name) => {
    const option = document.createElement("option");
    option.textContent = name;
    option.value = name;
    if (name === currentValue) option.selected = true;
    return option;
  });
  input.append(...options);
  input.addEventListener("change", () => {
    config.controlnet_units[0][unitField] = input.value;
    syncConfig(config);
  });
};

const initializeModels = async () =>
  initializeSelect({
    inputName: "modelSelect",
    getFunc: getModels,
    listName: "model_list",
    unitField: "model",
  });

const initializeModules = async () =>
  initializeSelect({
    inputName: "moduleSelect",
    getFunc: getModules,
    listName: "module_list",
    unitField: "module",
  });

const initializeFormElements = () => {
  const {
    seedInput,
    promptInput,
    stepsInput,
    cfgInput,
    batchInput,
    negativePrompt,
  } = getFormElements();
  const { seed, steps, cfg_scale, batch_size, prompt, negative_prompt } =
    getConfig();
  seedInput.value = seed;
  stepsInput.value = steps;
  cfgInput.value = cfg_scale;
  batchInput.value = batch_size;
  promptInput.value = prompt;
  negativePrompt.value = negative_prompt;
  seedInput.addEventListener("input", (event) =>
    syncConfig({ seed: event.target.value })
  );
  promptInput.addEventListener("input", (event) =>
    syncConfig({ prompt: event.target.value })
  );
  stepsInput.addEventListener("input", (event) =>
    syncConfig({ steps: event.target.value })
  );
  cfgInput.addEventListener("input", (event) =>
    syncConfig({ cfg_scale: event.target.value })
  );
  batchInput.addEventListener("input", (event) =>
    syncConfig({ batch_size: event.target.value })
  );
  negativePrompt.addEventListener("input", (event) =>
    syncConfig({ negative_prompt: event.target.value })
  );
};

const getConfigFromForm = () => {
  const config = getConfig();
  const {
    seedInput,
    promptInput,
    stepsInput,
    cfgInput,
    batchInput,
    negativePrompt,
    modelSelect,
    moduleSelect,
  } = getFormElements();
  const firstUnit = config.controlnet_units[0];
  firstUnit.model = modelSelect.value;
  firstUnit.module = moduleSelect.value;
  return {
    seed: seedInput.value,
    steps: stepsInput.value,
    cfg_scale: cfgInput.value,
    batch_size: batchInput.value,
    prompt: promptInput.value,
    negative_prompt: negativePrompt.value,
    controlnet_units: [firstUnit],
  };
};
