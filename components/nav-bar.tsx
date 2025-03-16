
const NavBar = () => {
  return (
    <header className="bg-white h-16 z-20 shadow-md">
      <nav className="flex justify-between items-center w-[92%] mx-auto">
        <h1 className="mt-3 mr-10 text-2xl font-bold text-gray-800">Gopher Run</h1>
        <div className="hidden sm:block h-full max-w-fit">
          DIRECTIONS
        </div>
        <div className="text-end items-end">
          USER AUTHENTICATION
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
