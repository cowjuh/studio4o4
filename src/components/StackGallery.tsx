import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

interface StackGalleryProps {
  images: string[]
}

interface ControlSettings {
  spacing: number
  yOffset: number
  xRotation: number
  moveSpeed: number
  moveDistance: number
  cameraX: number
  cameraY: number
  cameraZ: number
  brightness: number
}

const StackGallery = ({ images }: StackGalleryProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const timeRef = useRef(0)
  const activeIndexRef = useRef(0)
  const isTransitioningRef = useRef(false)

  // Control settings with defaults
  const [settings, setSettings] = useState<ControlSettings>({
    "spacing": 1,
    "yOffset": 1,
    "xRotation": 0,
    "moveSpeed": 0.008,
    "moveDistance": 3,
    "cameraX": 10,
    "cameraY": 10,
    "cameraZ": 10,
    "brightness": 1.05
  })

  const sceneRef = useRef<{
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
    imageMeshes: THREE.Mesh[]
  }>()

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return

    // Setup
    const container = containerRef.current
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xffffff)
    
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    )
    camera.position.set(settings.cameraX, settings.cameraY, settings.cameraZ)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    })
    renderer.setSize(container.clientWidth, container.clientHeight)

    // Create image planes
    const imageMeshes: THREE.Mesh[] = []
    const textureLoader = new THREE.TextureLoader()

    images.forEach((image, index) => {
      const texture = textureLoader.load(image)
      const geometry = new THREE.PlaneGeometry(4, 4)
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
        color: new THREE.Color(settings.brightness, settings.brightness, settings.brightness)
      })
      const mesh = new THREE.Mesh(geometry, material)

      // Position images in a train-like layout
      mesh.position.z = -index * settings.spacing
      mesh.position.y = settings.yOffset
      mesh.rotation.x = settings.xRotation
      
      scene.add(mesh)
      imageMeshes.push(mesh)
    })

    sceneRef.current = {
      scene,
      camera,
      renderer,
      imageMeshes
    }

    // Animation function
    const animate = () => {
      if (!sceneRef.current) return

      const { renderer, scene, camera, imageMeshes } = sceneRef.current
      timeRef.current += 0.01

      // Handle image transitions
      if (!isTransitioningRef.current) {
        const currentTime = timeRef.current % 3
        if (currentTime < 0.1) {
          isTransitioningRef.current = true
          
          let animationProgress = 0
          const centerIndex = Math.floor(images.length / 2)
          
          const animateTransition = () => {
            animationProgress += settings.moveSpeed
            
            // Smooth easing functions with better curves
            const easeInOut = (t: number) => {
              // Custom easing function for smoother motion
              return t < 0.5
                ? 4 * t * t * t
                : 1 - Math.pow(-2 * t + 2, 3) / 2
            }
            
            const easeProgress = easeInOut(animationProgress)
            const foldProgress = easeInOut(Math.min(1, animationProgress * 1.1))

            // Update all meshes positions
            imageMeshes.forEach((mesh, index) => {
              // Calculate the current and next position in the sequence
              const currentPosition = (index - activeIndexRef.current + images.length) % images.length
              const nextPosition = (currentPosition - 1 + images.length) % images.length
              
              // Get material for opacity changes
              const material = mesh.material as THREE.MeshBasicMaterial
              
              if (currentPosition === 0) {
                // Front card folds down and fades
                const foldRotation = Math.PI / 3 // Reduced rotation for smoother look
                mesh.rotation.x = settings.xRotation + foldRotation * foldProgress
                mesh.position.y = settings.yOffset - (1.5 * Math.pow(foldProgress, 2))
                mesh.position.z = -currentPosition * settings.spacing + (foldProgress * 0.5)
                material.opacity = Math.max(0, 1 - (foldProgress * 1.5))
                mesh.scale.setScalar(1 - (foldProgress * 0.2))
              } else if (currentPosition === images.length - 1) {
                // Back card emerges
                const foldRotation = Math.PI / 3
                mesh.rotation.x = settings.xRotation - foldRotation * (1 - foldProgress)
                mesh.position.y = settings.yOffset - (1.5 * Math.pow(1 - foldProgress, 2))
                mesh.position.z = -currentPosition * settings.spacing - ((1 - foldProgress) * 0.5)
                material.opacity = Math.min(1, foldProgress * 1.5)
                mesh.scale.setScalar(0.8 + (foldProgress * 0.2))
              } else if (currentPosition === centerIndex) {
                // Center image scales up with smooth acceleration
                const scaleEase = easeInOut(easeProgress)
                mesh.rotation.x = settings.xRotation
                mesh.position.y = settings.yOffset + (2 * scaleEase)
                mesh.position.z = -currentPosition * settings.spacing
                mesh.scale.setScalar(1 + (1.5 * scaleEase))
                material.opacity = 1
              } else {
                // Other cards slide with smooth acceleration
                const slideEase = easeInOut(easeProgress)
                const currentZ = -currentPosition * settings.spacing
                const nextZ = -nextPosition * settings.spacing
                mesh.position.z = currentZ * (1 - slideEase) + nextZ * slideEase
                mesh.rotation.x = settings.xRotation
                mesh.position.y = settings.yOffset
                mesh.scale.setScalar(1)
                material.opacity = 1
              }
            })
            
            if (animationProgress < 1) {
              requestAnimationFrame(animateTransition)
            } else {
              // Update active index and reset transition state
              activeIndexRef.current = (activeIndexRef.current + 1) % images.length
              isTransitioningRef.current = false
              
              // Set final positions with smooth settling
              imageMeshes.forEach((mesh, index) => {
                const position = (index - activeIndexRef.current + images.length) % images.length
                const material = mesh.material as THREE.MeshBasicMaterial
                
                mesh.position.z = -position * settings.spacing
                mesh.rotation.x = settings.xRotation
                
                if (position === centerIndex) {
                  mesh.position.y = settings.yOffset + 2
                  mesh.scale.setScalar(2.5)
                } else {
                  mesh.position.y = settings.yOffset
                  mesh.scale.setScalar(1)
                }
                material.opacity = 1
              })
            }
          }
          
          animateTransition()
        }
      }

      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }

    // Handle window resize
    const handleResize = () => {
      if (!sceneRef.current || !container) return
      const { camera, renderer } = sceneRef.current
      
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }

    window.addEventListener('resize', handleResize)
    animate()

    return () => {
      window.removeEventListener('resize', handleResize)
      
      // Cleanup
      scene.clear()
      renderer.dispose()
      imageMeshes.forEach(mesh => {
        mesh.geometry.dispose()
        const material = mesh.material as THREE.Material
        material.dispose()
      })
    }
  }, [images, settings])

  // Update scene when settings change
  useEffect(() => {
    if (!sceneRef.current) return
    const { camera, imageMeshes } = sceneRef.current
    
    // Update camera position
    camera.position.set(settings.cameraX, settings.cameraY, settings.cameraZ)
    camera.lookAt(0, 0, 0)

    // Update image positions, rotations, and brightness
    imageMeshes.forEach((mesh, index) => {
      const adjustedIndex = (index + activeIndexRef.current) % images.length
      mesh.position.z = -adjustedIndex * settings.spacing
      mesh.position.y = settings.yOffset
      mesh.rotation.x = settings.xRotation
      
      // Update brightness
      const material = mesh.material as THREE.MeshBasicMaterial
      material.color.setRGB(settings.brightness, settings.brightness, settings.brightness)
    })
  }, [settings, images.length])

  const handleSettingChange = (key: keyof ControlSettings, value: number) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className='w-full h-full'>
      <div 
        ref={containerRef} 
        className="w-full h-full rounded-lg"
      >
        <canvas
          ref={canvasRef}
          className="h-fit w-fit"
        />
        
        {/* Control Panel */}
        <div className="absolute top-4 left-4 bg-white/80 backdrop-blur p-4 rounded-lg shadow-lg space-y-4 w-64">
          <h3 className="font-medium text-sm">Settings</h3>
          <div className="space-y-2">
            {Object.entries(settings).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <div className="flex justify-between">
                  <label className="text-xs">{key}</label>
                  <span className="text-xs">{value.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min={key === 'brightness' ? 0 : key.includes('camera') ? -20 : -5}
                  max={key === 'brightness' ? 2 : key.includes('camera') ? 20 : 10}
                  step={key === 'brightness' ? 0.05 : 0.1}
                  value={value}
                  onChange={(e) => handleSettingChange(key as keyof ControlSettings, parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            ))}
          </div>
          
          {/* Copy Settings Button */}
          <button
            onClick={() => {
              const settingsString = JSON.stringify(settings, null, 2)
              navigator.clipboard.writeText(settingsString)
              alert('Settings copied to clipboard!')
            }}
            className="w-full bg-black text-white rounded px-3 py-1 text-sm"
          >
            Copy Settings
          </button>
        </div>
      </div>
    </div>
  )
}

export default StackGallery 