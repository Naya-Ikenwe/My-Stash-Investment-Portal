import Link from "next/link";
import CardWrapper from "./CardWrapper";
import { IoIosArrowBack } from "react-icons/io";
import Image from "next/image";

export default function CreatePlanWelcome({
  onContinue,
}: {
  onContinue: () => void;
}) {
  return (
    <main className="flex gap-24 ">
      <CardWrapper className="flex flex-col items-center justify-center gap-5 w-[700px] h-[450px] relative">
        <Link
          href="/dashboard"
          className="bg-[#E7E7E7] p-2 rounded-full absolute top-5 left-5"
        >
          <IoIosArrowBack />
        </Link>

        <div className="flex flex-col gap-2 items-center">
          <h2 className="text-primary text-2xl font-medium">Create a Plan</h2>

          <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-full">
            <Image
              src={"/create-plan-icon.svg"}
              alt="create-plan-icon"
              width={24}
              height={24}
            />
          </div>

          <p className="text-[#37474F]">
            Create a plan to start earning returns
          </p>
        </div>

        <button
          onClick={onContinue}
          className="bg-primary text-white px-6 py-2 rounded-lg cursor-pointer"
        >
          Proceed
        </button>
      </CardWrapper>

      <div className="w-[45%] flex flex-col items-center gap-8 text-center ">
        <p className="text-primary text-[28px] font-medium">
          Every great journey starts with a solid plan—take the first step
          toward something big.
        </p>

        <Image src={'/rocket.svg'} alt="rocket" width={50} height={50} className="w-32"/>
      </div>
    </main>
  );
}
