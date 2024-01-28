import React from 'react';
import { useStateProvider } from '../Context/StateContext'
import Image from 'next/image';
import { reducerCases } from '../Context/Constants';
import { MdOutlineCallEnd, MdPhone } from 'react-icons/md';

const IncomingVoiceCall = () => {
    const [{ incomingVoiceCall, socket, voiceCall }, dispatch] = useStateProvider();
    // console.log(incomingVideoCall)

    const acceptCall = () => {
        dispatch({
            type: reducerCases.SET_VOICE_CALL,
            voiceCall: { ...incomingVoiceCall, type: 'in-coming' }
        })


        socket.current.on('accept-incoming-call', {
            id: incomingVoiceCall.id
        })

        dispatch({
            type: reducerCases.SET_INCOMING_VOICE_CALL,
            incomingVoiceCall: undefined
        })



    }

    const rejectCall = () => {

        socket.current.emit('reject-voice-call', {
            from: incomingVoiceCall.id,
        })

        dispatch({
            type: reducerCases.END_CALL
        })

    }
    return (
        <div className='h-24 w-80 fixed bottom-8 mb-0 right-6 z-50 rounded-sm flex gap-5 items-center justify-start p-4 bg-conversation-panel-background text-white drop-shadow-2xl border-icon-green border-2 py-14'>

            <div className="">
                <Image src={incomingVoiceCall.profileImage} alt='User' height={70} width={70} className='rounded-full' />
            </div>

            <div className="">
                <div className="">{incomingVoiceCall.name}</div>
                <div className="text-xs">Incoming Voice Call</div>
                <div className="flex gap-2 mt-2 ">
                    <MdPhone className='text-3xl bg-green-500 p-1 cursor-pointer rounded-full' onClick={acceptCall} />
                    <MdOutlineCallEnd className='text-3xl bg-red-500 p-1 cursor-pointer rounded-full' onClick={rejectCall} />
                </div>
            </div>

        </div>
    )
}

export default IncomingVoiceCall
