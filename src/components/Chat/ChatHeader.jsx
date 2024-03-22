import React, { useState } from "react";
import Avatar from "../common/Avatar";
import { MdCall } from "react-icons/md";
import { IoMdVideocam } from "react-icons/io";
import { BiSearchAlt2 } from "react-icons/bi";
import { BiDotsVertical } from "react-icons/bi";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import ContextMenu from "../common/ContextMenu";

function ChatHeader() {
  const [{ userInfo, currentChatUser,onlineUsers }, dispatch] = useStateProvider();

  const [contextMenuCordinates, setContextMenuCordinates] = useState({
    x: 0,
    y: 0,
  });
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);

  const showContextMenu = (e) => {
    e.preventDefault();
    setIsContextMenuVisible(true);
    setContextMenuCordinates({ x: e.pageX-50, y: e.pageY }); // sets the coordinates of the menu to displayed
  };

  const contextMenuOptions = [
    {
      name: "Exit",
      callback: () => {
        dispatch({ type: reducerCases.SET_EXIT_CHAT});
      },
    },
  ];

  const handleVoiceCall = () => {
    dispatch({
      type: reducerCases.SET_VOICE_CALL,
      voiceCall: {
        ...currentChatUser.data,
        type: "out-going",
        callType: "voice",
        roomId: Date.now(),
      },
    });
  };

  const handleVideoCall = () => {
    dispatch({
      type: reducerCases.SET_VIDEO_CALL,
      videoCall: {
        ...currentChatUser.data,
        type: "out-going",
        callType: "video",
        roomId: Date.now(),
      },
    });
  };

  console.log(onlineUsers)

  return (
    <div className="h-16 px-4 py-3 flex justify-between items-center bg-panel-header-background z-10">
      <div className="flex items-center justify-center gap-6">
        <Avatar type="sm" image={currentChatUser?.data?.profilePicture} />
        <div className="flex flex-col">
          <span className="text-primary-strong">
            {userInfo.id === currentChatUser?.data.id
              ? "You"
              : currentChatUser?.data.name}
          </span>
          <span className="text-secondary text-sm">
            {
              (onlineUsers)?.includes(currentChatUser.data.id)? "online" : "offline"
            }
          </span>
        </div>
      </div>

      <div className="flex gap-6">
        <MdCall
          onClick={handleVoiceCall}
          className="text-panel-header-icon cursor-pointer text-xl"
        />
        <IoMdVideocam
          onClick={handleVideoCall}
          className="text-panel-header-icon cursor-pointer text-xl"
        />
        <BiSearchAlt2
          onClick={() => dispatch({ type: reducerCases.SET_MESSAGE_SEARCH })}
          className="text-panel-header-icon cursor-pointer text-xl"
        />
        <BiDotsVertical className="text-panel-header-icon cursor-pointer text-xl" onClick={(e)=>showContextMenu(e)} 
              id="context-opener"/>
        {isContextMenuVisible && (
          <ContextMenu
            options={contextMenuOptions}
            cordinates={contextMenuCordinates}
            contextMenu={isContextMenuVisible}
            setContextMenu={setIsContextMenuVisible}
          />
        )}

      </div>
    </div>
  );
}

export default ChatHeader;
