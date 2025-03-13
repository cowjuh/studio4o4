import SectionLink from './SectionLink'
import { NAV_ITEMS } from '@/config/navigation'

interface SidebarProps {
  orientation?: 'horizontal' | 'vertical';
}

const Sidebar = ({ orientation = 'vertical' }: SidebarProps) => {
  return (
    <nav className={`
      flex flex-col gap-2 py-2
      ${orientation === 'horizontal' ? 'lg:flex-row lg:items-center' : ''}
    `}>
      <div className='divide-y divide-black/70'>
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

export default Sidebar 