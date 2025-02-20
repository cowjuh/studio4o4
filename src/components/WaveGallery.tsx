import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'

interface WaveGalleryProps {
  images: string[]
}

interface ControlSettings {
  waveAmplitude: number
  waveFrequency: number
  waveSpeed: number
  spacing: number
  yOffset: number
  cameraX: number
  cameraY: number
  cameraZ: number
  brightness: number
  oceanicScale: number
}

// Custom shader for image distortion
const WaveShader = {
  uniforms: {
    'tDiffuse': { value: null },
    'time': { value: 0 },
    'distortionAmount': { value: 0.9 },
    'waveFrequency': { value: 0.0 },
    'mousePosition': { value: new THREE.Vector2(0, 0) }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float time;
    uniform float distortionAmount;
    uniform float waveFrequency;
    uniform vec2 mousePosition;
    varying vec2 vUv;

    void main() {
      vec2 uv = vUv;
      
      // Simple wave distortion
      float wave = sin(uv.y * waveFrequency + time * 0.5) * distortionAmount;
      uv.x += wave * 0.05;
      
      gl_FragColor = texture2D(tDiffuse, uv);
    }
  `
}

const WaveGallery = ({ images }: WaveGalleryProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef(new THREE.Vector2())
  const timeRef = useRef(0)

  // Control settings with defaults
  const [settings, setSettings] = useState<ControlSettings>({
    waveAmplitude: 1.4,
    waveFrequency: 6.2,
    waveSpeed: 0.1,
    spacing: 1.2,
    yOffset: 0,
    cameraX: 6.7,
    cameraY: 15.7,
    cameraZ: -6.3,
    brightness: 0.8,
    oceanicScale: 4.1
  })

  const sceneRef = useRef<{
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
    composer: EffectComposer
    imageMeshes: THREE.Mesh[]
    geometricMeshes: THREE.Mesh[]
    wavePass: ShaderPass
    grid: THREE.GridHelper
    boundary: THREE.Mesh
  }>()

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return

    // Setup
    const container = containerRef.current
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xffffff)
    
    const camera = new THREE.PerspectiveCamera(
      45, // Reduced FOV for better containment
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

    // Calculate visible bounds based on camera
    const vFOV = THREE.MathUtils.degToRad(45)
    const visibleHeight = 2 * Math.tan(vFOV / 2) * Math.abs(settings.cameraZ)
    const visibleWidth = visibleHeight * camera.aspect

    // Create a boundary for the ocean
    const boundaryGeometry = new THREE.PlaneGeometry(visibleWidth * 0.8, visibleHeight * 0.8)
    const boundaryMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      wireframe: true,
      transparent: true,
      opacity: 0.1
    })
    const boundary = new THREE.Mesh(boundaryGeometry, boundaryMaterial)
    boundary.rotation.x = -Math.PI / 2
    scene.add(boundary)

    // Create a larger grid for oceanic effect but contained within boundary
    const baseGridSize = Math.ceil(Math.sqrt(images.length))
    const expandedGridSize = baseGridSize * 2 // Reduced multiplier for containment
    const grid = new THREE.GridHelper(Math.min(visibleWidth * 0.7, expandedGridSize), 40, 0x808080, 0x808080)
    grid.material.transparent = true
    grid.material.opacity = 0.1
    scene.add(grid)

    // Post-processing setup
    const composer = new EffectComposer(renderer)
    const renderPass = new RenderPass(scene, camera)
    composer.addPass(renderPass)

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(container.clientWidth, container.clientHeight),
      0.4,
      0.4,
      0.85
    )
    composer.addPass(bloomPass)

    const wavePass = new ShaderPass(WaveShader)
    composer.addPass(wavePass)

    // Create meshes
    const imageMeshes: THREE.Mesh[] = []
    const geometricMeshes: THREE.Mesh[] = []
    const textureLoader = new THREE.TextureLoader()

    // Calculate contained dimensions
    const totalWidth = Math.min(visibleWidth * 0.7, expandedGridSize * settings.spacing)
    const startX = -(totalWidth / 2)
    const startZ = -(totalWidth / 2)

    // Create a function to generate random geometric shapes
    const createGeometricShape = (x: number, z: number) => {
      const size = 0.5 + Math.random() // Smaller shapes for better containment
      const geometry = new THREE.PlaneGeometry(size, size)
      const material = new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.1 + Math.random() * 0.2,
        wireframe: Math.random() > 0.7,
        side: THREE.DoubleSide
      })
      const mesh = new THREE.Mesh(geometry, material)
      
      // Constrain position within boundary
      mesh.position.set(
        THREE.MathUtils.clamp(x, startX, -startX),
        settings.yOffset,
        THREE.MathUtils.clamp(z, startZ, -startZ)
      )
      mesh.rotation.x = -Math.PI / 2
      return mesh
    }

    // Place images sparsely throughout the contained grid
    images.forEach((image) => {
      const texture = textureLoader.load(image)
      const geometry = new THREE.PlaneGeometry(2, 2) // Slightly smaller for containment
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
        color: new THREE.Color(settings.brightness, settings.brightness, settings.brightness)
      })
      const mesh = new THREE.Mesh(geometry, material)

      // Constrain image positions within boundary
      const x = startX + Math.random() * totalWidth
      const z = startZ + Math.random() * totalWidth
      mesh.position.set(x, settings.yOffset, z)
      mesh.rotation.x = -Math.PI / 2

      scene.add(mesh)
      imageMeshes.push(mesh)
    })

    // Fill the contained grid with geometric shapes
    const numShapes = expandedGridSize * expandedGridSize / 2 // Reduced density
    for (let i = 0; i < numShapes; i++) {
      const x = startX + Math.random() * totalWidth
      const z = startZ + Math.random() * totalWidth

      // Add 1-2 shapes at each position
      const numShapesAtPoint = Math.floor(Math.random() * 2) + 1
      for (let j = 0; j < numShapesAtPoint; j++) {
        const mesh = createGeometricShape(x, z)
        scene.add(mesh)
        geometricMeshes.push(mesh)
      }
    }

    sceneRef.current = { 
      scene, 
      camera, 
      renderer, 
      composer, 
      imageMeshes,
      geometricMeshes,
      wavePass,
      grid,
      boundary
    }

    // Mouse movement handler for contained parallax
    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1
      const y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1
      
      mouseRef.current.set(x, y)

      if (sceneRef.current) {
        const { camera } = sceneRef.current
        // Reduced parallax movement
        const targetX = x * 2
        const targetY = settings.cameraY + y
        camera.position.x += (targetX - camera.position.x) * 0.05
        camera.position.y += (targetY - camera.position.y) * 0.05
        camera.lookAt(0, 0, 0)
      }
    }

    // Animation
    const animate = () => {
      if (!sceneRef.current) return
      const { composer, imageMeshes, geometricMeshes, wavePass, grid, boundary } = sceneRef.current

      timeRef.current += 0.01 * settings.waveSpeed

      // Update wave distortion
      wavePass.uniforms.time.value = timeRef.current
      wavePass.uniforms.distortionAmount.value = 0.2 + Math.sin(timeRef.current * 0.3) * 0.05
      wavePass.uniforms.mousePosition.value = mouseRef.current

      // Create contained wave motion
      const createWave = (x: number, z: number, time: number) => {
        const frequency = settings.waveFrequency
        const scale = settings.oceanicScale
        
        // Calculate distance from center for amplitude falloff
        const distanceFromCenter = Math.sqrt(x * x + z * z)
        const maxDistance = totalWidth / 2
        const falloff = Math.max(0, 1 - (distanceFromCenter / maxDistance))
        
        // Combine multiple sine waves with containment
        const wave1 = Math.sin(x * frequency + time) * Math.cos(z * frequency + time)
        const wave2 = Math.sin((x + z) * frequency * 0.5 + time * 1.2)
        const wave3 = Math.cos(x * frequency * 0.8 - z * frequency * 0.3 + time * 0.7)
        
        return (wave1 + wave2 + wave3) * settings.waveAmplitude * scale * falloff
      }

      // Animate all meshes with contained motion
      const allMeshes = [...imageMeshes, ...geometricMeshes]
      allMeshes.forEach((mesh) => {
        const { x, z } = mesh.position
        const wave = createWave(x * 0.1, z * 0.1, timeRef.current)
        
        // Constrain vertical movement
        mesh.position.y = THREE.MathUtils.clamp(
          settings.yOffset + wave,
          settings.yOffset - settings.waveAmplitude,
          settings.yOffset + settings.waveAmplitude
        )
        
        // Constrained rotation
        mesh.rotation.x = -Math.PI / 2 + THREE.MathUtils.clamp(wave * 0.1, -0.3, 0.3)
        mesh.rotation.z = THREE.MathUtils.clamp(wave * 0.05, -0.2, 0.2)
      })

      // Animate grid and boundary with subtle motion
      grid.position.y = Math.sin(timeRef.current * 0.2) * 0.2
      boundary.position.y = Math.sin(timeRef.current * 0.15) * 0.1

      composer.render()
      requestAnimationFrame(animate)
    }

    // Handle window resize
    const handleResize = () => {
      if (!sceneRef.current || !container) return
      const { camera, renderer, composer } = sceneRef.current
      
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      
      renderer.setSize(container.clientWidth, container.clientHeight)
      composer.setSize(container.clientWidth, container.clientHeight)
    }

    container.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('resize', handleResize)
    animate()

    return () => {
      container.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      
      // Cleanup
      scene.clear()
      renderer.dispose()
      composer.dispose()
      const allMeshes = [...imageMeshes, ...geometricMeshes]
      allMeshes.forEach(mesh => {
        mesh.geometry.dispose()
        const material = mesh.material as THREE.Material
        material.dispose()
      })
    }
  }, [images, settings])

  // Update scene when settings change
  useEffect(() => {
    if (!sceneRef.current) return
    const { camera } = sceneRef.current
    
    camera.position.set(settings.cameraX, settings.cameraY, settings.cameraZ)
    camera.lookAt(0, 0, 0)
  }, [settings])

  const handleSettingChange = (key: keyof ControlSettings, value: number) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className='w-full h-full'>
      <div 
        ref={containerRef} 
        className="relative w-full h-full rounded-lg"
      >
        <canvas
          ref={canvasRef}
          className="h-fit w-fit"
        />
        
        {/* Control Panel */}
        <div className="absolute top-4 left-4 bg-white/80 backdrop-blur p-4 rounded-lg shadow-lg space-y-4 w-64">
          <h3 className="font-medium text-sm">Ocean Wave Settings</h3>
          <div className="space-y-2">
            {Object.entries(settings).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <div className="flex justify-between">
                  <label className="text-xs">{key}</label>
                  <span className="text-xs">{value.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min={key.includes('camera') ? -20 : 0}
                  max={key.includes('camera') ? 40 : key === 'brightness' ? 2 : key === 'oceanicScale' ? 5 : 10}
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

export default WaveGallery 