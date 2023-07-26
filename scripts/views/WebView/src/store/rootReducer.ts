import { createReducer } from "typesafe-actions";
import { ActionType, StateType } from "./types";
import actions from "./actions";

const IMAGES_CLIP_BUFFER_OVERFLOW = 20;

const initialState: Readonly<StateType> = {
  scrollTop: 0,
  modal: null,
  isZenModeOn: false,
  cnProgress: 0,
  result: {
    images: [],
    imageSize: [512, 512],
    viewedImageIndex: 0,
    imagesCount: 4,
    isMultipleImagesModeOn: false,
    info: null,
    inputImageViewOpacity: 0,
  },
  canvas: {
    imagesStack: [],
    emptyImage: "",
    currentImageIndex: -1,
    size: [512, 512],
  },
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
};

export default createReducer<StateType, ActionType>(initialState)
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
    return {
      ...state,
      brushConfig: { ...state.brushConfig, isErasingByMouse: payload },
    };
  })
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
  .handleAction(actions.setEmptyImage, (state, { payload }) => ({
    ...state,
    canvas: {
      ...state.canvas,
      emptyImage: payload,
      imagesStack: [payload],
      currentImageIndex: 0,
    },
  }))
  .handleAction(actions.setCanvasImage, (state, { payload }) => {
    const { imagesStack, currentImageIndex } = state.canvas;
    const isStackEmpty = !imagesStack.length;
    const isOverflow = imagesStack.length >= IMAGES_CLIP_BUFFER_OVERFLOW;
    const oldIndex = isStackEmpty ? 0 : currentImageIndex;
    const areSame = imagesStack[oldIndex] === payload;

    const newStack: string[] = [];
    const newIndex =
      areSame || isOverflow
        ? oldIndex
        : Math.min(IMAGES_CLIP_BUFFER_OVERFLOW, currentImageIndex + 1);

    if (areSame) {
      newStack.push(...imagesStack);
    } else if (oldIndex >= imagesStack.length - 1) {
      if (isOverflow) {
        const sliceStart = imagesStack.length - IMAGES_CLIP_BUFFER_OVERFLOW + 1;
        newStack.push(...imagesStack.slice(sliceStart), payload);
      } else {
        newStack.push(...imagesStack, payload);
      }
    } else {
      newStack.push(...imagesStack.slice(0, newIndex), payload);
    }
    return {
      ...state,
      canvas: {
        ...state.canvas,
        imagesStack: newStack,
        currentImageIndex: newIndex,
      },
    };
  })
  .handleAction(actions.increaseCanvasImageIndex, (state) => {
    const currentImageIndex = Math.min(
      IMAGES_CLIP_BUFFER_OVERFLOW,
      state.canvas.imagesStack.length - 1,
      state.canvas.currentImageIndex + 1
    );
    return { ...state, canvas: { ...state.canvas, currentImageIndex } };
  })
  .handleAction(actions.decreaseCanvasImageIndex, (state) => {
    const currentImageIndex = Math.max(0, state.canvas.currentImageIndex - 1);
    return { ...state, canvas: { ...state.canvas, currentImageIndex } };
  })
  .handleAction(actions.setCanvasWidth, (state, { payload }) => ({
    ...state,
    canvas: { ...state.canvas, size: [payload, state.canvas.size[1]] },
  }))
  .handleAction(actions.setCanvasHeight, (state, { payload }) => ({
    ...state,
    canvas: { ...state.canvas, size: [state.canvas.size[0], payload] },
  }))
  .handleAction(actions.setResultImages, (state, { payload }) => ({
    ...state,
    result: { ...state.result, images: payload },
  }))
  .handleAction(actions.setResultWidth, (state, { payload }) => ({
    ...state,
    result: {
      ...state.result,
      imageSize: [payload, state.result.imageSize[1]],
    },
  }))
  .handleAction(actions.setResultHeight, (state, { payload }) => ({
    ...state,
    result: {
      ...state.result,
      imageSize: [state.result.imageSize[0], payload],
    },
  }))
  .handleAction(actions.setResultImagesCount, (state, { payload }) => ({
    ...state,
    result: {
      ...state.result,
      imagesCount: payload,
    },
    cnConfig: {
      ...state.cnConfig,
      batch_size: state.result.isMultipleImagesModeOn
        ? payload
        : state.cnConfig.batch_size,
    },
  }))
  .handleAction(actions.setMultipleImagesMode, (state, { payload }) => {
    if (payload === "switch")
      return {
        ...state,
        result: {
          ...state.result,
          isMultipleImagesModeOn: !state.result.isMultipleImagesModeOn,
        },
        cnConfig: {
          ...state.cnConfig,
          batch_size: state.result.isMultipleImagesModeOn
            ? 1
            : state.result.imagesCount,
        },
      };
    return {
      ...state,
      result: {
        ...state.result,
        isMultipleImagesModeOn: payload,
      },
      cnConfig: {
        ...state.cnConfig,
        batch_size: payload ? state.result.imagesCount : 1,
      },
    };
  })
  .handleAction(actions.setViewedImageIndex, (state, { payload }) => ({
    ...state,
    result: {
      ...state.result,
      viewedImageIndex: payload,
    },
  }))
  .handleAction(actions.setInputImageViewOpacity, (state, { payload }) => {
    if (payload === "switch") {
      const opacity = state.result.inputImageViewOpacity;
      return {
        ...state,
        result: {
          ...state.result,
          inputImageViewOpacity: +(opacity < 1),
        },
      };
    }
    return {
      ...state,
      result: {
        ...state.result,
        inputImageViewOpacity: payload,
      },
    };
  })
  .handleAction(actions.setResultInfo, (state, { payload }) => ({
    ...state,
    result: {
      ...state.result,
      info: payload,
    },
  }))
  .handleAction(actions.setScrollTop, (state, { payload }) => ({
    ...state,
    scrollTop: payload,
  }))
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
  .handleAction(actions.setCnConfig, (state, { payload }) => ({
    ...state,
    cnConfig: { ...state.cnConfig, ...payload },
  }))
  .handleAction(actions.setInstantGenerationMode, (state, { payload }) => {
    if (payload === "switch")
      return { ...state, instantGenerationMode: !state.instantGenerationMode };
    return { ...state, instantGenerationMode: payload };
  });
