import React, { useEffect, useRef, useState } from "react";
import { StateType } from "store/types";
import { connect } from "react-redux";
import { setViewedImageIndex } from "store/actions";
import cn from "classnames";
import ImageInfo from "./ImageInfo";
import styles from "./ImagesViewer.module.scss";

type StateProps = ReturnType<typeof MSTP>;
type DispatchProps = typeof MDTP;
type ImageViewerProps = StateProps & DispatchProps;

const ImagesViewer: React.FC<ImageViewerProps> = ({
  images,
  viewedImageIndex,
  setViewedImageIndex,
  info,
  inputImageOpacity,
  withTiling,
}) => {
  const [isInfoHidden, setInfoHidden] = useState(true);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (viewedImageIndex > images.length - 1) setViewedImageIndex(0);
  }, [images, setViewedImageIndex, viewedImageIndex]);

  useEffect(() => {
    itemsRef.current = itemsRef.current.slice(0, images.length);
    const selected = itemsRef.current[viewedImageIndex];
    if (selected) {
      selected.scrollIntoView(true);
    }
  }, [images, viewedImageIndex]);

  return (
    <div className={styles.base}>
      <ImageInfo isHidden={isInfoHidden} setHidden={setInfoHidden} />
      <div
        className={cn(
          styles.imageContainer,
          withTiling && styles.imageContainer__tiling,
          images.length > 1 && styles.imageContainer__multiple,
          isInfoHidden && styles.imageContainer__infoHidden
        )}
      >
        {withTiling ? (
          Array(9)
            .fill("")
            .map(() => (
              <div
                className={cn(styles.imageWrapper, styles.imageWrapper__tiling)}
                style={{
                  aspectRatio: withTiling
                    ? info?.width &&
                      info?.height &&
                      `${info?.width} / ${info?.height}`
                    : 0,
                }}
              >
                <img
                  className={styles.image}
                  src={images[viewedImageIndex]}
                  alt=""
                />
                <img
                  className={styles.inputImage}
                  src={info ? info.input_image : ""}
                  style={{ opacity: inputImageOpacity }}
                  alt=""
                />
              </div>
            ))
        ) : (
          <div className={cn(styles.imageWrapper)}>
            <img
              className={styles.image}
              src={images[viewedImageIndex]}
              alt=""
            />
            <img
              className={styles.inputImage}
              src={info ? info.input_image : ""}
              style={{ opacity: inputImageOpacity }}
              alt=""
            />
          </div>
        )}
      </div>
      {images.length > 1 && (
        <div
          className={styles.carousel}
          onPointerDown={(event) => event.stopPropagation()}
        >
          {images.map((image, index) => (
            <img
              className={cn(
                styles.carouselImage,
                index === viewedImageIndex && styles.carouselImage__selected
              )}
              src={image}
              onPointerDown={(event) => {
                event.stopPropagation();
                setViewedImageIndex(index);
              }}
              key={index}
              alt=""
              ref={(el) => (itemsRef.current[index] = el)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const MSTP = ({
  modal,
  result: { images, info },
  viewer: { viewedImageIndex, inputImageOpacity, withTiling },
}: StateType) => ({
  modal,
  images,
  viewedImageIndex,
  info,
  withTiling,
  inputImageOpacity,
});

const MDTP = { setViewedImageIndex };

export default connect(MSTP, MDTP)(ImagesViewer);
