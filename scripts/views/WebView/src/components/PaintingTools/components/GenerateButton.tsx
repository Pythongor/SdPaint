import React, { useCallback } from "react";
import { connect } from "react-redux";
import { StateType } from "store/types";
import { PayloadActionCreator } from "typesafe-actions";
import { Actions } from "store/types";
import { sendImage, retryRequest, getImage, catchError } from "api";
import { getPaintImage } from "store/selectors";
import { setResultImage, setCnProgress } from "store/actions";
import cn from "classnames";
import styles from "../PaintingTools.module.scss";

type StateProps = ReturnType<typeof MSTP>;
type DispatchProps = typeof MDTP;
type GenerateButtonProps = StateProps & DispatchProps;

export const generate = async (
  paintImage: string,
  setResultImage: PayloadActionCreator<Actions.setResultImage, string>,
  setCnProgress: PayloadActionCreator<Actions.setCnProgress, number>
) => {
  if (!paintImage) return;
  await sendImage(paintImage).catch(catchError);
  await retryRequest({
    finalFunc: async () => {
      const { blob } = await getImage();
      setResultImage(URL.createObjectURL(blob));
    },
    progressFunc: (data) => {
      setCnProgress(data * 100);
      return !!data;
    },
  });
};

const GenerateButton: React.FC<GenerateButtonProps> = ({
  paintImage,
  setResultImage,
  setCnProgress,
}) => {
  const onClick = useCallback(() => {
    generate(paintImage, setResultImage, setCnProgress);
  }, [paintImage, setResultImage, setCnProgress]);

  return (
    <button
      className={cn(styles.button, styles.button__generate)}
      onClick={onClick}
    >
      Generate
    </button>
  );
};

const MSTP = (state: StateType) => ({ paintImage: getPaintImage(state) });

const MDTP = { setResultImage, setCnProgress };

export default connect(MSTP, MDTP)(GenerateButton);
