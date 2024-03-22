import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { ADD_AUDIO_MESSAGE_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import {
  FaMicrophone,
  FaPauseCircle,
  FaPlay,
  FaStop,
  FaTrash,
} from "react-icons/fa";
import { MdSend } from "react-icons/md";
import WaveSurfer from "wavesurfer.js";

// create the wavesurfer instance to display the audio on load
// as soon as the wavesurfer instance is created call the start recording function


function CaptureAudio({ hide }) {
  const [{ userInfo, currentChatUser, socket },dispatch] = useStateProvider();

  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [waveform, setWaveForm] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(null);
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isPlaying, setisPlaying] = useState(false);

  const [renderedAudio, setRenderedAudio] = useState(null);

  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const waveFormRef = useRef(null);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration((prevDuration) => {
          setTotalDuration(prevDuration + 1);
          return prevDuration + 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isRecording]);

  useEffect(() => {
    const wavesurfer = WaveSurfer.create({
      container: waveFormRef.current,
      waveColor: "#ccc",
      progressColor: "#4a9eff",
      cursorColor: "#7ae3c3",
      barWidth: 2,
      height: 30,
      responsive: true,
    });

    setWaveForm(wavesurfer);

    wavesurfer.on("finish", () => {
      setisPlaying(false);
    });

    return () => {
      wavesurfer.destroy();
    };
  }, []);

  useEffect(() => {
    if (waveform) handleStartRecording();
  }, [waveform]);

  const handleStartRecording = () => {
    // initialise
    setRecordingDuration(0);
    setCurrentPlaybackTime(0);
    setIsRecording(true);
    setRecordedAudio(null);

    // navigator media api
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream); // create recorder instance
        mediaRecorderRef.current = mediaRecorder; // store instance in useRef to avoid rerender
        audioRef.current.srcObject = stream; // store the stream in audio ref

        const chunks = [];

        mediaRecorder.ondataavailable = (e) => chunks.push(e.data); // store the data chunks in array as soon as data is available
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" }); // create a blob from array of chunks
          const audioURL = URL.createObjectURL(blob); // create a ObjectURL
          const audio = new Audio(audioURL); // create audio from URL
          setRecordedAudio(audio); // store the audio
          waveform.load(audioURL); // load the audio in waveform to display
        };

        mediaRecorder.start();
      })
      .catch((error) => {
        console.error("Error accessing the microphone.", error);
      });
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      waveform.stop();

      const audioChunks = [];
      mediaRecorderRef.current.addEventListener("dataavailable", (event) => {
        audioChunks.push(event.data);
      });

      mediaRecorderRef.current.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
        const audioFile = new File([audioBlob], "recording.mp3");
        setRenderedAudio(audioFile);
      });
    }
  };

  useEffect(() => {
    if (recordedAudio) {
      const updatePlaybackTime = () => {
        setCurrentPlaybackTime(recordedAudio.currentTime);
      };

      recordedAudio.addEventListener("timeupdate", updatePlaybackTime);
      return () => {
        recordedAudio.removeEventListener("timeupdate", updatePlaybackTime);
      };
    }
  }, [recordedAudio]);

  const handlePlayRecording = () => {
    if (recordedAudio) {
      waveform.stop();
      waveform.play();
      recordedAudio.play();
      setisPlaying(true);
    }
  };
  const handlePauseRecording = () => {
    waveform.stop();
    recordedAudio.pause();
    setisPlaying(false);
  };


  // similar to send images method 
  const sendRecording = async () => 
  {
    try {
      const formData = new FormData();
      formData.append("audio", renderedAudio); // make a form {"audio" : file} to be sent via the request to server

      const response = await axios.post(ADD_AUDIO_MESSAGE_ROUTE, formData,{
        headers: {
          "Content-Type": "multipart/form-data", // setting the type of request as multpart so that multer middle ware recognises and uploads the media
        },
        params: {
          from: userInfo.id,
          to: currentChatUser.data.id, // setting params
        },
      });

      if (response.status === 201) {
        socket.current.emit("send-msg", {
          to: currentChatUser.data?.id, // selected User
          from: userInfo?.id, // logged in user
          message: response.data.message,
        });

        console.log("sender: ", userInfo.name);

        // dispatch called again to add the new messages to sender's chat container
        // receiver's chat container gets populated from
        dispatch({
          type: reducerCases.ADD_MESSAGE,
          newMessage: {
            ...response.data.message,
          },
          fromSelf: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="flex text-2xl w-full justify-end items-center">
      <div className="pt-1">
        <FaTrash className="text-panel-header-icon cursor-pointer" onClick={() => hide()} />
      </div>
      <div className=" items-center mx-4 py-2 px-4 text-white text-lg flex gap-3 justify-center bg-search-input-container-background rounded-full drop-shadow-lg">
        {isRecording ? (
          <div className="text-red-500 animate-pulse w-50 text-center">
            Recording
            <span className="ml-1">{formatTime(recordingDuration)}</span>
          </div>
        ) : (
          <div className="cursor-pointer">
            {recordedAudio && (
              <>
                {!isPlaying ? (
                  <FaPlay onClick={handlePlayRecording} />
                ) : (
                  <FaStop onClick={handlePauseRecording} />
                )}
              </>
            )}
          </div>
        )}
        {/* wave form  */}
        <div className="w-60" ref={waveFormRef} hidden={isRecording} />

        {recordedAudio && isPlaying && (
          <span>{formatTime(currentPlaybackTime)}</span>
        )}

        {recordedAudio && !isPlaying && (
          <span>{formatTime(totalDuration)}</span>
        )}

        <audio ref={audioRef} />

        <div className="mr-4 cursor-pointer">
          {!isRecording ? (
            <FaMicrophone
              onClick={handleStartRecording}
              className="text-red-500 text-xl"
            />
          ) : (
            <FaPauseCircle
              onClick={handleStopRecording}
              className="text-red-500 text-xl"
            />
          )}
        </div>
        <div className="">
          <MdSend
            className="text-panel-header-icon cursor-pointer"
            title="Send"
            onClick={sendRecording}
          />
        </div>
      </div>
    </div>
  );
}

export default CaptureAudio;
