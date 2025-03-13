import { Link } from '@tanstack/react-router'
import { HomeIcon } from '@radix-ui/react-icons'
import SectionLink from './SectionLink'
import { NAV_ITEMS } from '@/config/navigation'

interface MenuProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

const Menu = ({ orientation = 'vertical', className = '' }: MenuProps) => {
  return (
    <nav className={`
      flex flex-col
      ${orientation === 'horizontal' ? 'lg:flex-row lg:items-center' : ''}
      ${className}
    `}>
      <Link
        to="/"
        className="flex items-center gap-2 text-sm group md:mb-4"
      >
        {({ isActive }) => (
          <span className={`flex items-center gap-2 hover:underline ${isActive ? 'font-bold' : ''}`}>
            <HomeIcon className="w-4 h-4" />
            <span>Home</span>
          </span>
        )}
      </Link>
      <div className='divide-y divide-black/70 w-full'>
        {NAV_ITEMS.slice(0, -1).map((item, index) => (
          <SectionLink
            key={item.path}
            index={index}
            title={item.title}
            path={item.path}
            images={item.images}
          />
        ))}
        <SectionLink
          title={NAV_ITEMS[NAV_ITEMS.length - 1].title}
          path={NAV_ITEMS[NAV_ITEMS.length - 1].path}
        />
      </div>
    </nav>
  )
}

export default Menu 