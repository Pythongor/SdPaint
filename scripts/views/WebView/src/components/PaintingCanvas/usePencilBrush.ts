import { useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { StateType } from "store/types";
import { getErasingState } from "store/selectors";
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
  setErasingByMouse,
}: UseBrushProps) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const { isErasing, brushType } = useSelector((state: StateType) => ({
    isErasing: getErasingState(state),
    brushType: state.brushType,
  }));

  useEffect(() => {
    setIsDrawing(false);
  }, [brushType]);

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

  const onPointerDown: React.PointerEventHandler<HTMLCanvasElement> =
    useCallback(
      (event) => {
        if (event.buttons == 2) {
          setErasingByMouse(true);
        } else setErasingByMouse(false);
        setMouseCoordinates(event);
        if (!context || !paintingRef.current) return;
        context.fillStyle = isErasing || event.buttons == 2 ? "white" : "black";
        setIsDrawing(true);
        drawCircle(context);
        context.beginPath();
      },
      [context, setMouseCoordinates, paintingRef?.current, mousePos, isErasing]
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

  const onPointerMove: React.PointerEventHandler<HTMLCanvasElement> =
    useCallback(
      (event) => {
        setMouseCoordinates(event);
        if (!previewContext || !previewRef?.current) return;
        clear(previewRef, previewContext);
        previewContext.fillStyle = isErasing ? "white" : "black";
        const lineWidth = previewContext.lineWidth;
        previewContext.lineWidth = isErasing ? lineWidth * 2 : lineWidth;
        switchBrushStyle();
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
      [
        previewContext,
        previewRef?.current,
        setMouseCoordinates,
        context,
        mousePos,
      ]
    );

  const onPointerUp: React.PointerEventHandler<HTMLCanvasElement> = useCallback(
    (event) => {
      setMouseCoordinates(event);
      if (!context || !paintingRef.current || !isDrawing) return;
      setIsDrawing(false);
      context.fillStyle = isErasing ? "white" : "black";
      drawCircle(context);
      context.beginPath();
      const paintImage = paintingRef.current.toDataURL();
      setPaintImage(paintImage);
      if (instantGenerationMode) {
        generate(paintImage, setResultImage, setCnProgress);
      }
      setErasingByMouse(false);
    },
    [
      context,
      setMouseCoordinates,
      paintingRef?.current,
      instantGenerationMode,
      mousePos,
    ]
  );

  const onPointerOut: React.PointerEventHandler<HTMLCanvasElement> =
    useCallback(() => {
      clear(previewRef, previewContext);
      setIsDrawing(false);
      if (!paintingRef.current) return;
    }, [previewContext, previewRef?.current, paintingRef?.current]);

  return { onPointerDown, onPointerMove, onPointerUp, onPointerOut };
};
