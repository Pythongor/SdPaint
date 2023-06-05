import React, { useEffect, useRef } from "react";
import { ImageViewer, ControlNetForm, MainSection } from "components";
import { connect } from "react-redux";
import { StateType } from "store/types";
import { setScrollTop } from "store/actions";
import cn from "classnames";
import styles from "./App.module.scss";

type StateProps = ReturnType<typeof MSTP>;
type DispatchProps = typeof MDTP;
type AppProps = StateProps & DispatchProps;

const App: React.FC<AppProps> = ({ isImageViewerActive, setScrollTop }) => {
  const ref = useRef<HTMLDivElement>(null);
  // const onload = () => {
  //   document.addEventListener("keydown", (event) => {
  //     const { code, ctrlKey, shiftKey, altKey } = event;
  //     const { brushSlider } = getBrushElements();
  //     const hotkeyMap = {
  //       Enter: () => generate(),
  //       Equal: () => {
  //         if (+brushWidth < brushWidthMap.length) {
  //           setWidth(+brushWidth + 1);
  //         }
  //         brushSlider.value = +brushWidth;
  //       },
  //       Minus: () => {
  //         if (+brushWidth > 0) {
  //           setWidth(+brushWidth - 1);
  //         }
  //         brushSlider.value = +brushWidth;
  //       },
  //       Backspace: ({ shiftKey }) => shiftKey && clearCanvas(),
  //       KeyD: ({ shiftKey }) => shiftKey && downloadImage(),
  //     };
  //     hotkeyMap[code] && hotkeyMap[code]({ ctrlKey, shiftKey, altKey });
  //   });
  // };

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

const MSTP = ({ isImageViewerActive }: StateType) => ({ isImageViewerActive });

const MDTP = { setScrollTop };

export default connect(MSTP, MDTP)(App);
