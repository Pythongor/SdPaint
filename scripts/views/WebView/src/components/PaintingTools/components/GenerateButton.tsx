import React, { useCallback } from "react";
import { connect } from "react-redux";
import { AudioSignalType, StateType } from "store/types";
import { PayloadActionCreator } from "typesafe-actions";
import { Actions } from "store/types";
import { sendImage, retryRequest, getImage, catchError } from "api";
import { getPaintImage } from "store/selectors";
import { setResultImage, setCnProgress, setAudioReady } from "store/actions";
import { renewAudioContext } from "audio/synth";
import {
  playEpicSignal,
  playRingtoneSignal,
  playBounceSignal,
} from "audio/signals";
import { start } from "tone";
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

const playSignal = (signalType: AudioSignalType) => {
  if (signalType === "epic") {
    playEpicSignal();
  } else if (signalType === "ringtone") {
    playRingtoneSignal();
  } else {
    playBounceSignal();
  }
};

const GenerateButton: React.FC<GenerateButtonProps> = ({
  paintImage,
  isAudioReady,
  signalType,
  isAudioEnabled,
  setResultImage,
  setCnProgress,
  setAudioReady,
}) => {
  const onClick = useCallback(() => {
    generate(paintImage, setResultImage, setCnProgress);
  }, [paintImage, setResultImage, setCnProgress]);

  const x = useCallback(() => {
    if (!isAudioEnabled) {
      if (isAudioReady) {
        renewAudioContext();
        setAudioReady(false);
      }
    } else {
      if (isAudioReady) renewAudioContext();
      start().then(
        () => {
          !isAudioReady && console.log("audio is ready");
          playSignal(signalType);
          setAudioReady(true);
        },
        (er) => console.log(er)
      );
    }
  }, [isAudioReady, signalType, isAudioEnabled]);

  return (
    <button className={cn(styles.button, styles.button__generate)} onClick={x}>
      Generate
    </button>
  );
};

const MSTP = (state: StateType) => ({
  paintImage: getPaintImage(state),
  isAudioReady: state.audio.isReady,
  signalType: state.audio.signalType,
  isAudioEnabled: state.audio.isEnabled,
});

const MDTP = { setResultImage, setCnProgress, setAudioReady };

export default connect(MSTP, MDTP)(GenerateButton);
