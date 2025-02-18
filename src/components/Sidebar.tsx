import { Link } from '@tanstack/react-router'
import { HomeIcon } from '@radix-ui/react-icons'
import SectionLink from './SectionLink'

type ImageModule = { default: string }

// Dynamically import images from each directory
const modelingImages = import.meta.glob<ImageModule>('@assets/images/digitals/*.{png,jpg,jpeg}', { eager: true })
const headshotsImages = import.meta.glob<ImageModule>('@assets/images/headshots/*.{png,jpg,jpeg}', { eager: true })
const editorialImages = import.meta.glob<ImageModule>('@assets/images/editorial/*.{png,jpg,jpeg}', { eager: true })

// Helper function to get first 3 images from a module object
const getFirst3Images = (moduleObj: Record<string, ImageModule>) => {
  return Object.values(moduleObj)
    .map(module => module.default)
    .slice(0, 3)
}

const NAV_ITEMS = [
  {
    title: "Modeling Digitals",
    path: "/modeling",
    images: getFirst3Images(modelingImages),
  },
  {
    title: "Headshots",
    path: "/headshots",
    images: getFirst3Images(headshotsImages),
  },
  {
    title: "Editorial & Fine Art",
    path: "/editorial",
    images: getFirst3Images(editorialImages),
  },
];

interface SidebarProps {
  orientation?: 'horizontal' | 'vertical';
}

const Sidebar = ({ orientation = 'vertical' }: SidebarProps) => {
  return (
    <nav className={`
      flex flex-col gap-2 py-2
      ${orientation === 'horizontal' ? 'lg:flex-row lg:items-center' : ''}
    `}>
      <Link
        to="/"
        className="flex items-center gap-2 text-sm group mb-4"
      >
        {({ isActive }) => (
          <span className={`flex items-center gap-2 hover:underline ${isActive ? 'font-bold' : ''}`}>
            <HomeIcon className="w-4 h-4" />
            <span>Home</span>
          </span>
        )}
      </Link>
      <div className='divide-y divide-black/70'>
        {NAV_ITEMS.map((item, index) => (
          <SectionLink
            key={item.path}
            index={index}
            title={item.title}
            path={item.path}
            images={item.images}
          />
        ))}
        <SectionLink
          title="About"
          path="/about"
        />
      </div>
    </nav>
  )
}

export default Sidebar 