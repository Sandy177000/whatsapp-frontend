import { useStateProvider } from "@/context/StateContext";
import dynamic from "next/dynamic";
import React, { useEffect } from "react";


const Container = dynamic(()=> import("./Container"),{ssr:false})

function VoiceCall() {


  const [{voiceCall,socket,userInfo}] = useStateProvider();


  useEffect(()=>{
      if(voiceCall.type==="out-going")
      {
        // creating an outgoing call event
        socket.current.emit("outgoing-voice-call",{
          to:voiceCall.id,
          from:{
            id: userInfo.id,
            profilePicture: userInfo.profileImage,
            name: userInfo.name
          },
          callType : voiceCall.callType,
          roomId : voiceCall.roomId

        })

        console.log("emitting voice call outgoing")
      }
  },[voiceCall])
  
  return <Container data={voiceCall}/>;
}

export default VoiceCall;
