import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import ImageStack from './ImageStack'

type NavItem = {
  path: string;
  label: string;
  previewImages: string[];
}

interface SidebarProps {
  orientation?: 'horizontal' | 'vertical';
}

const NAV_ITEMS: NavItem[] = [
  {
    path: '/modeling',
    label: 'Modeling Digitals',
    previewImages: [
      'https://picsum.photos/seed/modeling1/40',
      'https://picsum.photos/seed/modeling2/40',
      'https://picsum.photos/seed/modeling3/40',
      'https://picsum.photos/seed/modeling4/40',
      'https://picsum.photos/seed/modeling5/40',
    ],
  },
  {
    path: '/headshots',
    label: 'Headshots',
    previewImages: [
      'https://picsum.photos/seed/headshots1/40',
      'https://picsum.photos/seed/headshots2/40',
      'https://picsum.photos/seed/headshots3/40',
      'https://picsum.photos/seed/headshots4/40',
    ],
  },
  {
    path: '/editorial',
    label: 'Editorial & Fine Art',
    previewImages: [
      'https://picsum.photos/seed/editorial1/40',
      'https://picsum.photos/seed/editorial2/40',
      'https://picsum.photos/seed/editorial3/40',
      'https://picsum.photos/seed/editorial4/40',
      'https://picsum.photos/seed/editorial5/40',
      'https://picsum.photos/seed/editorial6/40',
    ],
  },
  {
    path: '/about',
    label: 'About',
    previewImages: [
      'https://picsum.photos/seed/about1/40',
      'https://picsum.photos/seed/about2/40',
    ],
  },
]

const Sidebar = ({ orientation = 'vertical' }: SidebarProps) => {
  const [hoveredPath, setHoveredPath] = useState<string | null>(null)
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY })
  }

  const handleMouseLeave = () => {
    setHoveredPath(null)
    setMousePosition(null)
  }

  return (
    <nav 
      className={`
        relative p-4 
        ${orientation === 'horizontal' 
          ? 'flex flex-row gap-6 min-w-max py-3' 
          : 'flex flex-col gap-2'
        }
      `}
    >
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          onMouseEnter={() => setHoveredPath(item.path)}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
        >
          {({ isActive }) => (
            <span className={`
              text-base text-neutral-700 hover:text-black cursor-pointer 
              transition-opacity whitespace-nowrap
              ${isActive ? 'font-semibold underline text-black' : ''}
            `}>
              {item.label}
              {orientation === 'vertical' && (
                <ImageStack 
                  images={item.previewImages} 
                  isVisible={hoveredPath === item.path} 
                  mousePosition={mousePosition}
                />
              )}
            </span>
          )}
        </Link>
      ))}
    </nav>
  )
}

export default Sidebar 