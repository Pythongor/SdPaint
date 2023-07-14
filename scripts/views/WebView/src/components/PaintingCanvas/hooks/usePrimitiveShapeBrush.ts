import React, { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { StateType } from "store/types";
import { getErasingState } from "store/selectors";
import { UseBrushProps, PointType } from "../types";
import { useBrush } from "./useBrush";
import {
  drawRectangle,
  getRectangleFrom2Points,
  drawEllipse,
  getEllipseFrom2Points,
} from "../canvasHelpers";

type PrimitiveShapeProps = UseBrushProps & { kind: "rectangle" | "ellipse" };

const shapeMap = {
  rectangle: {
    drawFunc: drawRectangle,
    getRect: getRectangleFrom2Points,
  },
  ellipse: {
    drawFunc: drawEllipse,
    getRect: getEllipseFrom2Points,
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
  const { drawFunc, getRect } = shapeMap[kind];

  const onBrushTypeChangeFunc = () => setStartPos({ x: 0, y: 0 });

  const afterPointerDownFunc = (pos: PointType) => {
    setStartPos(pos);
  };

  const afterPointerMoveFunc = useCallback(
    (isDrawing: boolean) => {
      if (!previewContext || !previewRef?.current) return;
      if (isDrawing) {
        const rect = getRect(mousePos, startPos);
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
    [previewContext, mousePos, startPos, withBrushFill, kind]
  );

  const onPointerUpFunc = useCallback(
    (event: React.PointerEvent) => {
      if (!context) return;
      const rect = getRect(mousePos, startPos);
      drawFunc({
        context,
        withStroke: true,
        ...rect,
        withFill: isErasing || withBrushFill,
      });
      if (event.pointerType !== "mouse") context.closePath();
    },
    [context, mousePos, startPos, isErasing, withBrushFill]
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
