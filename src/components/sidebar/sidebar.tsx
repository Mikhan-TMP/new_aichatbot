'use client';
import { RiSettings5Fill } from "react-icons/ri";
import { BiSolidHelpCircle } from "react-icons/bi";
import { FaUserCircle } from "react-icons/fa";
import { MdAddComment } from "react-icons/md";
import { RiChatHistoryFill } from "react-icons/ri";
import { GiMagicHat } from "react-icons/gi";
import { TiThMenu } from "react-icons/ti";
import { backendUrl } from "@/config";
import React, { useEffect, useState } from "react";
import { GiTeacher } from "react-icons/gi";
import { PiChefHatDuotone } from "react-icons/pi";
import { GiPoliceOfficerHead } from "react-icons/gi";
import { MdFireTruck } from "react-icons/md";
import { GoCopilot } from "react-icons/go";
import { GiGuitarHead } from "react-icons/gi";
import { FaRunning } from "react-icons/fa";
import { MdScience } from "react-icons/md";
import { BiSolidBusiness } from "react-icons/bi";
import { IoMdFitness } from "react-icons/io";
import { GrYoga } from "react-icons/gr";
import { RiBoxingFill } from "react-icons/ri";
import { ImManWoman } from "react-icons/im";


interface SidebarProps {
    onNewChat?: () => void;
    onChatSelect?: (chat: ChatSession) => void; 
    onPersonaSelect?: (persona: string, route_id: number) => void;
    email?: string;
}
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

const Sidebar: React.FC<SidebarProps> = ({ onNewChat, onChatSelect, onPersonaSelect }) => {
    const Persona =[
        { 
            name: "Teacher", 
            id: 1, 
            icon: <GiTeacher />,
            route_id: 1
        },
        { 
            name: "Chef", 
            id: 2,
            icon: <PiChefHatDuotone />,
            route_id: 1
        },
        { 
            name: "Police Officer", 
            id: 3, 
            icon: <GiPoliceOfficerHead />,
            route_id: 1
        },
        { 
            name: "Firefighter", 
            id: 4, 
            icon: <MdFireTruck />,
            route_id: 1
        },
        { 
            name: "Pilot", 
            id: 5, 
            icon: <GoCopilot />,
            route_id: 1
        },
        { 
            name: "Musician", 
            id: 6, 
            icon: <GiGuitarHead />,
            route_id: 1
        },
        { 
            name: "Athlete", 
            id: 7, 
            icon: <FaRunning />,
            route_id: 1
        },
        { 
            name: "Scientist", 
            id: 8, 
            icon: <MdScience />,
            route_id: 1
        },
        { 
            name: "Businessman", 
            id: 9, 
            icon: <BiSolidBusiness />,
            route_id: 1
        },
        { 
            name: "Fitness Instructor", 
            id: 10, 
            icon: <IoMdFitness />,
            route_id: 2
        },
        { 
            name: "Yoga Instructor", 
            id: 11, 
            icon: <GrYoga />,
            route_id: 2
        },
        { 
            name: "Boxer", 
            id: 12, 
            icon: <RiBoxingFill />,
            route_id: 1
        },
        { 
            name: "Dancer", 
            id: 13, 
            icon: <ImManWoman />,
            route_id: 1
        },
    ];

    const [activePersona, setActivePersona] = useState<string | null>(null);

    const handlePersonaClick = (name: string, route_id: number) => {
        setActivePersona(name);
        onPersonaSelect?.(name, route_id);
    };

    return (
        <div className="flex h-screen">
            <button data-drawer-target="separator-sidebar" data-drawer-toggle="separator-sidebar" aria-controls="separator-sidebar" type="button" className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
            <span className="sr-only">Open sidebar</span>
            <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            {/* <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path> */}
            </svg>
            </button>
            <aside id="separator-sidebar" className="top-0 left-0 z-40 w-84 h-screen transition-transform -translate-x-full sm:translate-x-0 " aria-label="Sidebar" >
            <div className="h-full px-6 py-8 bg-gray-50 dark:bg-gray-800">
                {/* LOGO */}
                <ul className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <GiMagicHat className="text-3xl"/>
                        <h1 className="text-3xl font-bold">Ai Chat </h1>
                    </div>
                    <TiThMenu className="text-2xl" />
                </ul>

                {/* MENU */}
                <ul className="pt-4 mt-4 space-y-2 font-medium ">
                    <li className="cursor-pointer">
                        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">Select a Persona</span>
                    </li>
                    {Persona.map((item) => (
                        <li key={item.id}>
                            <button
                            onClick={() => handlePersonaClick(item.name, item.route_id)}
                            className={`flex border text-start cursor-pointer items-center p-2 rounded-lg w-full ${
                                activePersona === item.name
                                ? 'bg-green-100 dark:bg-green-800 text-green-700 dark:text-white'
                                : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                            >
                            {item.icon}
                            <span className="flex-1 ms-3 whitespace-nowrap">{item.name}</span>
                            </button>
                        </li>
                    ))}

                </ul>

                {/* SIDEBAR BOTTOM */}
                <ul className="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
                    <li>
                        <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                        <RiSettings5Fill />
                        <span className="flex-1 ms-3 whitespace-nowrap">Settings</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                        <BiSolidHelpCircle />
                        <span className="flex-1 ms-3 whitespace-nowrap">Help</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                        <FaUserCircle />
                        <span className="flex-1 ms-3 whitespace-nowrap">Sign Up</span>
                        </a>
                    </li>
                    
                </ul>
            </div>
            </aside>

        </div>
    );
}

export default Sidebar;