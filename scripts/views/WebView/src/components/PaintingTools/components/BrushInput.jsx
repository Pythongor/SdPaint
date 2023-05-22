import React from "react";
import { connect } from "react-redux";
import { setBrushWidth, setIsErasing } from "store/actions";
import { getRealBrushWidth } from "store/selectors";

const BrushInput = ({ isErasing, setBrushWidth, setIsErasing, brushWidth }) => {
  const onSliderInput = (event) => setBrushWidth(event.target.value);

  const onEraserInput = (event) => {
    if (event.target.checked) {
      setIsErasing(true);
    } else {
      setIsErasing(false);
    }
  };

  return (
    <div className="tools_group">
      <label>
        <span className="tools_title">Customize brush</span>
        <input
          className="brush_input"
          id="brushSize"
          type="range"
          min="1"
          max="10"
          defaultValue="2"
          onInput={onSliderInput}
        ></input>
      </label>
      <div className="brush_group">
        <label className="checkbox">
          <input
            type="checkbox"
            name="eraser"
            id="eraser"
            onInput={onEraserInput}
          ></input>
          <span>Eraser</span>
        </label>
        <div
          id="brushSample"
          style={{ backgroundColor: isErasing ? "black" : "white" }}
        >
          <div
            style={{
              backgroundColor: isErasing ? "white" : "black",
              width: `${brushWidth}px`,
              height: `${brushWidth}px`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

const MSTP = (state) => {
  return {
    isErasing: state.isErasing,
    brushWidth: getRealBrushWidth(state),
  };
};

const MDTP = { setBrushWidth, setIsErasing };

export default connect(MSTP, MDTP)(BrushInput);
