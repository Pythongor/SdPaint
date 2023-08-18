import React, { useCallback, useEffect, useRef } from "react";
import {
  ControlNetForm,
  MainSection,
  ModalWrapper,
  Popups,
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
  addPopup,
} from "store/actions";
import { setAudioEnabled, setAudioSignalType } from "store/audio/actions";
import { setCanvasWidth, setCanvasHeight } from "store/canvas/actions";
import { setCnConfig } from "store/controlNet/actions";
import {
  setResultImagesCount,
  setMultipleImagesMode,
} from "store/result/actions";
import HotkeyWrapper from "./HotkeyWrapper";
import cn from "classnames";
import styles from "./App.module.scss";

type StorageConfigType = Awaited<ReturnType<typeof getCnConfig>>;

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
  addPopup,
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

  const setConfig = useCallback(
    (config: StorageConfigType) => {
      if ("error" in config) return;
      setCnConfig(config);
      setMultipleImagesMode(getSettings().isMultipleImagesModeOn);
    },
    [setCnConfig, setMultipleImagesMode]
  );

  useEffect(() => {
    const storageConfig = extractDataFromConfig(getStorageConfig());
    setCnConfig(storageConfig);
    getCnConfig(addPopup).then(setConfig);
  }, [setCnConfig, addPopup, setConfig]);

  console.log("modal", modal);

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
        <Popups />
        <ControlNetForm />
        <MainSection />
        <ZenControls />
      </div>
    </HotkeyWrapper>
  );
};

const MSTP = ({ root: { modal } }: StateType) => ({
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
  addPopup,
};

export default connect(MSTP, MDTP)(App);
