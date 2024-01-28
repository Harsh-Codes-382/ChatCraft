import React, { useEffect, useRef, useState } from 'react';
import { BsEmojiSmile } from 'react-icons/bs';
import { ImAttachment } from 'react-icons/im';
import { MdSend } from 'react-icons/md';
import { FaMicrophone } from 'react-icons/fa';
import { useStateProvider } from '../Context/StateContext';
import axios from 'axios';
import { reducerCases } from '../Context/Constants';
import { ADD_IMAGE_MESSAGE_ROUTE, ADD_MESSAGE } from '../utils/Apiroutes';
import EmojiPicker from 'emoji-picker-react';
import PhotoPicker from '../Components/PhotoPicker';
import dynamic from 'next/dynamic';
// This is dynamic import of file 
const CaptureAudio = dynamic(() => import('../Components/CaptureAudio'), { ssr: false })


// We are first gonna store the msg in DB & then withdraw from DB and send msg with Socket.io & recieve too
// So, if even user is not online then msg will be saved into DB & when User get's online the msg will be recieved/send

const ChatMessage = () => {
    const emojiPickerRef = useRef(null);
    const [{ userInfo, currentChatUser, socket, messages, newMessages }, dispatch] = useStateProvider();
    const [MessageInput, setMessageInput] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [GrabPhoto, setGrabPhoto] = useState(false);
    const [showAudioRecorder, setShowAudioRecorder] = useState(false)

    const handleOutsideClickOfEmojiMode = (event) => {
        if (event.target.id !== 'emoji-open') {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                setShowEmojiPicker(false)
            }
        }
    }

    // We will load this function as soon as component mounted & remove that function when component unMounted
    useEffect(() => {
        document.addEventListener('click', handleOutsideClickOfEmojiMode);

        return () => {
            document.removeEventListener("click", handleOutsideClickOfEmojiMode)
        }
    }, [])

    const handlerSendMessage = async () => {
        try {
            const { data } = await axios.post(ADD_MESSAGE,
                {
                    message: MessageInput,
                    from: userInfo?.id,  // this is that user id who is logged in so obviously this user is sending the the messages
                    to: currentChatUser?.id // this is that user id who's chat is open means logged in user opened this user when sending the message
                }
            )
            // console.log("data: ", data)

            // Here we are sending the info. about Sender/reciever & whole new typed message to socket in backend from here
            socket.current.emit("send-msg", {
                to: currentChatUser?.id,
                from: userInfo?.id,
                message: { ...data?.newMessage }
            })
            
            dispatch({
                type: reducerCases.ADD_MESSAGE,
                newMessages: {
                    ...data?.newMessage
                },
                fromSelf: true,
            })

            // dispatch({
            //     type: reducerCases.SET_MESSAGES,
            //     messages: [...messages, data?.newMessage]
            // })
            // console.log("Message : ", data?.newMessage?.message);
            // console.log("messages:", messages);
            // console.log("new messages: ", newMessages)

            setMessageInput("")

        } catch (error) {
            console.error(error)
        }
    }

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            return handlerSendMessage();
        }
    }

    const handleEmojiMode = () => {
        setShowEmojiPicker(!showEmojiPicker);
    }
    const handleEmojiClick = (emoji) => {
        setMessageInput((prevMessage) => (prevMessage += emoji.emoji))

    }

    useEffect(() => {
        if (GrabPhoto) {
            // Because we added the component variable which holds the input file tag with id "photo-picker" so, we can access it
            const data = document.getElementById('photo-picker');

            data.click();   // Since that input file tag is hidden so here we are clicking it

            document.body.onfocus = (e) => {    // Means once it is clicked then grabphoto is set false & this useEffect() will check garbphoto
                // We put the setTimeout here because it setting the state false before we can even execute the onChange() function of photo picker 
                setTimeout(() => {
                    setGrabPhoto(false)
                }, 1000)
            }
        }

    }, [GrabPhoto])

    const photopickerChange = async (e) => {
        try {
            const file = e.target.files[0];
            const formdata = new FormData();
            formdata.append('image', file);

            const response = await axios.post(ADD_IMAGE_MESSAGE_ROUTE, formdata, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                params: {
                    from: userInfo.id,
                    to: currentChatUser.id
                }
            })

            if (response.status === 201) {
                socket.current.emit("send-msg", {
                    to: currentChatUser?.id,
                    from: userInfo?.id,
                    message: { ...response.data?.newMessage }
                })
                dispatch({
                    type: reducerCases.ADD_MESSAGE,
                    newMessages: {
                        ...response.data?.newMessage
                    },
                    fromSelf: true,
                })
            }

            // console.log("Response: ", response)


        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className='bg-panel-header-background h-20 px-4 flex items-center gap-6 relative'>
            {!showAudioRecorder &&
                <>
                    <div className="flex gap-6">
                        <BsEmojiSmile
                            className='text-panel-header-icon cursor-pointer  text-xl'
                            title='Emoji'
                            id='emoji-open'
                            onClick={handleEmojiMode}
                        />
                        {
                            showEmojiPicker && (
                                <div
                                    ref={emojiPickerRef}
                                    className="absolute bottom-24 left-16 z-40">
                                    <EmojiPicker
                                        onEmojiClick={handleEmojiClick}
                                        theme='dark'
                                    />
                                </div>
                            )
                        }

                        <ImAttachment
                            className='text-panel-header-icon cursor-pointer  text-xl'
                            title='Attach File'
                            onClick={() => { setGrabPhoto(true) }}
                        />
                    </div>
                    <div className="w-full rounded-lg h-10 flex items-center">
                        <input
                            type="text"
                            className='bg-input-background text-sm focus:outline-none text-white h-10 rounded-lg px-5 py-4 w-full' placeholder='Type a message'
                            onChange={(e) => { setMessageInput(e.target.value) }}
                            value={MessageInput}
                            onKeyDown={handleKeyPress}
                        />
                    </div>
                    <div className="flex items-center justify-center w-10">
                        <button>

                            {MessageInput.length
                                ?
                                <MdSend
                                    className='text-panel-header-icon cursor-pointer text-xl' title='Send Message'
                                    onClick={handlerSendMessage} />

                                :
                                <FaMicrophone
                                    className='text-panel-header-icon cursor-pointer text-xl' title='Record Voice'
                                    onClick={() => { setShowAudioRecorder(true) }} />
                            }
                        </button>
                    </div>



                </>
            }

            {GrabPhoto && (
                <PhotoPicker onChange={photopickerChange} />
            )}

            {showAudioRecorder && <CaptureAudio hideAudioRecorder={setShowAudioRecorder} />}
        </div>
    )
}

export default ChatMessage
