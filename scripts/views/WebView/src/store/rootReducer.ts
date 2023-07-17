import { createReducer } from "typesafe-actions";
import { ActionType, StateType } from "./types";
import actions from "./actions";

const initialState: Readonly<StateType> = {
  scrollTop: 0,
  modal: null,
  isZenModeOn: false,
  cnProgress: 0,
  resultImages: [],
  paintImagesStack: [],
  emptyImage: "",
  currentPaintImageIndex: -1,
  instantGenerationMode: true,
  brushConfig: {
    isErasingByMouse: false,
    isErasingBySwitch: false,
    width: 2,
    brushType: "pencil",
    withFill: false,
  },
  cnConfig: {
    seed: -1,
    prompt: "dark unexplored dungeon",
    negative_prompt: "",
    steps: 15,
    cfg_scale: 7,
    batch_size: 1,
    models: ["control_v11p_sd15_scribble"],
    model: "control_v11p_sd15_scribble",
    modules: ["none"],
    module: "none",
  },
  audio: {
    isEnabled: false,
    isReady: false,
    signalType: "ringtone",
  },
  canvasSize: [512, 512],
  resultSize: [512, 512],
};

const IMAGES_CLIP_BUFFER_OVERFLOW = 20;

export default createReducer<StateType, ActionType>(initialState)
  .handleAction(actions.setErasingBySwitch, (state, { payload }) => {
    if (payload === "switch")
      return {
        ...state,
        brushConfig: {
          ...state.brushConfig,
          isErasingBySwitch: !state.brushConfig.isErasingBySwitch,
        },
      };
    return {
      ...state,
      brushConfig: { ...state.brushConfig, isErasingBySwitch: payload },
    };
  })
  .handleAction(actions.setErasingByMouse, (state, { payload }) => {
    return { ...state, isErasingByMouse: payload };
  })
  .handleAction(actions.setScrollTop, (state, { payload }) => ({
    ...state,
    scrollTop: payload,
  }))
  .handleAction(actions.setBrushWidth, (state, { payload }) => {
    if (
      ["ellipse", "rectangle"].includes(state.brushConfig.brushType) &&
      state.brushConfig.withFill
    )
      return state;
    if (payload === "-") {
      return {
        ...state,
        brushConfig: {
          ...state.brushConfig,
          width: Math.max(1, state.brushConfig.width - 1),
        },
      };
    } else if (payload === "+")
      return {
        ...state,
        brushConfig: {
          ...state.brushConfig,
          width: Math.min(10, state.brushConfig.width + 1),
        },
      };
    return {
      ...state,
      brushConfig: {
        ...state.brushConfig,
        width: payload,
      },
    };
  })
  .handleAction(actions.setBrushType, (state, { payload }) => ({
    ...state,
    brushConfig: {
      ...state.brushConfig,
      brushType: payload,
    },
  }))
  .handleAction(actions.setBrushFilling, (state, { payload }) => {
    if (
      !["ellipse", "rectangle"].includes(state.brushConfig.brushType) ||
      state.brushConfig.isErasingBySwitch ||
      state.brushConfig.isErasingByMouse
    )
      return state;
    if (payload === "switch")
      return {
        ...state,
        brushConfig: {
          ...state.brushConfig,
          withFill: !state.brushConfig.withFill,
        },
      };
    return {
      ...state,
      brushConfig: {
        ...state.brushConfig,
        withFill: payload,
      },
    };
  })
  .handleAction(actions.setCnProgress, (state, { payload }) => ({
    ...state,
    cnProgress: payload,
  }))
  .handleAction(actions.setModal, (state, { payload }) => {
    return { ...state, modal: payload };
  })
  .handleAction(actions.setZenMode, (state, { payload }) => {
    if (payload === "switch")
      return {
        ...state,
        isZenModeOn: !state.isZenModeOn,
        scrollTop: state.scrollTop + 0.01,
      };
    return {
      ...state,
      isZenModeOn: payload,
      scrollTop: state.scrollTop + 0.01,
    };
  })
  .handleAction(actions.setResultImages, (state, { payload }) => ({
    ...state,
    resultImages: payload,
  }))
  .handleAction(actions.setEmptyImage, (state, { payload }) => ({
    ...state,
    emptyImage: payload,
    paintImagesStack: [payload],
    currentPaintImageIndex: 0,
  }))
  .handleAction(actions.setPaintImage, (state, { payload }) => {
    const { paintImagesStack, currentPaintImageIndex } = state;
    const isStackEmpty = !paintImagesStack.length;
    const isOverflow = paintImagesStack.length >= IMAGES_CLIP_BUFFER_OVERFLOW;
    const oldIndex = isStackEmpty ? 0 : currentPaintImageIndex;
    const areSame = paintImagesStack[oldIndex] === payload;

    const newStack: string[] = [];
    const newIndex =
      areSame || isOverflow
        ? oldIndex
        : Math.min(IMAGES_CLIP_BUFFER_OVERFLOW, currentPaintImageIndex + 1);

    if (areSame) {
      newStack.push(...paintImagesStack);
    } else if (oldIndex >= paintImagesStack.length - 1) {
      if (isOverflow) {
        const sliceStart =
          paintImagesStack.length - IMAGES_CLIP_BUFFER_OVERFLOW + 1;
        newStack.push(...paintImagesStack.slice(sliceStart), payload);
      } else {
        newStack.push(...paintImagesStack, payload);
      }
    } else {
      newStack.push(...paintImagesStack.slice(0, newIndex), payload);
    }
    return {
      ...state,
      paintImagesStack: newStack,
      currentPaintImageIndex: newIndex,
    };
  })
  .handleAction(actions.increasePaintImageIndex, (state) => {
    const currentPaintImageIndex = Math.min(
      IMAGES_CLIP_BUFFER_OVERFLOW,
      state.paintImagesStack.length - 1,
      state.currentPaintImageIndex + 1
    );
    return { ...state, currentPaintImageIndex };
  })
  .handleAction(actions.decreasePaintImageIndex, (state) => {
    const currentPaintImageIndex = Math.max(
      0,
      state.currentPaintImageIndex - 1
    );
    return { ...state, currentPaintImageIndex };
  })
  .handleAction(actions.setCnConfig, (state, { payload }) => ({
    ...state,
    cnConfig: { ...state.cnConfig, ...payload },
  }))
  .handleAction(actions.setInstantGenerationMode, (state, { payload }) => {
    if (payload === "switch")
      return { ...state, instantGenerationMode: !state.instantGenerationMode };
    return { ...state, instantGenerationMode: payload };
  })
  .handleAction(actions.setAudioEnabled, (state, { payload }) => {
    if (payload === "switch")
      return {
        ...state,
        audio: { ...state.audio, isEnabled: !state.audio.isEnabled },
      };
    return {
      ...state,
      audio: { ...state.audio, isEnabled: payload },
    };
  })
  .handleAction(actions.setAudioReady, (state, { payload }) => ({
    ...state,
    audio: { ...state.audio, isReady: payload },
  }))
  .handleAction(actions.setAudioSignalType, (state, { payload }) => ({
    ...state,
    audio: { ...state.audio, signalType: payload },
  }))
  .handleAction(actions.setCanvasWidth, (state, { payload }) => ({
    ...state,
    canvasSize: [payload, state.canvasSize[1]],
  }))
  .handleAction(actions.setCanvasHeight, (state, { payload }) => ({
    ...state,
    canvasSize: [state.canvasSize[0], payload],
  }))
  .handleAction(actions.setResultWidth, (state, { payload }) => ({
    ...state,
    resultSize: [payload, state.resultSize[1]],
  }))
  .handleAction(actions.setResultHeight, (state, { payload }) => ({
    ...state,
    resultSize: [state.resultSize[0], payload],
  }));
