import React, { useCallback } from "react";
import { connect } from "react-redux";
import { StateType } from "store/types";
import { getCnConfig, sendCnConfig } from "api";
import { default as BrushInput } from "./components/BrushInput";
import ToolsCheckboxes from "./components/ToolsCheckboxes";
import { default as GenerateButton } from "./components/GenerateGroup";
import { setModal, addPopup } from "store/actions";
import { setCnConfig } from "store/controlNet/actions";
import { setCanvasImage } from "store/canvas/actions";
import cn from "classnames";
import styles from "./PaintingTools.module.scss";

type StateProps = ReturnType<typeof MSTP>;
type DispatchProps = typeof MDTP;
type PaintingToolsProps = StateProps & DispatchProps;

export const downloadImages = (images: string | string[]) => {
  const downloadImage = (image: string) => {
    if (!image) return;
    const a = document.createElement("a");
    a.href = image;
    a.download = `sd_gen_${new Date().toJSON()}.png`;
    a.click();
  };
  if (!images) return;
  if (Array.isArray(images)) {
    images.forEach((image) => downloadImage(image));
  } else downloadImage(images);
};

const PaintingTools: React.FC<PaintingToolsProps> = ({
  resultImages,
  cnConfig,
  emptyImage,
  setCanvasImage,
  setCnConfig,
  setModal,
  addPopup,
}) => {
  const loadConfig = () =>
    getCnConfig(addPopup).then((fileConfig) => {
      if ("error" in fileConfig) {
        addPopup({
          message: `Config loaded with error: ${fileConfig.error}`,
          popupType: "error",
        });
        return;
      }
      setCnConfig(fileConfig);
      addPopup({
        message: "Config loaded successfully!",
        popupType: "success",
      });
    });
  const saveConfig = useCallback(() => {
    sendCnConfig(cnConfig, addPopup);
    addPopup({ message: "Config saved successfully!", popupType: "success" });
  }, [cnConfig, addPopup]);
  const clear = useCallback(
    () => setCanvasImage(emptyImage),
    [emptyImage, setCanvasImage]
  );

  return (
    <div className={styles.base}>
      <div>
        <BrushInput />
        <button
          className={cn(styles.button, styles.button__single)}
          onPointerDown={() => downloadImages(resultImages)}
          title="Download result image (if any)"
        >
          Download image
        </button>
        <div className={styles.buttonGroup}>
          <button
            className={cn(
              styles.button,
              styles.button__symbol,
              styles.button__big
            )}
            onPointerDown={loadConfig}
            title="Load config from 'controlnet.json'"
          >
            ⭳
          </button>
          <button
            className={cn(
              styles.button,
              styles.button__symbol,
              styles.button__big
            )}
            onPointerDown={saveConfig}
            title="Save config to 'controlnet.json'"
          >
            ⭱
          </button>
          <button
            className={cn(styles.button, styles.button__symbol)}
            onPointerDown={() => setModal("settings")}
            title="Settings"
          >
            ⛭
          </button>
        </div>
        <button
          className={cn(
            styles.button,
            styles.button__single,
            styles.button__clear
          )}
          title="Clear painting canvas"
          onPointerDown={clear}
        >
          Clear
        </button>
      </div>
      <ToolsCheckboxes />
      <GenerateButton />
    </div>
  );
};

const MSTP = ({
  result: { images },
  canvas: { emptyImage },
  controlNet: { config },
}: StateType) => ({
  resultImages: images,
  cnConfig: config,
  emptyImage,
});

const MDTP = { setCanvasImage, setCnConfig, setModal, addPopup };

export default connect(MSTP, MDTP)(PaintingTools);
