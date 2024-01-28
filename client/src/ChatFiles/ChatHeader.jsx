import React, { useState } from 'react'
import Avatar from '../Components/Avatar';
import { MdCall } from 'react-icons/md';
import { IoVideocam } from 'react-icons/io5';
import { BiSearchAlt2 } from 'react-icons/bi';
import { BsThreeDotsVertical } from 'react-icons/bs'
import { useStateProvider } from '../Context/StateContext';
import { reducerCases } from '../Context/Constants';
import ContextMenu from '../Components/ContextMenu';

const ChatHeader = () => {
    const [{ currentChatUser }, dispatch] = useStateProvider();
    const [isContextMenuVisible, setisContextMenuVisible] = useState(false);
    // So where clicked We can keep that coordinate
    const [ContextMenuCoordinates, setContextMenuCoordinates] = useState({ x: 0, y: 0 });

    const showContextMenu = (e) => {
        // Coordinates where we clicked.
        // console.log(e.pageX, e.pageY)
        e.preventDefault();
        setisContextMenuVisible(true);
        setContextMenuCoordinates({ x: e.pageX, y: e.pageY })
    }

    const contextMenuOptions = [
        {
            name: 'Exit',
            callback: async () => {
                dispatch({
                    type: reducerCases.SET_EXIT_CHAT
                })
            }
        }
    ]

    const handleVoiceCall = () => {
        dispatch({
            type: reducerCases.SET_VOICE_CALL,
            voiceCall: {
                ...currentChatUser,
                type: 'out-going',
                callType: "voice",
                roomId: Date.now()
            }
        })
    }

    const handleVideoCall = () => {
        dispatch({
            type: reducerCases.SET_VIDEO_CALL,
            videoCall: {
                ...currentChatUser,
                type: 'out-going',
                callType: "video",
                roomId: Date.now()
            }
        })
    }
    // console.log("Current", currentChatUser)
    return (
        <div className='h-16 px-4 py-3 flex justify-between items-center bg-panel-header-background z-10'>
            <div className="flex items-center justify-center gap-6">
                <Avatar type="sm" image={`${currentChatUser?.profilePhoto || "/default_avatar.png"}`} />
                <div className="flex flex-col ">
                    <span className="text-primary-strong">{currentChatUser?.name || "User"}</span>
                    <span className="text-secondary text-sm">{"Offline"}</span>
                </div>
            </div>
            <div className="flex gap-6">
                <MdCall
                    className='text-xl text-panel-header-icon cursor-pointer'
                    title='Call'
                    onClick={handleVoiceCall}
                />

                <IoVideocam
                    className='text-xl text-panel-header-icon cursor-pointer'
                    title='Video Call'
                    onClick={handleVideoCall}
                />

                <BiSearchAlt2
                    className='text-xl text-panel-header-icon cursor-pointer'
                    title='Search'
                    onClick={() => { dispatch({ type: reducerCases.SET_SEARCH_MESSAGE }) }}
                />
                <BsThreeDotsVertical
                    className='text-xl text-panel-header-icon cursor-pointer'
                    title='Menu'
                    id='context-opener'
                    onClick={(e) => { showContextMenu(e) }}
                />

                {isContextMenuVisible && (
                    <ContextMenu
                        options={contextMenuOptions}
                        coordinates={ContextMenuCoordinates}
                        contextmenu={isContextMenuVisible}
                        setContextMenu={setisContextMenuVisible}
                    />
                )}

            </div>

        </div>
    )
}

export default ChatHeader
