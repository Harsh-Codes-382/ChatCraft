import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useStateProvider } from '../Context/StateContext';
const Container = dynamic(() => import('./Container'), { ssr: false })

const VideoCall = () => {
    const [{ userInfo, socket, videoCall }] = useStateProvider();

    useEffect(() => {
        if (videoCall.type === 'out-going') {
            socket.current.emit('outgoing-video-call', {
                to: videoCall.id,
                from: {
                    id: userInfo.id,
                    profileImage: userInfo.profileImage,
                    name: userInfo.name
                },
                callType: videoCall.callType,
                roomId: videoCall.roomId
            })
        }
    }, [videoCall])
    return (
        <Container data={videoCall} />
    )
}

export default VideoCall
