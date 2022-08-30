import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const bakedShadow = textureLoader.load('/textures/bakedShadow.jpg')
const simpleShadow = textureLoader.load('/textures/simpleShadow.jpg')

/**
 * Lights
 */
// Directional Light
const directionalLight = new THREE.DirectionalLight(0xF7D5E0, 0.5)
directionalLight.position.set(4, 2, - 1)
scene.add(directionalLight)

// Spot Light
const spotLight = new THREE.SpotLight(0xED3080, 0.5, 10, Math.PI * 0.3)
spotLight.position.set(0,2,4)
scene.add(spotLight)
scene.add(spotLight.target)

// Point Light
const pointLight = new THREE.PointLight(0xF7D5E0, 0.5)
pointLight.position.set(0, 3, 0)

scene.add(pointLight)

/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.7
material.color = new THREE.Color(0xF7D5E0) // F7D5E0 // 4e00ff 

const groundMaterial = new THREE.MeshStandardMaterial()
material.color = new THREE.Color(0xF7D5E0)

/**
 * Objects
 */
// Ground
const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(8, 4),
    groundMaterial
)
ground.rotation.x = - Math.PI * 0.5
ground.position.y = -1.5
ground.position.z = 0

// Sphere1
const sphere1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere1.position.x = - 2
sphere1.castShadow = false

// Sphere 2
const sphere2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere2.position.x = 0
sphere2.castShadow = false

// Sphere 3
const sphere3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere3.position.x = 2
sphere3.castShadow = false

// Add objects to scene
scene.add(sphere1, sphere2, sphere3, ground)

/**
 * Shadows
 */

// Shadow Sphere 1
const sphereShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 1.5),
    new THREE.MeshBasicMaterial({
        color: 0x000000, // ED3080
        transparent: true,
        alphaMap: simpleShadow
    })
)
sphereShadow.rotation.x = - Math.PI * 0.5
sphereShadow.position.y = ground.position.y + 0.01
scene.add(sphereShadow, sphere1,  ground)

// Shadow Sphere 2
const sphereShadow2 = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 1.5),
    new THREE.MeshBasicMaterial({
        color: 0x000000, // ED3080
        transparent: true,
        alphaMap: simpleShadow
    })
)
sphereShadow2.rotation.x = - Math.PI * 0.5
sphereShadow2.position.y = ground.position.y + 0.011
sphereShadow2.position.x = ground.position.x - 2
scene.add(sphereShadow2, sphere2,  ground)

// Shadow Sphere 3
const sphereShadow3 = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 1.5),
    new THREE.MeshBasicMaterial({
        color: 0x000000, // ED3080
        transparent: true,
        alphaMap: simpleShadow
    })
)
sphereShadow3.rotation.x = - Math.PI * 0.5
sphereShadow3.position.x = ground.position.x + 2
sphereShadow3.position.y = ground.position.y + 0.011
scene.add(sphereShadow3, sphere3,  ground)

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster()

const rayOrigin = new THREE.Vector3(-3, 0, 0)
const rayDirection = new THREE.Vector3(10,0,0)
rayDirection.normalize()
raycaster.set(rayDirection, rayDirection)

const intersects = raycaster.intersectObjects([sphere1, sphere2, sphere3])
console.log(intersects)

/**
 * GUI
 */
// Debug
const gui = new dat.GUI()

// Material
const materialFolder = gui.addFolder('Surface')
materialFolder.add(material, 'metalness').min(0).max(1).step(0.001)
materialFolder.add(material, 'roughness').min(0).max(1).step(0.001)

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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 8
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
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Animate objects
    sphere1.position.y = Math.sin(elapsedTime * 2.4)
    sphere2.position.y = Math.sin(elapsedTime * 2.6)
    sphere3.position.y = Math.sin(elapsedTime * 2.8)

    // Animate the shadow
    sphereShadow.position.x = sphere1.position.x
    sphereShadow.position.z = sphere1.position.z
    sphereShadow.material.opacity = (1 - sphere1.position.y) * 0.42

    sphereShadow2.position.x = sphere2.position.x
    sphereShadow2.position.z = sphere2.position.z
    sphereShadow2.material.opacity = (1 - sphere2.position.y) * 0.42

    sphereShadow3.position.x = sphere3.position.x
    sphereShadow3.position.z = sphere3.position.z
    sphereShadow3.material.opacity = (1 - sphere3.position.y) * 0.42

    // Cast a ray
    const rayOrigin = new THREE.Vector3(- 3, 0, 0)
    const rayDirection = new THREE.Vector3(1, 0, 0)
    rayDirection.normalize()
    raycaster.set(rayOrigin, rayDirection)

    const objectsToTest = [sphere1, sphere2, sphere3]
    const intersects = raycaster.intersectObjects(objectsToTest)

    for(const object of objectsToTest)
    {
        object.material.color.set('#ED3080')
    }

    for(const intersect of intersects)
    {
        intersect.object.material.color.set('#F7D5E0')
    }
    
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}
tick()