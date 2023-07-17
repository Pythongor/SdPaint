import React, { useCallback } from "react";
import { connect } from "react-redux";
import { StateType } from "store/types";
import { getCnConfig, sendCnConfig } from "api";
import { default as BrushInput } from "./components/BrushInput";
import ToolsCheckboxes from "./components/ToolsCheckboxes";
import { default as GenerateButton } from "./components/GenerateGroup";
import { setPaintImage, setCnConfig, setModal } from "store/actions";
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
  setPaintImage,
  setCnConfig,
  setModal,
}) => {
  const loadConfig = () =>
    getCnConfig().then((fileConfig) => {
      if ("error" in fileConfig) return;
      setCnConfig(fileConfig);
    });
  const saveConfig = useCallback(() => sendCnConfig(cnConfig), [cnConfig]);
  const clear = useCallback(() => setPaintImage(emptyImage), [emptyImage]);

  return (
    <div className={styles.base}>
      <div>
        <BrushInput />
        <button
          className={cn(styles.button, styles.button__single)}
          onClick={() => downloadImages(resultImages)}
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
            onClick={loadConfig}
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
            onClick={saveConfig}
            title="Save config to 'controlnet.json'"
          >
            ⭱
          </button>
          <button
            className={cn(styles.button, styles.button__symbol)}
            onClick={() => setModal("settings")}
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
          onClick={clear}
        >
          Clear
        </button>
      </div>
      <ToolsCheckboxes />
      <GenerateButton />
    </div>
  );
};

const MSTP = ({ resultImages, cnConfig, emptyImage }: StateType) => ({
  resultImages,
  cnConfig,
  emptyImage,
});

const MDTP = { setPaintImage, setCnConfig, setModal };

export default connect(MSTP, MDTP)(PaintingTools);
