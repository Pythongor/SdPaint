import { PayloadActionCreator } from "typesafe-actions";
import { Actions } from "store/types";

export type PointType = { x: number; y: number };

export type UseBrushProps = {
  paintingRef: React.RefObject<HTMLCanvasElement>;
  previewRef: React.RefObject<HTMLCanvasElement>;
  context: CanvasRenderingContext2D | undefined;
  previewContext: CanvasRenderingContext2D | undefined;
  mousePos: PointType;
  instantGenerationMode: boolean;
  setMouseCoordinates: (event: any) => void;
  setPaintImage: PayloadActionCreator<Actions.setPaintImage, string>;
  setCnProgress: PayloadActionCreator<Actions.setCnProgress, number>;
  setResultImage: PayloadActionCreator<Actions.setResultImage, string>;
};

export type CanvasInstructionProps = PointType & {
  context: CanvasRenderingContext2D;
  width?: number;
  height?: number;
  withStroke?: boolean;
  withFill?: boolean;
};
