import { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { StateType } from "store/types";
import { UseBrushProps } from "./types";
import { generate } from "components/PaintingTools/components/GenerateButton";
import { drawEllipse, drawLine, clear } from "./canvasHelpers";

export const useLineBrush = ({
  paintingRef,
  previewRef,
  context,
  previewContext,
  mousePos,
  instantGenerationMode,
  setMouseCoordinates,
  setPaintImage,
  setCnProgress,
  setResultImage,
}: UseBrushProps) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const { isErasing } = useSelector(({ isErasing }: StateType) => ({
    isErasing,
  }));

  const drawCircle = useCallback(
    (
      context: CanvasRenderingContext2D,
      withStroke?: boolean,
      pos = mousePos
    ) => {
      if (!context) return;
      drawEllipse({
        context,
        ...pos,
        width: context.lineWidth / 2,
        height: context.lineWidth / 2,
        withStroke,
      });
    },
    [mousePos]
  );

  const mouseDown = useCallback(
    (event) => {
      setMouseCoordinates(event);
      if (!context || !paintingRef.current) return;
      context.fillStyle = isErasing ? "white" : "black";
      setIsDrawing(true);
      setStartPos(mousePos);
      context.beginPath();
      setPaintImage(paintingRef.current.toDataURL());
    },
    [context, setMouseCoordinates, paintingRef?.current, mousePos]
  );

  const switchBrushStyle = useCallback(() => {
    if (!previewContext || !previewRef?.current) return;
    if (isDrawing) {
      if (isErasing) {
        previewContext.strokeStyle = "#6b8aad";
      } else {
        previewContext.strokeStyle = "#d5e3c3";
      }
    } else {
      if (isErasing) {
        previewContext.strokeStyle = "black";
      } else {
        previewContext.strokeStyle = "white";
      }
    }
  }, [previewContext, isDrawing, isErasing]);

  const mouseMove = useCallback(
    (event) => {
      setMouseCoordinates(event);
      if (!previewContext || !previewRef?.current) return;
      clear(previewRef, previewContext);
      previewContext.fillStyle = isErasing ? "white" : "black";
      switchBrushStyle();
      if (isDrawing && context) {
        context.strokeStyle = isErasing ? "white" : "black";
        drawCircle(previewContext, false, startPos);
        drawCircle(previewContext);
        drawLine(previewContext, startPos, mousePos);
      } else {
        drawCircle(previewContext, true);
      }
    },
    [
      previewContext,
      previewRef?.current,
      setMouseCoordinates,
      context,
      mousePos,
    ]
  );

  const mouseUp = useCallback(
    (event) => {
      setMouseCoordinates(event);
      if (!context || !paintingRef.current) return;
      setIsDrawing(false);
      context.strokeStyle = isErasing ? "white" : "black";
      drawLine(context, startPos, mousePos);
      const paintImage = paintingRef.current.toDataURL();
      setPaintImage(paintImage);
      if (instantGenerationMode) {
        generate(paintImage, setResultImage, setCnProgress);
      }
    },
    [
      context,
      setMouseCoordinates,
      paintingRef?.current,
      instantGenerationMode,
      mousePos,
    ]
  );

  const mouseOut = useCallback(() => {
    clear(previewRef, previewContext);
    setIsDrawing(false);
    if (!paintingRef.current) return;
    setPaintImage(paintingRef.current.toDataURL());
  }, [previewContext, previewRef?.current, paintingRef?.current]);

  return { mouseDown, mouseMove, mouseUp, mouseOut };
};
