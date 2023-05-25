import React from "react";
import { PaintingTools, PaintingCanvas, ResultCanvas } from "components";
import styles from "./MainSection.module.scss";

export const MainSection = () => {
  return (
    <div className={styles.base}>
      <PaintingTools />
      <PaintingCanvas />
      <ResultCanvas />
    </div>
  );
};
