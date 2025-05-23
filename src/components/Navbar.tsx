import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { HamburgerMenuIcon, Cross1Icon } from '@radix-ui/react-icons'
import AcuityBookingButton from './AcuityBookingButton'
import { NAV_ITEMS } from '@/config/navigation'
import logo from '../assets/images/auxiliary/IMG_8449.png'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 bg-white border-b border-black/70 z-50">
      <div className="max-w-7xl mx-auto px-2 h-16 flex items-center">
        <div className="flex justify-between items-center w-full">
          <Link to="/" className="flex items-center space-x-4 hover:opacity-80 transition-opacity">
            <div className="flex items-center space-x-2">
            <div className="h-10 overflow-hidden">
              <img 
                src={logo} 
                alt="4o4.space Studio" 
                className="h-full w-auto"
                />
            </div>
            <div className="flex flex-col">
              <span className="font-medium">4o4STUDIO</span>
              <span className="text-sm text-neutral-500">at 4o4.space</span>
            </div>
                </div>
            <div className="ml-6 text-sm hidden md:block">
              <div>Bushwick</div>
              <div className="text-neutral-500">Brooklyn, NY, 11237</div>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-sm">
              <div>Inquiries</div>
              <div className="text-neutral-500">@4o4.space | hello@4o4.space</div>
            </div>
            <AcuityBookingButton />
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
        <div className="md:hidden border-t border-black/70 absolute top-16 left-0 right-0">
          <div className="bg-white px-4 py-4 space-y-4 border-b border-black/70">
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
              <div>@4o4.space</div>
              <div>hello@4o4.space</div>
            </div>
            <AcuityBookingButton className="block text-center" />
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar 