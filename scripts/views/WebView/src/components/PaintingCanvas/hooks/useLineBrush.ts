import { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { StateType } from "store/types";
import { getErasingState } from "store/selectors";
import { UseBrushProps, PointType } from "../types";
import { useBrush } from "./useBrush";
import { drawEllipse, drawLine, clearSquaredLine } from "../canvasHelpers";

export const useLineBrush = ({
  previewRef,
  context,
  previewContext,
  mousePos,
  ...rest
}: UseBrushProps) => {
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const { isErasing, brushWidth } = useSelector((state: StateType) => ({
    isErasing: getErasingState(state),
    brushWidth: state.brush.width,
  }));

  const drawCircle = useCallback(
    (
      context: CanvasRenderingContext2D,
      withStroke?: boolean,
      pos: PointType = mousePos
    ) => {
      if (!context) return;
      const size = brushWidth * (isErasing ? 2 : 1);
      drawEllipse({ context, ...pos, width: size, height: size, withStroke });
    },
    [mousePos, isErasing, brushWidth]
  );

  const onBrushTypeChangeFunc = () => setStartPos({ x: 0, y: 0 });

  const afterPointerDownFunc = useCallback(
    (pos: PointType) => {
      if (!context) return;
      setStartPos(pos);
      context.beginPath();
    },
    [context]
  );

  const afterPointerMoveFunc = useCallback(
    (isDrawing: boolean) => {
      if (!previewContext || !previewRef?.current) return;
      if (isDrawing && context) {
        context.strokeStyle = isErasing ? "white" : "black";
        previewContext.lineWidth = isErasing ? brushWidth * 4 : brushWidth * 2;
        drawCircle(previewContext, false, startPos);
        drawCircle(previewContext);
        drawLine(previewContext, startPos, mousePos);
        previewContext.lineWidth = brushWidth;
      } else {
        previewContext.lineWidth = isErasing ? brushWidth * 4 : brushWidth * 2;
        drawCircle(previewContext, true);
        previewContext.lineWidth = brushWidth;
      }
    },
    [
      context,
      previewContext,
      mousePos,
      startPos,
      isErasing,
      drawCircle,
      previewRef,
      brushWidth,
    ]
  );

  const onPointerUpFunc = useCallback(() => {
    if (!context) return;
    const func = isErasing ? clearSquaredLine : drawLine;
    context.lineWidth = isErasing ? brushWidth * 4 : brushWidth * 2;
    func(context, startPos, mousePos);
    context.lineWidth = brushWidth;
  }, [context, mousePos, startPos, isErasing, brushWidth]);

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
