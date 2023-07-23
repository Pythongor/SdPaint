import { PayloadActionCreator } from "typesafe-actions";
import { Actions, ResultInfoType } from "store/types";

export type PointType = { x: number; y: number };

export type UseBrushProps = {
  paintingRef: React.RefObject<HTMLCanvasElement>;
  previewRef: React.RefObject<HTMLCanvasElement>;
  context: CanvasRenderingContext2D | undefined;
  previewContext: CanvasRenderingContext2D | undefined;
  mousePos: PointType;
  instantGenerationMode: boolean;
  setMouseCoordinates: (event: any) => PointType;
  setCanvasImage: PayloadActionCreator<Actions.setCanvasImage, string>;
  setCnProgress: PayloadActionCreator<Actions.setCnProgress, number>;
  setResultImages: PayloadActionCreator<Actions.setResultImages, string[]>;
  setResultInfo: PayloadActionCreator<
    Actions.setResultInfo,
    ResultInfoType | null
  >;
  setErasingByMouse: PayloadActionCreator<Actions.setErasingByMouse, boolean>;
  setAudioReady: PayloadActionCreator<Actions.setAudioReady, boolean>;
};

export type CanvasInstructionProps = PointType & {
  context: CanvasRenderingContext2D;
  width?: number;
  height?: number;
  withStroke?: boolean;
  withFill?: boolean;
};
