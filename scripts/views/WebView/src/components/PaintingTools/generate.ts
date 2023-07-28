import { AudioConfigType, AudioSignalType, ResultInfoType } from "store/types";
import { PayloadActionCreator } from "typesafe-actions";
import { Actions } from "store/types";
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
  setResultInfo: PayloadActionCreator<
    Actions.setResultInfo,
    ResultInfoType | null
  >,
  audioFunc: () => void
) => {
  if (!paintImage) return;
  await sendImage(paintImage).catch(catchError);
  await retryRequest({
    finalFunc: async () => {
      const result = await getImage();
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
  });
};
