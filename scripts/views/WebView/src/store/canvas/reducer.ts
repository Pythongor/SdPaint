import { createReducer } from "typesafe-actions";
import { CanvasActionType, CanvasStateType } from "./types";
import actions from "./actions";

const IMAGES_CLIP_BUFFER_OVERFLOW = 20;

const initialState: Readonly<CanvasStateType> = {
  imagesStack: [],
  emptyImage: "",
  currentImageIndex: -1,
  size: [512, 512],
};

export default createReducer<CanvasStateType, CanvasActionType>(initialState)
  .handleAction(actions.setEmptyImage, (state, { payload }) => ({
    ...state,
    emptyImage: payload,
    imagesStack: [payload],
    currentImageIndex: 0,
  }))
  .handleAction(actions.setCanvasImage, (state, { payload }) => {
    const { imagesStack, currentImageIndex } = state;
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
      imagesStack: newStack,
      currentImageIndex: newIndex,
    };
  })
  .handleAction(actions.increaseCanvasImageIndex, (state) => {
    const currentImageIndex = Math.min(
      IMAGES_CLIP_BUFFER_OVERFLOW,
      state.imagesStack.length - 1,
      state.currentImageIndex + 1
    );
    return { ...state, currentImageIndex };
  })
  .handleAction(actions.decreaseCanvasImageIndex, (state) => {
    const currentImageIndex = Math.max(0, state.currentImageIndex - 1);
    return { ...state, currentImageIndex };
  })
  .handleAction(actions.setCanvasWidth, (state, { payload }) => ({
    ...state,
    size: [payload, state.size[1]],
  }))
  .handleAction(actions.setCanvasHeight, (state, { payload }) => ({
    ...state,
    size: [state.size[0], payload],
  }));
