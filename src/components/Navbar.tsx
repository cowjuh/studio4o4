import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { HamburgerMenuIcon, Cross1Icon } from '@radix-ui/react-icons'

const NAV_ITEMS = [
  {
    path: '/modeling',
    label: 'Modeling Digitals',
  },
  {
    path: '/headshots',
    label: 'Headshots',
  },
  {
    path: '/editorial',
    label: 'Editorial & Fine Art',
  },
  {
    path: '/about',
    label: 'About',
  },
]

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 bg-white border-b border-black/70 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center">
        <div className="flex justify-between items-center w-full">
          <Link to="/" className="flex items-center space-x-4 hover:opacity-80 transition-opacity">
            <div className="h-10 w-10 overflow-hidden">
              <img 
                src="https://picsum.photos/40" 
                alt="4o4.space Studio" 
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-medium">STUDIO 4o4</span>
              <span className="text-sm">4o4.space</span>
            </div>
            <div className="ml-6 text-sm hidden md:block">
              <div>Bushwick</div>
              <div>Brooklyn, NY, 11237</div>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="text-sm">
              <div>Inquiries</div>
              <div>IG: @cowjuh E: cowjuh@gmail.com</div>
            </div>
            <Link 
              to="/"
              className="border border-black px-4 py-2 text-sm hover:bg-black hover:text-white transition-colors"
            >
              Book Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-black p-2"
          >
            {isMenuOpen ? <Cross1Icon className="w-6 h-6" /> : <HamburgerMenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-black/70">
          <div className="bg-white px-4 py-4 space-y-4">
            {/* Navigation Links */}
            <div className="space-y-3 border-b border-black/10 pb-4">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="block text-sm hover:opacity-70 transition-opacity"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {({ isActive }) => (
                    <span className={`${isActive ? 'font-semibold underline' : ''}`}>
                      {item.label}
                    </span>
                  )}
                </Link>
              ))}
            </div>

            {/* Contact Info */}
            <div className="text-sm">
              <div>Bushwick</div>
              <div>Brooklyn, NY, 11237</div>
            </div>
            <div className="text-sm">
              <div>Inquiries</div>
              <div>IG: @cowjuh</div>
              <div>E: cowjuh@gmail.com</div>
            </div>
            <Link 
              to="/"
              className="block border border-black px-4 py-2 text-sm text-center hover:bg-black hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Book Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar 