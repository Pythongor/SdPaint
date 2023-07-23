import React, { useState } from "react";
import { StateType } from "store/types";
import { connect } from "react-redux";
import { setViewedImageIndex } from "store/actions";
import cn from "classnames";
import styles from "./ImagesViewer.module.scss";
import { Arrow } from "components/widgets";

type StateProps = ReturnType<typeof MSTP>;
type DispatchProps = typeof MDTP;
type ImageViewerProps = StateProps & DispatchProps;

const ImageInfo: React.FC<ImageViewerProps> = ({ info }) => {
  const [isHidden, setHidden] = useState(true);
  return (
    <div
      className={cn(styles.info, isHidden && styles.info__hidden)}
      onClick={(event) => event.stopPropagation()}
    >
      <Arrow
        onPointerDown={(event) => {
          event.stopPropagation();
          setHidden((value) => !value);
        }}
        isOn={!isHidden}
        position="right"
        customClass={styles.arrow}
      />
    </div>
  );
};

const MSTP = ({ result: { info } }: StateType) => ({ info });

const MDTP = { setViewedImageIndex };

export default connect(MSTP, MDTP)(ImageInfo);
