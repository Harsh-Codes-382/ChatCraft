import React from 'react'
import ChatHeader from './ChatHeader'
import ChatContainer from './ChatContainer'
import ChatMessage from './ChatMessage'

const Chat = () => {
    return (
        <div className='border-conversation-border border-1 w-full bg-conversation-panel-background flex flex-col h-[100vh] z-10'>

            <ChatHeader />
            <ChatContainer />
            <ChatMessage />

        </div>
    )
}

export default Chat
