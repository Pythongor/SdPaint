import React, { useCallback } from "react";
import { connect } from "react-redux";
import { StateType } from "store/types";
import {
  decreaseCanvasImageIndex,
  increaseCanvasImageIndex,
  setCanvasImage,
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
  setMultipleImagesMode,
} from "store/actions";
import { useHotKeys } from "hooks";
import { downloadImages } from "components/PaintingTools/PaintingTools";
import { getCanvasImage } from "store/selectors";
import {
  generate,
  handleAudioSignal,
} from "components/PaintingTools/components/GenerateGroup";
import { getCnConfig, sendCnConfig, skipRendering } from "api";

type StateProps = ReturnType<typeof MSTP>;
type DispatchProps = typeof MDTP;
type HotkeyWrapperProps = StateProps &
  DispatchProps & { children: React.ReactNode };

const HotkeyWrapper: React.FC<HotkeyWrapperProps> = ({
  children,
  modal,
  resultImages,
  canvasImage,
  cnConfig,
  isZenModeOn,
  audio,
  decreaseCanvasImageIndex,
  increaseCanvasImageIndex,
  setCanvasImage,
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
  setMultipleImagesMode,
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
    generate(canvasImage, setResultImages, setCnProgress, audioFunc);
  }, [canvasImage, setResultImages, setCnProgress, audio]);

  const memoizedDownload = useCallback(
    () => downloadImages(resultImages),
    [resultImages]
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

  const saveConfig = useCallback(() => {
    sendCnConfig(cnConfig);
  }, [cnConfig]);

  useHotKeys(
    {
      Escape: handleEscape,
      Enter: memoizedGenerate,
      Equal: () => setBrushWidth("+"),
      Minus: () => setBrushWidth("-"),
      Delete: () => setCanvasImage(""),
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
      KeyM: () => setMultipleImagesMode("switch"),
      KeyP: () => setBrushType("pencil"),
      KeyR: () => setBrushType("rectangle"),
      KeyS: memoizedToggleSettings,
      KeyV: memoizedToggleViewer,
      KeyY_c: () => increaseCanvasImageIndex(),
      KeyZ: () => setZenMode("switch"),
      KeyZ_c: () => decreaseCanvasImageIndex(),
      KeyZ_cs: () => increaseCanvasImageIndex(),
    },
    [cnConfig.seed, canvasImage, resultImages, isZenModeOn, modal]
  );
  return <>{children}</>;
};

const MSTP = (state: StateType) => ({
  modal: state.modal,
  resultImages: state.result.images,
  canvasImage: getCanvasImage(state),
  cnConfig: state.cnConfig,
  isZenModeOn: state.isZenModeOn,
  audio: state.audio,
});

const MDTP = {
  decreaseCanvasImageIndex,
  increaseCanvasImageIndex,
  setCanvasImage,
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
  setMultipleImagesMode,
};

export default connect(MSTP, MDTP)(HotkeyWrapper);
