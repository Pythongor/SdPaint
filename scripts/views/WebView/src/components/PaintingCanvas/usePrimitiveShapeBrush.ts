import React, { useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { StateType } from "store/types";
import { getErasingState } from "store/selectors";
import { UseBrushProps } from "./types";
import { generate } from "components/PaintingTools/components/GenerateButton";
import {
  drawRectangle,
  getRectangleFrom2Points,
  drawEllipse,
  getEllipseFrom2Points,
  clear,
} from "./canvasHelpers";

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
  kind,
}: PrimitiveShapeProps) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const { isErasing, brushType, withBrushFill } = useSelector(
    (state: StateType) => ({
      withBrushFill: state.withBrushFill,
      isErasing: getErasingState(state),
      brushType: state.brushType,
    })
  );
  const { drawFunc, getRect } = shapeMap[kind];

  useEffect(() => {
    setIsDrawing(false);
    setStartPos({ x: 0, y: 0 });
  }, [brushType]);

  const onPointerDown: React.PointerEventHandler<HTMLCanvasElement> =
    useCallback(
      (event) => {
        if (event.buttons == 2) {
          setErasingByMouse(true);
        } else setErasingByMouse(false);
        const pos = setMouseCoordinates(event);
        if (!previewContext || !previewRef.current) return;
        previewContext.fillStyle =
          isErasing || event.buttons == 2 ? "white" : "black";
        setStartPos(pos);
        setIsDrawing(true);
      },
      [previewContext, setMouseCoordinates, previewRef?.current, isErasing]
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
        switchBrushStyle();
        previewContext.fillStyle = isErasing ? "white" : "black";
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
      [previewContext, previewRef?.current, setMouseCoordinates, mousePos]
    );

  const onPointerUp: React.PointerEventHandler<HTMLCanvasElement> = useCallback(
    (event) => {
      setMouseCoordinates(event);
      if (!context || !paintingRef.current || !isDrawing) return;
      setIsDrawing(false);
      context.fillStyle = isErasing ? "white" : "black";
      context.strokeStyle = isErasing ? "white" : "black";
      const rect = getRect(mousePos, startPos);
      drawFunc({
        context,
        withStroke: true,
        ...rect,
        withFill: isErasing || withBrushFill,
      });
      if (event.pointerType !== "mouse") context.closePath();
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

export const useRectangleBrush = (props: UseBrushProps) =>
  usePrimitiveShapeBrush({ kind: "rectangle", ...props });

export const useEllipseBrush = (props: UseBrushProps) =>
  usePrimitiveShapeBrush({ kind: "ellipse", ...props });
