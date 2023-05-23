import React from "react";

export const ToolsCheckboxes = () => {
  return (
    <div>
      <div className="tools_group">
        <label className="checkbox">
          <input
            type="checkbox"
            defaultChecked
            name="fastMode"
            id="fastMode"
          ></input>
          <span>Powerful GPU mode</span>
        </label>
      </div>
      <div className="tools_group">
        <label className="checkbox">
          <input
            type="checkbox"
            defaultChecked
            name="syncJSON"
            id="syncJSON"
          ></input>
          <span>Sync with JSON</span>
        </label>
      </div>
    </div>
  );
};
