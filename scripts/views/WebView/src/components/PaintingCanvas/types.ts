import {
  addPopup,
  setAudioReady,
  setErasingByMouse,
  setResultInfo,
  setResultImages,
  setCnProgress,
  setCanvasImage,
} from "store/actions";

export type PointType = { x: number; y: number };

export type UseBrushProps = {
  paintingRef: React.RefObject<HTMLCanvasElement>;
  previewRef: React.RefObject<HTMLCanvasElement>;
  context: CanvasRenderingContext2D | undefined;
  previewContext: CanvasRenderingContext2D | undefined;
  mousePos: PointType;
  instantGenerationMode: boolean;
  setMouseCoordinates: (event: any) => PointType;
  setCanvasImage: typeof setCanvasImage;
  setCnProgress: typeof setCnProgress;
  setResultImages: typeof setResultImages;
  setResultInfo: typeof setResultInfo;
  setErasingByMouse: typeof setErasingByMouse;
  setAudioReady: typeof setAudioReady;
  addPopup: typeof addPopup;
};

export type CanvasInstructionProps = PointType & {
  context: CanvasRenderingContext2D;
  width?: number;
  height?: number;
  withStroke?: boolean;
  withFill?: boolean;
};
