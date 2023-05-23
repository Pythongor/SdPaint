import React from "react";
import { PaintingTools, PaintingCanvas, ResultCanvas } from "components";

export const MainSection = () => {
  return (
    <div className="main">
      <PaintingTools />
      <PaintingCanvas />
      <ResultCanvas />
    </div>
  );
};
