import Image from "next/image";
type AuthWrapperProps = {
  children: React.ReactNode;
  className?: string;
};

export default function AuthWrapper({ children, className }: AuthWrapperProps) {
  return (
    <main className="max-w-2xl mx-auto pb-6 px-4">
      <div className="mt-6 lg:mt-10 mb-12 lg:mb-24">
        <Image
          src="/images/mystash-logo.svg"
          alt="mystash-logo"
          width={100}
          height={100}
          className="w-32 lg:w-40 h-auto"
        />
      </div>

      <div className={`${className} `}>{children}</div>
    </main>
  );
}
