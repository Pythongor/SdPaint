import React, { useEffect } from "react";
import {
  setPaintImage,
  setResultImage,
  setCnProgress,
  setEmptyImage,
  setErasingByMouse,
} from "store/actions";
import { connect, useSelector } from "react-redux";
import { StateType } from "store/types";
import { UseBrushProps } from "./types";
import { usePencilBrush } from "./usePencilBrush";
import { useLineBrush } from "./useLineBrush";
import { useRectangleBrush, useEllipseBrush } from "./usePrimitiveShapeBrush";
import { useCanvas, clear } from "./canvasHelpers";
import cn from "classnames";
import styles from "./PaintingCanvas.module.scss";
import { getPaintImage } from "store/selectors";

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
  paintImagesStack,
  isZenModeOn,
  setPaintImage,
  setCnProgress,
  setResultImage,
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
    if (!paintImagesStack.length) {
      const image = paintingRef.current.toDataURL();
      setEmptyImage(image);
    }
  }, [paintingRef?.current, context, paintImagesStack]);

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
  }, [paintImage, paintingRef?.current, context]);

  useEffect(() => {
    resize();
  }, [paintingRef?.current, scrollTop]);

  const { onPointerDown, onPointerMove, onPointerUp, onPointerOut } = useBrush({
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
  });

  return (
    <div className={styles.base}>
      {!isZenModeOn && (
        <div className={styles.title}>Draw your sketch here</div>
      )}
      <canvas
        ref={paintingRef}
        className={cn(styles.canvas, styles.canvas__painting)}
        height="512"
        width="512"
      ></canvas>
      <canvas
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerOut={onPointerOut}
        onPointerEnter={resize}
        onContextMenu={(ev) => ev.preventDefault()}
        ref={previewRef}
        className={cn(styles.canvas, styles.canvas__preview)}
        height="512"
        width="512"
      ></canvas>
    </div>
  );
};

const MSTP = (state: StateType) => ({
  paintImage: getPaintImage(state),
  paintImagesStack: state.paintImagesStack,
  scrollTop: state.scrollTop,
  instantGenerationMode: state.instantGenerationMode,
  brushType: state.brushType,
  isZenModeOn: state.isZenModeOn,
});

const MDTP = {
  setPaintImage,
  setCnProgress,
  setResultImage,
  setEmptyImage,
  setErasingByMouse,
};

export default connect(MSTP, MDTP)(PaintingCanvas);
