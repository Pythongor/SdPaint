import React from "react";
import { ImageViewer, ControlNetForm, MainSection } from "components";
import { connect } from "react-redux";
import { StateType } from "store/types";
import cn from "classnames";
import styles from "./App.module.scss";

type AppProps = ReturnType<typeof MSTP>;

const App: React.FC<AppProps> = ({ isImageViewerActive }) => {
  const onload = () => {
    // document.addEventListener("keydown", (event) => {
    //   const { code, ctrlKey, shiftKey, altKey } = event;
    //   const { brushSlider } = getBrushElements();
    //   const hotkeyMap = {
    //     Enter: () => generate(),
    //     Equal: () => {
    //       if (+brushWidth < brushWidthMap.length) {
    //         setWidth(+brushWidth + 1);
    //       }
    //       brushSlider.value = +brushWidth;
    //     },
    //     Minus: () => {
    //       if (+brushWidth > 0) {
    //         setWidth(+brushWidth - 1);
    //       }
    //       brushSlider.value = +brushWidth;
    //     },
    //     Backspace: ({ shiftKey }) => shiftKey && clearCanvas(),
    //     KeyD: ({ shiftKey }) => shiftKey && downloadImage(),
    //   };
    //   hotkeyMap[code] && hotkeyMap[code]({ ctrlKey, shiftKey, altKey });
    // });
    // initializeFormElements();
    // await initializeModels();
    // await initializeModules();
  };

  window.onload = onload;

  return (
    <div
      className={cn(
        styles.base,
        isImageViewerActive && styles.base__scrollLock
      )}
    >
      <ImageViewer />
      <ControlNetForm />
      <MainSection />
    </div>
  );
};

const MSTP = ({ isImageViewerActive }: StateType) => ({ isImageViewerActive });

export default connect(MSTP)(App);
