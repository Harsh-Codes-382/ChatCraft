import React from "react";
import { BiSearchAlt2 } from "react-icons/bi";
import { BsFilter } from 'react-icons/bs'
import { useStateProvider } from "../Context/StateContext";
import { reducerCases } from "../Context/Constants";

const SearchBar = () => {   
  const [{ contactSearch }, dispatch] = useStateProvider();

  return (
    <div className="bg-search-input-container-background flex py-3 pl-3 items-center gap-3 h-14">
      <div className="flex items-center bg-panel-header-background gap-5 px-3 py-1 rounded-lg flex-grow">
        <div>
          <BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-lg" />
        </div>
        <div>
          <input
            type="text"
            placeholder="Search or start a new chat"
            className="bg-transparent text-sm focus:outline-none text-white w-full"
            onChange={(e) => {
              dispatch({
                type: reducerCases.SET_USER_CONTACT_SEARCH,
                contactSearch: e.target.value,
              })
            }}
            value={contactSearch}
          />
        </div>
      </div>
      <div className="pr-5 pl-3 ">
        <BsFilter className="text-panel-header-icon cursor-pointer text-lg" />
      </div>
    </div>
  );
};

export default SearchBar;
