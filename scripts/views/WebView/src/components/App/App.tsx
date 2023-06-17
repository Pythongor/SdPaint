import React, { useEffect, useRef, useCallback } from "react";
import { ImageViewer, ControlNetForm, MainSection } from "components";
import { connect } from "react-redux";
import { StateType } from "store/types";
import {
  setScrollTop,
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
import cn from "classnames";
import styles from "./App.module.scss";

type HotKeyModificators = {
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
};

type StateProps = ReturnType<typeof MSTP>;
type DispatchProps = typeof MDTP;
type AppProps = StateProps & DispatchProps;

const App: React.FC<AppProps> = ({
  isImageViewerActive,
  resultImage,
  paintImage,
  seed,
  isZenModeOn,
  setScrollTop,
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
  const ref = useRef<HTMLDivElement>(null);

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

  return (
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
    </div>
  );
};

const MSTP = (state: StateType) => ({
  isImageViewerActive: state.isImageViewerActive,
  resultImage: state.resultImage,
  paintImage: getPaintImage(state),
  seed: state.cnConfig.seed,
  isZenModeOn: state.isZenModeOn,
});

const MDTP = {
  setScrollTop,
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

export default connect(MSTP, MDTP)(App);
