import React from "react";
import { connect } from "react-redux";
import { StateType } from "store/types";
import { sendImage, retryRequest, getImage } from "api";
import { setResultImage, setCnProgress } from "store/actions";
import cn from "classnames";
import styles from "../PaintingTools.module.scss";

type StateProps = ReturnType<typeof MSTP>;
type DispatchProps = typeof MDTP;
type GenerateButtonProps = StateProps & DispatchProps;

const GenerateButton: React.FC<GenerateButtonProps> = ({
  paintImage,
  setResultImage,
  setCnProgress,
}) => {
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
    <button
      id="generate"
      className={cn(styles.button, styles.button__generate)}
      onClick={generate}
    >
      Generate
    </button>
  );
};

const MSTP = ({ paintImage }: StateType) => ({ paintImage });

const MDTP = { setResultImage, setCnProgress };

export default connect(MSTP, MDTP)(GenerateButton);
