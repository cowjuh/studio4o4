type ImageModule = { default: string }

// Dynamically import images from each directory
const modelingImages = import.meta.glob<ImageModule>('@assets/images/digitals/*.{png,jpg,jpeg}', { eager: true })
const headshotsImages = import.meta.glob<ImageModule>('@assets/images/headshots/*.{png,jpg,jpeg}', { eager: true })
const editorialImages = import.meta.glob<ImageModule>('@assets/images/editorial/*.{png,jpg,jpeg}', { eager: true })
const spaceImages = import.meta.glob<ImageModule>('@assets/images/space/*.{png,jpg,jpeg}', { eager: true })

// Helper function to get first 4 images from a module object
export const getFirst4Images = (moduleObj: Record<string, ImageModule>) => {
  return Object.values(moduleObj)
    .map(module => module.default)
    .slice(0, 4)
}

export const NAV_ITEMS = [
  {
    title: "Modeling Digitals & Comp Cards",
    label: "Modeling Digitals",
    path: "/modeling",
    images: getFirst4Images(modelingImages),
  },
  {
    title: "Headshots & Personal Branding",
    label: "Headshots & Personal Branding",
    path: "/headshots",
    images: getFirst4Images(headshotsImages),
  },
  {
    title: "Editorial, Fine Art & Other",
    label: "Editorial & Fine Art",
    path: "/editorial",
    images: getFirst4Images(editorialImages),
  },
  {
    title: "The Space",
    label: "The Space",
    path: "/space",
    images: getFirst4Images(spaceImages),
  },
  {
    title: "About",
    label: "About",
    path: "/about",
  },
] 