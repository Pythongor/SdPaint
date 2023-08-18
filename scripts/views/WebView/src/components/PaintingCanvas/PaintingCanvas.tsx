import React, { useEffect } from "react";
import { setErasingByMouse } from "store/brush/actions";
import { setCanvasImage, setEmptyImage } from "store/canvas/actions";
import { connect } from "react-redux";
import { StateType } from "store/types";
import { useBrushes } from "./hooks/useBrushes";
import { useCanvas, clear } from "./canvasHelpers";
import CanvasResizer from "./CanvasResizer";
import cn from "classnames";
import styles from "./PaintingCanvas.module.scss";
import { getCanvasImage } from "store/selectors";

type StateProps = ReturnType<typeof MSTP>;
type DispatchProps = typeof MDTP;
type PaintingCanvasProps = StateProps & DispatchProps;

export const PaintingCanvas: React.FC<PaintingCanvasProps> = ({
  scrollTop,
  canvasImage,
  instantGenerationMode,
  canvasImagesStack,
  isZenModeOn,
  canvasSize,
  setCanvasImage,
  setEmptyImage,
  setErasingByMouse,
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
  }, [context, canvasImagesStack, paintingRef, setEmptyImage]);

  useEffect(() => {
    if (!paintingRef?.current || !context) return;
    const currentImage = paintingRef.current.toDataURL();
    if (!canvasImage) {
      clear(paintingRef, context);
    } else if (currentImage !== canvasImage) {
      const image = new Image();
      image.src = canvasImage;
      image.onload = function () {
        clear(paintingRef, context);
        context.drawImage(image, 0, 0);
      };
    }
  }, [canvasImage, context, canvasSize, paintingRef]);

  useEffect(() => {
    resize();
  }, [resize, scrollTop, paintingRef]);

  const { onPointerDown, onPointerMove, onPointerUp, onPointerOut } =
    useBrushes({
      paintingRef,
      previewRef,
      context,
      previewContext,
      mousePos,
      instantGenerationMode,
      setMouseCoordinates,
      setCanvasImage,
      setErasingByMouse,
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
  canvasImage: getCanvasImage(state),
  canvasImagesStack: state.canvas.imagesStack,
  scrollTop: state.root.scrollTop,
  instantGenerationMode: state.root.instantGenerationMode,
  brushType: state.brush.brushType,
  isZenModeOn: state.root.isZenModeOn,
  canvasSize: state.canvas.size,
});

const MDTP = { setCanvasImage, setEmptyImage, setErasingByMouse };

export default connect(MSTP, MDTP)(PaintingCanvas);
