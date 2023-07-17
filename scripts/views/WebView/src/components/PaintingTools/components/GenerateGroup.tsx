import React, { useCallback } from "react";
import { connect } from "react-redux";
import { AudioConfigType, AudioSignalType, StateType } from "store/types";
import { PayloadActionCreator } from "typesafe-actions";
import { Actions } from "store/types";
import { sendImage, retryRequest, getImage, catchError } from "api";
import { getCanvasImage } from "store/selectors";
import {
  setResultImages,
  setCnProgress,
  setAudioReady,
  setCnConfig,
  setMultipleImagesMode,
} from "store/actions";
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
type GenerateGroupProps = StateProps & DispatchProps;

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
  setResultImages: PayloadActionCreator<Actions.setResultImages, string[]>,
  setCnProgress: PayloadActionCreator<Actions.setCnProgress, number>,
  audioFunc: () => void
) => {
  if (!paintImage) return;
  await sendImage(paintImage).catch(catchError);
  await retryRequest({
    finalFunc: async () => {
      const { images } = await getImage();
      setResultImages(images);
      audioFunc();
    },
    progressFunc: (data) => {
      setCnProgress(data * 100);
      return !!data;
    },
  });
};

const GenerateGroup: React.FC<GenerateGroupProps> = ({
  paintImage,
  isMultipleModeOn,
  audio,
  setResultImages,
  setCnProgress,
  setAudioReady,
  setMultipleImagesMode,
}) => {
  const audioFunc = useCallback(
    () => handleAudioSignal(audio, setAudioReady),
    [audio]
  );

  const onClick = useCallback(() => {
    generate(paintImage, setResultImages, setCnProgress, audioFunc);
  }, [paintImage, setResultImages, setCnProgress, audio]);

  return (
    <div className={styles.group}>
      <label
        className={styles.label}
        title="In multiple mode app generates few images instead of just one"
      >
        <input
          className={styles.checkbox}
          type="checkbox"
          checked={isMultipleModeOn}
          onChange={() => {
            setMultipleImagesMode(!isMultipleModeOn);
          }}
        ></input>
        Multiple mode
      </label>
      <button
        className={cn(styles.button, styles.button__generate)}
        onClick={onClick}
        title="Start image generation using your sketch and form data"
      >
        Generate
      </button>
    </div>
  );
};

const MSTP = (state: StateType) => ({
  paintImage: getCanvasImage(state),
  imagesCount: state.cnConfig.batch_size,
  audio: state.audio,
  isMultipleModeOn: state.result.isMultipleImagesModeOn,
});

const MDTP = {
  setResultImages,
  setCnProgress,
  setAudioReady,
  setCnConfig,
  setMultipleImagesMode,
};

export default connect(MSTP, MDTP)(GenerateGroup);
