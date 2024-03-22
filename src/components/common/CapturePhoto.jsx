import React, { useEffect, useRef } from "react";
import { IoMdClose } from "react-icons/io";

function CapturePhoto({ setImage, hide }) {
  const videoRef = useRef(null);

  useEffect(() => {
    let stream;
    if(!videoRef){

    }else{

    const startCamera = async () => {
      //get the stream of images from navigator api
      stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      videoRef.current.srcObject = stream; // set the stream to video ref
      // By using a ref, you ensure that: 
      // You can store information between re-renders (unlike regular variables, 
      // which reset on every render). Changing it does not trigger a re-render (unlike state variables, which trigger a re-render).
    };

    startCamera(); // call the function to execute

    return ()=>{
      stream?.getTracks().forEach(track=> track.stop()); // function to stop all the tracks
    };
  }

  }, []); // does not depend on any variable loads when capture photo component is loaded
 

  // onclick take photo and set as image
  const capturePhoto = () => {
    const canvas = document.createElement("canvas");
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0, 350, 150);
    setImage(canvas.toDataURL("image/jpeg"));
    hide(false);
  };

  return (
    <div className="gap-3 rounded-lg pt-2 flex items-center justify-center absolute h-4/6 w-2/6 top-1/4 left-1/3 bg-gray-900">
      <div className="flex flex-col gap-4 w-full items-center justify-center">
        <div
          onClick={() => hide(false)}
          className="pt-2 pr-2 cursor-pointer flex items-end justify-end"
        >
          <IoMdClose className="h-10 w-10 cursor-pointer" />
        </div>

        <div className="flex justify-center">
          <video id="video" width="400" autoPlay ref={videoRef}></video>
        </div>

        <button
          className="h-16 w-16 bg-white rounded-full cursor-pointer border-8 border-teal-light"
          onClick={capturePhoto}
        ></button>
      </div>
    </div>
  );
}

export default CapturePhoto;
