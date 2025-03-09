export interface IMessage {
    content: string
    sender: 'me' | 'peer'
    timestamp: number
}

export function Message({ message }: { message: IMessage }) {
    const isMe = message.sender === 'me'

    return (
        <div className={`mb-2 flex px-6 ${isMe ? 'justify-end' : 'justify-start'} `}>
            <div className={`max-w-[70%] rounded-lg px-4 py-2 ${isMe ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                <p>{message.content}</p>
                <span className={`mt-1 block text-right text-xs ${isMe ? 'text-blue-100' : 'text-gray-500'}`}>
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>
        </div>
    )
}
