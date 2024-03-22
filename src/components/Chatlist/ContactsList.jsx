import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { GET_ALL_CONTACTS } from "@/utils/ApiRoutes";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BiArrowBack, BiSearchAlt2 } from "react-icons/bi";
import ChatLIstItem from "./ChatListItem";
import ChatListItem from "./ChatListItem";

function ContactsList() {
  const [allContacts, setAllContacts] = useState([]);
  const [{}, dispatch] = useStateProvider();

  const [searchFilter, setSearchFilter] = useState("");
  const [searchContacts, setSearchContacts] = useState([]);

  useEffect(() => {
    if (searchFilter.length) {
      const filteredData = {};

      Object.keys(allContacts).forEach((key) => {
        filteredData[key] = allContacts[key].filter((obj) =>
          obj.name.toLowerCase().includes(searchFilter.toLowerCase())
        );
      });

      setSearchContacts(filteredData);
    } else {
      setSearchContacts(allContacts);
    }
  }, [searchFilter]);

  useEffect(() => {
    const getContacts = async () => {
      try {
        const {
          data: { user },
        } = await axios.get(GET_ALL_CONTACTS,{
          withCredentials: true,
          headers: {
            "Access-Control-Allow-Origin": "*"
          }
        }); // have to use headers and allow credentials to store access the token sent over the request

        setAllContacts(user);
        setSearchContacts(user)
      } catch (error) {
        console.log(error);
      }
    };

    console.log(allContacts);

    getContacts();
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="h-24 flex items-end px-3 py-4">
        <div className="flex items-center gap-12 text-white">
          <BiArrowBack
            className="cursor-pointer text-xl"
            onClick={() =>
              dispatch({ type: reducerCases.SET_ALL_CONTACTS_PAGE })
            }
          />
          <span>New Chat</span>
        </div>
      </div>

      <div className="bg-search-input-container-background flex-auto h-full overflow-auto custom-scrollbar">
        <div className="flex py-1 items-center gap-3 h-14">
          <div className="bg-panel-header-background flex items-center gap-5 px-3 py-1 rounded-lg flex-grow mx-4">
            <div>
              <BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-1" />
            </div>
            <div>
              <input
                onChange={(e) => setSearchFilter(e.target.value)}
                value={searchFilter}
                type="text"
                placeholder="Search Contacts"
                className="bg-transparent text-sm focus:outline-none text-white w-full"
              />
            </div>
          </div>
        </div>
        {Object.entries(searchContacts).map(([initialLetter, userList]) => {
          return (
            <div key={Date.now() + initialLetter}>
              <span className="text-secondary"> {initialLetter}</span>
              <div className="text-teal-light pl-10 py-5">
                {userList.map((contact) => {
                  return (
                    <ChatListItem
                      data={contact}
                      isContactPage={true}
                      key={contact.id}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ContactsList;
