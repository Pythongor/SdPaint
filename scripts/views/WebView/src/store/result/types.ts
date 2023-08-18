import { ActionType as ActType } from "typesafe-actions";
import * as actions from "./actions";

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
  with_tiling: boolean;
  [key: string]: any;
};

export type ResultType = {
  info: ResultInfoType;
  status_code: number;
} & ({ image: string } | { batch_images: string[] });

export type ResultStateType = {
  images: string[];
  imageSize: [number, number];
  imagesCount: number;
  isMultipleImagesModeOn: boolean;
  info: ResultInfoType | null;
};

export enum ResultActions {
  setResultWidth = "RESULT__SET_WIDTH",
  setResultHeight = "RESULT__SET_HEIGHT",
  setResultImages = "RESULT__SET_IMAGES",
  setResultInfo = "RESULT__SET_INFO",
  setResultImagesCount = "RESULT__SET_IMAGES_COUNT",
  setMultipleImagesMode = "RESULT__SET_MULTIPLE_IMAGES_MODE",
}

export type ResultActionType = ActType<typeof actions>;
