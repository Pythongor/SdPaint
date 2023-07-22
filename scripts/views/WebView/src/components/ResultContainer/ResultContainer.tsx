import React from "react";
import { StateType } from "store/types";
import { connect } from "react-redux";
import { skipRendering } from "api";
import ResultImages from "./ResultImages";
import styles from "./ResultContainer.module.scss";

type StateProps = ReturnType<typeof MSTP>;
type ResultCanvasProps = StateProps;

const ResultContainer: React.FC<ResultCanvasProps> = ({
  cnProgress,
  isZenModeOn,
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
              onClick={() => skipRendering()}
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

const MSTP = ({ cnProgress, isZenModeOn }: StateType) => ({
  cnProgress,
  isZenModeOn,
});

export default connect(MSTP)(ResultContainer);
