import { useEffect, useRef } from 'react'

import { IMessage, Message } from './Message'

export default function Messages({ messages }: { messages: IMessage[] }) {
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    return (
        <div className="relative flex-1 overflow-hidden">
            <div className="size-full overflow-auto pt-2">
                {messages.map((message, index) => (
                    <Message key={index} message={message} />
                ))}
                <div ref={messagesEndRef} />
            </div>
        </div>
    )
}
