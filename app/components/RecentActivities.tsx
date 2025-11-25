import { PiEmptyBold } from "react-icons/pi";

export default function RecentActivities() {
  const notifications = ['']
  return (
    <main className="w-1/5 bg-[#F7F7F7] p-4 rounded-2xl flex flex-col ">
      <p>Recent Activities</p>

      
        <div className="w-full h-full flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="bg-white p-4 rounded-full">
              <PiEmptyBold className="text-[#455A64] inline-block" size={32} />
            </div>

            <p className="text-center">Your transactions will appear here.</p>
          </div>
        </div>
      
    </main>
  );
}