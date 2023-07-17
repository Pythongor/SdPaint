import React, { useRef, useCallback, useEffect, useState } from "react";
import { StateType } from "store/types";
import { connect } from "react-redux";
import { setModal, setResultWidth, setResultHeight } from "store/actions";
import { skipRendering } from "api";
import cn from "classnames";
import styles from "./ResultContainer.module.scss";

type StateProps = ReturnType<typeof MSTP>;
type DispatchProps = typeof MDTP;
type ResultCanvasProps = StateProps & DispatchProps;

const ResultCanvas: React.FC<ResultCanvasProps> = ({
  cnProgress,
  resultImages,
  resultSize,
  isZenModeOn,
  setModal,
  setResultWidth,
  setResultHeight,
  seed,
}) => {
  const isEmpty = resultImages.length === 0;
  const isBatch = resultImages.length > 1;

  useEffect(() => {
    const image = resultImages[0];
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
        };
      });
  }, [resultImages]);

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
      <div
        className={cn(
          styles.container,
          resultImages.length > 1 && styles.container__2c
        )}
      >
        {!isEmpty &&
          resultImages.map((image, index) => (
            <div className={styles.imageWrapper}>
              <img
                key={index}
                className={cn(
                  styles.image,
                  cnProgress !== 0 && !isZenModeOn && styles.image__waiting,
                  !resultImages && styles.image__empty
                )}
                width={resultSize[0]}
                height={resultSize[1]}
                onClick={() => setModal("imageViewer")}
                src={image}
              ></img>
              {isBatch && (
                <div className={styles.seed}>Seed: {seed + index}</div>
              )}
            </div>
          ))}
      </div>

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
  resultImages,
  resultSize,
  isZenModeOn,
  cnConfig: { seed },
}: StateType) => ({
  cnProgress,
  resultImages,
  resultSize,
  isZenModeOn,
  seed,
});

const MDTP = { setModal, setResultWidth, setResultHeight };

export default connect(MSTP, MDTP)(ResultCanvas);
