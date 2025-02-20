import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

interface BirdsEyeWaveProps {
  images: string[]
}

interface CameraPosition {
  x: number
  y: number
  z: number
}

// Shape equations for morphing
const shapeEquations = [
  {
    name: 'Twist',
    transform: (angle: number, height: number, time: number, camera: { position: THREE.Vector3, direction: THREE.Vector3 }) => {
      // Use both camera position and direction for more accurate shape influence
      const cameraAngle = Math.atan2(camera.direction.z, camera.direction.x)
      const cameraHeight = camera.position.y
      const cameraDistance = Math.sqrt(camera.position.x * camera.position.x + camera.position.z * camera.position.z)
      
      // Normalize camera values to useful ranges
      const normalizedHeight = (cameraHeight / 40)
      const normalizedDistance = (cameraDistance / 60)
      
      // Make parameters more responsive to camera
      const pulseAmount = 0.3 + Math.sin(time * 0.1) * 0.2 * normalizedDistance
      const heightScale = 4 + Math.sin(time * 0.15) * 2 * normalizedHeight
      const angleOffset = cameraAngle * 2 // Double the influence of camera angle
      
      // Add more variation based on camera position
      const twistFrequency = 2 + normalizedHeight * 3 // Varies between 2 and 5
      const heightPhase = normalizedDistance * Math.PI // Varies between 0 and π
      
      const r = 1 + pulseAmount * Math.sin(twistFrequency * angle + height/3 + time * 0.1 + angleOffset)
      const heightMod = Math.cos(angle + time * 0.05 + heightPhase) * heightScale

      return {
        r,
        heightMod,
        params: {
          pulseAmount: pulseAmount.toFixed(3),
          heightScale: heightScale.toFixed(3),
          angleOffset: angleOffset.toFixed(3),
          r: r.toFixed(3),
          lookX: camera.direction.x.toFixed(3),
          lookY: camera.direction.y.toFixed(3),
          lookZ: camera.direction.z.toFixed(3)
        }
      }
    }
  }
]

// Improved noise function for flowing effect
const noise = (x: number, y: number, z: number): number => {
  const p = new THREE.Vector3(x, y, z)
  return (Math.sin(p.x * 1.5 + p.z * 0.5) * Math.cos(p.y * 1.2)) * 0.5 +
         (Math.sin(p.x * 2.5 + p.y * 1.5) * Math.sin(p.z * 1.8)) * 0.3 +
         (Math.cos(p.x * 3.0 + p.z * 2.0) * Math.sin(p.y * 2.5)) * 0.2
}

const BirdsEyeWave = ({ images }: BirdsEyeWaveProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const timeRef = useRef(0)
  const frameRef = useRef<number>()
  
  // Use refs for animation values instead of state
  const morphRef = useRef({
    currentShape: 0,
    nextShape: 1,
    progress: 0,
    lastTransition: 0,
    initialized: false
  })

  // Keep camera position as state since it's just for display
  const [cameraPos, setCameraPos] = useState<CameraPosition>({
    x: 0,
    y: 0,
    z: 60
  })

  const sceneRef = useRef<{
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
    particles: THREE.Mesh[]
    boundary: THREE.Mesh
    axesHelper: THREE.Group
  }>()

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return

    // Setup
    const container = containerRef.current
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xffffff)
    
    // Camera positioned for tunnel view
    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    )
    camera.position.set(10, 10, 10) // Even closer initial position
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      powerPreference: "high-performance"
    })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // Set up custom rotation
    const rotationCenter = new THREE.Vector3(0, 0, 0)
    const rotationAxis1 = new THREE.Vector3(1, 1, 0).normalize()
    const rotationAxis2 = new THREE.Vector3(0, 1, 1).normalize()
    let rotationAngle1 = 0
    let rotationAngle2 = 0

    // Create axes helper
    const axesHelper = new THREE.Group()
    
    // Create X axis (red)
    const xGeometry = new THREE.BufferGeometry()
    xGeometry.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array([0, 0, 0, 20, 0, 0]), 3))
    const xLine = new THREE.Line(xGeometry, new THREE.LineBasicMaterial({ color: 0xff0000 }))
    const xLabel = new THREE.Sprite(new THREE.SpriteMaterial({ 
      map: createTextTexture('X'),
      color: 0xff0000
    }))
    xLabel.position.set(22, 0, 0)
    xLabel.scale.set(2, 2, 2)
    
    // Create Y axis (green)
    const yGeometry = new THREE.BufferGeometry()
    yGeometry.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array([0, 0, 0, 0, 20, 0]), 3))
    const yLine = new THREE.Line(yGeometry, new THREE.LineBasicMaterial({ color: 0x00ff00 }))
    const yLabel = new THREE.Sprite(new THREE.SpriteMaterial({ 
      map: createTextTexture('Y'),
      color: 0x00ff00
    }))
    yLabel.position.set(0, 22, 0)
    yLabel.scale.set(2, 2, 2)
    
    // Create Z axis (blue)
    const zGeometry = new THREE.BufferGeometry()
    zGeometry.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array([0, 0, 0, 0, 0, 20]), 3))
    const zLine = new THREE.Line(zGeometry, new THREE.LineBasicMaterial({ color: 0x0000ff }))
    const zLabel = new THREE.Sprite(new THREE.SpriteMaterial({ 
      map: createTextTexture('Z'),
      color: 0x0000ff
    }))
    zLabel.position.set(0, 0, 22)
    zLabel.scale.set(2, 2, 2)

    axesHelper.add(xLine, xLabel, yLine, yLabel, zLine, zLabel)
    scene.add(axesHelper)

    // Create tunnel boundary with more segments for smoother morphing
    const radius = 20
    const tubeLength = 60
    const radialSegments = 32 // Increased for smoother morphing
    const tubularSegments = 32 // Increased for smoother morphing
    
    const boundaryGeometry = new THREE.CylinderGeometry(
      radius,
      radius * 1.2,
      tubeLength,
      radialSegments,
      tubularSegments,
      true
    )

    // Store original positions for morphing
    const originalPositions = new Float32Array(boundaryGeometry.attributes.position.array)
    
    const boundaryMaterial = new THREE.MeshBasicMaterial({
      color: 0xcccccc, // Much lighter gray
      wireframe: true,
      transparent: true,
      opacity: 0.15 // More transparent
    })
    const boundary = new THREE.Mesh(boundaryGeometry, boundaryMaterial)
    boundary.rotation.x = Math.PI / 2
    scene.add(boundary)

    // Create particles using images
    const particles: THREE.Mesh[] = []
    const textureLoader = new THREE.TextureLoader()
    const baseParticleSize = 1.5
    const numParticles = 200 // More particles for tube coverage

    // Precompute values with tube distribution
    const precomputedAngles = new Array(numParticles).fill(0).map((_, i) => {
      // Distribute along tube
      const angle = (Math.PI * 2 * i) / numParticles
      const heightFraction = (i % tubularSegments) / tubularSegments
      const heightOffset = (Math.random() - 0.5) * 0.1
      
      // Add some randomness to distribution
      const radiusVariation = 1 + (Math.random() - 0.5) * 0.2
      const angleVariation = (Math.random() - 0.5) * 0.2
      
      const finalAngle = angle + angleVariation
      const finalHeight = (heightFraction + heightOffset) * tubeLength - tubeLength / 2

      return {
        angle: finalAngle,
        height: finalHeight,
        radius: radius * radiusVariation,
        frequency: 0.3 + Math.random() * 0.4,
        phase: Math.random() * Math.PI * 2,
        amplitude: 0.5 + Math.random() * 0.3,
        turbulence: 0.3 + Math.random() * 0.4,
        rotationSpeed: (Math.random() - 0.5) * 0.02
      }
    })

    // Create particles with varying sizes
    const textures = images.map(image => textureLoader.load(image))
    
    for (let i = 0; i < numParticles; i++) {
      const texture = textures[i % textures.length]
      const particleSize = baseParticleSize * (0.8 + Math.random() * 0.4)
      const geometry = new THREE.PlaneGeometry(particleSize, particleSize)
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
        opacity: 0.8 + Math.random() * 0.2
      })
      const particle = new THREE.Mesh(geometry, material)

      const { angle, height, radius } = precomputedAngles[i]
      particle.position.set(
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius
      )

      particle.lookAt(0, height, 0)
      particle.rotateY(Math.PI / 2)

      scene.add(particle)
      particles.push(particle)
    }

    sceneRef.current = { 
      scene, 
      camera, 
      renderer, 
      particles,
      boundary,
      axesHelper
    }

    // Initialize morph ref
    morphRef.current = {
      currentShape: 0,
      nextShape: 1,
      progress: 0,
      lastTransition: 0,
      initialized: true
    }

    // Remove the interval and handle transitions in the animation loop
    const animate = () => {
      if (!sceneRef.current) return
      const { renderer, scene, camera, particles, boundary } = sceneRef.current

      // Update rotation angles
      rotationAngle1 += 0.002
      rotationAngle2 += 0.003

      // Create composite rotation
      const rotationMatrix = new THREE.Matrix4()
      const tempMatrix = new THREE.Matrix4()
      
      // Apply first rotation
      rotationMatrix.makeRotationAxis(rotationAxis1, rotationAngle1)
      
      // Apply second rotation
      tempMatrix.makeRotationAxis(rotationAxis2, rotationAngle2)
      rotationMatrix.multiply(tempMatrix)

      // Calculate zoom level that shifts between 12 and 15
      const time = timeRef.current
      const zoomBase = 13.5 // Base zoom level
      const zoomVariation = 1.5 // Amount to zoom in/out
      const zoomLevel = zoomBase + Math.sin(time * 0.1) * zoomVariation // Slow zoom cycle

      // Apply rotation to camera position with dynamic radius
      const basePosition = new THREE.Vector3(zoomLevel, zoomLevel, zoomLevel)
      camera.position.copy(basePosition)
      camera.position.applyMatrix4(rotationMatrix)
      camera.lookAt(rotationCenter)

      // Update camera position display
      setCameraPos({
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z
      })

      // Get camera direction for shape transformation
      const direction = new THREE.Vector3(0, 0, 1)
      direction.applyQuaternion(camera.quaternion)

      timeRef.current += 0.003

      // Handle shape transitions
      const currentShape = shapeEquations[0]

      // Add scale animation with limited range
      const scaleAnimation = 1.2 + Math.sin(time * 0.2) * 0.05
      boundary.scale.set(scaleAnimation, scaleAnimation, scaleAnimation)

      // Update boundary geometry for continuous morphing
      const positions = boundary.geometry.attributes.position.array
      const vertexCount = positions.length / 3

      for (let i = 0; i < vertexCount; i++) {
        const x = originalPositions[i * 3]
        const y = originalPositions[i * 3 + 1]
        const z = originalPositions[i * 3 + 2]

        // Calculate angle and height for this vertex
        const angle = Math.atan2(z, x)
        const height = y - tubeLength / 2

        // Get continuous transformation
        const cameraData = {
          position: new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z),
          direction: direction
        }
        const transform = currentShape.transform(angle, height, time, cameraData)

        // Apply transformed position
        const morphedRadius = radius * transform.r
        const morphedHeight = height + transform.heightMod

        // Apply morphed position with smooth interpolation
        const r = Math.sqrt(x * x + z * z)
        const scale = morphedRadius / (r || 1)

        positions[i * 3] = x * scale
        positions[i * 3 + 1] = morphedHeight + tubeLength / 2
        positions[i * 3 + 2] = z * scale
      }

      boundary.geometry.attributes.position.needsUpdate = true

      // Update particles with flowing motion
      particles.forEach((particle, i) => {
        const {
          angle, height, radius, frequency, phase,
          amplitude, turbulence, rotationSpeed
        } = precomputedAngles[i]

        // Calculate flow movement with smoother transitions
        const flowSpeed = time * frequency * 0.3 // Even slower
        const heightOffset = Math.sin(flowSpeed + phase) * amplitude * 0.7 // Reduced amplitude
        
        // Create spiral motion
        const spiralAngle = angle + time * rotationSpeed * 0.5 // Slower rotation

        // Get continuous transformation
        const cameraData = {
          position: new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z),
          direction: direction
        }
        const transform = currentShape.transform(spiralAngle, height, time, cameraData)

        // Calculate position with reduced extremes
        const morphedRadius = radius * transform.r
        const morphedHeight = height + transform.heightMod * 0.7 // Reduced height modification

        // Add gentler turbulence
        const radiusOffset = Math.cos(flowSpeed * 2 + phase) * turbulence * 0.5 // Reduced turbulence

        // Calculate noise for organic movement with reduced impact
        const noiseValue = noise(
          Math.cos(spiralAngle) * (morphedRadius + radiusOffset),
          morphedHeight + heightOffset,
          Math.sin(spiralAngle) * (morphedRadius + radiusOffset)
        ) * 0.5 // Reduced noise impact

        // Update particle position with smoother transitions
        particle.position.set(
          Math.cos(spiralAngle) * (morphedRadius + radiusOffset + noiseValue),
          morphedHeight + heightOffset,
          Math.sin(spiralAngle) * (morphedRadius + radiusOffset + noiseValue)
        )

        // Orient particle with gentler rotation
        particle.lookAt(0, morphedHeight + heightOffset, 0)
        particle.rotateY(Math.PI / 2 + noiseValue * 0.1) // Reduced rotation impact
        particle.rotateZ(Math.sin(flowSpeed) * 0.05) // Reduced rotation impact
      })

      renderer.render(scene, camera)
      frameRef.current = requestAnimationFrame(animate)
    }

    // Handle window resize
    const handleResize = () => {
      if (!sceneRef.current || !container) return
      const { camera, renderer } = sceneRef.current
      
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      
      renderer.setSize(container.clientWidth, container.clientHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }

    window.addEventListener('resize', handleResize)
    frameRef.current = requestAnimationFrame(animate)

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
      window.removeEventListener('resize', handleResize)
      
      // Cleanup
      scene.clear()
      renderer.dispose()
      particles.forEach(particle => {
        particle.geometry.dispose()
        const material = particle.material as THREE.Material
        material.dispose()
      })
    }
  }, [images])

  // Helper function to create text textures for axis labels
  const createTextTexture = (text: string): THREE.Texture => {
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const ctx = canvas.getContext('2d')
    if (!ctx) return new THREE.Texture()

    ctx.fillStyle = 'white'
    ctx.font = '48px monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, 32, 32)

    const texture = new THREE.Texture(canvas)
    texture.needsUpdate = true
    return texture
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
        
        {/* Camera coordinates - top right */}
        <div className="absolute top-2 right-2 font-mono text-xs text-[#ff0000] tracking-tight tabular-nums p-2">
          x: {cameraPos.x.toFixed(1)}
          <br />
          y: {cameraPos.y.toFixed(1)}
          <br />
          z: {cameraPos.z.toFixed(1)}
        </div>

        {/* Shape parameters - bottom left */}
        <div className="absolute bottom-2 left-2 font-mono text-xs text-[#0066ff] p-2">
          <div className="space-y-0.5">
            <div>p: {shapeEquations[0].transform(0, 0, timeRef.current, {
              position: new THREE.Vector3(cameraPos.x, cameraPos.y, cameraPos.z),
              direction: new THREE.Vector3(0, 0, 1).applyQuaternion(sceneRef.current?.camera.quaternion || new THREE.Quaternion())
            }).params.pulseAmount}</div>
            <div>h: {shapeEquations[0].transform(0, 0, timeRef.current, {
              position: new THREE.Vector3(cameraPos.x, cameraPos.y, cameraPos.z),
              direction: new THREE.Vector3(0, 0, 1).applyQuaternion(sceneRef.current?.camera.quaternion || new THREE.Quaternion())
            }).params.heightScale}</div>
            <div>a: {shapeEquations[0].transform(0, 0, timeRef.current, {
              position: new THREE.Vector3(cameraPos.x, cameraPos.y, cameraPos.z),
              direction: new THREE.Vector3(0, 0, 1).applyQuaternion(sceneRef.current?.camera.quaternion || new THREE.Quaternion())
            }).params.angleOffset}</div>
            <div>r: {shapeEquations[0].transform(0, 0, timeRef.current, {
              position: new THREE.Vector3(cameraPos.x, cameraPos.y, cameraPos.z),
              direction: new THREE.Vector3(0, 0, 1).applyQuaternion(sceneRef.current?.camera.quaternion || new THREE.Quaternion())
            }).params.r}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BirdsEyeWave 