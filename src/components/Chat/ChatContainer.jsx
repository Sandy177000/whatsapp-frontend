import { useStateProvider } from "@/context/StateContext";
import { calculateTime } from "@/utils/CalculateTime";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import MessageStatus from "../common/MessageStatus";
import ImageMessage from "./ImageMessage";
import dynamic from "next/dynamic";
import ImageViewer from "./ImageViewer";
const VoiceMessage = dynamic(() => import("./VoiceMessage"), { ssr: false });

function ChatContainer() {
  const [{ messages, currentChatUser, userInfo, socket }, dispatch] =
    useStateProvider();
  const chatContainerRef = useRef(null);

  useLayoutEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const [vI, setVI] = useState(false);

  console.log(messages);
  console.log(currentChatUser.data);
  return (
    <div className="h-[80vh] w-full relative flex flex-grow py-2 overflow-auto custom-scrollbar">
      <div className="flex w-full">
        <div
          className="flex flex-col w-full gap-1 custom-scrollbar overflow-auto"
          ref={chatContainerRef}
        >
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`${
                message.senderId === currentChatUser?.data.id
                  ? "justify-start"
                  : "justify-end"
              } flex`}
            >
              {/* extra id checking to avoid interference of sockets */}
              {(message.senderId === currentChatUser?.data.id ||
                message.senderId === userInfo?.id) &&
                message.type === "text" && (
                  <div
                    className={`text-white mx-3 px-2 py-[5px] text-sm rounded-md flex flex-col gap-2 items-end max-w-[45%] ${
                      message.senderId === currentChatUser?.data.id
                        ? "bg-incoming-background"
                        : "bg-outgoing-background"
                    }`}
                  >
                    <span className="break-all text-white">
                      {message.message}
                    </span>

                    <div className="flex gap-1 items-end">
                      <span className="text-bubble-meta text-[11px] pt-1 min-w-fit">
                        {calculateTime(message.createdAt)}
                      </span>

                      {message.senderId === userInfo.id && (
                        <MessageStatus messageStatus={message.messageStatus} />
                      )}
                    </div>
                  </div>
                )}

              {(message.senderId === currentChatUser?.data.id ||
                message.senderId === userInfo?.id) &&
                message.type === "image" && (
                  <ImageMessage message={message} setVI={setVI} />
                )}

              {(message.senderId === currentChatUser?.data.id ||
                message.senderId === userInfo?.id) &&
                message.type == "audio" && <VoiceMessage message={message} />}
            </div>
          ))}
        </div>
      </div>
      {vI && <ImageViewer messages={messages} setVI={setVI} />}
    </div>
  );
}

export default ChatContainer;
