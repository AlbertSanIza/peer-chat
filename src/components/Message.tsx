import React from 'react'

export interface IMessage {
    id: string
    content: string
    sender: 'me' | 'peer'
    timestamp: number
}

interface MessageProps {
    message: IMessage
}

export const Message: React.FC<MessageProps> = ({ message }) => {
    const isMe = message.sender === 'me'

    return (
        <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-2`}>
            <div className={`max-w-[70%] rounded-lg px-4 py-2 ${isMe ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                <p className="break-words">{message.content}</p>
                <span className={`text-xs ${isMe ? 'text-blue-100' : 'text-gray-500'} mt-1 block`}>
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>
        </div>
    )
}
