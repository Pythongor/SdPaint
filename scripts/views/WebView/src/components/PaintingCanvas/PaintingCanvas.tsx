import React, { useEffect } from "react";
import {
  setPaintImage,
  setResultImages,
  setCnProgress,
  setEmptyImage,
  setErasingByMouse,
  setAudioReady,
} from "store/actions";
import { connect } from "react-redux";
import { StateType } from "store/types";
import { useBrushes } from "./hooks/useBrushes";
import { useCanvas, clear } from "./canvasHelpers";
import CanvasResizer from "./CanvasResizer";
import cn from "classnames";
import styles from "./PaintingCanvas.module.scss";
import { getPaintImage } from "store/selectors";

type StateProps = ReturnType<typeof MSTP>;
type DispatchProps = typeof MDTP;
type PaintingCanvasProps = StateProps & DispatchProps;

export const PaintingCanvas: React.FC<PaintingCanvasProps> = ({
  scrollTop,
  paintImage,
  instantGenerationMode,
  canvasImagesStack,
  isZenModeOn,
  canvasSize,
  setPaintImage,
  setCnProgress,
  setResultImages,
  setEmptyImage,
  setErasingByMouse,
  setAudioReady,
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
    if (!canvasImagesStack.length) {
      const image = paintingRef.current.toDataURL();
      setEmptyImage(image);
    }
  }, [paintingRef?.current, context, canvasImagesStack]);

  useEffect(() => {
    if (!paintingRef?.current || !context) return;
    const currentImage = paintingRef.current.toDataURL();
    if (paintImage === "") {
      clear(paintingRef, context);
    } else if (currentImage !== paintImage) {
      const image = new Image();
      image.src = paintImage;
      image.onload = function () {
        clear(paintingRef, context);
        context.drawImage(image, 0, 0);
      };
    }
  }, [paintImage, paintingRef?.current, context, canvasSize]);

  useEffect(() => {
    resize();
  }, [paintingRef?.current, scrollTop]);

  const { onPointerDown, onPointerMove, onPointerUp, onPointerOut } =
    useBrushes({
      paintingRef,
      previewRef,
      context,
      previewContext,
      mousePos,
      instantGenerationMode,
      setMouseCoordinates,
      setPaintImage,
      setCnProgress,
      setResultImages,
      setErasingByMouse,
      setAudioReady,
    });

  return (
    <div className={styles.base}>
      {!isZenModeOn && (
        <div className={styles.title} title="Draw your sketch here">
          Painting canvas
        </div>
      )}
      <canvas
        ref={paintingRef}
        className={cn(styles.canvas, styles.canvas__painting)}
        width={canvasSize[0]}
        height={canvasSize[1]}
      ></canvas>
      <canvas
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerOut={onPointerOut}
        onPointerEnter={resize}
        ref={previewRef}
        className={cn(styles.canvas, styles.canvas__preview)}
        width={canvasSize[0]}
        height={canvasSize[1]}
      ></canvas>
      <CanvasResizer />
    </div>
  );
};

const MSTP = (state: StateType) => ({
  paintImage: getPaintImage(state),
  canvasImagesStack: state.canvas.imagesStack,
  scrollTop: state.scrollTop,
  instantGenerationMode: state.instantGenerationMode,
  brushType: state.brushConfig.brushType,
  isZenModeOn: state.isZenModeOn,
  canvasSize: state.canvas.size,
});

const MDTP = {
  setPaintImage,
  setCnProgress,
  setResultImages,
  setEmptyImage,
  setErasingByMouse,
  setAudioReady,
};

export default connect(MSTP, MDTP)(PaintingCanvas);
