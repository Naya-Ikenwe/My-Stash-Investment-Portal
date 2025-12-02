import Image from "next/image";
type AuthWrapperProps = {
  children: React.ReactNode;
  className?: string;
};

export default function AuthWrapper({ children, className }: AuthWrapperProps) {
  return (
    <main className="max-w-7xl mx-auto pb-6">
      <div className="mt-10 mb-24">
        <Image
          src="/images/mystash-logo.svg"
          alt="mystash-logo"
          width={100}
          height={100}
        />
      </div>

      <div className={`${className} `}>{children}</div>
    </main>
  );
}
