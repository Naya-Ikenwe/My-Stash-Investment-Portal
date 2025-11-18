import Image from "next/image";
type AuthWrapperProps = {
  children: React.ReactNode;
};

export default function AuthWrapper({ children }: AuthWrapperProps) {
  return (
    <main>
      <div className="mt-10 ml-20 mb-24">
        <Image
          src="/images/mystash-logo.svg"
          alt="mystash-logo"
          width={100}
          height={100}
        />
      </div>

      {children}
    </main>
  );
}
