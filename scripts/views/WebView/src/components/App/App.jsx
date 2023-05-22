import React from "react";
import { ImageViewer, ControlNetForm, MainSection } from "components";
import { connect } from "react-redux";
import { StateType } from "store/types";
import { setIsErasing, setBrushWidth } from "store/actions";
import { syncSettings, getConfig, getSettings } from "../../storage";
import styles from "./App.module.scss";
import "../../style.css";

const App = ({ isImageViewerActive }) => {
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
      className={isImageViewerActive ? "scrollLock" : ""}
      style={{ height: "100vh", overflow: "auto" }}
    >
      <ImageViewer />
      <ControlNetForm />
      <MainSection />
    </div>
  );
};

const MSTP = ({ isImageViewerActive }) => ({ isImageViewerActive });

const MDTP = {};

export default connect(MSTP, MDTP)(App);
