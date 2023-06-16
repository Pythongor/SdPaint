import React from "react";
import { connect } from "react-redux";
import { StateType } from "store/types";
import { default as BrushInput } from "./components/BrushInput";
import ToolsCheckboxes from "./components/ToolsCheckboxes";
import { default as GenerateButton } from "./components/GenerateButton";
import { setPaintImage } from "store/actions";
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
  setPaintImage,
}) => {
  return (
    <div className={styles.base}>
      <div>
        <BrushInput />
        <div className={styles.group}>
          <p className={styles.title}>Clear canvas</p>
          <div className={styles.clear}>
            <button className={styles.button} onClick={() => setPaintImage("")}>
              Clear
            </button>
          </div>
        </div>
        <button
          className={cn(styles.button, styles.button__download)}
          onClick={() => downloadImage(resultImage)}
        >
          Download image
        </button>
      </div>
      <ToolsCheckboxes />
      <GenerateButton />
    </div>
  );
};

const MSTP = ({ resultImage }: StateType) => ({ resultImage });

const MDTP = { setPaintImage };

export default connect(MSTP, MDTP)(PaintingTools);
