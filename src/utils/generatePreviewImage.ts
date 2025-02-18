export const generatePreviewImage = async (
  title: string,
  backgroundImage: string
): Promise<string> => {
  // Create canvas
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Could not get canvas context')

  // Set dimensions for social media preview (1200x630 is standard)
  canvas.width = 1200
  canvas.height = 630

  // Load and draw background image
  const img = new Image()
  img.crossOrigin = 'anonymous' // Enable CORS for the image
  
  await new Promise((resolve, reject) => {
    img.onload = resolve
    img.onerror = reject
    img.src = backgroundImage
  })

  // Calculate dimensions to maintain aspect ratio and fill canvas (true object-cover)
  const imageAspectRatio = img.width / img.height
  const canvasAspectRatio = canvas.width / canvas.height
  
  let sourceX = 0
  let sourceY = 0
  let sourceWidth = img.width
  let sourceHeight = img.height

  if (imageAspectRatio > canvasAspectRatio) {
    // Image is wider than canvas - crop the sides
    sourceWidth = img.height * canvasAspectRatio
    sourceX = (img.width - sourceWidth) / 2
  } else {
    // Image is taller than canvas - crop the top/bottom
    sourceHeight = img.width / canvasAspectRatio
    sourceY = (img.height - sourceHeight) / 2
  }

  // Draw and scale background image
  ctx.drawImage(
    img,
    sourceX, sourceY, sourceWidth, sourceHeight,  // Source rectangle
    0, 0, canvas.width, canvas.height             // Destination rectangle
  )

  // Add dark overlay for better text visibility
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Configure text styles
  ctx.fillStyle = 'white'
  
  // Draw "4o4" in top left
  ctx.textAlign = 'left'
  ctx.font = '120px Inter, -apple-system, BlinkMacSystemFont, system-ui, sans-serif'
  ctx.fillText('4o4', 80, 140)
  
  // Draw "STUDIO" in bottom right
  ctx.textAlign = 'right'
  ctx.font = '120px Inter, -apple-system, BlinkMacSystemFont, system-ui, sans-serif'
  ctx.fillText('STUDIO', canvas.width - 80, canvas.height - 80)

  // Draw page title in center
  ctx.textAlign = 'center'
  ctx.font = '50px Inter, -apple-system, BlinkMacSystemFont, system-ui, sans-serif'
  ctx.fillText(title, canvas.width / 2, canvas.height / 2)

  // Return as data URL
  return canvas.toDataURL('image/jpeg', 0.9)
} 