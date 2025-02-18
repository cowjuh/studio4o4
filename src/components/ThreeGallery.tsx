import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface ThreeGalleryProps {
  images: string[]
}

const ThreeGallery = ({ images }: ThreeGalleryProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef(new THREE.Vector2())
  const coordinatesRef = useRef<HTMLDivElement>(null)
  const selectedMeshIndexRef = useRef<number>(0);
  const borderRef = useRef<THREE.LineSegments | null>(null);
  const timeRef = useRef<number>(0);
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
    raycaster: THREE.Raycaster
  }>()

  // Separate effect for image selection
  useEffect(() => {
    const updateSelectedImage = () => {
      selectedMeshIndexRef.current = (selectedMeshIndexRef.current + 1) % images.length;
    };

    const intervalId = setInterval(updateSelectedImage, 3000);
    return () => clearInterval(intervalId);
  }, [images.length]);

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
    const raycaster = new THREE.Raycaster()

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
    const baseSizes = [0.8, 1.0, 1.1, 1.2, 1.4] // More varied sizes, biased towards smaller
    const defaultMaterial = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      transparent: true,
    });

    // Create border for highlighting
    const maxImageSize = Math.max(...baseSizes)
    const borderGeometry = new THREE.EdgesGeometry(new THREE.PlaneGeometry(maxImageSize + 0.1, maxImageSize + 0.1));
    const borderMaterial = new THREE.LineBasicMaterial({ 
      color: 0xff0000,
      linewidth: 2,
    });
    const border = new THREE.LineSegments(borderGeometry, borderMaterial);
    border.visible = false;
    sphereGroup.add(border);
    borderRef.current = border;

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
      // Randomly select a size with bias towards smaller sizes
      const sizeIndex = Math.floor(Math.pow(Math.random(), 1.5) * baseSizes.length)
      const imageSize = baseSizes[sizeIndex]
      const geometry = new THREE.PlaneGeometry(imageSize, imageSize)
      const material = defaultMaterial.clone()
      material.map = texture
      const mesh = new THREE.Mesh(geometry, material)

      const point = getPointOnSphere(index, images.length)
      mesh.position.set(point.x, point.y, point.z)

      // Store the initial world position
      mesh.userData.initialPosition = new THREE.Vector3(point.x, point.y, point.z)
      mesh.userData.baseSize = imageSize // Store base size for scaling

      sphereGroup.add(mesh)
      imageMeshes.push(mesh)
    })

    sceneRef.current = { scene, camera, renderer, imageMeshes, sphere, sphereGroup, raycaster }

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
      const x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1
      const y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1
      
      mouseRef.current.set(x, y)

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
      if (!sceneRef.current || !borderRef.current || !coordinatesRef.current) return
      const { scene, camera, renderer, sphereGroup, imageMeshes, raycaster } = sceneRef.current

      const currentTime = Date.now()
      const timeSinceLastInteraction = currentTime - dragRef.current.lastInteractionTime
      const isInactive = timeSinceLastInteraction > 1000 // 1 second after last interaction

      // Apply ambient rotation when not dragging and either never interacted or enough time has passed
      if (!dragRef.current.isDragging && (dragRef.current.lastInteractionTime === 0 || isInactive)) {
        timeRef.current += 0.005; // Slower time increment for more gradual changes
        
        // Create a varying diagonal rotation by combining different frequencies
        const baseRotation = 0.001; // Slower base rotation speed
        const variationAmplitude = 0.0005; // Smaller amplitude for subtle variation
        
        // Primary diagonal rotation
        dragRef.current.sphereRotation.y += baseRotation;
        dragRef.current.sphereRotation.x += baseRotation * 0.7; // Slightly less on X for diagonal effect
        
        // Add subtle variations to the rotation axes
        dragRef.current.sphereRotation.y += Math.sin(timeRef.current * 0.3) * variationAmplitude;
        dragRef.current.sphereRotation.x += Math.cos(timeRef.current * 0.2) * variationAmplitude;
      }

      // Update sphere group rotation based on drag
      sphereGroup.rotation.y = dragRef.current.sphereRotation.y
      sphereGroup.rotation.x = dragRef.current.sphereRotation.x

      // Update coordinates in animation loop
      raycaster.setFromCamera(mouseRef.current, camera)
      const intersects = raycaster.intersectObjects(imageMeshes)
      
      let worldPos: THREE.Vector3;
      const isHovered = intersects.length > 0;
      
      if (isHovered) {
        worldPos = intersects[0].object.getWorldPosition(new THREE.Vector3())
      } else {
        const selectedMesh = imageMeshes[selectedMeshIndexRef.current]
        worldPos = selectedMesh.getWorldPosition(new THREE.Vector3())
      }

      const screenPos = worldPos.clone().project(camera)
      const screenX = (screenPos.x * 0.5 + 0.5) * container.clientWidth
      const screenY = (-screenPos.y * 0.5 + 0.5) * container.clientHeight

      // Update coordinates display directly
      coordinatesRef.current.style.left = `${screenX}px`
      coordinatesRef.current.style.top = `${screenY + 50}px`
      coordinatesRef.current.textContent = `x: ${Math.round(worldPos.x * 100) / 100}, y: ${Math.round(worldPos.y * 100) / 100}, z: ${Math.round(worldPos.z * 100) / 100}`

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
        
        // Scale images based on their position and base size
        const baseScale = mesh.userData.baseSize
        const scaleMultiplier = Math.max(0.6, 1 - (distanceFromCenter * 0.1))
        mesh.scale.set(baseScale * scaleMultiplier, baseScale * scaleMultiplier, 1)

        // Update border scale if this is the selected mesh
        if (borderRef.current && mesh === imageMeshes[selectedMeshIndexRef.current]) {
          borderRef.current.position.copy(mesh.position)
          borderRef.current.rotation.copy(mesh.rotation)
          const borderScale = baseScale * scaleMultiplier
          borderRef.current.scale.set(borderScale, borderScale, 1)
          borderRef.current.visible = true
        }
      })

      // Update image materials
      if (sceneRef.current) {
        sceneRef.current.imageMeshes.forEach((mesh, index) => {
          const material = mesh.material as THREE.MeshBasicMaterial;
          if (index === selectedMeshIndexRef.current) {
            material.color.setHex(0xffffff); // Full brightness for selected
          } else {
            material.color.setHex(0xcccccc); // Slightly dimmed for others
          }
        });
      }

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
      if (borderRef.current) {
        borderRef.current.geometry.dispose();
        (borderRef.current.material as THREE.LineBasicMaterial).dispose();
      }
    }
  }, [images])

  return (
    <div className='w-full h-full'>
      <div 
        ref={containerRef} 
        className="relative w-full h-full rounded-lg cursor-move"
      >
        <canvas
          ref={canvasRef}
          className="h-fit w-fit"
        />
        <div 
          ref={coordinatesRef}
          className="absolute pointer-events-none font-mono text-sm text-red-500"
          style={{ 
            transform: 'translate(-50%, 0)',
          }}
        />
      </div>
    </div>
  )
}

export default ThreeGallery 