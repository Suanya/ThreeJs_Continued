import './style.css'
import * as dat from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
// import {position} from "three/examples/jsm/nodes/shadernode/ShaderNodeBaseElements";
import firefliesVertexShader from './shaders/fireflies/vertex.glsl'
import firefliesFragmentShader from './shaders/fireflies/fragment.glsl'
import portalVertexShader from './shaders/portal/vertex.glsl'
import portalFragmentShader from './shaders/portal/fragment.glsl'




/**
 * Spector JS
 */
/*
const SPECTOR = require('spectorjs')
const spector = new SPECTOR.Spector()
spector.displayUI()
*/

/**
 * Base
 */
// Debug
const gui = new dat.GUI({
    width: 400
})
const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader()

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * Textures
 */
const bakedTexture = textureLoader.load('/draco/myBaked.jpg')
bakedTexture.flipY = false
bakedTexture.encoding = THREE.sRGBEncoding

/**
 * Materials
 */
// Baked Material
const bakedMaterial = new THREE.MeshBasicMaterial( { map: bakedTexture })

// Pole Light Material
const poleLightMaterial = new THREE.MeshBasicMaterial( { color: 0xffe50e} )

// Portal light material
debugObject.portalColorStart = '#ffff00'
debugObject.portalColorEnd = '#0000ff'

gui
    .addColor(debugObject, 'portalColorStart')
    .onChange(() =>
    {
        portalLightMaterial.uniforms.uColorStart.value.set(debugObject.portalColorStart)
    })

gui
    .addColor(debugObject, 'portalColorEnd')
    .onChange(() =>
    {
        portalLightMaterial.uniforms.uColorEnd.value.set(debugObject.portalColorEnd)
    })

//const portalLightMaterial = new THREE.MeshBasicMaterial({ color: 0xffe50e, side: THREE.DoubleSide} )
const portalLightMaterial = new THREE.ShaderMaterial({
    uniforms:
        {
            uTime: { value: 0 },
            uColorStart: { value: new THREE.Color( 0xffff00) },
            uColorEnd: { value: new THREE.Color (0x0000ff)}
        },
    vertexShader: portalVertexShader,
    fragmentShader: portalFragmentShader
})



/**
 * Model
 */
gltfLoader.load(
    '/draco/myPortal.glb',
    (gltf) =>
    {
        /*
        gltf.scene.traverse((child) =>
        {   console.log(child)
            child.material = bakedMaterial
        })
       */
        
        // Get each object
        const bakedMesh = gltf.scene.children.find((child) => child.name === 'baked')
        const portalLightMesh = gltf.scene.children.find((child) => child.name === 'Disco')
        const poleLightAMesh = gltf.scene.children.find((child) => child.name === 'LampLight')
        const poleLightBMesh = gltf.scene.children.find((child) => child.name === 'LampLight2')
        
        // Apply material
        bakedMesh.material = bakedMaterial
        poleLightAMesh.material = poleLightMaterial
        poleLightBMesh.material = poleLightMaterial
        portalLightMesh.material = portalLightMaterial
        
        scene.add(gltf.scene)
    }
)

/**
 * FireFlies
 */
// Geometry
const firefliesGeometry = new THREE.BufferGeometry()
const firefliesCount = 30
const positionArray = new Float32Array(firefliesCount * 3)
const scaleArray = new Float32Array(firefliesCount)

for(let i = 0; i < firefliesCount; i++)
{
    positionArray[i * 3 + 0] = (Math.random() - 0.5) * 6
    positionArray[i * 3 + 1] = Math.random() * 2
    positionArray[i * 3 + 2] = (Math.random() - 0.5) * 4
    
    scaleArray[i] = Math.random()
}
firefliesGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3))
firefliesGeometry.setAttribute('aScale', new THREE.BufferAttribute(positionArray, 1))

// Material
// const firefliesMaterial = new THREE.PointsMaterial({ size: 0.1, sizeAttenuation: true })

const firefliesMaterial = new THREE.ShaderMaterial({
    uniforms:
        {
            uTime: { value: 0},
            uPixelRatio: { value: Math.min(window.devicePixelRatio, 2)},
            uSize: { value: 100 }
        },
    
    vertexShader: firefliesVertexShader,
    fragmentShader: firefliesFragmentShader,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
})
gui.add(firefliesMaterial.uniforms.uSize, 'value').min(0).max(50).step(1).name('firefliesSize')


// Points
const fireflies = new THREE.Points(firefliesGeometry, firefliesMaterial)
scene.add(fireflies)



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
    
    // Update fireflies
    firefliesMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2)
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(65, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 4
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding = THREE.sRGBEncoding

// Debug
debugObject.clearColor = '#000000' //#220334
renderer.setClearColor(debugObject.clearColor)
gui
    .add(debugObject, 'clearColor')
    .onChange(() =>
    {
        renderer.setClearColor((debugObject.clearColor))
    })
 
/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update materials
    firefliesMaterial.uniforms.uTime.value = elapsedTime
    portalLightMaterial.uniforms.uTime.value = elapsedTime
    
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()