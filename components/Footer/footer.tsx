import Link from "next/link"

const Footer = () => {
  return (
    <footer className="bg-[#7A0019] text-white py-10 relative bottom-0 mt-auto">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">

        {/* Column 1 - About */}
        <div>
          <h4 className="text-xl font-bold text-[#FFCC33]">About Gopher Run</h4>
          <p className="mt-2 text-gray-300">
            Gopher Run is a community-driven platform to connect runners of all levels.
            Join local events, find running buddies, and stay motivated!
          </p>
        </div>

        {/* Column 2 - Quick Links */}
        <div>
          <h4 className="text-xl font-bold text-[#FFCC33]">Quick Links</h4>
          <ul className="mt-2 space-y-2">
            <li><Link href="/" className="text-gray-300 hover:text-[#FFCC33]">Home</Link></li>
            <li><Link href="/events" className="text-gray-300 hover:text-[#FFCC33]">Events</Link></li>
            <li><Link href="/about" className="text-gray-300 hover:text-[#FFCC33]">About Us</Link></li>
            <li><Link href="/contact" className="text-gray-300 hover:text-[#FFCC33]">Contact</Link></li>
          </ul>
        </div>

        {/* Column 3 - Contact & Socials */}
        <div>
          <h4 className="text-xl font-bold text-[#FFCC33]">Contact Us</h4>
          <p className="mt-2 text-gray-300">📍 Minneapolis, MN</p>
          <p className="text-gray-300">📧 support@gopherrun.com</p>
          <p className="text-gray-300">📞 (612) 123-4567</p>

          {/* Social Icons */}
          <div className="flex justify-center md:justify-start mt-4 space-x-4">
            <a href="#" className="text-gray-300 hover:text-[#FFCC33]">
              <i className="fab fa-facebook text-2xl"></i>
            </a>
            <a href="#" className="text-gray-300 hover:text-[#FFCC33]">
              <i className="fab fa-twitter text-2xl"></i>
            </a>
            <a href="#" className="text-gray-300 hover:text-[#FFCC33]">
              <i className="fab fa-instagram text-2xl"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="mt-8 border-t border-gray-500 text-center pt-4 text-sm text-gray-300">
        © {new Date().getFullYear()} Gopher Run. All Rights Reserved.
      </div>
    </footer>

  )
}

export default Footer
