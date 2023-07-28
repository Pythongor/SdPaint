import React, { useEffect, useRef } from "react";
import {
  ModalWrapper,
  ControlNetForm,
  MainSection,
  ZenControls,
} from "components";
import { connect } from "react-redux";
import { StateType } from "store/types";
import { getSettings, getStorageConfig } from "storage";
import { extractDataFromConfig } from "helpers";
import { getCnConfig } from "api";
import {
  setScrollTop,
  setInstantGenerationMode,
  setZenMode,
  setCnConfig,
  setAudioEnabled,
  setAudioSignalType,
  setCanvasWidth,
  setCanvasHeight,
  setResultImagesCount,
  setMultipleImagesMode,
} from "store/actions";
import HotkeyWrapper from "./HotkeyWrapper";
import cn from "classnames";
import styles from "./App.module.scss";

type StateProps = ReturnType<typeof MSTP>;
type DispatchProps = typeof MDTP;
type AppProps = StateProps & DispatchProps;

const App: React.FC<AppProps> = ({
  modal,
  setScrollTop,
  setInstantGenerationMode,
  setZenMode,
  setCnConfig,
  setAudioEnabled,
  setAudioSignalType,
  setCanvasWidth,
  setCanvasHeight,
  setResultImagesCount,
  setMultipleImagesMode,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const {
      instantMode,
      zenMode,
      audioEnabled,
      audioSignalType,
      canvasSize,
      resultImagesCount,
      isMultipleImagesModeOn,
    } = getSettings();
    setInstantGenerationMode(instantMode);
    setZenMode(zenMode);
    setAudioEnabled(audioEnabled);
    setAudioSignalType(audioSignalType);
    setCanvasWidth(canvasSize[0]);
    setCanvasHeight(canvasSize[1]);
    setResultImagesCount(resultImagesCount);
    setMultipleImagesMode(isMultipleImagesModeOn);
  }, [
    setAudioEnabled,
    setAudioSignalType,
    setCanvasHeight,
    setCanvasWidth,
    setInstantGenerationMode,
    setMultipleImagesMode,
    setResultImagesCount,
    setZenMode,
  ]);

  useEffect(() => {
    const storageConfig = extractDataFromConfig(getStorageConfig());
    setCnConfig(storageConfig);
    getCnConfig().then((fileConfig) => {
      if ("error" in fileConfig) return;
      setCnConfig(fileConfig);
    });
  }, [setCnConfig]);

  return (
    <HotkeyWrapper>
      <div
        className={cn(styles.base, modal && styles.base__scrollLock)}
        ref={ref}
        onScroll={() =>
          ref.current?.scrollTop && setScrollTop(ref.current?.scrollTop)
        }
      >
        <ModalWrapper />
        <ControlNetForm />
        <MainSection />
        <ZenControls />
      </div>
    </HotkeyWrapper>
  );
};

const MSTP = ({ modal }: StateType) => ({
  modal,
});

const MDTP = {
  setScrollTop,
  setInstantGenerationMode,
  setZenMode,
  setCnConfig,
  setAudioEnabled,
  setAudioSignalType,
  setCanvasWidth,
  setCanvasHeight,
  setResultImagesCount,
  setMultipleImagesMode,
};

export default connect(MSTP, MDTP)(App);
