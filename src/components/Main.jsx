import React, { useEffect, useRef, useState } from "react";
import ChatList from "./Chatlist/ChatList";
import Empty from "./Empty";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import axios from "axios";
import { CHECK_USER_ROUTE, GET_MESSAGE_ROUTE, HOST } from "@/utils/ApiRoutes";
import { useRouter } from "next/router";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import Chat from "./Chat/Chat";
import { io } from "socket.io-client";
import SearchMessages from "./Chat/SearchMessages";
import VideoCall from "./Call/VideoCall";
import VoiceCall from "./Call/VoiceCall";
import IncomingVideoCall from "./common/IncomingVideoCall";
import IncomingCall from "./common/IncomingCall";
import ImageViewer from "./Chat/ImageViewer";

function Main() {
  const router = useRouter();
  const [
    {
      userInfo,
      currentChatUser,
      messagesSearch,
      videoCall,
      voiceCall,
      incomingVoiceCall,
      incomingVideoCall,
    },
    dispatch,
  ] = useStateProvider();
  const [redirectLogin, setRedirectLogin] = useState(false);
  const [socketEvent, setSocketEvent] = useState(false);
  const socket = useRef();

  useEffect(() => {
    if (redirectLogin) {
      router.push("/login");
    }
  }, [redirectLogin]);

  // get the logged in user email and then get the userInfo from backend database
  onAuthStateChanged(firebaseAuth, async (currentUser) => {
    
     try {
      if (!currentUser) {
        setRedirectLogin(true);
      }
  
      if (!userInfo && currentUser?.email) {
        const { data } = await axios.post(CHECK_USER_ROUTE, {
          email: currentUser.email,
        });
  
        if (!data.status) {
          router.push("/login");
        }
  
        const {
          id,
          name,
          email,
          profilePicture: profileImage,
          status,
        } = data.data;
  
        dispatch({
          type: reducerCases.SET_USER_INFO,
          userInfo: {
            id,
            name,
            email,
            profileImage,
            status,
          },
        });
      }
     } catch (error) {
       console.log(error.message,error)
     }
  });

  // socket implementation
  useEffect(() => {
    if (userInfo) {
      socket.current = io(HOST); // 'http://localhost:3005' connect to backend creating an instance
      socket.current.emit("add-user", userInfo.id); // call/emitting the event add-user to backend
      dispatch({ type: reducerCases.SET_SOCKET, socket }); // set socket-ref in socket
    }
  }, [userInfo]);

  // real time message update
  useEffect(() => {
    // to avoid creating multiple events
    // if the socketEvent does not exists only then create event
    if (socket.current && !socketEvent) {
      socket.current.on("msg-receive", (data) => {
        console.log(data.message);
        dispatch({
          type: reducerCases.ADD_MESSAGE,
          newMessage: {
            ...data.message, //passing the new message to server
          },
        });
      });

      socket.current.on("incoming-voice-call", ({ from, roomId, callType }) => {
        dispatch({
          type: reducerCases.SET_INCOMING_VOICE_CALL,
          incomingVoiceCall: { ...from, roomId, callType },
        });
      });

      socket.current.on("incoming-video-call", ({ from, roomId, callType }) => {

        dispatch({
          type: reducerCases.SET_INCOMING_VIDEO_CALL,
          incomingVideoCall: { ...from, roomId, callType },
        });
      });

      socket.current.on("voice-call-rejected",()=>{
        dispatch({type:reducerCases.END_CALL})
      })

      socket.current.on("video-call-rejected",()=>{
        
        dispatch({type:reducerCases.END_CALL})
      })

      socket.current.on("online-users",(onlineUsers)=>{
         dispatch({type: reducerCases.SET_ONLINE_USERS,onlineUsers})
      })

      setSocketEvent(true);
    }
  }, [socket.current]);

  // as soon as logged in user selects a contact to chat get all their messages
  useEffect(() => {
    try {
      const getMessages = async () => {
        // const {
        //   data: { messages },
        // } = await axios.get(
        //   `${GET_MESSAGE_ROUTE}/${userInfo?.id}/${currentChatUser.data?.id}`
        // );

        const {
          data: { messages },
        } = await axios.post(GET_MESSAGE_ROUTE,{from:userInfo?.id, to:currentChatUser.data?.id},
          {
            withCredentials: true
          },
          );

        dispatch({ type: reducerCases.SET_MESSAGES, messages });
      };

      if (currentChatUser && userInfo?.id) {
        getMessages();
      }
    } catch (error) {
      console.log(error);
    }
  }, [currentChatUser]);



  return (
    <>
      {
        incomingVideoCall && <IncomingVideoCall/>
      }

      {
        incomingVoiceCall && <IncomingCall/>
      }

      
      {videoCall && (
        <div className="h-screen w-screen max-h-full overflow-hidden">
          <VideoCall />
        </div>
      )}

      {voiceCall && (
        <div className="h-screen w-screen max-h-full overflow-hidden">
          <VoiceCall />
        </div>
      )}

      {!videoCall && !voiceCall && (
        <div className="grid grid-cols-main h-screen w-screen max-h-screen max-w-full overflow-auto">
          <ChatList />
          {!currentChatUser ? (
            <Empty />
          ) : (
            <div
              className={messagesSearch ? `grid grid-cols-2` : "grid-cols-2"}
            >
              <Chat />
              {messagesSearch && <SearchMessages />}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Main;
