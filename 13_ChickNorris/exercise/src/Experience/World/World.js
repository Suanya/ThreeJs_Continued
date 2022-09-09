import * as THREE from 'three'
import Experience from "../Experience.js";
import Environment from "./Environment.js";
import Floor from "./Floor";
import Fox from "./Fox";


export default class World
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        
        console.log(this.resources)
        
        
        
        // Wait for resources
        this.resources.on('ready', () =>
        {
            // Set Up
            this.floor = new Floor()
            this.fox = new Fox()
            this.environment = new Environment()
           
        })

        
    }
    
    update()
    {
        if(this.fox)
            this.fox.update()
        
    }
}