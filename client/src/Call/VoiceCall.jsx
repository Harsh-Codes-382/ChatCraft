import dynamic from 'next/dynamic';
import React, { useEffect } from 'react';
import { useStateProvider } from '../Context/StateContext';
const Container = dynamic(() => import('./Container'), { ssr: false })

const VoiceCall = () => {
    const [{ userInfo, socket, voiceCall }] = useStateProvider();


    // As soon as the logged in user click on voice call means 'voiceCall' global state will set that time & we are emitting an event to server which takes info. like logged in user who make the call because logged in user is only one who can make call
    useEffect(() => {
        if (voiceCall.type === 'out-going') {
            socket.current.emit('outgoing-voice-call', {
                to: voiceCall.id,
                from: {
                    id: userInfo.id,
                    profileImage: userInfo.profileImage,
                    name: userInfo.name
                },
                callType: voiceCall.callType,
                roomId: voiceCall.roomId
            })
        }
    }, [voiceCall])
    return (
        <Container data={voiceCall} />
    )
}

export default VoiceCall
