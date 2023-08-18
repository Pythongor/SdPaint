import { useCallback } from "react";
import { ResultInfoType } from "store/result/types";
import { AudioStateType, AudioSignalType } from "store/audio/types";
import { PayloadActionCreator } from "typesafe-actions";
import { AudioActions } from "store/audio/types";
import { addPopup } from "store/actions";
import { setCnProgress } from "store/controlNet/actions";
import { setResultImages, setResultInfo } from "store/result/actions";
import { sendImage, retryRequest, getImage, catchError } from "api";
import { renewAudioContext } from "audio/synth";
import {
  playEpicSignal,
  playRingtoneSignal,
  playBounceSignal,
} from "audio/signals";
import { start } from "tone";
import { useDispatch, useSelector } from "react-redux";
import { PopupConfigType, StateType } from "store/types";
import { setAudioReady } from "store/audio/actions";

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

export const useGenerate = () => {
  const dispatch = useDispatch();
  const audio = useSelector(({ audio }: StateType) => audio);

  const dispatchResultImages = (payload: string[]) =>
    dispatch(setResultImages(payload));
  const dispatchCnProgress = (payload: number) =>
    dispatch(setCnProgress(payload));
  const dispatchResultInfo = (payload: ResultInfoType | null) =>
    dispatch(setResultInfo(payload));
  const dispatchPopup = (payload: Omit<PopupConfigType, "id">) =>
    dispatch(addPopup(payload));
  const dispatchAudioReady = (payload: boolean) =>
    dispatch(setAudioReady(payload));

  const audioFunc = () => handleAudioSignal(audio, dispatchAudioReady);

  return useCallback(
    async (paintImage: string) => {
      if (!paintImage) return;
      await sendImage(paintImage).catch((error) =>
        catchError(error, dispatchPopup)
      );
      await retryRequest({
        finalFunc: async () => {
          const result = await getImage(dispatchPopup);
          if ("error" in result) {
            audioFunc();
            return;
          }
          const { images, info, status_code } = result;
          if (status_code === 200) {
            dispatchResultImages(images);
            dispatchResultInfo(info);
          }
          audioFunc();
        },
        progressFunc: (data) => {
          dispatchCnProgress(isNaN(data) ? 100 : data * 100);
          return !!data;
        },
        addPopup: dispatchPopup,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [audio]
  );
};
