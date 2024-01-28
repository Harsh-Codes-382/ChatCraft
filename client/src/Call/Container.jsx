import React, { useEffect, useState } from 'react'
import { useStateProvider } from '../Context/StateContext'
import Image from 'next/image';
import { MdOutlineCallEnd } from 'react-icons/md';
import { reducerCases } from '../Context/Constants';
import axios from 'axios';
import { GENERATE_TOKEN } from '../utils/Apiroutes';

const Container = ({ data }) => {

    const [{ userInfo, socket }, dispatch] = useStateProvider();
    const [callAccepted, setCallAccepted] = useState(false);
    const [token, setToken] = useState(undefined);
    const [zgVar, setZgVar] = useState(undefined);
    const [localStream, setLocalStream] = useState(undefined)
    const [publishStream, setPublishStream] = useState(undefined)

    useEffect(() => {
        if (data.type === 'out-going') {
            socket.current.on('call-accepted', () => {
                setCallAccepted(true)
            })
        }
        else {
            setTimeout(() => {
                setCallAccepted(true)
            }, 1000)
        }
    }, [data])

    useEffect(() => {
        const gettoken = async () => {
            try {
                const { data: { token: returnedtoken } } = await axios.get(`${GENERATE_TOKEN}/${userInfo.id}`)
                console.log(returnedtoken)
                setToken(returnedtoken)


            } catch (error) {
                console.error(error)
            }
        }
        gettoken();
    }, [callAccepted])

    useEffect(() => {
        const startCall = async () => {
            import('zego-express-engine-webrtc').then(async ({ ZegoExpressEngine }) => {
                const zg = new ZegoExpressEngine(process.env.NEXT_PUBLIC_ZEGO_APP_ID, process.env.NEXT_PUBLIC_ZEGO_SERVER_ID)
                setZgVar(zg)
                zg.on('roomStreamUpdate', async (roomID, updateType, streamList, extendedData) => {
                    if (updateType === 'ADD') {
                        const rmVideo = document.getElementById('remote-video');
                        const vd = document.createElement(data.callType === 'video' ? 'video' : 'audio');
                        vd.id = streamList[0].streamID;
                        vd.autoplay = true;
                        vd.playsInline = true;
                        vd.muted = false;
                        if (rmVideo) {
                            rmVideo.appendChild(vd);
                        }
                        zg.startPlayingStream(streamList[0].streamID, {
                            audio: true,
                            video: true
                        }).then((stream) => (vd.srcObject = stream))
                    }
                    else if (updateType === 'DELETE' && zg && localStream && streamList[0].streamID) {
                        zg.destroyStream(localStream);
                        zg.stopPublishingStream(streamList[0].streamID);
                        zg.logoutRoom(data.roomId.toString());
                        dispatch({ type: reducerCases.END_CALL })

                    }

                })
                console.log("data.roomId: ", data.roomId)
                await zg.loginRoom(data.roomId.toString(), token, { userID: userInfo.id.toString(), userName: userInfo.name }, { userUpdate: true })
                const localStream = await zg.createStream({
                    camera: {
                        audio: true,
                        video: data.callType === 'video' ? true : false,
                    }
                })
                const localVideo = document.getElementById('local-audio');
                const videoElement = document.createElement(data.callType === 'video' ? 'video' : 'audio');
                videoElement.id = "video-local-zego";
                videoElement.className = "h-28 w-32";
                videoElement.autoplay = true;
                videoElement.muted = false;
                videoElement.playsInline = true;
                localVideo.appendChild(videoElement)
                const td = document.getElementById('video-local-zego');
                td.srcObject = localStream;
                const streamID = "123" + Date.now();
                setPublishStream(streamID);
                setLocalStream(localStream);
                zg.startPublishingStream(streamID, localStream)
            })

        }
        if (token) {
            startCall();
        }
    }, [token])

    const endCall = () => {
        const id = data.id;
        if (zgVar && localStream && publishStream) {
            zgVar.destroyStream(localStream);
            zgVar.stopPublishingStream(publishStream);
            zgVar.logoutRoom(data.roomId.toString())
        }
        if (data.callType === 'voice') {
            socket.current.emit('reject-voice-call', {
                from: id
            });

        }
        else if (data.callType === 'video') {
            socket.current.emit('reject-video-call', {
                from: id
            })
        }
        dispatch({
            type: reducerCases.END_CALL
        })
    }

    return (
        <>
            <div className='border-conversation-border border-l w-full bg-conversation-panel-background flex flex-col h-[100vh] overflow-hidden items-center justify-center text-white'>
                <div className="flex flex-col gap-3 items-center">
                    <span className='text-5xl'>{data.name}</span>
                    <span className="text-lg">
                        {/* If call is accepted means ongoing & it is not voice call then show  */}
                        {callAccepted && data.callType !== 'video' ? "On going Call" : "Calling..."}
                    </span>
                </div>
                {/* if call not accepted means reciever user haven't answered yet or it is a voicecall only then show image  */}
                {(!callAccepted || data.callType === 'voice') && (
                    <div className="my-24">
                        <Image src={data.profilePhoto || data.profileImage} height={300} width={300} alt='Reciever' className='rounded-full' />
                    </div>
                )}
                <div className="my-5 relative" id='remote-video'>
                    <div className="absolute bottom-5 right-5 " id='local-audio'></div>
                </div>
                <div className="h-16 w-16 bg-red-600 flex items-center justify-center rounded-full">
                    <MdOutlineCallEnd className='text-3xl cursor-pointer' onClick={endCall} />
                </div>
            </div>
        </>
    )
}

export default Container
