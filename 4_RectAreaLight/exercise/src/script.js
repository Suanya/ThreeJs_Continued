import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import {color, position, roughness} from "three/examples/jsm/nodes/shadernode/ShaderNodeBaseElements";
import {CSS3DObject} from "three/examples/jsm/renderers/CSS3DRenderer";
import {BoundingBox} from "three/examples/jsm/libs/opentype.module";


/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Debug
 */
const gui = new dat.GUI({ closed: true, width: 400 })


/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
const matcapTexture = textureLoader.load('/textures/matcaps/9.png')

const gradientTexture = textureLoader.load('/textures/gradients/3.jpg')
gradientTexture.minFilter = THREE.NearestFilter
gradientTexture.magFilter = THREE.NearestFilter
gradientTexture.generateMipmaps = false

const environmentMapTexture  = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg'
])

/**
 * Objects
 */
// Material
    
// const material = new THREE.MeshBasicMaterial()
// material.map = doorAmbientOcclusionTexture
// material.color = new THREE.Color('gold')
// material.wireframe = true
// material.opacity = 0.5
// material.transparent = true
// material.alphaMap = doorAlphaTexture
// material.side = THREE.FrontSide
// material.side = THREE.BackSide
// material.side = THREE.DoubleSide

// const material = new THREE.MeshNormalMaterial()
// material.flatShading = true
    
// const material = new THREE.MeshMatcapMaterial()
// material.matcap = matcapTexture
    
// const material = new THREE.MeshDepthMaterial()
    
// const material = new THREE.MeshLambertMaterial()

// const material = new THREE.MeshPhongMaterial()
// material.shininess = 100
// material.specular = new THREE.Color(0x1188ff)
    
// const material = new THREE.MeshToonMaterial()   
// material.gradientMap = gradientTexture

/*
const material = new THREE.MeshStandardMaterial()
material.metalness = 0
material.roughness = 1
material.map = doorColorTexture
material.aoMap = doorAmbientOcclusionTexture
material.aoMapIntensity = 1
material.displacementMap = doorHeightTexture
material.displacementScale = 0.05
material.metalnessMap = doorMetalnessTexture
material.roughnessMap = doorRoughnessTexture
material.normalMap = doorNormalTexture
material.normalScale.set(0.5,0.5)
material.transparent = true
material.alphaMap = doorAlphaTexture
*/

const material = new THREE.MeshStandardMaterial()
material.metalness = 0.7
material.roughness = 0.2
material.envMap = environmentMapTexture

gui.add(material, 'metalness').min(0).max(1).step(0.0001)
gui.add(material, 'roughness').min(0).max(1).step(0.0001)
gui.add(material, 'aoMapIntensity').min(0).max(10).step(0.0001)
gui.add(material, 'displacementScale').min(0).max(10).step(0.0001)

// Sphere
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5,64,64), // (,...,16,16)
    material
)
sphere.position.x = -1.5
sphere.geometry.setAttribute('uv2', new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2))

// Plane
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1, 100, 100),
    material
)
plane.geometry.setAttribute('uv2', new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2))
material.side = THREE.DoubleSide
plane.position.x = 0.5

// Capsule
const capsule = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.25, 0.5, 64,128), // *4
    material
)
capsule.position.x = 2.5
capsule.geometry.setAttribute('uv2', new THREE.BufferAttribute(capsule.geometry.attributes.uv.array, 2))

// Donut
const donut = new THREE.Mesh(
    new THREE.TorusGeometry(0.6, 0.075, 64, 128), // ,,16,32
    material
)
donut.position.x = 2.5
donut.rotation.x = 1
donut.geometry.setAttribute('uv2', new THREE.BufferAttribute(donut.geometry.attributes.uv.array, 2))

// Add objects to the scene
scene.add(sphere, plane, capsule, donut)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)


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
const camera = new THREE.PerspectiveCamera(140, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
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

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    
    // Update objects
    sphere.rotation.x = elapsedTime * 1.6
    sphere.rotation.y = elapsedTime * 1.6
    plane.rotation.y = elapsedTime * 1
    capsule.rotation.y = elapsedTime * 1.6
    donut.rotation.z = elapsedTime * 2
    donut.rotation.x = elapsedTime * 2
    
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()




/**
 * ShoeBox
 */
/*
// Ground
const ground = new THREE.Mesh(
    new  THREE.PlaneGeometry(5, 3),
    material
)
ground.rotation.x = Math.PI * 0.5
ground.position.y = - 1.0

// Roof
const roof = new THREE.Mesh(
    new  THREE.PlaneGeometry(5, 3),
    material
)
roof.rotation.x = Math.PI * 0.5
roof.position.y =  2

// BackWall
const wall = new THREE.Mesh(
    new  THREE.PlaneGeometry(5, 3),
    material
)
wall.position.z = - 1.5
wall.position.y = 0.5


// LeftWall
const leftWall = new THREE.Mesh(
    new  THREE.PlaneGeometry(3, 3),
    material
)
leftWall.position.y = 0.5
leftWall.position.x = - 2.5
leftWall.rotation.y = Math.PI * 2.5

// RightWall
const rightWall = new THREE.Mesh(
    new  THREE.PlaneGeometry(3, 3),
    material
)
rightWall.position.y = 0.5
rightWall.position.x = 2.5
rightWall.rotation.y = Math.PI * 2.5

// Add shoeBox
// scene.add(ground, wall, roof, leftWall, rightWall)

 */