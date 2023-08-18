import { createReducer } from "typesafe-actions";
import { ResultActionType, ResultStateType } from "./types";
import actions from "./actions";

const initialState: Readonly<ResultStateType> = {
  images: [],
  imageSize: [512, 512],
  imagesCount: 4,
  isMultipleImagesModeOn: false,
  info: null,
};

export default createReducer<ResultStateType, ResultActionType>(initialState)
  .handleAction(actions.setResultImages, (state, { payload }) => {
    return { ...state, images: payload };
  })
  .handleAction(actions.setResultWidth, (state, { payload }) => {
    return { ...state, imageSize: [payload, state.imageSize[1]] };
  })
  .handleAction(actions.setResultHeight, (state, { payload }) => {
    return { ...state, imageSize: [state.imageSize[0], payload] };
  })
  .handleAction(actions.setResultImagesCount, (state, { payload }) => {
    return { ...state, imagesCount: payload };
  })
  .handleAction(actions.setMultipleImagesMode, (state, { payload }) => {
    if (payload === "switch")
      return {
        ...state,
        isMultipleImagesModeOn: !state.isMultipleImagesModeOn,
      };
    return {
      ...state,
      isMultipleImagesModeOn: payload,
    };
  })
  .handleAction(actions.setResultInfo, (state, { payload }) => {
    return { ...state, info: payload };
  });
