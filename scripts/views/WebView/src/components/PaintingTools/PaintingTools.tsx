import React, { useCallback } from "react";
import { connect } from "react-redux";
import { StateType } from "store/types";
import { getCnConfig, sendCnConfig } from "api";
import { default as BrushInput } from "./components/BrushInput";
import ToolsCheckboxes from "./components/ToolsCheckboxes";
import { default as GenerateButton } from "./components/GenerateButton";
import { setPaintImage, setCnConfig } from "store/actions";
import cn from "classnames";
import styles from "./PaintingTools.module.scss";

type StateProps = ReturnType<typeof MSTP>;
type DispatchProps = typeof MDTP;
type PaintingToolsProps = StateProps & DispatchProps;

export const downloadImage = (image: string) => {
  if (!image) return;
  const a = document.createElement("a");
  a.href = image;
  a.download = `sd_gen_${new Date().toJSON()}.png`;
  a.click();
};

const PaintingTools: React.FC<PaintingToolsProps> = ({
  resultImage,
  cnConfig,
  setPaintImage,
  setCnConfig,
}) => {
  const loadConfig = () =>
    getCnConfig().then((fileConfig) => {
      if ("error" in fileConfig) return;
      setCnConfig(fileConfig);
    });

  const saveConfig = useCallback(() => sendCnConfig(cnConfig), [cnConfig]);
  return (
    <div className={styles.base}>
      <div>
        <BrushInput />
        <button
          className={cn(styles.button, styles.button__single)}
          onClick={() => downloadImage(resultImage)}
        >
          Download image
        </button>
        <div className={styles.buttonGroup}>
          <button className={cn(styles.button)} onClick={loadConfig}>
            Load config
          </button>
          <button className={cn(styles.button)} onClick={saveConfig}>
            Save config
          </button>
        </div>
        <button
          className={cn(
            styles.button,
            styles.button__single,
            styles.button__clear
          )}
          onClick={() => setPaintImage("")}
        >
          Clear canvas
        </button>
      </div>
      <ToolsCheckboxes />
      <GenerateButton />
    </div>
  );
};

const MSTP = ({ resultImage, cnConfig }: StateType) => ({
  resultImage,
  cnConfig,
});

const MDTP = { setPaintImage, setCnConfig };

export default connect(MSTP, MDTP)(PaintingTools);
