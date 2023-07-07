import {
  Synth,
  AMSynth,
  MonoSynth,
  AutoWah,
  Reverb,
  getTransport,
  MembraneSynth,
} from "tone";
import { NoteType, createPart, setTransport } from "./synth";

const playVoice1 = () => {
  const notes: NoteType[] = [
    {
      note: "C4",
      time: 0.001,
      duration: 16,
    },
    {
      note: "E4",
      time: 0.0833,
      duration: 16,
    },
    {
      note: "G4",
      time: 0.1667,
      duration: 16,
    },
    {
      note: "C5",
      time: 0.25,
      duration: 2,
    },
  ];
  const synthesizer = new AMSynth({
    oscillator: {
      type: "triangle",
    },
  }).toDestination();
  const reverb = new Reverb(3).toDestination();
  const autoWah = new AutoWah(50, 6, -30).toDestination();
  autoWah.Q.value = 8;
  synthesizer.chain(reverb);
  createPart(synthesizer, notes);
};

const playVoice2 = () => {
  const notes: NoteType[] = [
    {
      note: "C5",
      velocity: 0.4,
      time: 0.25,
      duration: 2,
      ramp: ["Db4", 0.25, 0.25],
    },
    {
      note: "C4",
      velocity: 0.4,
      time: 1,
      duration: 4,
    },
  ];
  const synthesizer = new MonoSynth({
    envelope: {
      attack: 0.01,
      decay: 0.01,
    },
  }).toDestination();
  const reverb = new Reverb(3).toDestination();
  synthesizer.chain(reverb);
  createPart(synthesizer, notes);
};

const playVoice3 = () => {
  const notes: NoteType[] = [
    {
      note: "C5",
      velocity: 0.4,
      time: 0.25,
      duration: 2,
      ramp: ["F4", 0.25, 0.25],
    },
    {
      note: "E4",
      velocity: 0.4,
      time: 1,
      duration: 4,
    },
  ];
  const synthesizer = new MonoSynth({
    envelope: {
      attack: 0.01,
      decay: 0.01,
    },
  }).toDestination();
  const reverb = new Reverb(3).toDestination();
  synthesizer.chain(reverb);
  createPart(synthesizer, notes);
};

const playVoice4 = () => {
  const notes: NoteType[] = [
    {
      note: "C5",
      velocity: 0.4,
      time: 0.25,
      duration: 2,
      ramp: ["Bb3", 0.25, 0.25],
    },
    {
      note: "C3",
      velocity: 0.4,
      time: 1,
      duration: 4,
    },
  ];
  const synthesizer = new MonoSynth({
    envelope: {
      attack: 0.01,
      decay: 0.01,
    },
  }).toDestination();
  const reverb = new Reverb(3).toDestination();
  synthesizer.chain(reverb);
  createPart(synthesizer, notes);
};

export const playEpicSignal = () => {
  playVoice1();
  playVoice2();
  playVoice3();
  playVoice4();
  setTransport(95, [4, 4]);
  getTransport().start();
};

export const playRingtoneSignal = () => {
  const notes: NoteType[] = [
    {
      note: "D4",
      time: 0.001,
      duration: 16,
    },
    {
      note: "G4",
      time: 0.125,
      duration: 32,
    },
    {
      note: "A4",
      time: 0.188,
      duration: 32,
    },
    {
      note: "D5",
      time: 0.25,
      duration: 16,
    },
    {
      note: "F4",
      time: 0.375,
      duration: 16,
    },
    {
      note: "C5",
      time: 0.5,
      duration: 16,
    },
    {
      note: "B4",
      time: 0.625,
      duration: 16,
    },
    {
      note: "G4",
      time: 0.75,
      duration: 16,
    },
    {
      note: "A4",
      time: 0.875,
      duration: 16,
    },
    {
      note: "D4",
      time: 1,
      duration: 16,
    },
  ];
  const synthesizer = new Synth({
    oscillator: {
      type: "sawtooth",
    },
  }).toDestination();
  createPart(synthesizer, notes);
  setTransport(120, [4, 4]);
  getTransport().start();
};

export const playBounceSignal = () => {
  const notes: NoteType[] = [
    {
      note: "F2",
      time: 0.001,
      duration: 2,
      velocity: 0.8,
      ramp: ["C5", 0.25, 0.25],
    },
  ];
  const notes2: NoteType[] = [
    {
      note: "F2",
      time: 0.001,
      duration: 16,
    },
    {
      note: "F4",
      time: 0.125,
      duration: 16,
    },
    {
      note: "F5",
      time: 0.25,
      duration: 16,
    },
    {
      note: "F6",
      time: 0.375,
      duration: 16,
    },
  ];
  const synthesizer = new Synth({
    oscillator: {
      type: "square",
    },
  }).toDestination();
  const synthesizer2 = new MembraneSynth({
    oscillator: {
      type: "square",
    },
  }).toDestination();
  createPart(synthesizer, notes);
  createPart(synthesizer2, notes2);
  setTransport(120, [4, 4]);
  getTransport().start();
};
