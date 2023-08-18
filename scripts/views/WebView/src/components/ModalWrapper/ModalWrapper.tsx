import React, { useRef, useEffect } from "react";
import { StateType } from "store/types";
import { connect } from "react-redux";
import { setModal } from "store/actions";
import { ImagesViewer, Settings } from "..";
import { useHotKeys } from "hooks";
import cn from "classnames";
import styles from "./ModalWrapper.module.scss";

type StateProps = ReturnType<typeof MSTP>;
type DispatchProps = typeof MDTP;
type ImageViewerProps = StateProps & DispatchProps;

const ModalWrapper: React.FC<ImageViewerProps> = ({ modal, setModal }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref?.current) {
      if (modal) {
        ref.current.focus();
      } else {
        ref.current.blur();
      }
    }
  }, [modal, ref]);
  const contentMap = {
    imageViewer: ImagesViewer,
    settings: Settings,
    empty: () => null,
  };

  useHotKeys(
    {
      Escape: () => setModal(null),
    },
    [setModal],
    ref
  );

  const Content = contentMap[modal || "empty"] as React.FC;

  return (
    <div
      ref={ref}
      tabIndex={-1}
      className={cn(styles.base, !modal && styles.base__hide)}
      onPointerDown={() => setModal(null)}
    >
      <Content />
    </div>
  );
};

const MSTP = ({ root: { modal } }: StateType) => ({ modal });

const MDTP = { setModal };

export default connect(MSTP, MDTP)(ModalWrapper);
