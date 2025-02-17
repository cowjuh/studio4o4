import { FaInstagram, FaGithub } from 'react-icons/fa'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-black py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-6">
            <a 
              href="https://www.instagram.com/cowjuh/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-neutral-700 hover:text-black"
            >
              <FaInstagram size={20} />
            </a>
            <a 
              href="https://github.com/cowjuh/studio4o4" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-neutral-700 hover:text-black"
            >
              <FaGithub size={20} />
            </a>
          </div>
          
          <div className="text-sm text-center md:text-right">
            <p>© {currentYear} 4o4.space</p>
            <p className="text-neutral-600">
              Designed and built by Jenny Zhang
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer 