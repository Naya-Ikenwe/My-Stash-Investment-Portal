import Image from "next/image";
import { IoMdArrowDropdown } from "react-icons/io";
import { MdOutlineNotifications } from "react-icons/md";

export default function DashboardTopLevel() {
  return (
    <main className="flex justify-between items-center mb-4">
      <input type="text" placeholder="search...." />

      <div className="flex gap-4 items-center ">
        <MdOutlineNotifications size={24} />

        <div className="flex gap-2 items-center">
          <Image
            src={"/profile.svg"}
            alt="profile-placholder"
            width={20}
            height={20}
            className="w-10 h-10 rounded-full bg-[#F7F7F7]"
          />

          <IoMdArrowDropdown className="text-[#A243DC]" size={20} />
        </div>
      </div>
    </main>
  );
}
