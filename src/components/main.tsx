'use client';
import Image from "next/image";
import Sidebar from "../components/sidebar/sidebar";
import ChatWindow from "../components/chatwindow/chatwindow";
import dynamic from 'next/dynamic';
import React, { useRef, useState, useImperativeHandle } from "react";
const AvatarFBX = dynamic(() => import('../components/3davatar/3davatar'), { ssr: false });


export default function AppSidebar() {
// Handler for New Chat
const chatRef = useRef<any>(null);
const avatarRef = useRef<any>(null);
const [selectedChat, setSelectedChat] = useState(null);
// const [bvhRaw, setBvhRaw] = useState<string | null>(null); 
const [bvhQueue, setBvhQueue] = useState<string[]>([]);
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

return (
    <div className="flex w-full h-screen">
        <div className="flex h-screen">
            <Sidebar onNewChat={handleNewChat} onChatSelect={handleChatSelect} />
        </div>
        <div className="flex min-w-[400px] w-[1000px] h-screen bg-gray-100 dark:bg-gray-900 border-r border-l border-gray-200 dark:border-gray-700">
            <ChatWindow ref={chatRef} selectedChat={selectedChat} onBVH={handleBVH} onBVHPlay={handleBVHPlay} />
        </div>
        <div className="flex h-screen w-[700px] min-w-[400px] bg-gray-50 dark:bg-gray-800">
            <AvatarFBX bvhQueue={bvhQueue} />
        </div>
        
    </div>
);
}
