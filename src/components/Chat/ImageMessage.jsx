import { useStateProvider } from "@/context/StateContext";
import { HOST } from "@/utils/ApiRoutes";
import { calculateTime } from "@/utils/CalculateTime";
import Image from "next/image";
import React, { useState } from "react";
import MessageStatus from "../common/MessageStatus";
import ImageViewer from "./ImageViewer";

function ImageMessage({ message ,setVI}) {
  console.log(message);
  const [{ currentChatUser, userInfo, messages }] = useStateProvider();


  return (
    <>
      <div
        className={`p-1 ml-3 mx-3 rounded-lg ${
          message.senderId === currentChatUser.data.id
            ? "bg-incoming-background"
            : "bg-outgoing-background"
        } 

      `}
      >
        <div
          className="relative w-[350px] h-[200px]"
          onClick={() => setVI(true)}
        >
          <Image
            src={`${HOST}/${message.message}`}
            className="rounded-lg"
            alt="asset"
            fill
          />

          <div className="absolute bottom-1 flex right-1 items-end gap-1">
            <span className="text-bubble-meta text-[11px] pt-1 min-w-fit">
              {calculateTime(message.createdAt)}
            </span>
            <span className="text-bubble-meta">
              {message.senderId === userInfo.id && (
                <MessageStatus messageStatus={message.messageStatus} />
              )}
            </span>
          </div>
        </div>
      </div>
      
       
    
    </>
  );
}

export default ImageMessage;
