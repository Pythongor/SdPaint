import React, { useEffect, useRef } from "react";
import { StateType } from "store/types";
import { connect } from "react-redux";
import { setViewedImageIndex } from "store/actions";
import cn from "classnames";
import styles from "./ModalWrapper.module.scss";

type StateProps = ReturnType<typeof MSTP>;
type DispatchProps = typeof MDTP;
type ImageViewerProps = StateProps & DispatchProps;

const ImagesViewer: React.FC<ImageViewerProps> = ({
  images,
  viewedImageIndex,
  setViewedImageIndex,
}) => {
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    if (viewedImageIndex > images.length - 1) setViewedImageIndex(0);
  }, [images, viewedImageIndex]);

  useEffect(() => {
    itemsRef.current = itemsRef.current.slice(0, images.length);
    const selected = itemsRef.current[viewedImageIndex];
    if (selected) {
      selected.scrollIntoView(true);
    }
  }, [images]);

  return (
    <div className={styles.viewer}>
      <div className={styles.imageContainer}>
        <img className={styles.image} src={images[viewedImageIndex]} />
      </div>
      {images.length > 1 && (
        <div
          className={styles.carousel}
          onClick={(event) => event.stopPropagation()}
        >
          {images.map((image, index) => (
            <img
              className={cn(
                styles.carouselImage,
                index === viewedImageIndex && styles.carouselImage__selected
              )}
              src={image}
              onClick={() => setViewedImageIndex(index)}
              key={index}
              ref={(el) => (itemsRef.current[index] = el)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const MSTP = ({ modal, result: { images, viewedImageIndex } }: StateType) => ({
  modal,
  images,
  viewedImageIndex,
});

const MDTP = { setViewedImageIndex };

export default connect(MSTP, MDTP)(ImagesViewer);
