import React from "react";
import { StateType } from "store/types";
import { connect } from "react-redux";
import { skipRendering } from "api";
import { addPopup } from "store/actions";
import ResultImages from "./ResultImages";
import styles from "./ResultContainer.module.scss";

type StateProps = ReturnType<typeof MSTP>;
type DispatchProps = typeof MDTP;
type ResultCanvasProps = StateProps & DispatchProps;

const ResultContainer: React.FC<ResultCanvasProps> = ({
  cnProgress,
  isZenModeOn,
  addPopup,
}) => {
  return (
    <div className={styles.base}>
      {!isZenModeOn && (
        <div
          className={styles.title}
          title="Your generated result will be here"
        >
          Result
        </div>
      )}
      <ResultImages />
      {cnProgress !== 0 && (
        <>
          {!isZenModeOn && (
            <div
              className={styles.loader}
              onPointerDown={() => skipRendering(addPopup)}
            ></div>
          )}
          <progress className={styles.progress} max="100" value={cnProgress}>
            {cnProgress}
          </progress>
        </>
      )}
    </div>
  );
};

const MSTP = ({
  root: { isZenModeOn },
  controlNet: { progress },
}: StateType) => ({
  cnProgress: progress,
  isZenModeOn,
});

const MDTP = { addPopup };

export default connect(MSTP, MDTP)(ResultContainer);
