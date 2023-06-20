import React, { useCallback } from "react";
import { connect } from "react-redux";
import { StateType } from "store/types";
import {
  decreasePaintImageIndex,
  increasePaintImageIndex,
  setPaintImage,
  setBrushWidth,
  setBrushType,
  setIsErasing,
  setInstantGenerationMode,
  setResultImage,
  setCnProgress,
  setCnConfig,
  setBrushFilling,
  setZenMode,
  setImageViewerActive,
} from "store/actions";
import { useHotKeys } from "hooks";
import { downloadImage } from "components/PaintingTools/PaintingTools";
import { getPaintImage } from "store/selectors";
import { generate } from "components/PaintingTools/components/GenerateButton";

type StateProps = ReturnType<typeof MSTP>;
type DispatchProps = typeof MDTP;
type HotkeyWrapperProps = StateProps &
  DispatchProps & { children: React.ReactNode };

const HotkeyWrapper: React.FC<HotkeyWrapperProps> = ({
  children,
  isImageViewerActive,
  resultImage,
  paintImage,
  seed,
  isZenModeOn,
  decreasePaintImageIndex,
  increasePaintImageIndex,
  setPaintImage,
  setBrushWidth,
  setBrushType,
  setBrushFilling,
  setIsErasing,
  setInstantGenerationMode,
  setResultImage,
  setCnProgress,
  setCnConfig,
  setZenMode,
  setImageViewerActive,
}) => {
  const changeSeed = useCallback(
    (ascend?: boolean) => {
      if (ascend) {
        setCnConfig({ seed: seed + 1 });
      } else setCnConfig({ seed: seed - 1 });
    },
    [seed]
  );

  const memoizedGenerate = useCallback(() => {
    generate(paintImage, setResultImage, setCnProgress);
  }, [paintImage, setResultImage, setCnProgress]);

  const memoizedDownload = useCallback(
    () => downloadImage(resultImage),
    [resultImage]
  );

  const handleEscape = useCallback(() => {
    if (isImageViewerActive) {
      setImageViewerActive(false);
    } else if (isZenModeOn) setZenMode(false);
  }, [isZenModeOn, isImageViewerActive]);

  useHotKeys(
    {
      Escape: handleEscape,
      Enter: memoizedGenerate,
      Equal: () => setBrushWidth("+"),
      Minus: () => setBrushWidth("-"),
      Delete: () => setPaintImage(""),
      KeyD: memoizedDownload,
      KeyE: () => setBrushType("ellipse"),
      KeyE_c: () => setIsErasing("switch"),
      KeyF: () => setBrushFilling("switch"),
      KeyI: () => setInstantGenerationMode("switch"),
      KeyL: () => setBrushType("line"),
      KeyP: () => setBrushType("pencil"),
      KeyR: () => setBrushType("rectangle"),
      KeyS: () => changeSeed(true),
      KeyS_s: () => changeSeed(),
      KeyV: () => setImageViewerActive("switch"),
      KeyY_c: () => increasePaintImageIndex(),
      KeyZ: () => setZenMode("switch"),
      KeyZ_c: () => decreasePaintImageIndex(),
      KeyZ_cs: () => increasePaintImageIndex(),
    },
    [seed, paintImage, resultImage, isZenModeOn, isImageViewerActive]
  );
  return <>{children}</>;
};

const MSTP = (state: StateType) => ({
  isImageViewerActive: state.isImageViewerActive,
  resultImage: state.resultImage,
  paintImage: getPaintImage(state),
  seed: state.cnConfig.seed,
  isZenModeOn: state.isZenModeOn,
});

const MDTP = {
  decreasePaintImageIndex,
  increasePaintImageIndex,
  setPaintImage,
  setBrushWidth,
  setBrushFilling,
  setBrushType,
  setIsErasing,
  setInstantGenerationMode,
  setResultImage,
  setCnProgress,
  setCnConfig,
  setZenMode,
  setImageViewerActive,
};

export default connect(MSTP, MDTP)(HotkeyWrapper);
