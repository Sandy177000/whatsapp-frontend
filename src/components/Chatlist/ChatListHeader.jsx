import React, { useEffect, useState } from "react";
import Avatar from "../common/Avatar";
import { useStateProvider } from "@/context/StateContext";
import { BsFillChatLeftTextFill, BsThreeDotsVertical } from "react-icons/bs";
import { reducerCases } from "@/context/constants";
import ContextMenu from "../common/ContextMenu";
import { useRouter } from "next/router";

function ChatListHeader() {
  const router = useRouter();
  const [{ userInfo }, dispatch] = useStateProvider();

  const handleAllContactsPage = () => {
    dispatch({ type: reducerCases.SET_ALL_CONTACTS_PAGE });
  };

  const [contextMenuCordinates, setContextMenuCordinates] = useState({
    x: 0,
    y: 0,
  });
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);

  const showContextMenu = (e) => {
    e.preventDefault();
    setIsContextMenuVisible(true);
    setContextMenuCordinates({ x: e.pageX, y: e.pageY }); // sets the coordinates of the menu to displayed
  };

  const contextMenuOptions = [
    {
      name: "Logout",
      callback: () => {
        setIsContextMenuVisible(false)
        router.push("/logout")
      },
    },
  ];

  useEffect(() => {
    console.log("chatlistheader render useeffect");
  }, [userInfo]);

  return (
    <>
      {userInfo?.profileImage ? (
        <div className="h-16 px-4 py-3 flex justify-between items-center">
          <div className="cursor-pointer">
            <Avatar type="sm" image={userInfo?.profileImage} />
          </div>
          <div className="flex gap-6">
            <BsFillChatLeftTextFill
              className="text-panel-header-icon cursor-pointer"
              title="New Chat"
              onClick={handleAllContactsPage}
            />
            <>
              <BsThreeDotsVertical
                className="text-panel-header-icon cursor-pointer"
                title="Menu"
                onClick={(e) => showContextMenu(e)}
                id="context-opener"
              />
            </>
          </div>
        </div>
      ) : (
        <>loading...</>
      )}

      {isContextMenuVisible && (
        <ContextMenu
          options={contextMenuOptions}
          cordinates={contextMenuCordinates}
          contextMenu={isContextMenuVisible}
          setContextMenu={setIsContextMenuVisible}
        />
      )}
    </>
  );
}

export default ChatListHeader;
