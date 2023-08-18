import React, { useCallback } from "react";
import { connect } from "react-redux";
import { StateType } from "store/types";

import {
  setInstantGenerationMode,
  setZenMode,
  setModal,
  addPopup,
} from "store/actions";
import { setAudioEnabled } from "store/audio/actions";
import {
  setBrushWidth,
  setBrushType,
  setErasingBySwitch,
  setBrushFilling,
} from "store/brush/actions";
import {
  decreaseCanvasImageIndex,
  increaseCanvasImageIndex,
  setCanvasImage,
} from "store/canvas/actions";
import { setCnConfig } from "store/controlNet/actions";
import { setMultipleImagesMode } from "store/result/actions";

import { useHotKeys } from "hooks";
import { downloadImages } from "components/PaintingTools/PaintingTools";
import { getCanvasImage } from "store/selectors";
import { useGenerate } from "components/PaintingTools/generate";
import { getCnConfig, sendCnConfig, skipRendering } from "api";

type StateProps = ReturnType<typeof MSTP>;
type DispatchProps = typeof MDTP;
type HotkeyWrapperProps = StateProps &
  DispatchProps & {
    children: React.ReactNode;
  };

const HotkeyWrapper: React.FC<HotkeyWrapperProps> = ({
  children,
  modal,
  resultImages,
  canvasImage,
  cnConfig,
  isZenModeOn,
  decreaseCanvasImageIndex,
  increaseCanvasImageIndex,
  setCanvasImage,
  setBrushWidth,
  setBrushType,
  setBrushFilling,
  setErasingBySwitch,
  setInstantGenerationMode,
  setCnConfig,
  setZenMode,
  setModal,
  setAudioEnabled,
  setMultipleImagesMode,
  addPopup,
}) => {
  const generate = useGenerate();

  const changeSeed = useCallback(
    (ascend?: boolean) => {
      if (ascend) {
        setCnConfig({ seed: cnConfig.seed + 1 });
      } else setCnConfig({ seed: cnConfig.seed - 1 });
    },
    [cnConfig.seed, setCnConfig]
  );

  const randomizeSeed = () =>
    setCnConfig({ seed: Math.trunc(Math.random() * 2 ** 32 - 1) });

  const memoizedGenerate = useCallback(() => {
    generate(canvasImage);
  }, [generate, canvasImage]);

  const memoizedDownload = useCallback(
    () => downloadImages(resultImages),
    [resultImages]
  );

  const memoizedToggleViewer = useCallback(() => {
    if (modal === "imageViewer") {
      setModal(null);
    } else if (resultImages.length) {
      setModal("imageViewer");
    }
  }, [modal, setModal, resultImages]);

  const memoizedToggleSettings = useCallback(() => {
    if (modal === "settings") {
      setModal(null);
    } else {
      setModal("settings");
    }
  }, [modal, setModal]);

  const loadConfig = () => {
    getCnConfig(addPopup).then((fileConfig) => {
      if ("error" in fileConfig) return;
      setCnConfig(fileConfig);
    });
  };

  const saveConfig = useCallback(() => {
    sendCnConfig(cnConfig, addPopup);
  }, [cnConfig, addPopup]);

  useHotKeys(
    {
      Escape: () => setZenMode(false),
      Enter: memoizedGenerate,
      Equal: () => setBrushWidth("+"),
      Minus: () => setBrushWidth("-"),
      Delete: () => setCanvasImage(""),
      Backspace: () => skipRendering(addPopup),
      Backquote: () => changeSeed(true),
      Backquote_s: () => changeSeed(),
      Backquote_a: randomizeSeed,
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
  modal: state.root.modal,
  resultImages: state.result.images,
  canvasImage: getCanvasImage(state),
  cnConfig: state.controlNet.config,
  isZenModeOn: state.root.isZenModeOn,
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
  setCnConfig,
  setZenMode,
  setModal,
  setAudioEnabled,
  setMultipleImagesMode,
  addPopup,
};

export default connect(MSTP, MDTP)(HotkeyWrapper);
