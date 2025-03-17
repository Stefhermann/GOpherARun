import Link from "next/link";

const NavLink = ({
  href,
  label,
  pathname,
}: {
  href: string;
  label: string;
  pathname: string;
}) => {
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={`px-4 py-2 font-medium relative ${isActive ? "text-[#7A0019] after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-[#7A0019]" : "text-[#7A0019]"
        } transition-colors`}
    >
      {label}
    </Link>
  );
};

export default NavLink;
