import React, { useCallback, useEffect, useState } from "react";
import { StateType } from "store/types";
import { connect } from "react-redux";
import { setResultWidth, setResultHeight } from "store/result/actions";
import { setCnConfig } from "store/controlNet/actions";
import { useResize } from "hooks";
import ResultImage from "./ResultImage";
import cn from "classnames";
import styles from "./ResultContainer.module.scss";

type StateProps = ReturnType<typeof MSTP>;
type DispatchProps = typeof MDTP;
type ResultImagesProps = StateProps & DispatchProps;

const ResultImages: React.FC<ResultImagesProps> = ({
  cnProgress,
  images,
  imageSize,
  isZenModeOn,
  canvasWidth,
  setResultWidth,
  setResultHeight,
}) => {
  const [containerStyle, setContainerStyle] = useState(styles.container);

  const setContainerLayout = useCallback(() => {
    const diffWithoutResult =
      window.innerWidth - (isZenModeOn ? 38 : 248) - canvasWidth;
    const containerStyles = [styles.container];

    if (images.length > 1) {
      if (images.length === 6) {
        if (diffWithoutResult - imageSize[0] > 0) {
          if (diffWithoutResult - imageSize[0] * 1.5 > 0) {
            containerStyles.push(styles.container__3c);
          } else containerStyles.push(styles.container__2c);
        } else containerStyles.push(styles.container__3c);
      } else if (images.length === 9) {
        containerStyles.push(styles.container__3c);
      } else if (images.length === 12) {
        if (diffWithoutResult - imageSize[0] > 0) {
          if (diffWithoutResult - (imageSize[0] * 4) / 3 > 0) {
            containerStyles.push(styles.container__4c);
          } else containerStyles.push(styles.container__3c);
        } else containerStyles.push(styles.container__4c);
      } else if (images.length === 16) {
        containerStyles.push(styles.container__4c);
      } else {
        containerStyles.push(styles.container__2c);
      }
    }

    setContainerStyle(cn(...containerStyles));
  }, [images, imageSize, canvasWidth, isZenModeOn]);

  useResize(setContainerLayout, [images, imageSize, canvasWidth, isZenModeOn]);

  useEffect(setContainerLayout, [
    images,
    imageSize,
    canvasWidth,
    isZenModeOn,
    setContainerLayout,
  ]);

  useEffect(() => {
    const image = images[0];
    image &&
      fetch(image)
        .then((response) => response.blob())
        .then((blob) => {
          const url = URL.createObjectURL(blob);
          const img = new Image();
          img.src = url;
          img.onload = () => {
            URL.revokeObjectURL(url);
            if (imageSize[0] !== img.width || imageSize[1] !== img.height) {
              setResultWidth(img.width);
              setResultHeight(img.height);
            }
          };
        });
  }, [
    images,
    canvasWidth,
    imageSize,
    isZenModeOn,
    setResultWidth,
    setResultHeight,
  ]);

  return (
    <div className={containerStyle}>
      {images.length > 0 &&
        images.map((_, index) => (
          <ResultImage
            isWaiting={cnProgress !== 0 && !isZenModeOn}
            index={index}
            key={index}
          />
        ))}
    </div>
  );
};

const MSTP = ({
  root: { isZenModeOn },
  canvas: { size },
  controlNet: { progress },
  result: { images, imageSize },
}: StateType) => ({
  cnProgress: progress,
  images,
  imageSize,
  isZenModeOn,
  canvasWidth: size[0],
});

const MDTP = { setResultWidth, setResultHeight, setCnConfig };

export default connect(MSTP, MDTP)(ResultImages);
