'use client';
import Image from "next/image";
import Sidebar from "../components/sidebar/sidebar";
import ChatWindow from "../components/chatwindow/chatwindow";
import dynamic from 'next/dynamic';
import React, { useRef, useState, Suspense } from "react";
const AvatarFBX = dynamic(() => import('../components/3davatar/3davatar'), { ssr: false });

function Loader() {
    return (
        <div className="flex w-full h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
            <div className="flex flex-col items-center">
                <svg className="animate-spin h-10 w-10 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
                <span className="text-lg text-gray-700 dark:text-gray-200">Loading...</span>
            </div>
        </div>
    );
}

export default function AppSidebar() {
    // Handler for New Chat
    const chatRef = useRef<any>(null);
    const avatarRef = useRef<any>(null);
    const [selectedChat, setSelectedChat] = useState(null);
    const [bvhQueue, setBvhQueue] = useState<string[]>([]);
    const [selectedPersona, setSelectedPersona] = useState(null);
    const [route_id, setRouteId] = useState<number | null>(null);

    const handleNewChat = () => {
        chatRef.current?.resetChat();
        avatarRef.current?.resetBVH();
    };

    const handleChatSelect = (chat) => {
        setSelectedChat(chat);
        chatRef.current?.loadChat(chat);
    };

    const handleBVH = (bvhList: string[] | string) => {
        if (Array.isArray(bvhList)) {
            setBvhQueue(bvhList);
        } else {
            setBvhQueue([bvhList]);
        }
    };
    const handleBVHPlay = (bvh: string) => {
        setBvhQueue([bvh]);
    };

    const handlePersonaSelect = (persona: string, route_id: number) => {
        setSelectedPersona(persona);
        setRouteId(route_id);
    };

    return (
        <Suspense fallback={<Loader />}>
            <div className="flex flex-col md:flex-row w-full h-screen">
                <div className="flex h-20 md:h-screen w-full md:w-auto">
                    <Sidebar onNewChat={handleNewChat} onChatSelect={handleChatSelect} onPersonaSelect={handlePersonaSelect}  />
                </div>
                <div className="flex w-full md:min-w-[400px] md:w-[1000px] h-[60vh] md:h-screen bg-gray-100 dark:bg-gray-900 border-t md:border-t-0 md:border-r md:border-l border-gray-200 dark:border-gray-700">
                    <ChatWindow ref={chatRef} selectedChat={selectedChat} onBVH={handleBVH} onBVHPlay={handleBVHPlay} selectedPersona={selectedPersona} route_id={route_id} />
                </div>
                <div className="flex w-full md:w-[700px] md:min-w-[400px] h-[40vh] md:h-screen bg-gray-50 dark:bg-gray-800">
                    {/* <AvatarFBX bvhQueue={bvhQueue} /> */}
                </div>
            </div>
        </Suspense>
    );
}
