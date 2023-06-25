import { useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { StateType } from "store/types";
import { getErasingState } from "store/selectors";
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
  setErasingByMouse,
}: UseBrushProps) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const { isErasing, brushType } = useSelector((state: StateType) => ({
    isErasing: getErasingState(state),
    brushType: state.brushType,
  }));

  useEffect(() => {
    setIsDrawing(false);
    setStartPos({ x: 0, y: 0 });
  }, [brushType]);

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

  const onPointerDown: React.PointerEventHandler<HTMLCanvasElement> =
    useCallback(
      (event) => {
        if (event.buttons == 2) {
          setErasingByMouse(true);
        } else setErasingByMouse(false);
        const pos = setMouseCoordinates(event);
        if (!context || !paintingRef.current) return;
        context.fillStyle = isErasing || event.buttons == 2 ? "white" : "black";
        setIsDrawing(true);
        setStartPos(pos);
        context.beginPath();
        setPaintImage(paintingRef.current.toDataURL());
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
        switchBrushStyle();
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
      if (!context || !paintingRef.current) return;
      setIsDrawing(false);
      context.strokeStyle = isErasing ? "white" : "black";
      const lineWidth = context.lineWidth;
      context.lineWidth = isErasing ? lineWidth * 2 : lineWidth;
      drawLine(context, startPos, mousePos);
      context.lineWidth = lineWidth;
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
    useCallback(
      () => clear(previewRef, previewContext),
      [previewContext, previewRef?.current]
    );

  return { onPointerDown, onPointerMove, onPointerUp, onPointerOut };
};
