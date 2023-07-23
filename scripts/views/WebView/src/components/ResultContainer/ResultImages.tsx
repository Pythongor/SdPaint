import React, { useCallback, useEffect, useState } from "react";
import { StateType } from "store/types";
import { connect } from "react-redux";
import { setResultWidth, setResultHeight, setCnConfig } from "store/actions";
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
  seed,
  setResultWidth,
  setResultHeight,
}) => {
  // TODO rework with server response
  const [imageSeed, setImageSeed] = useState(seed);
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

  useEffect(() => {
    setContainerLayout();
    setImageSeed(seed);
  }, [images, imageSize, canvasWidth, isZenModeOn]);

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
          if (imageSize[0] !== img.width || imageSize[1] !== img.height) {
            setResultWidth(img.width);
            setResultHeight(img.height);
          }
        };
      });
  }, [images, canvasWidth, imageSize, isZenModeOn]);

  return (
    <div className={containerStyle}>
      {images.length > 0 &&
        images.map((image, index) => (
          <ResultImage
            isWaiting={cnProgress !== 0 && !isZenModeOn}
            index={index}
            imageSeed={imageSeed}
            key={index}
          />
        ))}
    </div>
  );
};

const MSTP = ({
  cnProgress,
  result: { images, imageSize },
  isZenModeOn,
  canvas: { size },
  cnConfig: { seed },
}: StateType) => ({
  cnProgress,
  images,
  imageSize,
  isZenModeOn,
  canvasWidth: size[0],
  seed,
});

const MDTP = { setResultWidth, setResultHeight, setCnConfig };

export default connect(MSTP, MDTP)(ResultImages);
