import React, { useEffect, useRef, useState } from 'react'
import WaveSurfer from 'wavesurfer.js';
import { useStateProvider } from '../Context/StateContext';
import { HOST } from '../utils/Apiroutes';
import { calculateTime } from '../utils/CalculateTime';
import Messagestatus from '../Components/Messagestatus';
import Avatar from '../Components/Avatar';
import { FaPlay, FaStop } from 'react-icons/fa';

const VoiceMessage = ({ message }) => {
    // console.log("Checking: ", message.message)
    const [{ userInfo, currentChatUser }, dispatch] = useStateProvider();
    // console.log(userInfo)
    const [audioMessage, setAudioMessage] = useState(null);
    const [isPlaying, setIsPlaying] = useState();
    const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
    const [totalDuration, setTotalDuration] = useState(0);

    const waveFormRef = useRef(null);
    const waveForm = useRef(null)

    useEffect(() => {
        if (waveForm.current === null) {
            waveForm.current = WaveSurfer.create({
                container: waveFormRef.current,
                waveColor: "#ccc",
                progressColor: "#4a9eff",
                cursorColor: "#7ae3c3",
                barWidth: 2,
                height: 30,
                responsive: true
            })
            waveForm.current.on('finish', () => {
                setIsPlaying(false);
            })
        }
        // return () => {
        //     waveForm.current.destroy();
        // }
    }, [])

    useEffect(() => {
        const audioURL = `${HOST}/${message.message}`;
        const audio = new Audio(audioURL);
        setAudioMessage(audio);
        waveForm?.current?.load(audioURL);
        waveForm?.current?.on("ready", () => {
            setTotalDuration(waveForm.current.getDuration())
        })

    }, [message.message])

    useEffect(() => {
        if (audioMessage) {
            const updatePlayBackTime = () => {
                setCurrentPlaybackTime(audioMessage.currentTime);
            }
            audioMessage.addEventListener('timeupdate', updatePlayBackTime);

            return () => {
                audioMessage.removeEventListener("timeupdate", updatePlayBackTime)
            }
        }


    }, [audioMessage])

    // This will format the time for recording
    const formatTime = (time) => {
        if (isNaN(time)) return "00:00";

        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`

    }

    // This will play the recorded audio
    const handlePlayAudio = () => {
        if (audioMessage) {
            waveForm.current.stop();
            waveForm.current.play();
            audioMessage.play();
            setIsPlaying(true);
        }
    }

    // This will stop the recorded audio
    const handlePauseAudio = () => {
        waveForm.current.stop();
        audioMessage.pause();
        setIsPlaying(false)
    }
    return (
        <div className={`flex gap-5 items-center text-white px-4 pr-2 py-4 text-sm rounded-md ${message.senderId === userInfo.id ? "bg-outgoing-background" : "bg-incoming-background"}`}>
            <Avatar type='lg' image={message.senderId === userInfo.id ? userInfo?.profileImage : currentChatUser?.profilePhoto} />
            <div className="cursor-pointer text-xl">
                {!isPlaying ? <FaPlay onClick={handlePlayAudio} /> : <FaStop onClick={handlePauseAudio} />}
            </div>
            <div className="relative">
                <div className="w-60" ref={waveFormRef} />
                <div className="text-bubble-meta text-[11px] pt-1 flex justify-between absolute bottom-[-22px] w-full">
                    <span>
                        {formatTime(isPlaying ? currentPlaybackTime : totalDuration)}
                    </span>
                    <div className="flex gap-1 ">
                        <span>
                            {calculateTime(message.createdAt)}
                        </span>
                        <span className="text-bubble-meta">
                            {message?.senderId === userInfo?.id && <Messagestatus messageStatus={message?.messageStatus} />}
                        </span>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default VoiceMessage
