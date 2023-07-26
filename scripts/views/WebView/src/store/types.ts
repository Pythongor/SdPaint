import { ActionType as ActType } from "typesafe-actions";
import * as actions from "./actions";

export type CnConfigType = {
  seed: number;
  prompt: string;
  negative_prompt: string;
  steps: number;
  cfg_scale: number;
  batch_size: number;
  model: string;
  models: string[];
  module: string;
  modules: string[];
};

export type ModalType = "imageViewer" | "settings" | null;

export type BrushType = "pencil" | "line" | "rectangle" | "ellipse";

export type AudioSignalType = "epic" | "ringtone" | "bounce";

export type ResultInfoType = {
  prompt: string;
  all_prompts: string[];
  negative_prompt: string;
  all_negative_prompts: string[];
  seed: number;
  all_seeds: number[];
  subseed: number;
  all_subseeds: number[];
  subseed_strength: number;
  width: number;
  height: number;
  input_image: string;
  sampler_name: string;
  cfg_scale: number;
  steps: number;
  batch_size: number;
  restore_faces: boolean;
  face_restoration_model: null;
  sd_model_hash: string;
  seed_resize_from_w: number;
  seed_resize_from_h: number;
  denoising_strength: number;
  extra_generation_params: { "ControlNet 0": string };
  index_of_first_image: number;
  infotexts: string[];
  styles: any[];
  job_timestamp: string;
  clip_skip: number;
  is_using_inpainting_conditioning: boolean;
  [key: string]: any;
};

export type ResultType = {
  info: ResultInfoType;
  status_code: number;
} & ({ image: string } | { batch_images: string[] });

export type AudioConfigType = {
  isEnabled: boolean;
  isReady: boolean;
  signalType: AudioSignalType;
};

export type BrushConfigType = {
  isErasingBySwitch: boolean;
  isErasingByMouse: boolean;
  width: number;
  brushType: BrushType;
  withFill: boolean;
};

export type ResultConfigType = {
  images: string[];
  imageSize: [number, number];
  viewedImageIndex: number;
  imagesCount: number;
  isMultipleImagesModeOn: boolean;
  info: ResultInfoType | null;
  inputImageViewOpacity: number;
};

export type CanvasConfigType = {
  imagesStack: string[];
  currentImageIndex: number;
  size: [number, number];
  emptyImage: string;
};

export type StateType = Readonly<{
  brushConfig: Readonly<BrushConfigType>;
  scrollTop: number;
  cnProgress: number;
  modal: ModalType;
  isZenModeOn: boolean;
  canvas: Readonly<CanvasConfigType>;
  result: Readonly<ResultConfigType>;
  cnConfig: Readonly<CnConfigType>;
  instantGenerationMode: boolean;
  audio: Readonly<AudioConfigType>;
}>;

export enum Actions {
  setAudioEnabled = "AUDIO__SET_ENABLED",
  setAudioReady = "AUDIO_SET__READY",
  setAudioSignalType = "AUDIO__SET_SIGNAL_TYPE",
  setErasingBySwitch = "BRUSH__SET_ERASING_BY_SWITCH",
  setErasingByMouse = "BRUSH__SET_ERASING_BY_MOUSE",
  setBrushWidth = "BRUSH__SET_WIDTH",
  setBrushType = "BRUSH__SET_TYPE",
  setBrushFilling = "BRUSH__SET_FILLING",
  setCanvasImage = "CANVAS__SET_IMAGE",
  setCanvasWidth = "CANVAS__SET_WIDTH",
  setCanvasHeight = "CANVAS__SET_HEIGHT",
  increaseCanvasImageIndex = "CANVAS__INCREASE_IMAGE_INDEX",
  decreaseCanvasImageIndex = "CANVAS__DECREASE_IMAGE_INDEX",
  setResultWidth = "RESULT__SET_WIDTH",
  setResultHeight = "RESULT__SET_HEIGHT",
  setResultImages = "RESULT__SET_IMAGES",
  setResultInfo = "RESULT__SET_INFO",
  setResultImagesCount = "RESULT__SET_IMAGES_COUNT",
  setMultipleImagesMode = "RESULT__SET_MULTIPLE_IMAGES_MODE",
  setViewedImageIndex = "RESULT__SET_VIEWED_IMAGE_INDEX",
  setInputImageViewOpacity = "RESULT__SET_INPUT_IMAGE_VIEW_OPACITY",
  setCnProgress = "SET_CONTROL_NET_PROGRESS",
  setInstantGenerationMode = "SET_INSTANT_GENERATION_MODE",
  setModal = "SET_MODAL",
  setZenMode = "SET_ZEN_MODE",
  setEmptyImage = "SET_EMPTY_IMAGE",
  setCnConfig = "SET_CONTROL_NET_CONFIG",
  setScrollTop = "SET_SCROLL_TOP",
}

export type ActionType = ActType<typeof actions>;
