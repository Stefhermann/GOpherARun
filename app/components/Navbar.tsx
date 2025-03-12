import Link from 'next/link'

const Navbar: React.FC = () => {
    return (
        <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          GOpher A Run
        </Link>
        <div className="space-x-4">
          <Link href="/" className="hover:underline">Home</Link>
          <Link href="/create" className="hover:underline">Create a Run</Link>
          {/* <Link href="/login" className="hover:underline">Login</Link> */}
        </div>
      </div>
    </nav>
    )
}

export default Navbar;