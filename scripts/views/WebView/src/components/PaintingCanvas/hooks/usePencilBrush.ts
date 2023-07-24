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
    if (!context) return;
    drawCircle(context);
    context.beginPath();
  }, [context, drawCircle, isErasing]);

  const afterPointerMoveFunc = useCallback(
    (isDrawing: boolean) => {
      if (!previewContext) return;
      const lineWidth = previewContext.lineWidth;
      previewContext.lineWidth = isErasing ? lineWidth * 2 : lineWidth;
      drawCircle(previewContext, true);

      if (isDrawing && context) {
        context.strokeStyle = isErasing ? "white" : "black";
        context.lineWidth = isErasing ? lineWidth * 2 : lineWidth;
        context.lineTo(mousePos.x, mousePos.y);
        context.stroke();
        context.lineWidth = lineWidth;
      }
      previewContext.lineWidth = lineWidth;
    },
    [previewContext, context, isErasing, mousePos, drawCircle]
  );
  const onPointerUpFunc = useCallback(() => {
    if (!context) return;
    drawCircle(context);
    context.beginPath();
  }, [context, drawCircle]);

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
