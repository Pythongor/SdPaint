import React, { useRef } from "react";
import { connect } from "react-redux";
import { setImageViewerActive } from "store/actions";

const ImageViewer = ({
  resultImage,
  isImageViewerActive,
  setImageViewerActive,
}) => {
  const ref = useRef(null);

  const onClick = () => setImageViewerActive(false);

  return (
    <div
      id="modal"
      className={isImageViewerActive ? "" : "hide"}
      ref={ref}
      onClick={onClick}
    >
      <img className="modal_image" src={resultImage} alt=""></img>
    </div>
  );
};

const MSTP = ({ isImageViewerActive, resultImage }) => ({
  isImageViewerActive,
  resultImage,
});

const MDTP = { setImageViewerActive };

export default connect(MSTP, MDTP)(ImageViewer);
