import React, { useEffect, useRef } from "react";
import {
  ImageViewer,
  ControlNetForm,
  MainSection,
  ZenControls,
} from "components";
import { connect } from "react-redux";
import { StateType } from "store/types";
import { getSettings } from "storage";
import {
  setScrollTop,
  setInstantGenerationMode,
  setZenMode,
} from "store/actions";
import HotkeyWrapper from "./HotkeyWrapper";
import cn from "classnames";
import styles from "./App.module.scss";

type StateProps = ReturnType<typeof MSTP>;
type DispatchProps = typeof MDTP;
type AppProps = StateProps & DispatchProps;

const App: React.FC<AppProps> = ({
  isImageViewerActive,
  setScrollTop,
  setInstantGenerationMode,
  setZenMode,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { instantMode, zenMode } = getSettings();
    setInstantGenerationMode(instantMode);
    setZenMode(zenMode);
  }, []);

  return (
    <HotkeyWrapper>
      <div
        className={cn(
          styles.base,
          isImageViewerActive && styles.base__scrollLock
        )}
        ref={ref}
        onScroll={() =>
          ref.current?.scrollTop && setScrollTop(ref.current?.scrollTop)
        }
      >
        <ImageViewer />
        <ControlNetForm />
        <MainSection />
        <ZenControls />
      </div>
    </HotkeyWrapper>
  );
};

const MSTP = ({ isImageViewerActive }: StateType) => ({
  isImageViewerActive,
});

const MDTP = {
  setScrollTop,
  setInstantGenerationMode,
  setZenMode,
};

export default connect(MSTP, MDTP)(App);
