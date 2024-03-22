import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { ADD_IMAGE_MESSAGE_ROUTE, ADD_MESSAGE_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";
import React, { useEffect, useRef, useState } from "react";
import { BsFillEmojiSmileFill } from "react-icons/bs";
import { FaMicrophone } from "react-icons/fa";
import { IoMdAttach } from "react-icons/io";
import { MdSend } from "react-icons/md";
import PhotoPicker from "../common/PhotoPicker";

import dynamic from "next/dynamic";
import SpeechToText from "./SpeechToText";

const CaptureAudio  = dynamic(()=> import ("../common/CaptureAudio"), {ssr:false});


function MessageBar() {
  const [{ userInfo, currentChatUser, socket }, dispatch] = useStateProvider();
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);
  const [grabPhoto, setGrabPhoto] = useState(false);
  const [showAudioRecorder, setShowAudioRecorder] = useState(false);

  const handleEmojiModal = () => {
    setShowEmojiPicker(!showEmojiPicker);
    console.log(showEmojiPicker);
  };

  const handleEmojiClick = (e) => {
    setMessage((prevMessage) => prevMessage + e.emoji);
  };

  // IMAGE FILE HANDLER FUNCTION
  const photoPickerChange = async (e) => {
    console.log(e.target.files[0]);
    try {
      const file = e.target.files[0]; // get selected image file
      const formData = new FormData();
      formData.append("image", file); // make a form {"image" : file} to be sent over the request to server

      const response = await axios.post(ADD_IMAGE_MESSAGE_ROUTE, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // setting the type of request which is mostly json
        },
        params: {
          from: userInfo.id,
          to: currentChatUser.data.id, // setting params
        },
        
      });

      // if the image is saved in db emit the image to receiver
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

  useEffect(() => {
    if (grabPhoto) {
      const data = document.getElementById("photo-picker");
      data.click(); // click to open the dialog box to take file input
      document.body.onfocus = (e) => {
        setTimeout(() => {
          setGrabPhoto(false); // hide the menu...
        }, 1000);
      };
    }
  }, [grabPhoto]);

  const sendMessage = async () => {
    try {
      // Saving message in the database
      const { data } = await axios.post(ADD_MESSAGE_ROUTE, {
        to: currentChatUser.data?.id, // selected User
        from: userInfo?.id, // logged in user
        message,
      },
      {
        withCredentials: true
      },);

      socket.current.emit("send-msg", {
        to: currentChatUser.data?.id, // selected User
        from: userInfo?.id, // logged in user
        message: data.message,
      });

      console.log("sender: ", userInfo.name);

      // dispatch called again to add the new messages to sender's chat container
      // receiver's chat container gets populated from
      dispatch({
        type: reducerCases.ADD_MESSAGE,
        newMessage: {
          ...data.message,
        },
        fromSelf: true,
      });

      setMessage("");

      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-panel-header-background h-20 px-4 flex items-center gap-6 relative">
      {!showAudioRecorder && (
        <>
          <div className="flex gap-6">
            <BsFillEmojiSmileFill
              className="text-panel-header-icon cursor-pointer text-xl"
              title="Emoji"
              id="emoji-open"
              onClick={handleEmojiModal}
            />
            {showEmojiPicker && (
              <div
                className="absolute bottom-24 left-16 x-4"
                ref={emojiPickerRef}
              >
                <EmojiPicker
                  onEmojiClick={(e) => handleEmojiClick(e)}
                  theme="dark"
                />
              </div>
            )}
            <IoMdAttach
              className="text-panel-header-icon cursor-pointer text-xl"
              title="Attach File"
              onClick={() => {
                setGrabPhoto(!grabPhoto);
              }}
            />
          </div>
          <div className="w-full rounded-lg h-10 flex items-center">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              type="text"
              placeholder="Type a message..."
              className="bg-input-background text-sm focus:outline-none text-white h-10 rounded-lg px-5 py-4 w-full"
            />
          </div>
          <div className="flex w-10 items-center justify-center">
            {message.length ? (
              <button>
                <MdSend
                  className="text-panel-header-icon cursor-pointer text-xl"
                  title="Send Message"
                  onClick={sendMessage}
                />
              </button>
            ) : (
              <button>
                <FaMicrophone
                  className="text-panel-header-icon cursor-pointer text-xl"
                  title="Record Audio"
                  onClick={() => setShowAudioRecorder(true)}
                />
              </button>
            )}
          </div>
          <SpeechToText setMessage={setMessage}/>
        </>
      )}

      {grabPhoto && <PhotoPicker onChange={photoPickerChange} />}
      {showAudioRecorder && <CaptureAudio hide={setShowAudioRecorder} />}
    </div>
  );
}

export default MessageBar;

// TO HIDE OF THE EMOJI PICKER WHEN CLICKED OUTSIDE
// useEffect(() => {
//   const handleOutSideClick = (event) => {
//     console.log(event.target.id);

//     console.log(event.target);
//     console.log(emojiPickerRef.current);
//     if (event.target.id !== "emoji-open") {
//       if (
//         emojiPickerRef.current &&
//         !emojiPickerRef.current.contains(event.target)
//       ) {
//         setShowEmojiPicker(false);
//       }
//     }
//   };

//   document.addEventListener("click", handleOutSideClick);

//   return () => {
//     document.removeEventListener("click", handleOutSideClick);
//   };
// }, []);
