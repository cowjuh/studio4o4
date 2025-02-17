import { Link } from '@tanstack/react-router'

const Navbar = () => {
  return (
    <nav className="sticky top-0 bg-white border-b border-black/70 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 overflow-hidden">
              <img 
                src="https://picsum.photos/40" 
                alt="4o4.space Studio" 
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-medium">4o4.space STUDIO</span>
              <span className="text-sm">by Jenny Zhang</span>
            </div>
            <div className="ml-6 text-sm">
              <div>Bushwick</div>
              <div>Brooklyn, NY, 11237</div>
            </div>
          </div>

          <div className="flex items-center space-x-6">
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
        </div>
      </div>
    </nav>
  )
}

export default Navbar 