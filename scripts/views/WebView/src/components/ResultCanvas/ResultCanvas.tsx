import React, { useRef, useCallback, useEffect, useState } from "react";
import { StateType } from "store/types";
import { connect } from "react-redux";
import { setImageViewerActive } from "store/actions";
import { skipRendering } from "api";
import cn from "classnames";
import styles from "./ResultCanvas.module.scss";

type StateProps = ReturnType<typeof MSTP>;
type DispatchProps = typeof MDTP;
type ResultCanvasProps = StateProps & DispatchProps;

const ResultCanvas: React.FC<ResultCanvasProps> = ({
  cnProgress,
  resultImage,
  isZenModeOn,
  setImageViewerActive,
}) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D>();

  useEffect(() => {
    if (!ref?.current) return;
    const canvasContext = ref?.current.getContext("2d");
    if (!canvasContext) return;
    setContext(canvasContext);
  }, [ref?.current]);

  useEffect(() => {
    if (!context || !ref.current) return;
    if (resultImage === "") {
      context.clearRect(0, 0, 512, 512);
    } else {
      fetch(resultImage)
        .then((response) => response.blob())
        .then((blob) => createImageBitmap(blob))
        .then((imageBitMap) => context.drawImage(imageBitMap, 0, 0, 512, 512));
    }
  }, [resultImage, context, ref.current]);

  const onClick = useCallback(() => {
    if (!ref.current || !resultImage) return;
    setImageViewerActive(true);
  }, [ref.current, resultImage]);

  return (
    <div className={styles.base}>
      {!isZenModeOn && <div className={styles.title}>Your result here</div>}
      <canvas
        className={cn(
          styles.canvas,
          cnProgress !== 0 && !isZenModeOn && styles.canvas__waiting,
          !resultImage && styles.canvas__empty
        )}
        height="512"
        width="512"
        onClick={onClick}
        ref={ref}
      ></canvas>
      {cnProgress !== 0 && (
        <>
          {!isZenModeOn && (
            <div
              className={styles.loader}
              onClick={() => skipRendering()}
            ></div>
          )}
          <progress className={styles.progress} max="100" value={cnProgress}>
            {cnProgress}
          </progress>
        </>
      )}
    </div>
  );
};

const MSTP = ({ cnProgress, resultImage, isZenModeOn }: StateType) => ({
  cnProgress,
  resultImage,
  isZenModeOn,
});

const MDTP = { setImageViewerActive };

export default connect(MSTP, MDTP)(ResultCanvas);
