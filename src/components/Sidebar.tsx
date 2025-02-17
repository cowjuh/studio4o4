import { Link } from '@tanstack/react-router'
import { HomeIcon } from '@radix-ui/react-icons'
import SectionLink from './SectionLink'

// Import images from each section
import modelingImg1 from "@assets/images/digitals/Leah Digitals0292 1.jpg";
import modelingImg2 from "@assets/images/digitals/Leah Digitals0277 1.jpg";
import modelingImg3 from "@assets/images/digitals/IMG_3450.jpg";

const NAV_ITEMS = [
  {
    title: "Modeling Digitals",
    path: "/modeling",
    images: [modelingImg1, modelingImg2, modelingImg3],
  },
  {
    title: "Headshots",
    path: "/headshots",
    images: [
      "https://picsum.photos/seed/headshots1/800/1200",
      "https://picsum.photos/seed/headshots2/800/1200",
      "https://picsum.photos/seed/headshots3/800/1200",
    ],
  },
  {
    title: "Editorial & Fine Art",
    path: "/editorial",
    images: [
      "https://picsum.photos/seed/editorial1/800/1200",
      "https://picsum.photos/seed/editorial2/800/1200",
      "https://picsum.photos/seed/editorial3/800/1200",
    ],
  },
];

interface SidebarProps {
  orientation?: 'horizontal' | 'vertical';
}

const Sidebar = ({ orientation = 'vertical' }: SidebarProps) => {
  return (
    <nav className={`
      flex flex-col gap-2 p-4 lg:p-6
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