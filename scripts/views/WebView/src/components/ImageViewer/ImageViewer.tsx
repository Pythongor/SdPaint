import React, { useRef } from "react";
import { StateType } from "store/types";
import { connect } from "react-redux";
import { setImageViewerActive } from "store/actions";
import cn from "classnames";
import styles from "./ImageViewer.module.scss";

type StateProps = ReturnType<typeof MSTP>;
type DispatchProps = typeof MDTP;
type ImageViewerProps = StateProps & DispatchProps;

const ImageViewer: React.FC<ImageViewerProps> = ({
  resultImage,
  isImageViewerActive,
  setImageViewerActive,
}) => {
  const ref = useRef(null);

  const onClick = () => setImageViewerActive(false);

  return (
    <div
      className={cn(styles.base, !isImageViewerActive && styles.base__hide)}
      ref={ref}
      onClick={onClick}
    >
      <img className={styles.image} src={resultImage} alt=""></img>
    </div>
  );
};

const MSTP = ({ isImageViewerActive, resultImage }: StateType) => ({
  isImageViewerActive,
  resultImage,
});

const MDTP = { setImageViewerActive };

export default connect(MSTP, MDTP)(ImageViewer);
