import React from "react";
import { connect } from "react-redux";
import { StateType } from "store/types";
import { PaintingTools, PaintingCanvas, ResultContainer } from "components";
import cn from "classnames";
import styles from "./MainSection.module.scss";

type StateProps = ReturnType<typeof MSTP>;

const MainSection: React.FC<StateProps> = ({ isZenModeOn }) => {
  return (
    <div className={cn(styles.base, isZenModeOn && styles.base__zen)}>
      {!isZenModeOn && <PaintingTools />}
      <PaintingCanvas />
      <ResultContainer />
    </div>
  );
};

const MSTP = ({ root: { isZenModeOn } }: StateType) => ({ isZenModeOn });

export default connect(MSTP)(MainSection);
