import React from "react";
import { StateType } from "store/types";
import { connect } from "react-redux";
import { setModal } from "store/actions";
import { ImagesViewer, Settings } from "..";
import cn from "classnames";
import styles from "./ModalWrapper.module.scss";

type StateProps = ReturnType<typeof MSTP>;
type DispatchProps = typeof MDTP;
type ImageViewerProps = StateProps & DispatchProps;

const ModalWrapper: React.FC<ImageViewerProps> = ({ modal, setModal }) => {
  const contentMap = {
    imageViewer: ImagesViewer,
    settings: Settings,
    empty: () => null,
  };

  const Content = contentMap[modal || "empty"] as React.FC;

  return (
    <div
      className={cn(styles.base, !modal && styles.base__hide)}
      onPointerDown={() => setModal(null)}
    >
      <Content />
    </div>
  );
};

const MSTP = ({ modal }: StateType) => ({ modal });

const MDTP = { setModal };

export default connect(MSTP, MDTP)(ModalWrapper);
