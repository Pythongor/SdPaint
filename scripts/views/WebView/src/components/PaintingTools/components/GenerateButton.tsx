import React, { useCallback } from "react";
import { connect, useSelector } from "react-redux";
import { AudioConfigType, AudioSignalType, StateType } from "store/types";
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

const playSignal = (signalType: AudioSignalType) => {
  if (signalType === "epic") {
    playEpicSignal();
  } else if (signalType === "ringtone") {
    playRingtoneSignal();
  } else {
    playBounceSignal();
  }
};

export const handleAudioSignal = (
  { isEnabled, isReady, signalType }: AudioConfigType,
  setAudioReady: PayloadActionCreator<Actions.setAudioReady, boolean>
) => {
  if (!isEnabled) {
    if (isReady) {
      renewAudioContext();
      setAudioReady(false);
    }
  } else {
    if (isReady) renewAudioContext();
    start().then(
      () => {
        !isReady && console.log("audio is ready");
        playSignal(signalType);
        setAudioReady(true);
      },
      (er) => console.log(er)
    );
  }
};

export const generate = async (
  paintImage: string,
  setResultImage: PayloadActionCreator<Actions.setResultImage, string>,
  setCnProgress: PayloadActionCreator<Actions.setCnProgress, number>,
  audioFunc: () => void
) => {
  if (!paintImage) return;
  await sendImage(paintImage).catch(catchError);
  await retryRequest({
    finalFunc: async () => {
      const { blob } = await getImage();
      const url = URL.createObjectURL(blob);
      setResultImage(url);
      audioFunc();
    },
    progressFunc: (data) => {
      setCnProgress(data * 100);
      return !!data;
    },
  });
};

const GenerateButton: React.FC<GenerateButtonProps> = ({
  paintImage,
  audio,
  setResultImage,
  setCnProgress,
  setAudioReady,
}) => {
  const audioFunc = useCallback(
    () => handleAudioSignal(audio, setAudioReady),
    [audio]
  );

  const onClick = useCallback(() => {
    generate(paintImage, setResultImage, setCnProgress, audioFunc);
  }, [paintImage, setResultImage, setCnProgress, audio]);

  return (
    <button
      className={cn(styles.button, styles.button__generate)}
      onClick={onClick}
      title="Start image generation using your sketch and form data"
    >
      Generate
    </button>
  );
};

const MSTP = (state: StateType) => ({
  paintImage: getPaintImage(state),
  audio: state.audio,
});

const MDTP = { setResultImage, setCnProgress, setAudioReady };

export default connect(MSTP, MDTP)(GenerateButton);
