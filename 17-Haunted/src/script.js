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
const fog = new THREE.Fog('#262837', 1, 15)
scene.fog = fog

const textureLoader = new THREE.TextureLoader()

const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

const bricksColor = textureLoader.load('/textures/bricks/color.jpg')
const bricksAO = textureLoader.load('/textures/bricks/ambientOcclusion.jpg')
const bricksNormal = textureLoader.load('/textures/bricks/normal.jpg')
const bricksRoughness = textureLoader.load('/textures/bricks/roughness.jpg')

const grassColor = textureLoader.load('/textures/grass/color.jpg')
const grassAO = textureLoader.load('/textures/grass/ambientOcclusion.jpg')
const grassNormal = textureLoader.load('/textures/grass/normal.jpg')
const grassRoughness = textureLoader.load('/textures/grass/roughness.jpg')

grassColor.repeat.set(8, 8)
grassAO.repeat.set(8, 8)
grassNormal.repeat.set(8, 8)
grassRoughness.repeat.set(8, 8)

grassColor.wrapS = THREE.RepeatWrapping
grassAO.wrapS = THREE.RepeatWrapping
grassNormal.wrapS = THREE.RepeatWrapping
grassRoughness.wrapS = THREE.RepeatWrapping

grassColor.wrapT = THREE.RepeatWrapping
grassAO.wrapT = THREE.RepeatWrapping
grassNormal.wrapT = THREE.RepeatWrapping
grassRoughness.wrapT = THREE.RepeatWrapping

//1. Creating the house

//1.1 Creating a group, then adding the group to the scene
const house = new THREE.Group()
scene.add(house)

//1.2 - Creating the walls, and tweaking the coordinates
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4,2.5,4),
    new THREE.MeshStandardMaterial({
        map: bricksColor,
        aoMap: bricksAO,
        normalMap: bricksNormal,
        roughness: bricksRoughness
    })
)
walls.position.y = 1.25
house.add(walls)

//1.3 Adding the roof, and tweaking the coordinates
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1, 4),
    new THREE.MeshStandardMaterial({color: '#B35F45'})
)
roof.position.y = 2.5 + 0.5 // height of the walls + half of the height of the housew
roof.rotation.y = Math.PI * 0.25
house.add(roof)

//1.4 Adding the door and positiioning it
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2,2, 100, 100),
    new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        transparent: true,
        alphaMap: doorAlphaTexture,
        aoMap: doorAmbientOcclusionTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.1,
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
        roughness: doorRoughnessTexture
    })
)
door.position.y = 1
door.position.z = 2 + 0.01
house.add(door)

//1.5 Adding the bushes and positioning them
/*Instead of creating mulitple geometries and meshes, to optimize performance-
we will create one geometry and one mesh- and use that over and over with different meshes
*/

const bushGeo = new THREE.SphereGeometry(1, 16,16)
const bushMat = new THREE.MeshStandardMaterial({color: '#89C854'})

const bush1 = new THREE.Mesh(bushGeo, bushMat)
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(0.8, 0.2, 2.2)

const bush2 = new THREE.Mesh(bushGeo, bushMat)
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(1.4, 0.1, 2.1)

const bush3 = new THREE.Mesh(bushGeo, bushMat)
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.set(-0.8, 0.1, 2.2)

const bush4 = new THREE.Mesh(bushGeo, bushMat)
bush4.scale.set(0.15, 0.15, 0.15)
bush4.position.set(-1, 0.05, 2.6)

house.add(bush1, bush2, bush3, bush4)

//1.6 Adding graves
const graves = new THREE.Group()
scene.add(graves)

const graveGeo = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const graveMat = new THREE.MeshStandardMaterial({color: '#B2B6B1'})

for(let i=0; i<50; i++) {
    const angle = Math.random() *  Math.PI * 2
    const radius = 4 + Math.random() * 6

    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius

    const grave = new THREE.Mesh(graveGeo, graveMat)
    grave.position.set(x, 0.3, z)
    grave.rotation.y = (Math.random() - 0.5) * 0.4
    grave.rotation.z = (Math.random() - 0.5) * 0.4

    graves.add(grave)
}

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({
        map: grassColor,
        aoMap: grassAO,
        normalMap: grassNormal,
        grassRoughness: grassRoughness
    })
)
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

//Lights
//2.1 adding the door light

const doorlight = new THREE.PointLight('#ff7d46', 1, 7)
doorlight.position.set(0, 2.2, 2.7)
house.add(doorlight)

const ghost1 = new THREE.PointLight('#00ff00',2, 3)
scene.add(ghost1)

const ghost2 = new THREE.PointLight('#0000ff',2, 3)
scene.add(ghost2)

const ghost3 = new THREE.PointLight('#ff0000',2, 3)
scene.add(ghost3)


// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#ffffff', 0.5)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

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
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
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
renderer.setClearColor('#262837')

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    const ghost1Angle = elapsedTime
    const ghost2Angle = -elapsedTime * 0.32
    const ghost3Angle = -elapsedTime * 0.18

    ghost1.position.x = Math.cos(ghost1Angle) * 6
    ghost1.position.z = Math.sin(ghost1Angle) * 6
    ghost1.position.y = Math.sin(ghost1Angle) * 2

    ghost2.position.x = Math.cos(ghost2Angle) * 5
    ghost2.position.z = Math.sin(ghost2Angle) * 5
    ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.25)

    ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32))
    ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5))
    ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)


    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()