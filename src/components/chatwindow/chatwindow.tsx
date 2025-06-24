import { RiRobot3Fill } from "react-icons/ri";
import { FaMicrophoneLines } from "react-icons/fa6";
import { FaUserSecret } from "react-icons/fa6";
import { IoSend } from "react-icons/io5";

export default function ChatWindow() {
    return(
        <div className="flex flex-col h-screen w-240 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex flex-col flex-1 overflow-hidden">
                {/* TOP CONTENT */}
                <div className="p-5 flex gap-2 items-center border-b border-gray-200 dark:border-gray-700" >
                    <RiRobot3Fill className="text-3xl" />
                    <h5 className=" text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Ai Chat Assistant</h5>
                </div>
                {/* CHAT CONTENT */}
                <div className="flex flex-col space-y-4 p-10 overflow-y-auto scrollbar-thumb-gray-900 scrollbar-track-gray-700 scrollbar-thin">
                    {/* USER CHAT */}
                    <div className="flex items-start gap-2.5 justify-end">
                        {/* <img className="w-8 h-8 rounded-full" src="/docs/images/people/profile-picture-3.jpg" alt="Jese image"> */}
                        <div className="flex flex-col w-full max-w-[380px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-xl rounded-br-none dark:bg-gray-700">
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">Jese Leos</span>
                                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">11:46</span>
                            </div>
                            <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">When will the library open? I need to pick up a book and I don't know when it will open</p>
                            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">Delivered</span>
                        </div>
                        <FaUserSecret className="w-8 h-8"/>
                    </div>
                    {/* CHATBOT CHAT */}
                    <div className="flex items-start gap-2.5 justify-start">
                        <FaUserSecret className="w-8 h-8"/>
                        {/* <img className="w-8 h-8 rounded-full" src="/docs/images/people/profile-picture-3.jpg" alt="Jese image"> */}
                        <div className="flex flex-col w-full max-w-[380px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">AI Librarian</span>
                                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">11:46</span>
                            </div>
                            <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">The library opens at 8:00 AM and closes at 5:00 PM. The library is closed on Sundays and public holidays.</p>
                            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">Delivered</span>
                        </div>
                    </div>



                </div>
            </div>
            {/* BOTTOM CONTENT */}
            <div className="mb-5">
                <div className="flex p-5 gap-2 items-center">
                    <div className="flex w-full">
                        <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300 border-e-0 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                            <FaMicrophoneLines />
                        </span>
                        <input type="text" id="website-admin" className="rounded-none rounded-e-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Your message" />
                    </div>
                    <div className="p-3 border border-gray-200 rounded-sm">
                        <IoSend className="w-4 h-4"/>
                    </div>

                </div>
            </div>
        </div>

    )
}