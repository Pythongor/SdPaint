import { ResultInfoType, ResultActions } from "store/result/types";
import { AudioStateType, AudioSignalType } from "store/audio/types";
import { PayloadActionCreator } from "typesafe-actions";
import { AudioActions } from "store/audio/types";
import { ControlNetActions } from "store/controlNet/types";
import { addPopup } from "store/actions";
import { sendImage, retryRequest, getImage, catchError } from "api";
import { renewAudioContext } from "audio/synth";
import {
  playEpicSignal,
  playRingtoneSignal,
  playBounceSignal,
} from "audio/signals";
import { start } from "tone";

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
  { isEnabled, isReady, signalType }: AudioStateType,
  setAudioReady: PayloadActionCreator<AudioActions.setAudioReady, boolean>
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
  setResultImages: PayloadActionCreator<
    ResultActions.setResultImages,
    string[]
  >,
  setCnProgress: PayloadActionCreator<ControlNetActions.setCnProgress, number>,
  setResultInfo: PayloadActionCreator<
    ResultActions.setResultInfo,
    ResultInfoType | null
  >,
  addPopupAction: typeof addPopup,
  audioFunc: () => void
) => {
  if (!paintImage) return;
  await sendImage(paintImage).catch((error) =>
    catchError(error, addPopupAction)
  );
  await retryRequest({
    finalFunc: async () => {
      const result = await getImage(addPopupAction);
      if ("error" in result) {
        audioFunc();
        return;
      }
      const { images, info, status_code } = result;
      if (status_code === 200) {
        setResultImages(images);
        setResultInfo(info);
      }
      audioFunc();
    },
    progressFunc: (data) => {
      setCnProgress(isNaN(data) ? 100 : data * 100);
      return !!data;
    },
    addPopup: addPopupAction,
  });
};
