import { RiSettings5Fill } from "react-icons/ri";
import { BiSolidHelpCircle } from "react-icons/bi";
import { FaUserCircle } from "react-icons/fa";
import { MdAddComment } from "react-icons/md";
import { RiChatHistoryFill } from "react-icons/ri";
import { GiMagicHat } from "react-icons/gi";

export default function Sidebar() {
    return (
        <div >
        <button data-drawer-target="separator-sidebar" data-drawer-toggle="separator-sidebar" aria-controls="separator-sidebar" type="button" className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
        <span className="sr-only">Open sidebar</span>
        <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
        </svg>
        </button>


        <aside id="separator-sidebar" className="top-0 left-0 z-40 w-84 h-screen transition-transform -translate-x-full sm:translate-x-0 " aria-label="Sidebar" >
        <div className="h-full px-10 py-8 overflow-y-auto bg-gray-50 dark:bg-gray-800">
            {/* LOGO */}
            <ul className="space-y-2 flex gap-2">
                <GiMagicHat className="text-3xl"/>
                <h1 className="text-3xl font-bold">Ai Chat </h1>
            </ul>
            {/* MENU */}
            <ul className="pt-4 mt-4 space-y-2 font-medium ">
                <li>
                    <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                    <MdAddComment />
                    <span className="ms-3">New Chat</span>
                    </a>
                </li>
                <li>
                    <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                    <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                        <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z"/>
                    </svg>
                    <span className="flex-1 ms-3 whitespace-nowrap">Current Chat</span>
                    <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">Pro</span>
                    </a>
                </li>
                <li>
                    <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                    <RiChatHistoryFill />
                    <span className="flex-1 ms-3 whitespace-nowrap">Chat History</span>
                    <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">3</span>
                    </a>
                </li>
            </ul>
            {/* RECENT CHATS */}
            <ul className="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
                <p className="px-3 text-xs text-gray-400 dark:text-gray-400">Recent Chats</p>
                <li>
                    <a href="#" className="flex  items-center p-2 text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group">
                    <div className="flex flex-col">
                        <span className="ms-3">Getting started with Ai Chat Bot</span>
                        <span className="ms-3 text-xs text-gray-400">2 minutes ago</span>
                    </div>
                    </a>
                </li>
                <li>
                    <a href="#" className="flex  items-center p-2 text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group">
                    <div className="flex flex-col">
                        <span className="ms-3">Where is the Library</span>
                        <span className="ms-3 text-xs text-gray-400">2 hours ago</span>
                    </div>
                    </a>
                </li>
                <li>
                    <a href="#" className="flex  items-center p-2 text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group">
                    <div className="flex flex-col">
                        <span className="ms-3">Books authored by J.K Rowling</span>
                        <span className="ms-3 text-xs text-gray-400">Yesterday</span>
                    </div>
                    </a>
                </li>
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