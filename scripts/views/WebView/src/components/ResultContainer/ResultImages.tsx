import React, { useCallback, useEffect, useState } from "react";
import { StateType } from "store/types";
import { connect } from "react-redux";
import {
  setModal,
  setResultWidth,
  setResultHeight,
  setViewedImageIndex,
} from "store/actions";
import { useResize } from "hooks";
import { RESULT_IMAGES_GRID_TYPES } from "components/ModalWrapper/Settings";
import cn from "classnames";
import styles from "./ResultContainer.module.scss";

type LengthType = (typeof RESULT_IMAGES_GRID_TYPES)[number] | 1;
type ImagesSizesMap = { [key in LengthType]: number };

type StateProps = ReturnType<typeof MSTP>;
type DispatchProps = typeof MDTP;
type ResultCanvasProps = StateProps & DispatchProps;

const ResultImages: React.FC<ResultCanvasProps> = ({
  cnProgress,
  images,
  imageSize,
  isZenModeOn,
  seed,
  canvasWidth,
  setModal,
  setResultWidth,
  setResultHeight,
  setViewedImageIndex,
}) => {
  const [containerStyle, setContainerStyle] = useState(styles.container);
  const isEmpty = images.length === 0;
  const isBatch = images.length > 1;

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

  useEffect(setContainerLayout, [imageSize, images, images]);

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

  const imageSizesMap: ImagesSizesMap = {
    1: 1,
    2: 2,
    4: 2,
    6: 2,
    9: 3,
    12: 3,
    16: 4,
  };

  const oneImageSize = [
    imageSize[0] / imageSizesMap[images.length as LengthType],
    imageSize[1] / imageSizesMap[images.length as LengthType],
  ];

  return (
    <div className={containerStyle}>
      {!isEmpty &&
        images.map((image, index) => (
          <div className={styles.imageWrapper} key={index}>
            <img
              className={cn(
                styles.image,
                cnProgress !== 0 && !isZenModeOn && styles.image__waiting
              )}
              width={oneImageSize[0]}
              height={oneImageSize[1]}
              onClick={() => {
                setViewedImageIndex(index);
                setModal("imageViewer");
              }}
              src={image}
            ></img>
            {isBatch && <div className={styles.seed}>Seed: {seed + index}</div>}
          </div>
        ))}
    </div>
  );
};

const MSTP = ({
  cnProgress,
  result: { images, imageSize },
  isZenModeOn,
  cnConfig: { seed },
  canvas: { size },
}: StateType) => ({
  cnProgress,
  images,
  imageSize,
  isZenModeOn,
  seed,
  canvasWidth: size[0],
});

const MDTP = { setModal, setResultWidth, setResultHeight, setViewedImageIndex };

export default connect(MSTP, MDTP)(ResultImages);
