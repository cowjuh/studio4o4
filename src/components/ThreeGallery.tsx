import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface ThreeGalleryProps {
  images: string[]
}

const ThreeGallery = ({ images }: ThreeGalleryProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const dragRef = useRef({ 
    isDragging: false, 
    previousX: 0, 
    previousY: 0,
    sphereRotation: { x: 0, y: 0 },
    lastInteractionTime: 0
  })
  const sceneRef = useRef<{
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
    imageMeshes: THREE.Mesh[]
    sphere: THREE.LineSegments
    sphereGroup: THREE.Group
  }>()

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return

    // Setup
    const container = containerRef.current
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      45, // Reduced FOV for less perspective distortion
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    )
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    })

    renderer.setSize(container.clientWidth, container.clientHeight)
    camera.position.z = 12 // Moved camera further back to see more space around the sphere

    // Create a group to hold the sphere and images
    const sphereGroup = new THREE.Group()
    scene.add(sphereGroup)

    // Create dotted sphere grid
    const radius = 3
    const sphereGeometry = new THREE.SphereGeometry(radius, 32, 32)
    const edges = new THREE.EdgesGeometry(sphereGeometry)
    const material = new THREE.LineBasicMaterial({ 
      color: 0x808080,
      transparent: true,
      opacity: 0.1,
      linewidth: 1
    })
    const sphere = new THREE.LineSegments(edges, material)
    sphereGroup.add(sphere)

    // Create image planes
    const imageMeshes: THREE.Mesh[] = []
    const textureLoader = new THREE.TextureLoader()
    const imageSize = 1.8 // Increased from 1.2 for larger images

    // Calculate points on sphere using spherical fibonacci distribution
    const getPointOnSphere = (index: number, total: number) => {
      const phi = Math.acos(1 - 2 * (index + 0.5) / total)
      const theta = Math.PI * (1 + Math.sqrt(5)) * (index + 0.5)
      return {
        x: radius * Math.cos(theta) * Math.sin(phi),
        y: radius * Math.sin(theta) * Math.sin(phi),
        z: radius * Math.cos(phi)
      }
    }

    // Create and position image planes
    images.forEach((image, index) => {
      const texture = textureLoader.load(image)
      const geometry = new THREE.PlaneGeometry(imageSize, imageSize)
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
      })
      const mesh = new THREE.Mesh(geometry, material)

      // Position using spherical fibonacci distribution
      const point = getPointOnSphere(index, images.length)
      mesh.position.set(point.x, point.y, point.z)

      sphereGroup.add(mesh)
      imageMeshes.push(mesh)
    })

    sceneRef.current = { scene, camera, renderer, imageMeshes, sphere, sphereGroup }

    // Mouse handlers for dragging
    const handleMouseDown = (event: MouseEvent) => {
      dragRef.current.isDragging = true
      dragRef.current.previousX = event.clientX
      dragRef.current.previousY = event.clientY
    }

    const handleMouseUp = () => {
      if (dragRef.current.isDragging) {
        dragRef.current.isDragging = false
        dragRef.current.lastInteractionTime = Date.now()
      }
    }

    const handleMouseLeave = () => {
      dragRef.current.isDragging = false
    }

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      mouseRef.current = {
        x: ((event.clientX - rect.left) / container.clientWidth) * 2 - 1,
        y: -((event.clientY - rect.top) / container.clientHeight) * 2 + 1,
      }

      if (dragRef.current.isDragging && sceneRef.current) {
        const deltaX = event.clientX - dragRef.current.previousX
        const deltaY = event.clientY - dragRef.current.previousY

        dragRef.current.sphereRotation.y += deltaX * 0.01
        dragRef.current.sphereRotation.x += deltaY * 0.01

        // Limit vertical rotation to avoid flipping
        dragRef.current.sphereRotation.x = Math.max(
          -Math.PI / 2,
          Math.min(Math.PI / 2, dragRef.current.sphereRotation.x)
        )

        dragRef.current.previousX = event.clientX
        dragRef.current.previousY = event.clientY
      }
    }

    // Resize handler
    const handleResize = () => {
      if (!sceneRef.current || !container) return
      const { camera, renderer } = sceneRef.current
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }

    // Animation
    const animate = () => {
      if (!sceneRef.current) return
      const { scene, camera, renderer, sphereGroup, imageMeshes } = sceneRef.current

      const currentTime = Date.now()
      const timeSinceLastInteraction = currentTime - dragRef.current.lastInteractionTime
      const isInactive = timeSinceLastInteraction > 1000 // 1 second after last interaction

      // Apply ambient rotation when not dragging and either never interacted or enough time has passed
      if (!dragRef.current.isDragging && (dragRef.current.lastInteractionTime === 0 || isInactive)) {
        dragRef.current.sphereRotation.y += 0.002 // Gentle constant spin
      }

      // Update sphere group rotation based on drag
      sphereGroup.rotation.y = dragRef.current.sphereRotation.y
      sphereGroup.rotation.x = dragRef.current.sphereRotation.x

      // Gentle camera movement based on mouse when not dragging
      if (!dragRef.current.isDragging) {
        const targetX = mouseRef.current.x * 0.5 // Reduced camera movement
        const targetY = mouseRef.current.y * 0.5
        camera.position.x += (targetX - camera.position.x) * 0.05
        camera.position.y += (targetY - camera.position.y) * 0.05
      }
      camera.lookAt(0, 0, 0)

      // Make images always face forward and scale based on position
      imageMeshes.forEach(mesh => {
        // Reset rotation
        mesh.rotation.set(0, 0, 0)
        // Counter-rotate to cancel out sphere rotation
        mesh.rotateY(-sphereGroup.rotation.y)
        mesh.rotateX(-sphereGroup.rotation.x)

        // Calculate distance from center of view
        const meshWorldPos = mesh.getWorldPosition(new THREE.Vector3())
        const distanceFromCenter = meshWorldPos.length()
        
        // Scale images based on their position
        const baseScale = 1
        const scaleMultiplier = Math.max(0.6, 1 - (distanceFromCenter * 0.1))
        mesh.scale.set(baseScale * scaleMultiplier, baseScale * scaleMultiplier, 1)
      })

      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }

    container.addEventListener('mousedown', handleMouseDown)
    container.addEventListener('mouseup', handleMouseUp)
    container.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('resize', handleResize)
    animate()

    return () => {
      container.removeEventListener('mousedown', handleMouseDown)
      container.removeEventListener('mouseup', handleMouseUp)
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('resize', handleResize)
      
      // Cleanup
      scene.clear()
      renderer.dispose()
      imageMeshes.forEach(mesh => {
        mesh.geometry.dispose()
        const material = mesh.material as THREE.ShaderMaterial
        if ('uniforms' in material) {
          material.uniforms.map.value.dispose()
        }
        material.dispose()
      })
      sphere.geometry.dispose()
      ;(sphere.material as THREE.LineBasicMaterial).dispose()
    }
  }, [images])

  return (
    <div 
      ref={containerRef} 
      className="relative min-h-[40vh] rounded-lg cursor-move"
    >
      <canvas
        ref={canvasRef}
        className="h-full"
      />
    </div>
  )
}

export default ThreeGallery 