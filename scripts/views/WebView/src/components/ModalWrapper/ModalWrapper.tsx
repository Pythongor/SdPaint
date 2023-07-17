import React from "react";
import { StateType } from "store/types";
import { connect } from "react-redux";
import { setModal } from "store/actions";
import Settings from "./Settings";
import cn from "classnames";
import styles from "./ModalWrapper.module.scss";

type StateProps = ReturnType<typeof MSTP>;
type DispatchProps = typeof MDTP;
type ImageViewerProps = StateProps & DispatchProps;

const ModalWrapper: React.FC<ImageViewerProps> = ({
  resultImages,
  modal,
  setModal,
}) => {
  const contentMap = {
    imageViewer: () => (
      <img className={styles.image} src={resultImages[0]} alt=""></img>
    ),
    settings: Settings,
    empty: () => null,
  };

  const Content = contentMap[modal || "empty"] as React.FC;

  return (
    <div
      className={cn(styles.base, !modal && styles.base__hide)}
      onClick={() => setModal(null)}
    >
      <Content />
    </div>
  );
};

const MSTP = ({ modal, result: { images } }: StateType) => ({
  modal,
  resultImages: images,
});

const MDTP = { setModal };

export default connect(MSTP, MDTP)(ModalWrapper);
