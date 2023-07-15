import React from "react";
import { setCanvasWidth, setCanvasHeight } from "store/actions";
import { connect } from "react-redux";
import { StateType } from "store/types";
import cn from "classnames";
import styles from "./PaintingCanvas.module.scss";

type StateProps = ReturnType<typeof MSTP>;
type DispatchProps = typeof MDTP;
type CanvasResizerProps = StateProps & DispatchProps;

export const CanvasResizer: React.FC<CanvasResizerProps> = ({
  canvasSize,
  setCanvasWidth,
  setCanvasHeight,
}) => {
  return (
    <div
      className={cn(styles.title, styles.resizer)}
      title="Change canvas size"
    >
      Size:{" "}
      <select
        className={styles.select}
        value={canvasSize[0]}
        onChange={(event) => setCanvasWidth(+event.target.value)}
      >
        <option value="512">512</option>
        <option value="768">768</option>
        <option value="1024">1024</option>
      </select>{" "}
      x{" "}
      <select
        className={styles.select}
        value={canvasSize[1]}
        onChange={(event) => setCanvasHeight(+event.target.value)}
      >
        <option value="512">512</option>
        <option value="768">768</option>
        <option value="1024">1024</option>
      </select>
    </div>
  );
};

const MSTP = ({ canvasSize }: StateType) => ({ canvasSize });

const MDTP = {
  setCanvasWidth,
  setCanvasHeight,
};

export default connect(MSTP, MDTP)(CanvasResizer);
