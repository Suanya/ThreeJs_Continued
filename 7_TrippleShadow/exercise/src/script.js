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
 * Lights
 */
// Directional Light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
directionalLight.position.set(4, 2, - 1)
scene.add(directionalLight)

// Directional Light Shadow Map
directionalLight.castShadow = true
directionalLight.shadow.mapSize.with = 1024
directionalLight.shadow.mapSize.height = 1024
directionalLight.shadow.camera.top = 2
directionalLight.shadow.camera.right = 2
directionalLight.shadow.camera.bottom = -2
directionalLight.shadow.camera.left = -2
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 9

// Spot Light
const spotLight = new THREE.SpotLight(0xED3080, 0.5, 10, Math.PI * 0.3)
spotLight.position.set(0,2,4)
scene.add(spotLight)
scene.add(spotLight.target)

// Spot Light Shadow Map
spotLight.castShadow = true
spotLight.shadow.camera.width = 1024
spotLight.shadow.camera.height = 1024
spotLight.shadow.camera.fov = 30
spotLight.shadow.camera.near = 1
spotLight.shadow.camera.far = 6

// Point Light
const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.set(0, 3, 0)
scene.add(pointLight)

// Point Light Shadow Map
pointLight.castShadow = true
pointLight.shadow.mapSize.width = 1024
pointLight.shadow.mapSize.height = 1024
pointLight.shadow.camera.near = 0.1
pointLight.shadow.camera.far = 5

/**
 * Light Camera Helper
 */
// Directional Light Helper
const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
directionalLightCameraHelper.visible = false
scene.add(directionalLightCameraHelper)

// Spot Light Helper
const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
spotLightCameraHelper.visible = false
scene.add(spotLightCameraHelper)

// Point LightHelper
const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera)
pointLightCameraHelper.visible = false
scene.add(pointLightCameraHelper)

/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.7
material.color = new THREE.Color(0xF7D5E0) // F7D5E0 // 4e00ff 

/**
 * Objects
 */
// Ground
const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(8, 4),
    material
)
ground.rotation.x = - Math.PI * 0.5
ground.position.y = - 0.65
ground.position.z = 0
ground.receiveShadow = true

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

// Add Objects to scene
scene.add(ground,sphere, cube, capsule, donut)

/**
 * GUI
 */
// Debug
const gui = new dat.GUI()

// Directional Light
const directionalLightFolder = gui.addFolder('DirectionalLight')
directionalLightFolder.add(directionalLight, 'visible').name('On / Off')
directionalLightFolder.add(directionalLightCameraHelper, 'visible').name('LightCameraHelper')
directionalLightFolder.add(directionalLight, 'intensity').min(0).max(1).step(0.001).name('Intensity')
directionalLightFolder.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001).name('Position.x')
directionalLightFolder.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001).name('Position.y')
directionalLightFolder.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001).name('Position.z')

// Spot Light
const spotLightFolder = gui.addFolder('SpotLight')
spotLightFolder.add(spotLight, 'visible').name('On / Off')
spotLightFolder.add(spotLightCameraHelper, 'visible').name('LightCameraHelper')
spotLightFolder.add(spotLight, 'intensity').min(0).max(1).step(0.001).name('Intensity')
spotLightFolder.add(spotLight.position, 'x').min(- 5).max(5).step(0.001).name('Position.x')
spotLightFolder.add(spotLight.position, 'y').min(- 5).max(5).step(0.001).name('Position.y')
spotLightFolder.add(spotLight.position, 'z').min(- 5).max(5).step(0.001).name('Position.z')

// Point Light
const pointLightFolder = gui.addFolder('PointLight')
pointLightFolder.add(pointLight, 'visible').name('On / Off')
pointLightFolder.add(pointLightCameraHelper, 'visible').name('LightCameraHelper')
pointLightFolder.add(pointLight, 'intensity').min(0).max(1).step(0.001).name('Intensity')
pointLightFolder.add(pointLight.position, 'x').min(- 5).max(5).step(0.001).name('Position.x')
pointLightFolder.add(pointLight.position, 'y').min(- 5).max(5).step(0.001).name('Position.y')
pointLightFolder.add(pointLight.position, 'z').min(- 5).max(5).step(0.001).name('Position.z')

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