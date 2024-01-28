import React from 'react'
import Avatar from '../Components/Avatar';
import { useStateProvider } from '../Context/StateContext';
import { reducerCases } from '../Context/Constants';
import { calculateTime } from '../utils/CalculateTime';
import Messagestatus from '../Components/Messagestatus';
import { FaCamera, FaMicrophone } from 'react-icons/fa';

const ChatListItem = ({ data, isContactPage = false }) => {
    const [{ userInfo, currentChatUser, userContacts }, dispatch] = useStateProvider();
    // console.log("userContacts: ", userContacts)
    const ClickContactToMakeCurrnetUser = () => {
        // console.log("Without Destructured data: ", data)
        // console.log("With Destructured data: ", { ...data })
        if (!isContactPage) {
            // This will set the currentChatUser because this is not from contactPage
            dispatch({
                type: reducerCases.CURRENT_CHAT_USER,
                currentChatUser: {  // We are destructuring the info from data object because info is in within the object
                    name: data.name || data.reciever.name,
                    about: data.about || data.reciever.about,
                    profilePhoto: data.profilePhoto || data.reciever.profilePhoto,
                    email: data.email || data.reciever.email,
                    id: userInfo.id === data.senderId ? data.receiverId : data.senderId
                }
            })


        }
        else {

            dispatch({
                type: reducerCases.CURRENT_CHAT_USER,
                currentChatUser: { ...data }    // We are destructuring the info from data object because info is in within the object
            })

            dispatch({
                type: reducerCases.SET_CONTACT_PAGE
            })
        }


    }
    return (
        <div className={`flex cursor-pointer items-center hover:bg-background-default-hover`}
            onClick={ClickContactToMakeCurrnetUser}
        >
            <div className="min-w-fit px-5 pt-3 pb-1">
                <Avatar type='sm' image={data?.profilePhoto || data?.reciever.profilePhoto} />
            </div>
            <div className="min-h-full flex flex-col justify-center mt-3 pr-2 w-full">
                <div className="flex justify-between">
                    <div>
                        <span className='text-white '>{data?.name || data?.reciever.name}</span>
                    </div>
                    {!isContactPage && (
                        <div>
                            <span className={`${!data.totalUnreadMessage > 0 ? "text-secondary" : "text-icon-green"} text-sm`}>
                                {calculateTime(data.createdAt)}
                            </span>
                        </div>
                    )}
                </div>
                <div className="flex border-b border-conversation-border pb-2 pt-1 pr-2">
                    <div className="flex justify-between w-full">

                        {/* If it is a contact page only then we will show the about of users but if it is not in a contactPage then we show there a what type of msg we have sent & totalUnreadMessage  */}

                        <span className="text-secondary line-clamp-1 text-sm">{isContactPage ? data?.about || data?.reciever.about || "\u00A0"
                            :
                            <div className='flex items-center gap-1 max-w-[200px] sm:max-w-[250px] md:max-w-[300px] lg:max-w-[200px] xl:max-w-[300px]'>
                                {data.senderId === userInfo.id && <Messagestatus messageStatus={data.messageStatus} />}
                                {data.type === "text" && <span className='truncate'>{data.message}</span>}
                                {data.type === 'audio' && <span className='flex gap-1 items-center'>
                                    <FaMicrophone className='text-panel-header-icon ' />
                                    Audio
                                </span>}
                                {data.type === 'image' && <span className='flex gap-1 items-center'>
                                    <FaCamera className='text-panel-header-icon ' />
                                    Image
                                </span>}
                            </div>
                        }
                        </span>
                        {data.totalUnreadMessage > 0 && <span className='bg-icon-green px-[5px] rounded-full text-sm'>{data.totalUnreadMessage}</span>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatListItem
