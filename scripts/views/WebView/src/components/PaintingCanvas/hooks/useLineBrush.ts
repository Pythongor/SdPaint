import { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { StateType } from "store/types";
import { getErasingState } from "store/selectors";
import { UseBrushProps, PointType } from "../types";
import { useBrush } from "./useBrush";
import { drawEllipse, drawLine } from "../canvasHelpers";

export const useLineBrush = ({
  previewRef,
  context,
  previewContext,
  mousePos,
  ...rest
}: UseBrushProps) => {
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const { isErasing } = useSelector((state: StateType) => ({
    isErasing: getErasingState(state),
  }));

  const drawCircle = useCallback(
    (
      context: CanvasRenderingContext2D,
      withStroke?: boolean,
      pos = mousePos
    ) => {
      if (!context) return;
      const size = context.lineWidth / (isErasing ? 1 : 2);
      drawEllipse({ context, ...pos, width: size, height: size, withStroke });
    },
    [mousePos, isErasing]
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
        drawCircle(previewContext, false, startPos);
        drawCircle(previewContext);
        const lineWidth = previewContext.lineWidth;
        previewContext.lineWidth = isErasing ? lineWidth * 2 : lineWidth;
        drawLine(previewContext, startPos, mousePos);
        previewContext.lineWidth = lineWidth;
      } else {
        drawCircle(previewContext, true);
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
    ]
  );

  const onPointerUpFunc = useCallback(() => {
    if (!context) return;
    const lineWidth = context.lineWidth;
    context.lineWidth = isErasing ? lineWidth * 2 : lineWidth;
    drawLine(context, startPos, mousePos);
    context.lineWidth = lineWidth;
  }, [context, mousePos, startPos, isErasing]);

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
