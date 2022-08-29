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
 * GUI
 */
// Debug
const gui = new dat.GUI()

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001).name('ambientLight')
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
directionalLight.position.set(4, 2, - 1)
gui.add(directionalLight, 'intensity').min(0).max(1).step(0.001).name('directionalLight')
gui.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(directionalLight)

// Shadow Map
directionalLight.castShadow = true
directionalLight.shadow.mapSize.with = 1024
directionalLight.shadow.mapSize.height = 1024
directionalLight.shadow.camera.top = 2
directionalLight.shadow.camera.right = 2
directionalLight.shadow.camera.bottom = -2
directionalLight.shadow.camera.left = -2
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 9
// directionalLight.shadow.camera.radius = 10


// Spot Light
const spotLight = new THREE.SpotLight(0xED3080, 0.5, 10, Math.PI * 0.3)

spotLight.castShadow = true
spotLight.shadow.camera.width = 1024
spotLight.shadow.camera.height = 1024
spotLight.shadow.camera.fov = 30
spotLight.shadow.camera.near = 1
spotLight.shadow.camera.far = 6

spotLight.position.set(0,2,4)
scene.add(spotLight)
scene.add(spotLight.target)

gui.add(spotLight, 'intensity').min(0).max(1).step(0.001).name('spotLight')

// Point Light
const pointLight = new THREE.PointLight(0xffffff, 0.5)

pointLight.castShadow = true
pointLight.shadow.mapSize.width = 1024
pointLight.shadow.mapSize.height = 1024
pointLight.shadow.camera.near = 0.1
pointLight.shadow.camera.far = 5

pointLight.position.set(0, 3, 0)
scene.add(pointLight)

gui.add(pointLight, 'intensity').min(0).max(1).step(0.001).name('pointLight')

/**
 * Helper
 */
// Directional Light Helper
const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
directionalLightCameraHelper.visible = false
scene.add(directionalLightCameraHelper)
gui.add(directionalLightCameraHelper, 'visible').name('directionalLightCameraHelper')

// Spot Light Helper
const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
spotLightCameraHelper.visible = false
scene.add(spotLightCameraHelper)
gui.add(spotLightCameraHelper, 'visible').name('spotLightCameraHelper')

// Point LightHelper
const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera)
pointLightCameraHelper.visible = false
scene.add(pointLightCameraHelper)
gui.add(pointLightCameraHelper, 'visible').name('pointLightCameraHelper')


/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.7
material.color = new THREE.Color(0xF7D5E0) // F7D5E0 // 4e00ff 
gui.add(material, 'metalness').min(0).max(1).step(0.001)
gui.add(material, 'roughness').min(0).max(1).step(0.001)

/**
 * Objects
 */
// Sphere
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.position.x = - 1.5
sphere.castShadow = true

// Cube
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
)
cube.position.x = 0.5
cube.castShadow = true

// Capsule
const capsule = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.25, 0.5, 64,128), // *4
    material
)
capsule.position.x = 2.5
capsule.castShadow = true

// Donut
const donut = new THREE.Mesh(
    new THREE.TorusGeometry(0.6, 0.075, 64, 128), // ,,16,32
    material
)
donut.position.x = 2.5
donut.rotation.x = 1
donut.castShadow = true



const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(8, 4),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65
plane.position.z = 0
plane.receiveShadow = true

scene.add(sphere, cube, capsule, donut, plane)

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
//renderer.shadowMap.type = THREE.PCFSoftShadowMap

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Update objects
    sphere.rotation.x = 0.15 * elapsedTime
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    donut.rotation.x = elapsedTime * 2

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()