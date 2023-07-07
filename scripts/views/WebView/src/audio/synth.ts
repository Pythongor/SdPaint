import {
  Synth,
  AMSynth,
  FMSynth,
  MembraneSynth,
  PluckSynth,
  MonoSynth,
  DuoSynth,
  NoiseSynth,
  Part,
  getTransport,
  Context,
  setContext,
} from "tone";

export type SynthInstanceType =
  | Synth
  | MonoSynth
  | AMSynth
  | FMSynth
  | MembraneSynth
  | DuoSynth
  | PluckSynth
  | NoiseSynth;

export type NoteType = {
  note: string;
  velocity?: number;
  time: number;
  duration: number;
  ramp?: [string, number, number];
};

export const createPart = (
  synthesizer: SynthInstanceType,
  notes: NoteType[]
) => {
  return new Part((time, value) => {
    const { note, duration, velocity = 1, ramp, time: valueTime } = value;
    if (!note || !valueTime) return;
    synthesizer.triggerAttackRelease(note, `${duration}n`, time, velocity);
    if (
      ramp &&
      !(synthesizer instanceof PluckSynth) &&
      !(synthesizer instanceof NoiseSynth)
    ) {
      synthesizer.frequency.linearRampTo(ramp[0], ramp[1], ramp[2] + time);
    }
  }, notes).start(0);
};

export const setTransport = (
  bpm: number,
  timeSignature: number | [number, number]
) => {
  const transport = getTransport();
  transport.bpm.value = bpm;
  transport.timeSignature = timeSignature;
};

export const renewAudioContext = () => {
  getTransport().dispose();
  const context = new Context();
  setContext(context);
};
