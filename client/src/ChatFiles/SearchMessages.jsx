import React, { useEffect, useState } from 'react'
import { IoClose } from 'react-icons/io5'
import { useStateProvider } from '../Context/StateContext'
import { reducerCases } from '../Context/Constants';
import { BiSearchAlt2 } from 'react-icons/bi';
import { calculateTime } from '../utils/CalculateTime';

const SearchMessages = () => {
    const [{ currentChatUser, messages }, dispatch] = useStateProvider();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchedMessages, setSearchedMessages] = useState([]);

    // Everytime searchTerm changes we want to filter the messages global state and set the message into our local array setSearchedMessages
    // So, our map() will show all of the message which matches with the message.message in messages array
    useEffect(() => {
        if (searchTerm) {
            setSearchedMessages(messages.filter((message) => message.type === 'text' && message.message.includes(searchTerm)))
        }
        else {
            setSearchedMessages([])
        }
    }, [searchTerm])
    return (
        <div className=' border-l w-full bg-conversation-panel-background flex flex-col z-10 max-h-screen '>
            <div className="h-16 py-5 px-4 flex gap-10 items-center bg-panel-header-background text-primary-strong" >
                <IoClose className='cursor-pointer text-icon-lighter text-2xl '
                    onClick={() => { dispatch({ type: reducerCases.SET_SEARCH_MESSAGE }) }}
                />
                <span>Search Messages</span>
            </div >
            <div className="overflow-auto overflow-x-hidden custom-scrollbar h-full">
                <div className="flex flex-col items-center w-full ">
                    <div className="flex px-5 items-center gap-3 h-14 w-full">
                        <div className="flex items-center bg-panel-header-background gap-5 px-3 py-1 rounded-lg flex-grow">
                            <div>
                                <BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-lg" />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Search messages..."
                                    className="bg-transparent text-sm focus:outline-none text-white w-full"
                                    value={searchTerm}
                                    onChange={(e) => { setSearchTerm(e.target.value) }}
                                />
                            </div>
                        </div>
                    </div>
                    <span className='mt-10 text-secondary'>
                        {!searchTerm.trim().length && `Search for message with ${currentChatUser.name} `}
                    </span>
                </div>
                <div className="flex justify-center h-full flex-col ">
                    {/* Means if user types for messages & 'searchedMessage' array is empty the it will show this text because 'searchedMessage' willl hold the messages if found from user input of message */}
                    {searchTerm.trim().length > 0 && !searchedMessages.length && <span className='text-secondary w-full flex justify-center'>
                        No Messages found similar to '{searchTerm}'
                    </span>}
                    <div className="flex flex-col w-full h-full">
                        {searchedMessages.map((message) => {
                            return (
                                <div key={message.id} className="flex cursor-pointer flex-col justify-center hover:bg-background-default-hover px-5 w-full border-b-[0.1px] border-secondary py-5">
                                    <div className='text-sm text-secondary'>{calculateTime(message.createdAt)}</div>
                                    <div className="text-icon-green">{message.message}</div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

        </div >

    )
}

export default SearchMessages
