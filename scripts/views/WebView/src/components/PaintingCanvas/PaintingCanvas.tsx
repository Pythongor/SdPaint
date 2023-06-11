import React, { useState, useEffect } from "react";
import { setPaintImage, setResultImage, setCnProgress } from "store/actions";
import { connect, useSelector } from "react-redux";
import { StateType } from "store/types";
import { UseBrushProps } from "./types";
import { usePencilBrush } from "./usePencilBrush";
import { useLineBrush } from "./useLineBrush";
import { useRectangleBrush, useEllipseBrush } from "./usePrimitiveShapeBrush";
import { useCanvas, clear } from "./canvasHelpers";
import cn from "classnames";
import styles from "./PaintingCanvas.module.scss";

const useBrush = (props: UseBrushProps) => {
  const brushType = useSelector(({ brushType }: StateType) => brushType);
  const pencilProps = usePencilBrush(props);
  const lineProps = useLineBrush(props);
  const rectangleProps = useRectangleBrush(props);
  const ellipseProps = useEllipseBrush(props);
  if (brushType === "pencil") {
    return pencilProps;
  } else if (brushType === "line") {
    return lineProps;
  } else if (brushType === "rectangle") {
    return rectangleProps;
  } else {
    return ellipseProps;
  }
};

type StateProps = ReturnType<typeof MSTP>;
type DispatchProps = typeof MDTP;
type PaintingCanvasProps = StateProps & DispatchProps;

export const PaintingCanvas: React.FC<PaintingCanvasProps> = ({
  scrollTop,
  paintImage,
  instantGenerationMode,
  setPaintImage,
  setCnProgress,
  setResultImage,
}) => {
  const {
    ref: paintingRef,
    context,
    resize,
    setMouseCoordinates,
    mousePos,
  } = useCanvas();
  const { ref: previewRef, context: previewContext } = useCanvas();

  useEffect(() => {
    if (!paintingRef?.current || !context) return;
    const currentImage = paintingRef.current.toDataURL();
    if (paintImage === "") {
      clear(paintingRef, context);
    } else if (currentImage !== paintImage) {
      console.log("not same", currentImage, paintImage);
    }
  }, [paintImage, paintingRef?.current, context]);

  useEffect(() => {
    resize();
  }, [paintingRef?.current, scrollTop]);

  const { mouseDown, mouseMove, mouseUp, mouseOut } = useBrush({
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
  });

  return (
    <div className={styles.base}>
      <p className={styles.title}>Draw your sketch here</p>
      <canvas
        ref={paintingRef}
        className={cn(styles.canvas, styles.canvas__painting)}
        height="512"
        width="512"
      ></canvas>
      <canvas
        onMouseDown={mouseDown}
        onMouseMove={mouseMove}
        onMouseUp={mouseUp}
        onMouseOut={mouseOut}
        onMouseEnter={resize}
        ref={previewRef}
        className={cn(styles.canvas, styles.canvas__preview)}
        height="512"
        width="512"
      ></canvas>
    </div>
  );
};

const MSTP = ({
  paintImage,
  scrollTop,
  instantGenerationMode,
  brushType,
}: StateType) => ({
  paintImage,
  scrollTop,
  instantGenerationMode,
  brushType,
});

const MDTP = { setPaintImage, setCnProgress, setResultImage };

export default connect(MSTP, MDTP)(PaintingCanvas);
