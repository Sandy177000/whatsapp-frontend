import { useStateProvider } from "@/context/StateContext";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { MdOutlineCallEnd } from "react-icons/md";
import axios from "axios";
import { GET_CALL_TOKEN } from "@/utils/ApiRoutes";
import { reducerCases } from "@/context/constants";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useRouter } from "next/router";

function Container({ data }) {
  console.log(data);

  const router = useRouter();
  const [{ socket, userInfo }, dispatch] = useStateProvider();
  const [callAccepted, setCallAccepted] = useState(false);

  const [token, setToken] = useState(undefined);
  const [zgVar, setZgVar] = useState(undefined);

  const [localStream, setLocalStream] = useState(undefined);

  const [publishStream, setPublishStream] = useState(undefined);

  useEffect(() => {
    if (data.type === "out-going") {
      socket.current.on("accept-call", () => setCallAccepted(true));
    }
  }, [data]);

  useEffect(() => {
    const getToken = async () => {
      try {
        const {
          data: { token: returnedToken },
        } = await axios.get(`${GET_CALL_TOKEN}/${userInfo.id}`,{
          withCredentials: true
        },);
        setToken(returnedToken);
      } catch (error) {
        console.log(error);
      }
    };
    getToken();
  }, [callAccepted]);

  const meeting = async (element) => {
    const appId = process.env.NEXT_PUBLIC_ZEGO_APP_ID;
    const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_ID;

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appId,
      serverSecret,
      data.roomId.toString(),
      data.id,
      data.name
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);

    if (data.callType === "video") {
      zp.joinRoom({
        container: element,
        scenario: {
          mode: ZegoUIKitPrebuilt.VideoConference,
        },
        showScreenSharingButton: false,
        showPreJoinView: false,

        showLeaveRoomConfirmDialog: false,
        onLeaveRoom: () => {
          dispatch({ type: reducerCases.END_CALL });
        },
      });
    } else {
      console.log("audio call started");
      zp.joinRoom({
        container: element,
        scenario: {
          mode: ZegoUIKitPrebuilt.VideoConference,
        },
        showScreenSharingButton: false,
        showPreJoinView: false,
        turnOnCameraWhenJoining: false,
        showMyCameraToggleButton: false,
        showAudioVideoSettingsButton: false,
        showScreenSharingButton: false,
        showLeaveRoomConfirmDialog: false,
        onLeaveRoom: () => {
          dispatch({ type: reducerCases.END_CALL });
        },
      });
    }
  };
  return (
    <div className=" w-full bg-conversation-panel-background flex flex-col h-[100vh] overflow-hidden items-center justify-center text-white">
      {<div ref={meeting} className="w-[70%]" />}
    </div>
  );
}

export default Container;

// useEffect(() => {
//   // sort of creating a zego instance (zg)

//   try {
//     const startCall = async () => {
//       import("zego-express-engine-webrtc").then(
//         async ({ ZegoExpressEngine }) => {
//           const zg = new ZegoExpressEngine(
//             process.env.NEXT_PUBLIC_ZEGO_APP_ID,
//             process.env.NEXT_PUBLIC_ZEGO_SERVER_ID
//           );

//           setZgVar(zg);

//           await zg.loginRoom(
//             data.roomId.toString(),
//             token,
//             { userID: userInfo.id, userName: userInfo.name },
//             { userUpdate: true }
//           );

//           const localStream = await zg.createStream({
//             camera: {
//               audio: true,
//               video: data.callType === "video" ? true : false,
//             },
//           });

//           const localVideo = document.getElementById("local-video");
//           const videoElement = document.createElement(
//             data.callType === "video" ? "video" : "audio"
//           );

//           videoElement.id = "video-local-zego";
//           videoElement.className = "h-20 w-32";
//           videoElement.autoplay = true;
//           videoElement.muted = false;
//           videoElement.playsInline = true;

//           localVideo?.appendChild(videoElement);
//           const td = document.getElementById("video-local-zego");
//           td.srcObject = localStream;

//           zg.on(
//             "roomStreamUpdate",
//             async (roomID, updateType, streamList, extendedData) => {
//               if (updateType === "ADD") {
//                 // creating a video or audio element
//                 const rmVideo = document.getElementById("remote-video");
//                 const vd = document.createElement(
//                   data.callType === "video" ? "video" : "audio"
//                 );

//                 // setting up the properties of the element
//                 vd.id = streamList[0].streamID;
//                 vd.autoplay = true;
//                 vd.playsInline = true;
//                 vd.muted = false;

//                 if (rmVideo) {
//                   rmVideo.appendChild(vd);
//                 }

//                 await zg
//                   .startPlayingStream(streamList[0].streamID, {
//                     audio: true,
//                     video: true,
//                   })
//                   .then((stream) => (vd.srcObject = stream)); // loading audio or video stream to the newly created element

//                 console.log("creating call");
//               } else if (
//                 updateType === "DELETE" &&
//                 zg &&
//                 localStream &&
//                 streamList[0].streamID
//               ) {
//                 console.log("delete");
//                 zg.destroyStream(localStream);
//                 zg.stopPublishingStream(streamList[0].streamID);
//                 zg.logoutRoom(data.roomId.toString());
//                 dispatch({ type: reducerCases.END_CALL });
//               }
//             }
//           );
//           const streamID = "123" + Date.now();
//           setPublishStream(streamID);
//           setLocalStream(localStream);
//           zg.startPublishingStream(streamID, localStream);
//         }
//       );
//     };

//     if (token) startCall();
//   } catch (error) {
//     console.log(error);
//   }
// }, [token, dispatch]);

// const endCall = () => {
//   const id = data.id;

//   console.log(data);
//   if (zgVar && localStream && publishStream) {
//     zgVar.destroyStream(localStream);
//     zgVar.stopPublishingStream(publishStream);
//     zgVar.logoutRoom(data.roomId.toString());
//   }

//   if (data.callType === "voice") {
//     socket.current.emit("reject-voice-call", {
//       to: id,
//     });
//   } else {
//     socket.current.emit("reject-video-call", {
//       to: id,
//     });
//   }
//   dispatch({ type: reducerCases.END_CALL });
// };
