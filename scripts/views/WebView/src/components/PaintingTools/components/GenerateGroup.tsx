import React, { useCallback } from "react";
import { connect } from "react-redux";
import { StateType } from "store/types";
import { getCanvasImage } from "store/selectors";
import { setMultipleImagesMode } from "store/result/actions";
import { useGenerate } from "../generate";
import cn from "classnames";
import styles from "../PaintingTools.module.scss";

type StateProps = ReturnType<typeof MSTP>;
type DispatchProps = typeof MDTP;
type GenerateGroupProps = StateProps & DispatchProps;

const GenerateGroup: React.FC<GenerateGroupProps> = ({
  paintImage,
  isMultipleModeOn,
  setMultipleImagesMode,
}) => {
  const generate = useGenerate();

  const onPointerDown = useCallback(() => {
    generate(paintImage);
  }, [generate, paintImage]);

  return (
    <div className={styles.group}>
      <label
        className={styles.label}
        title="In multiple mode app generates few images instead of just one"
      >
        <input
          className={styles.checkbox}
          type="checkbox"
          checked={isMultipleModeOn}
          onChange={() => {
            setMultipleImagesMode(!isMultipleModeOn);
          }}
        ></input>
        Multiple mode
      </label>
      <button
        className={cn(styles.button, styles.button__generate)}
        onPointerDown={onPointerDown}
        title="Start image generation using your sketch and form data"
      >
        Generate
      </button>
    </div>
  );
};

const MSTP = (state: StateType) => ({
  paintImage: getCanvasImage(state),
  imagesCount: state.controlNet.config.batch_size,
  isMultipleModeOn: state.result.isMultipleImagesModeOn,
});

const MDTP = { setMultipleImagesMode };

export default connect(MSTP, MDTP)(GenerateGroup);
