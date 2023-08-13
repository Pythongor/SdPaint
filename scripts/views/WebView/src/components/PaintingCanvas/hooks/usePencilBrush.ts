import { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { StateType } from "store/types";
import { getErasingState } from "store/selectors";
import { UseBrushProps } from "../types";
import { drawEllipse } from "../canvasHelpers";
import { useBrush } from "./useBrush";

export const usePencilBrush = ({
  previewRef,
  context,
  previewContext,
  mousePos,
  ...rest
}: UseBrushProps) => {
  const { isErasing } = useSelector((state: StateType) => ({
    isErasing: getErasingState(state),
  }));

  useEffect(() => {
    if (context) {
      context.lineJoin = "round";
    }
  }, [context]);

  const drawCircle = useCallback(
    (context: CanvasRenderingContext2D, withStroke?: boolean) => {
      if (!context) return;
      drawEllipse({
        context,
        ...mousePos,
        width: context.lineWidth / 2,
        height: context.lineWidth / 2,
        withStroke,
      });
    },
    [mousePos]
  );

  const afterPointerDownFunc = useCallback(() => {
    if (!context || isErasing) return;
    drawCircle(context);
    context.beginPath();
  }, [context, drawCircle, isErasing]);

  const afterPointerMoveFunc = useCallback(
    (isDrawing: boolean) => {
      if (!previewContext) return;
      const lineWidth = previewContext.lineWidth;
      previewContext.lineWidth = isErasing ? lineWidth * 2 : lineWidth;
      // previewContext.strokeStyle = "black";
      drawCircle(previewContext, true);

      if (isDrawing && context) {
        if (isErasing) context.globalCompositeOperation = "destination-out";
        context.lineWidth = isErasing ? lineWidth * 2 : lineWidth;
        context.lineTo(mousePos.x, mousePos.y);
        context.stroke();
        context.globalCompositeOperation = "source-over";
        context.lineWidth = lineWidth;
      }
      previewContext.lineWidth = lineWidth;
    },
    [previewContext, context, isErasing, mousePos, drawCircle]
  );

  const onPointerUpFunc = useCallback(() => {
    if (!context) return;
    !isErasing && drawCircle(context);
    context.beginPath();
  }, [context, drawCircle, isErasing]);

  return useBrush({
    previewRef,
    context,
    previewContext,
    mousePos,
    afterPointerDownFunc,
    afterPointerMoveFunc,
    onPointerUpFunc,
    ...rest,
  });
};
