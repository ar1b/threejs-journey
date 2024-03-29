import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

THREE.ColorManagement.enabled = false

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const particleTexture = textureLoader.load('/textures/particles/1.png')

//Particles geometry and material
const particleGeo = new THREE.BufferGeometry()

const count = 5000
const positions = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)

for(let i=0; i<count *3; i++){
    positions[i] = (Math.random() - 0.5) * 10
    colors[i] = Math.random()
}
particleGeo.setAttribute(
    'position',
    new  THREE.BufferAttribute(positions, 3)
)
particleGeo.setAttribute(
    'color',
    new THREE.BufferAttribute(colors, 3)
)

const particleMat = new THREE.PointsMaterial({
    size: 0.02,
    //size attenuation adjusts particle sizes based on camera distance
    sizeAttenuation: true,
    map: particleTexture,
    transparent: true,
    alphaMap: particleTexture,
    //alphaTest: 0.001
    //depthTest: false
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true
})

//creating the particles
const particles = new THREE.Points(particleGeo, particleMat)
scene.add(particles)





/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    //Updating particlers
    particles.rotation.y = elapsedTime * 0.2

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()