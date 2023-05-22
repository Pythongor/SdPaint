import React from "react";
import { connect } from "react-redux";
import { default as BrushInput } from "./components/BrushInput";
import { ToolsCheckboxes } from "./components/ToolsCheckboxes";
import { default as GenerateButton } from "./components/GenerateButton";
import { setPaintImage } from "store/actions";

const PaintingTools = ({ resultImage, setPaintImage }) => {
  const downloadImage = () => {
    if (!resultImage) return;
    const a = document.createElement("a");
    a.href = resultImage;
    a.download = `sd_gen_${new Date().toJSON()}.png`;
    a.click();
  };

  const clearCanvas = () => setPaintImage("");

  return (
    <div className="tools">
      <div>
        <BrushInput />
        <div className="tools_group">
          <p className="tools_title">Clear canvas</p>
          <div className="clear_group">
            <button id="clear" className="button" onClick={clearCanvas}>
              Clear
            </button>
          </div>
        </div>
        <button id="downloadImage" className="button" onClick={downloadImage}>
          Download image
        </button>
      </div>
      <ToolsCheckboxes />
      <GenerateButton />
    </div>
  );
};

const MSTP = ({ resultImage }) => ({ resultImage });

const MDTP = { setPaintImage };

export default connect(MSTP, MDTP)(PaintingTools);
