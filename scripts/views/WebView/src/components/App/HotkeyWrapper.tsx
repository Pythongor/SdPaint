import React, { useCallback } from "react";
import { connect } from "react-redux";
import { StateType } from "store/types";
import {
  decreasePaintImageIndex,
  increasePaintImageIndex,
  setPaintImage,
  setBrushWidth,
  setBrushType,
  setErasingBySwitch,
  setInstantGenerationMode,
  setResultImages,
  setCnProgress,
  setCnConfig,
  setBrushFilling,
  setZenMode,
  setModal,
  setAudioReady,
  setAudioEnabled,
} from "store/actions";
import { useHotKeys } from "hooks";
import { downloadImages } from "components/PaintingTools/PaintingTools";
import { getPaintImage } from "store/selectors";
import {
  generate,
  handleAudioSignal,
} from "components/PaintingTools/components/GenerateButton";
import { getCnConfig, sendCnConfig, skipRendering } from "api";

type StateProps = ReturnType<typeof MSTP>;
type DispatchProps = typeof MDTP;
type HotkeyWrapperProps = StateProps &
  DispatchProps & { children: React.ReactNode };

const HotkeyWrapper: React.FC<HotkeyWrapperProps> = ({
  children,
  modal,
  resultImage,
  paintImage,
  cnConfig,
  isZenModeOn,
  audio,
  decreasePaintImageIndex,
  increasePaintImageIndex,
  setPaintImage,
  setBrushWidth,
  setBrushType,
  setBrushFilling,
  setErasingBySwitch,
  setInstantGenerationMode,
  setResultImages,
  setCnProgress,
  setCnConfig,
  setZenMode,
  setModal,
  setAudioReady,
  setAudioEnabled,
}) => {
  const changeSeed = useCallback(
    (ascend?: boolean) => {
      if (ascend) {
        setCnConfig({ seed: cnConfig.seed + 1 });
      } else setCnConfig({ seed: cnConfig.seed - 1 });
    },
    [cnConfig.seed]
  );

  const audioFunc = useCallback(
    () => handleAudioSignal(audio, setAudioReady),
    [audio]
  );

  const memoizedGenerate = useCallback(() => {
    generate(paintImage, setResultImages, setCnProgress, audioFunc);
  }, [paintImage, setResultImages, setCnProgress, audio]);

  const memoizedDownload = useCallback(
    () => downloadImages(resultImage),
    [resultImage]
  );

  const handleEscape = useCallback(() => {
    if (modal) {
      setModal(null);
    } else if (isZenModeOn) setZenMode(false);
  }, [isZenModeOn, modal]);

  const memoizedToggleViewer = useCallback(() => {
    if (modal === "imageViewer") {
      setModal(null);
    } else {
      setModal("imageViewer");
    }
  }, [modal]);

  const memoizedToggleSettings = useCallback(() => {
    if (modal === "settings") {
      setModal(null);
    } else {
      setModal("settings");
    }
  }, [modal]);

  const loadConfig = () => {
    getCnConfig().then((fileConfig) => {
      if ("error" in fileConfig) return;
      setCnConfig(fileConfig);
    });
  };

  const saveConfig = useCallback(() => sendCnConfig(cnConfig), [cnConfig]);

  useHotKeys(
    {
      Escape: handleEscape,
      Enter: memoizedGenerate,
      Equal: () => setBrushWidth("+"),
      Minus: () => setBrushWidth("-"),
      Delete: () => setPaintImage(""),
      Backspace: () => skipRendering(),
      Backquote: () => changeSeed(true),
      Backquote_s: () => changeSeed(),
      KeyA: () => setAudioEnabled("switch"),
      KeyC: loadConfig,
      KeyC_s: saveConfig,
      KeyD: memoizedDownload,
      KeyE: () => setBrushType("ellipse"),
      KeyE_c: () => setErasingBySwitch("switch"),
      KeyF: () => setBrushFilling("switch"),
      KeyI: () => setInstantGenerationMode("switch"),
      KeyL: () => setBrushType("line"),
      KeyP: () => setBrushType("pencil"),
      KeyR: () => setBrushType("rectangle"),
      KeyS: memoizedToggleSettings,
      KeyV: memoizedToggleViewer,
      KeyY_c: () => increasePaintImageIndex(),
      KeyZ: () => setZenMode("switch"),
      KeyZ_c: () => decreasePaintImageIndex(),
      KeyZ_cs: () => increasePaintImageIndex(),
    },
    [cnConfig.seed, paintImage, resultImage, isZenModeOn, modal]
  );
  return <>{children}</>;
};

const MSTP = (state: StateType) => ({
  modal: state.modal,
  resultImage: state.resultImage,
  paintImage: getPaintImage(state),
  cnConfig: state.cnConfig,
  isZenModeOn: state.isZenModeOn,
  audio: state.audio,
});

const MDTP = {
  decreasePaintImageIndex,
  increasePaintImageIndex,
  setPaintImage,
  setBrushWidth,
  setBrushFilling,
  setBrushType,
  setErasingBySwitch,
  setInstantGenerationMode,
  setResultImages,
  setCnProgress,
  setCnConfig,
  setZenMode,
  setModal,
  setAudioReady,
  setAudioEnabled,
};

export default connect(MSTP, MDTP)(HotkeyWrapper);
