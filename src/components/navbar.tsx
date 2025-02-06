import Image from "next/image";

const Navbar = () => {
  return (
    <div className="flex items-center justify-between w-full px-10">
      <Image
        src="/siam-white.png"
        width={300}
        height={300}
        alt="siam logo"
        className="-mt-[3.5rem]"
      />
      <Image src="/logo.png" width={225} height={225} alt="coding relay logo" />
    </div>
  );
};

export default Navbar;
