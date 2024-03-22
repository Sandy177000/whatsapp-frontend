import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import React from "react";
import { BiSearchAlt2 } from "react-icons/bi";
import { BsFilter } from "react-icons/bs";

function SearchBar({placeHolder}) {

  const [{contactSearch},dispatch] = useStateProvider();
  return (
    <div className="bg-search-input-container-background flex p-3 pl-5 items-center gap3 h-14">
      <div className="bg-panel-header-background flex items-center gap-5 px-3 py-1 rounded-lg flex-grow">
        <div>
          <BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-1" />
        </div>
        <div>
          <input
            value={contactSearch}
            onChange={(e)=> {
              const val = e.target.value;
              dispatch({type:reducerCases.SET_CONTACT_SEARCH, val})
            }}
            type="text"
            placeholder= {placeHolder}
            className="bg-transparent text-sm focus:outline-none text-white w-full"
          />
        </div>
      </div>

      <div className="pr-5 pl-3">
        <BsFilter className="text-panel-header-icon cursor-pointer text-1"/>
      </div>
    </div>
  );
}

export default SearchBar;
