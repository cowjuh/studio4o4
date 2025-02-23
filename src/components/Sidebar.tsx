import SectionLink from './SectionLink'

type ImageModule = { default: string }

// Dynamically import images from each directory
const modelingImages = import.meta.glob<ImageModule>('@assets/images/digitals/*.{png,jpg,jpeg}', { eager: true })
const headshotsImages = import.meta.glob<ImageModule>('@assets/images/headshots/*.{png,jpg,jpeg}', { eager: true })
const editorialImages = import.meta.glob<ImageModule>('@assets/images/editorial/*.{png,jpg,jpeg}', { eager: true })

// Helper function to get first 3 images from a module object
const getFirst4Images = (moduleObj: Record<string, ImageModule>) => {
  return Object.values(moduleObj)
    .map(module => module.default)
    .slice(0, 4)
}

const NAV_ITEMS = [
  {
    title: "Modeling Digitals & Comp Cards",
    path: "/modeling",
    images: getFirst4Images(modelingImages),
  },
  {
    title: "Headshots & Personal Branding",
    path: "/headshots",
    images: getFirst4Images(headshotsImages),
  },
  {
    title: "Editorial, Fine Art & Other",
    path: "/editorial",
    images: getFirst4Images(editorialImages),
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