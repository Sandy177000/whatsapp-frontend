import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { GET_INITIAL_CONTACTS_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import React, { useEffect } from "react";
import ChatListItem from "./ChatListItem";

function List() {
  const [{ userInfo, userContacts, filteredContacts }, dispatch] =
    useStateProvider();

  useEffect(() => {
    // getting online users, contacts and their messages, users are  only those who already had conversation with the logged in user
    const getContacts = async () => {
      try {
        const {
          data: { users, onlineUsers },
        } = await axios(`${GET_INITIAL_CONTACTS_ROUTE}/${userInfo.id}`,{
          withCredentials: true
        },);

        dispatch({ type: reducerCases.SET_USER_CONTACTS, userContacts: users });
        dispatch({ type: reducerCases.SET_ONLINE_USERS, onlineUsers });
      } catch (err) {
        console.log(err);
      }
    };

    if (userInfo?.id) getContacts();
  }, [userInfo]);

  return (
    <div className="bg-search-input-container-background flex-auto overflow-auto max-h-full custom-scrollbar">
      {filteredContacts?.length > 0
        ? filteredContacts.map((contact) => (
            <ChatListItem data={contact} key={contact.id} />
          ))
        : userContacts.map((contact) => (
            <ChatListItem data={contact} key={contact.id} />
          ))}
    </div>
  );
}

export default List;
