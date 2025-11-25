import { IoMdClose } from "react-icons/io";
import HoverWrapper from "./HoverWrapper";
import { BiSolidBank, BiTransferAlt } from "react-icons/bi";

type FundSourceProps = {
  onClose: () => void;
};
export default function FundSource({ onClose }: FundSourceProps) {
  const sources = [
    { icon: <BiTransferAlt />, name: "Instant Transfer" },
    { icon: <BiSolidBank />, name: "Bank Transfer" },
  ];

  return (
    <HoverWrapper className="py-14">
      <IoMdClose
        className="absolute top-4 right-4"
        onClick={onClose}
        size={20}
      />

      <div className="w-[70%] flex flex-col gap-10 items-center">
        <h2>Select Funding Source</h2>

        <div className="flex flex-col gap-4 w-full">
          {sources.map((source) => (
            <button
              key={source.name}
              className="flex items-center gap-3 px-3 py-3 bg-white w-full rounded-lg border border-[#2323231A]"
            >
              <span className="text-primary text-xl">{source.icon}</span>
              <p className="text-[16px]">{source.name}</p>

              {/* <input type="radio" /> */}
            </button>
          ))}
        </div>
      </div>
    </HoverWrapper>
  );
}
