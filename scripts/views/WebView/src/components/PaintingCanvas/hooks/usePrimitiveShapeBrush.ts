import React, { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { StateType } from "store/types";
import { getErasingState } from "store/selectors";
import { UseBrushProps, PointType } from "../types";
import { useBrush } from "./useBrush";
import {
  drawRectangle,
  clearRectangle,
  getRectangleFrom2Points,
  drawEllipse,
  clearEllipse,
  getEllipseFrom2Points,
} from "../canvasHelpers";

type PrimitiveShapeProps = UseBrushProps & { kind: "rectangle" | "ellipse" };

const shapeMap = {
  rectangle: {
    drawFunc: drawRectangle,
    getShape: getRectangleFrom2Points,
    clearShape: clearRectangle,
  },
  ellipse: {
    drawFunc: drawEllipse,
    getShape: getEllipseFrom2Points,
    clearShape: clearEllipse,
  },
};

const usePrimitiveShapeBrush = ({
  previewRef,
  context,
  previewContext,
  mousePos,
  kind,
  ...rest
}: PrimitiveShapeProps) => {
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const { isErasing, withBrushFill } = useSelector((state: StateType) => ({
    withBrushFill: state.brushConfig.withFill,
    isErasing: getErasingState(state),
    brushType: state.brushConfig.brushType,
  }));
  const { drawFunc, getShape, clearShape } = shapeMap[kind];

  const onBrushTypeChangeFunc = () => setStartPos({ x: 0, y: 0 });

  const afterPointerDownFunc = (pos: PointType) => {
    setStartPos(pos);
  };

  const afterPointerMoveFunc = useCallback(
    (isDrawing: boolean) => {
      if (!previewContext || !previewRef?.current) return;
      if (isDrawing) {
        const rect = getShape(mousePos, startPos);
        drawFunc({
          context: previewContext,
          withStroke: true,
          ...rect,
          withFill: isErasing || withBrushFill,
        });
      } else {
        const shift = kind === "rectangle" ? previewContext.lineWidth / 2 : 0;
        drawFunc({
          context: previewContext,
          x: mousePos.x - shift,
          y: mousePos.y - shift,
          width: previewContext.lineWidth,
          height: previewContext.lineWidth,
          withFill: true,
          withStroke: true,
        });
      }
    },
    [
      previewContext,
      previewRef,
      getShape,
      mousePos,
      startPos,
      drawFunc,
      isErasing,
      withBrushFill,
      kind,
    ]
  );

  const onPointerUpFunc = useCallback(
    (event: React.PointerEvent) => {
      if (!context) return;
      const rect = getShape(mousePos, startPos);
      const func = isErasing ? clearShape : drawFunc;
      func({
        context,
        withStroke: true,
        ...rect,
        withFill: isErasing || withBrushFill,
      });
      if (event.pointerType !== "mouse") context.closePath();
    },
    [context, getShape, mousePos, startPos, drawFunc, isErasing, withBrushFill]
  );

  return useBrush({
    previewRef,
    context,
    previewContext,
    mousePos,
    onBrushTypeChangeFunc,
    afterPointerDownFunc,
    afterPointerMoveFunc,
    onPointerUpFunc,
    ...rest,
  });
};

export const useRectangleBrush = (props: UseBrushProps) =>
  usePrimitiveShapeBrush({ kind: "rectangle", ...props });

export const useEllipseBrush = (props: UseBrushProps) =>
  usePrimitiveShapeBrush({ kind: "ellipse", ...props });
