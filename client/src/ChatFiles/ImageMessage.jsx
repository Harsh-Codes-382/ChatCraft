import React from 'react'
import { useStateProvider } from '../Context/StateContext'
import Image from 'next/image';
import { HOST } from '../utils/Apiroutes';
import { calculateTime } from '../utils/CalculateTime';
import Messagestatus from '../Components/Messagestatus';

const ImageMessage = ({ message }) => {
    const [{ userInfo, currentChatUser }] = useStateProvider();
    return (
        <div className={`p-1 rounded-lg ${message.senderId === userInfo.id ? "bg-outgoing-background" : "bg-incoming-background"}`}>
            <div className="relative">
                <Image
                    src={`${HOST}/${message.message}`}
                    alt="Assets"
                    height={300}
                    width={300}
                />
                <div className="absolute bottom-1 right-1 flex items-end gap-1">
                    <span className='text-bubble-meta text-[11px] h-full min-w-[40px] '>
                        {calculateTime(message.createdAt)}
                    </span>
                    <span className="text-bubble-meta">
                        {message?.senderId === userInfo?.id && <Messagestatus messageStatus={message?.messageStatus} />}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default ImageMessage
