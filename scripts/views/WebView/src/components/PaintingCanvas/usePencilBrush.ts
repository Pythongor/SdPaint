import React, { useState, useCallback, useEffect } from "react";
import { setPaintImage, setResultImage, setCnProgress } from "store/actions";
import { useSelector } from "react-redux";
import { StateType } from "store/types";
import { UseBrushProps } from "./types";
import { generate } from "components/PaintingTools/components/GenerateButton";
import { drawEllipse, clear } from "./canvasHelpers";

export const usePencilBrush = ({
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
  const { isErasing } = useSelector(({ isErasing }: StateType) => ({
    isErasing,
  }));

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

  const mouseDown = useCallback(
    (event) => {
      setMouseCoordinates(event);
      if (!context || !paintingRef.current) return;
      context.fillStyle = isErasing ? "white" : "black";
      setIsDrawing(true);
      drawCircle(context);
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
      drawCircle(previewContext, true);

      if (isDrawing && context) {
        context.strokeStyle = isErasing ? "white" : "black";
        context.lineTo(mousePos.x, mousePos.y);
        context.stroke();
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
      context.fillStyle = isErasing ? "white" : "black";
      drawCircle(context);
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
