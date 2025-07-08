'use client';

import { RiRobot3Fill } from "react-icons/ri";
import { FaMicrophoneLines } from "react-icons/fa6";
import { FaUserSecret } from "react-icons/fa6";
import { IoSend } from "react-icons/io5";
import React, { useEffect, useState, Suspense, useRef, useImperativeHandle, forwardRef } from 'react';
// import { bouncy } from 'ldrs'
import { backendUrl, motionUrl } from "@/config";

type Message = {
    sender: string;
    name: string;
    time: string;
    text: string;
};


type ChatSession = {
    sessionId: string;
    name: string | null;
    messages: {
        text: string;
        sender: string;
        timestamp: string;
        _id: string;
    }[];
};


interface ChatWindowProps {
    selectedChat: any;
    onBVH?: (bvh: string | string[]) => void;
    onBVHPlay?: (bvh: string) => void; // <-- Add this
}


function renderMessageText(text: string) {
    // Try to match numbered list items in a single line
    // Example: 1. Item one 2. Item two 3. Item three
    const numberedListPattern = /(\d+\.\s[^(\d+\.\s)]+)/g;
    const matches = text.match(numberedListPattern);

    if (matches && matches.length > 1) {
        // If multiple numbered items found, render as <ol>
        return (
            <ol className="list-decimal ml-6">
                {matches.map((item, idx) => (
                    <li key={idx} className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">
                        {item.replace(/^\d+\.\s/, '').trim()}
                    </li>
                ))}
            </ol>
        );
    }

    // Fallback: handle multi-line lists (bullets or numbers)
    const lines = text.split('\n');
    const elements: any[] = [];
    let currentList: any[] = [];
    let currentType: 'ul' | 'ol' | null = null;

    function flushList() {
        if (!currentList.length) return null;
        const list = currentType === 'ol'
            ? <ol className="list-decimal ml-6">{currentList.map((li, i) => <li key={i}>{li}</li>)}</ol>
            : <ul className="list-disc ml-6">{currentList.map((li, i) => <li key={i}>{li}</li>)}</ul>;
        currentList = [];
        return list;
    }

    lines.forEach((line, idx) => {
        const match = line.match(/^(\s*)([-*•]|\d+\.)\s+(.*)$/);
        if (match) {
            const isOrdered = !!match[2].match(/^\d+\.$/);
            const content = match[3];

            if (currentType && ((isOrdered && currentType !== 'ol') || (!isOrdered && currentType !== 'ul'))) {
                const flushed = flushList();
                if (flushed) elements.push(flushed);
                currentType = isOrdered ? 'ol' : 'ul';
            }
            if (!currentType) {
                currentType = isOrdered ? 'ol' : 'ul';
            }
            currentList.push(content);
        } else {
            if (currentList.length) {
                const flushed = flushList();
                if (flushed) elements.push(flushed);
                currentType = null;
            }
            if (line.trim()) {
                elements.push(<p key={idx} className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">{line}</p>);
            }
        }
    });
    if (currentList.length) {
        const flushed = flushList();
        if (flushed) elements.push(flushed);
    }
    return <>{elements}</>;
}


const ChatWindow = forwardRef<{ resetChat: () => void; loadChat: (chat: any) => void }, ChatWindowProps>(
    ({ selectedChat, onBVH, onBVHPlay }, ref) => {
    // const email = props.email;
    const [lastMotions, setLastMotions] = useState<string[]>([]); // <-- Add this
    const [sessionId, setSessionId] = useState(Date.now().toString());
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const email = "tyalcabedos@gmail.com";
    const [messages, setMessages] = useState<Message[]>([]);
    const chatEndRef = useRef<HTMLDivElement | null>(null);
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    useEffect(() => {
        if (selectedChat) {
            setMessages(selectedChat.messages.map(m => ({
                sender: m.sender === "sent" ? "user" : m.sender === "received" ? "ai" : m.sender,
                name: selectedChat.name || "Instructor",
                time: new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                text: m.text
            })));
        }
    }, [selectedChat]);

    useImperativeHandle(ref, () => ({
        resetChat() {
            setMessages([]);
            setSessionId(Date.now().toString());
        },
        loadChat(chat) {
            setMessages(chat.messages.map(m => ({
                sender: m.sender === "sent" ? "user" : m.sender === "received" ? "ai" : m.sender,
                name: chat.name || "Instructor",
                time: new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                text: m.text
            })));
        }
    }));

    const [suggestions, setSuggestions] = useState([
        "Hello!",
        "Good Day!",
        "What's Up!"
    ]);


    function speakText(text: string, emotion?: string) {
        if ('speechSynthesis' in window) {
            const synth = window.speechSynthesis;
            let voices = synth.getVoices();
            // Try to pick a female English voice
            let voice = voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('female'))
                || voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('woman'))
                || voices.find(v => v.lang.startsWith('en'))
                || voices[0];

            const utterance = new window.SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            if (voice) utterance.voice = voice;

            // Adjust pitch/rate based on emotion
            switch (emotion) {
                case 'happy':
                    utterance.pitch = 1.5;
                    utterance.rate = 1.1;
                    break;
                case 'sad':
                    utterance.pitch = 0.8;
                    utterance.rate = 0.9;
                    break;
                case 'angry':
                    utterance.pitch = 1.2;
                    utterance.rate = 1.3;
                    break;
                default:
                    utterance.pitch = 1.1;
                    utterance.rate = 1.0;
            }
            synth.speak(utterance);
        }
    }
    
    async function handleSend() {
        const trimmedMessage = input.trim();
        if (!trimmedMessage) return;

        // Add user message to chat
        const userMsg = {
            sender: "user",
            name: email,
            time: time,
            text: trimmedMessage
        };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), 10 * 1000);
        try {
            const response = await fetch(
                backendUrl + "/api/query/query_router",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        query: trimmedMessage,
                        history: getChatHistory()
                    }),
                    signal: controller.signal
                }
            );
            const data = await response.json();
            clearTimeout(id);
            //check if data.answer exist
            if (!data.answer || data.answer.includes("[ERROR]") ){
                setMessages(prev => [
                    ...prev,
                    {
                        sender: "ai",
                        name: "Instructor",
                        time: time,
                        text: "Sorry, there was an error processing your request."
                    }
                ]);
            }else{
                let answer = data.answer;
                const motionMatches = [...answer.matchAll(/{{([^}]+)}}/g)].map(m => m[1]);
                setLastMotions(motionMatches); // <-- Save motions for UI

                const emotionMatch = answer.match(/^\(([^)]+)\)/);
                const motionMatch = answer.match(/{{([^}]+)}}/);

                // const emotion = emotionMatch ? emotionMatch[1] : null;
                // const motion = motionMatch ? motionMatch[1] : null;

                // // Remove emotion and motion from the answer
                // answer = answer.replace(/^\([^)]+\)\s*/, '').replace(/^{{[^}]+}}\s*/, '');

                // //remove the motionmatches from the answer as well
                // motionMatches.forEach(motion => {
                //     answer = answer.replace(`{{${motion}}}`, '');
                // });
                const aiMsg = {
                    sender: "ai",
                    name: "Instructor",
                    time: time,
                    text: answer
                };
                setMessages(prev => [...prev, aiMsg]);
                speakText(answer, emotionMatch ? emotionMatch[1] : null)

                if (motionMatches.length > 0) {
                    // Fetch all BVH files in order
                    Promise.all(
                        motionMatches.map(motion =>
                            fetch(motionUrl + "/generate_bvh", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ text_prompt: motion }),
                            })
                            .then(response => response.text())
                            .then(data => {
                                if (data.startsWith("HIERARCHY") && data.includes("MOTION")) {
                                    return data;
                                } else {
                                    return null;
                                }
                            })
                            .catch(() => null)
                        )
                    ).then(bvhFiles => {
                        const validBvhFiles = bvhFiles.filter(bvh => bvh && bvh.startsWith("HIERARCHY") && bvh.includes("MOTION"));
                        setLastMotions(validBvhFiles); // <-- Only valid BVH files
                        // Remove this to avoid auto-play:
                        // if (validBvhFiles.length > 0) onBVH?.(validBvhFiles);
                    });
                }
                
            }
            // Add AI response to chat
        } catch (err) {
            if (err.name === 'AbortError') {
                setMessages(prev => [
                    ...prev,
                    {
                        sender: "ai",
                        name: "Instructor",
                        time: time,
                        text: "Error: Could not reach server in time."
                    }
                ]);
            } else {
                setMessages(prev => [
                    ...prev,
                    {
                        sender: "ai",
                        name: "Instructor",
                        time: time,
                        text: "Error: Could not reach server."
                    }
                ]);
            }
        } finally {
            setLoading(false);
        }
    }

    function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter" && !loading) {
            handleSend();
        }
    }
    function getChatHistory() {
        return messages.map(msg => ({
            role: msg.sender,
            content: msg.text
        }));
    }
    return (
        <div className="flex flex-col w-full">

            {/* CONTENT */}
            <div className="flex flex-col flex-1">
                {/* TOP CONTENT */}
                <div className="p-5 flex gap-2 items-center border-b border-gray-200 dark:border-gray-700" >
                    <RiRobot3Fill className="text-3xl" />
                    <h5 className=" text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Ai Chat Assistant</h5>
                </div>
                {/* CHAT CONTENT */}
                <div className="flex flex-col space-y-4 p-10 h-[calc(100vh-160px)] overflow-y-scroll scrollbar-thumb-gray-900 scrollbar-track-gray-700 scrollbar-thin">
                    {messages.map((msg, idx) =>
                        msg.sender === "user" ? (
                            <div key={idx} className="flex items-start gap-2.5 justify-end">
                                <div className="flex flex-col w-full max-w-[380px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-xl rounded-tr-none dark:bg-gray-700">
                                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{msg.name}</span>
                                        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{msg.time}</span>
                                    </div>
                                    {renderMessageText(msg.text)}
                                    {/* <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">{msg.text}</p> */}
                                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400">Delivered</span>
                                </div>
                                <FaUserSecret className="w-8 h-8" />
                            </div>
                        ) : (
                            <div key={idx} className="flex items-start gap-2.5 justify-start">
                                <FaUserSecret className="w-8 h-8" />
                                <div className="flex flex-col w-full max-w-[380px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{msg.name}</span>
                                    {/* Render AI message text */}
                                    {renderMessageText(msg.text)}

                                    {/* --- Add this block: Play buttons for each motion step --- */}
                                    {idx === messages.length - 1 && lastMotions.length > 0 && (
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {lastMotions.map((bvh, motionIdx) => (
                                                bvh && (
                                                    <button
                                                        key={motionIdx}
                                                        className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                                                        onClick={() => onBVHPlay?.(bvh)}
                                                    >
                                                        ▶ Play Step {motionIdx + 1}
                                                    </button>
                                                )
                                            ))}
                                        </div>
                                    )}
                                    {/* --- End block --- */}
                                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400">Delivered</span>
                                </div>
                            </div>
                        )
                    )}
                    {loading && (
                        <div className="flex items-start gap-2.5 justify-start">
                            <FaUserSecret className="w-8 h-8" />
                            <div className="flex flex-col w-full max-w-[380px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
                                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">Instructor</span>
                                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                                </div>
                                <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">
                                    <span className="flex flex-row gap-2">
                                        <span className="w-2 h-2 rounded-full bg-red-500 animate-bounce"></span>
                                        <span className="w-2 h-2 rounded-full bg-red-500 animate-bounce [animation-delay:-.3s]">
                                        </span>
                                        <span className="w-2 h-2 rounded-full bg-red-500 animate-bounce [animation-delay:-.5s]"></span>
                                    </span>

                                    {/* <l-metronome size="20" speed="1.6"  color="white" ></l-metronome> */}
                                </p>
                            </div>
                        </div>
                    )}
                <div ref={chatEndRef} />
                </div>
            </div>
            {/* BOTTOM CONTENT */}
            <div className="border-t border-gray-50">
                <div className="flex p-5 gap-2 items-center">
                    <div className="flex w-full">
                        <span className="cursor-pointer inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300 border-e-0 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                            <FaMicrophoneLines />
                        </span>
                        <input
                            type="text"
                            className="rounded-none rounded-e-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Your message"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleInputKeyDown}
                            disabled={loading}
                        />
                    </div>
                    <button className="cursor-pointer p-3 border border-gray-200 rounded-sm" onClick={handleSend} disabled={loading || !input.trim()}>
                        <IoSend className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>

    )
});

export default ChatWindow;