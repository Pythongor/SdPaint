import React, { useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { StateType } from "store/types";
import { getErasingState } from "store/selectors";
import { UseBrushProps, PointType } from "../types";
import { generate, handleAudioSignal } from "components/PaintingTools/generate";
import { clear } from "../canvasHelpers";

type Props = UseBrushProps & {
  onBrushTypeChangeFunc?: () => void;
  afterPointerDownFunc: (pos: PointType) => void;
  afterPointerMoveFunc: (isDrawing: boolean) => void;
  onPointerUpFunc: (event: React.PointerEvent) => void;
};

export const useBrush = ({
  paintingRef,
  previewRef,
  context,
  previewContext,
  instantGenerationMode,
  setMouseCoordinates,
  setCanvasImage,
  setCnProgress,
  setResultImages,
  setResultInfo,
  setErasingByMouse,
  setAudioReady,
  afterPointerDownFunc,
  onBrushTypeChangeFunc,
  afterPointerMoveFunc,
  onPointerUpFunc,
  addPopup,
}: Props) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const { isErasing, brushType, audio } = useSelector((state: StateType) => ({
    isErasing: getErasingState(state),
    brushType: state.brush.brushType,
    audio: state.audio,
  }));

  const audioFunc = useCallback(
    () => handleAudioSignal(audio, setAudioReady),
    [audio, setAudioReady]
  );

  useEffect(() => {
    setIsDrawing(false);
    onBrushTypeChangeFunc && onBrushTypeChangeFunc();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brushType]);

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
  }, [previewContext, previewRef, isDrawing, isErasing]);

  const onPointerDown: React.PointerEventHandler<HTMLCanvasElement> =
    useCallback(
      (event) => {
        event.preventDefault();
        if (event.buttons === 4) {
          setErasingByMouse(true);
        } else setErasingByMouse(false);
        const pos = setMouseCoordinates(event);
        if (
          !context ||
          !paintingRef.current ||
          !previewContext ||
          !previewRef.current
        )
          return;
        const color = event.buttons === 4 ? "white" : "black";
        previewContext.fillStyle = color;
        context.fillStyle = color;
        context.strokeStyle = color;
        afterPointerDownFunc(pos);
        setIsDrawing(true);
      },
      [
        context,
        paintingRef,
        previewContext,
        previewRef,
        // isErasing,
        setMouseCoordinates,
        afterPointerDownFunc,
        setErasingByMouse,
      ]
    );

  const onPointerMove: React.PointerEventHandler<HTMLCanvasElement> =
    useCallback(
      (event) => {
        setMouseCoordinates(event);
        if (!previewContext || !previewRef?.current) return;
        clear(previewRef, previewContext);
        switchBrushStyle();
        previewContext.fillStyle = isErasing ? "white" : "black";
        afterPointerMoveFunc(isDrawing);
      },
      [
        previewContext,
        previewRef,
        setMouseCoordinates,
        afterPointerMoveFunc,
        isErasing,
        isDrawing,
        switchBrushStyle,
      ]
    );

  const onPointerUp: React.PointerEventHandler<HTMLCanvasElement> = useCallback(
    (event) => {
      setMouseCoordinates(event);
      if (!context || !paintingRef.current || !isDrawing) return;
      setIsDrawing(false);
      context.fillStyle = isErasing ? "white" : "black";
      context.strokeStyle = isErasing ? "white" : "black";
      onPointerUpFunc(event);
      const paintImage = paintingRef.current.toDataURL();
      setCanvasImage(paintImage);
      if (instantGenerationMode) {
        generate(
          paintImage,
          setResultImages,
          setCnProgress,
          setResultInfo,
          addPopup,
          audioFunc
        );
      }
      setErasingByMouse(false);
    },
    [
      context,
      setMouseCoordinates,
      paintingRef,
      instantGenerationMode,
      isErasing,
      addPopup,
      audioFunc,
      isDrawing,
      onPointerUpFunc,
      setCanvasImage,
      setCnProgress,
      setErasingByMouse,
      setResultImages,
      setResultInfo,
    ]
  );

  const onPointerOut: React.PointerEventHandler<HTMLCanvasElement> =
    useCallback(() => {
      clear(previewRef, previewContext);
      setIsDrawing(false);
      setErasingByMouse(false);
    }, [previewContext, previewRef, setErasingByMouse]);

  return { onPointerDown, onPointerMove, onPointerUp, onPointerOut };
};
