import React, { useEffect, useRef } from 'react'
import { useStateProvider } from '../Context/StateContext'
import { calculateTime } from '../utils/CalculateTime';
import Messagestatus from '../Components/Messagestatus';
import ImageMessage from './ImageMessage';
import dynamic from 'next/dynamic';
import { reducerCases } from '../Context/Constants';
// This is dynamic import of file 
const VoiceMessage = dynamic(() => import('./VoiceMessage'), { ssr: false })


const ChatContainer = () => {
    const [{ messages, currentChatUser, userInfo }, dispatch] = useStateProvider();


    return (
        <div className='h-[80vh] w-full relative flex-grow overflow-auto custom-scrollbar'>
            <div className="bg-chat-background bg-fixed h-full w-full opacity-5 fixed left-0 top-0 z-0"></div>
            <div className="mx-5 my-6 relative bottom-0 z-40 left-0">
                <div className="flex w-full">
                    <div className="flex flex-col justify-end gap-1 w-full overflow-auto">
                        {messages?.map((message, i) => {
                            return (
                                <div key={message.id}
                                    className={` flex ${message.receiverId === currentChatUser?.id ? "justify-end" : "justify-start"}`}>
                                    {message.type === "text" && (
                                        <div className={`text-white px-2 text-sm rounded-md flex  gap-2 items-end max-w-[45%] ${message.receiverId === currentChatUser.id ? "bg-outgoing-background" : "bg-incoming-background"}`}>

                                            <span className="break-all my-1">{message.message}</span>

                                            <div className="flex gap-1 items-end">
                                                <span className='text-bubble-meta text-[11px] h-full min-w-[40px] '>
                                                    {calculateTime(message?.createdAt)}
                                                </span>
                                                <span>{message?.senderId === userInfo?.id && <Messagestatus messageStatus={message?.messageStatus} />}</span>
                                            </div>
                                        </div>
                                    )}

                                    {message.type === 'image' && (
                                        <ImageMessage
                                            message={message}
                                        />
                                    )}

                                    {message.type === 'audio' && (
                                        <VoiceMessage
                                            message={message}
                                        />
                                    )}


                                </div>
                            )
                        })}
                    </div>
                </div>

            </div>

        </div>
    )
}

export default ChatContainer
