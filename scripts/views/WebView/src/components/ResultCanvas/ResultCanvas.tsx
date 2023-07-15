import React, { useRef, useCallback, useEffect, useState } from "react";
import { StateType } from "store/types";
import { connect } from "react-redux";
import { setModal, setResultWidth, setResultHeight } from "store/actions";
import { skipRendering } from "api";
import cn from "classnames";
import styles from "./ResultCanvas.module.scss";

type StateProps = ReturnType<typeof MSTP>;
type DispatchProps = typeof MDTP;
type ResultCanvasProps = StateProps & DispatchProps;

const ResultCanvas: React.FC<ResultCanvasProps> = ({
  cnProgress,
  resultImage,
  resultSize,
  isZenModeOn,
  setModal,
  setResultWidth,
  setResultHeight,
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
      context.clearRect(0, 0, resultSize[0], resultSize[1]);
    } else {
      const image = Array.isArray(resultImage) ? resultImage[0] : resultImage;
      fetch(image)
        .then((response) => response.blob())
        .then((blob) => {
          const url = URL.createObjectURL(blob);
          let img = new Image();
          img.src = url;
          img.onload = () => {
            URL.revokeObjectURL(url);
            setResultWidth(img.width);
            setResultHeight(img.height);
            context.drawImage(img, 0, 0, img.width, img.height);
          };
        });
    }
  }, [resultImage, context, ref.current]);

  const onClick = useCallback(() => {
    if (!ref.current || !resultImage) return;
    setModal("imageViewer");
  }, [ref.current, resultImage]);

  return (
    <div className={styles.base}>
      {!isZenModeOn && (
        <div
          className={styles.title}
          title="Your generated result will be here"
        >
          Result
        </div>
      )}
      <canvas
        className={cn(
          styles.canvas,
          cnProgress !== 0 && !isZenModeOn && styles.canvas__waiting,
          !resultImage && styles.canvas__empty
        )}
        width={resultSize[0]}
        height={resultSize[1]}
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

const MSTP = ({
  cnProgress,
  resultImage,
  resultSize,
  isZenModeOn,
}: StateType) => ({
  cnProgress,
  resultImage,
  resultSize,
  isZenModeOn,
});

const MDTP = { setModal, setResultWidth, setResultHeight };

export default connect(MSTP, MDTP)(ResultCanvas);
