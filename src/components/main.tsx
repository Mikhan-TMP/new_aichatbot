import Image from "next/image";
import Sidebar from "../components/sidebar/sidebar";
import ChatWindow from "../components/chatwindow/chatwindow";
export default function AppSidebar() {
return (
    <div className="flex gap-10 w-full h-screen  ">
        <div>
            <Sidebar />
        </div>
        <div className="flex w-240 h-screen">
            <ChatWindow />
        </div>
    </div>
);
}
