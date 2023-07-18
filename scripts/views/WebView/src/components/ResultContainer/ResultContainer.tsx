import React, { useEffect } from "react";
import { StateType } from "store/types";
import { connect } from "react-redux";
import {
  setModal,
  setResultWidth,
  setResultHeight,
  setViewedImageIndex,
} from "store/actions";
import { skipRendering } from "api";
import cn from "classnames";
import styles from "./ResultContainer.module.scss";

type StateProps = ReturnType<typeof MSTP>;
type DispatchProps = typeof MDTP;
type ResultCanvasProps = StateProps & DispatchProps;

const ResultContainer: React.FC<ResultCanvasProps> = ({
  cnProgress,
  images,
  imageSize,
  isZenModeOn,
  seed,
  setModal,
  setResultWidth,
  setResultHeight,
  setViewedImageIndex,
}) => {
  const isEmpty = images.length === 0;
  const isBatch = images.length > 1;

  useEffect(() => {
    const image = images[0];
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
  }, [images]);

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
          images.length > 1 && styles.container__2c
        )}
      >
        {!isEmpty &&
          images.map((image, index) => (
            <div className={styles.imageWrapper} key={index}>
              <img
                className={cn(
                  styles.image,
                  cnProgress !== 0 && !isZenModeOn && styles.image__waiting
                )}
                width={imageSize[0]}
                height={imageSize[1]}
                onClick={() => {
                  setViewedImageIndex(index);
                  setModal("imageViewer");
                }}
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
  result: { images, imageSize },
  isZenModeOn,
  cnConfig: { seed },
}: StateType) => ({
  cnProgress,
  images,
  imageSize,
  isZenModeOn,
  seed,
});

const MDTP = { setModal, setResultWidth, setResultHeight, setViewedImageIndex };

export default connect(MSTP, MDTP)(ResultContainer);
