import React, { useEffect, useRef } from "react";
import {
  ImageViewer,
  ControlNetForm,
  MainSection,
  ZenControls,
} from "components";
import { connect } from "react-redux";
import { StateType } from "store/types";
import { getSettings, getStorageConfig, ConfigType } from "storage";
import { extractDataFromConfig } from "helpers";
import { getCnConfig } from "api";
import {
  setScrollTop,
  setInstantGenerationMode,
  setZenMode,
  setCnConfig,
  setAudioEnabled,
  setAudioSignalType,
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
  setCnConfig,
  setAudioEnabled,
  setAudioSignalType,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { instantMode, zenMode, audioEnabled, audioSignalType } =
      getSettings();
    setInstantGenerationMode(instantMode);
    setZenMode(zenMode);
    setAudioEnabled(audioEnabled);
    setAudioSignalType(audioSignalType);
  }, []);

  useEffect(() => {
    const storageConfig = extractDataFromConfig(getStorageConfig());
    setCnConfig(storageConfig);
    getCnConfig().then((fileConfig) => {
      if ("error" in fileConfig) return;
      setCnConfig(fileConfig);
    });
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
  setCnConfig,
  setAudioEnabled,
  setAudioSignalType,
};

export default connect(MSTP, MDTP)(App);
