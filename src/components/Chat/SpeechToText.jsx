import React, { useEffect, useState } from "react";
import "regenerator-runtime/runtime";
import SpeechRecognition from "react-speech-recognition";
import { useSpeechRecognition } from "react-speech-recognition";
import { MdOutlineSpeakerNotes, MdOutlineSpeakerNotesOff } from "react-icons/md";

function SpeechToText({ setMessage }) {
  const [listening, setListening] = useState(false);

  const startListening = () =>
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });

  const { transcript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    alert("Your browser does not supports Speech Recognition");
  }

  useEffect(() => {
    setMessage(() => transcript);
  }, [transcript]);

  return (
    <div className="speech-to-text flex gap-2 items-center">
      {!listening ? (
        <MdOutlineSpeakerNotes color={"gray"}
          title="Speech to text on"
          className="rounded-full w-6 h-6 cursor-pointer"
          onClick={() => {
            startListening();
            setListening(true);
          }}
        />
      ) : (
        <MdOutlineSpeakerNotes
        title="Speech to text off"

           color={"gray"}
          className="rounded-full w-6 h-6 cursor-pointer animate-pulse"
          onClick={() => {
            SpeechRecognition.stopListening();
            setListening(false);
          }}
        />
      )}
    </div>
  );
}

export default SpeechToText;
