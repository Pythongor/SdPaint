import React from "react";
import { connect } from "react-redux";
import { sendImage, retryRequest, getImage } from "api";
import { setResultImage, setCnProgress } from "store/actions";

const GenerateButton = ({ paintImage, setResultImage, setCnProgress }) => {
  const generate = async () => {
    if (!paintImage) return;
    await sendImage(paintImage);
    await retryRequest(
      async () => {
        const { blob } = await getImage();
        setResultImage(URL.createObjectURL(blob));
      },
      (data) => setCnProgress(data * 100)
    );
  };

  return (
    <button id="generate" className="button" onClick={generate}>
      Generate
    </button>
  );
};

const MSTP = ({ paintImage }) => ({ paintImage });

const MDTP = { setResultImage, setCnProgress };

export default connect(MSTP, MDTP)(GenerateButton);
