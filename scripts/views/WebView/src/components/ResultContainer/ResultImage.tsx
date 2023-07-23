import React from "react";
import { StateType } from "store/types";
import { connect } from "react-redux";
import { setModal, setViewedImageIndex, setCnConfig } from "store/actions";
import { RESULT_IMAGES_GRID_TYPES } from "components/ModalWrapper/Settings";
import cn from "classnames";
import styles from "./ResultContainer.module.scss";

type LengthType = (typeof RESULT_IMAGES_GRID_TYPES)[number] | 1;
type ImagesSizesMap = { [key in LengthType]: number };

type OwnProps = { isWaiting: boolean; index: number };
type StateProps = ReturnType<typeof MSTP>;
type DispatchProps = typeof MDTP;
type ResultImageProps = OwnProps & StateProps & DispatchProps;

const imageSizesMap: ImagesSizesMap = {
  1: 1,
  2: 1,
  4: 2,
  6: 2,
  9: 3,
  12: 3,
  16: 4,
};

const ResultImage = ({
  isWaiting,
  index,
  seeds,
  images,
  imageSize,
  setViewedImageIndex,
  setModal,
  setCnConfig,
}: ResultImageProps) => {
  const oneImageSize = [
    imageSize[0] / imageSizesMap[images.length as LengthType],
    imageSize[1] / imageSizesMap[images.length as LengthType],
  ];

  return (
    <div className={styles.imageWrapper}>
      <img
        className={cn(styles.image, isWaiting && styles.image__waiting)}
        width={oneImageSize[0]}
        height={oneImageSize[1]}
        onClick={() => {
          setViewedImageIndex(index);
          setModal("imageViewer");
        }}
        src={images[index]}
      ></img>
      {images.length !== 1 && (
        <div className={styles.seed}>
          Seed: {seeds[index]}
          <button
            className={styles.button}
            onPointerDown={() => setCnConfig({ seed: seeds[index] })}
          >
            Use seed
          </button>
        </div>
      )}
    </div>
  );
};

const MSTP = ({
  result: { images, imageSize, info },
  cnConfig: { seed },
}: StateType) => ({
  images,
  imageSize,
  seeds: info?.all_seeds || images.map(() => seed),
});

const MDTP = { setModal, setViewedImageIndex, setCnConfig };

export default connect(MSTP, MDTP)(ResultImage);
