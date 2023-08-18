import { addPopup } from "store/actions";
import { setResultInfo, setResultImages } from "store/result/actions";
import { setAudioReady } from "store/audio/actions";
import { setErasingByMouse } from "store/brush/actions";
import { setCanvasImage } from "store/canvas/actions";
import { setCnProgress } from "store/controlNet/actions";

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
