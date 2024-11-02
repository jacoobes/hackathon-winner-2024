import * as PIXI from 'pixi.js'
const DEFAULT_RECT_OPTIONS = {
    x: 0, y: 0, width: 150, height: 100, borderRadius: 0
}

export const toggle = (x) => {
    if(x.visible) {
    x.visible =false 
    } else {
    x.visible =true 

    }

}

function onHover () {

}


export class KoreaMap {
    constructor(app, rectangleSprite) {
        this.app = app;
        this.rectangleSprite = rectangleSprite;

        this.init();
    }
    toggleVisibility () { 
        toggle(this.rectangleSprite)
        if(this.rectangleSprite.visible) {
            
        } else {

        }
        
    }

    init() {
        // Create the ocean rectangle background
        this.ocean = this.createOcean();

        // Add the map of Korea as a sprite
        this.korea = this.createKoreaSprite();

        // Add city labels
        this.createCityLabels();
    }

    createOcean() {
        const ocean = createRectangle(this.app, { 
            x: -250,
            y: 0,
            color: 0x2A52BE,
            width: 500,
            height: 500,
            borderRadius: 50,
        });
        this.rectangleSprite.addChild(ocean);
        return ocean;
    }

    createKoreaSprite() {
        // Ensure the texture scaling mode is set
        PIXI.Assets.get('korea').baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        
        // Create the sprite
        const korea = PIXI.Sprite.from('korea');
        korea.anchor.set(0.5);
        korea.scale.set(5);
        korea.position.set(-250, 0);

        this.rectangleSprite.addChild(korea);
        return korea;
    }

    createCityLabels() {
        const cityData = [
            { text: "Seoul", x: 100, y: -50 },
            { text: "Busan", x: 100, y: 0 },
            { text: "Jeju Island", x: 100, y: 50 }
        ];

        cityData.forEach(city => {
            const cityLabel = new PIXI.Text(city.text, { fill: 0x000000, fontSize: 16 });
            cityLabel.position.set(city.x, city.y);
            this.rectangleSprite.addChild(cityLabel);
        });
    }
}






export const createRectangle = (app, { 
    x, y,
    width, height, color=0xFFFFFF ,
    borderRadius,
    outline=  null
} = DEFAULT_RECT_OPTIONS) => {

    const graphics = new PIXI.Graphics();
    if (outline) {
        graphics.lineStyle(outline.thickness, outline.color);
    }
    // Draw a white rectangle
    graphics.beginFill(color); // White color
    if (borderRadius > 0) {
        graphics.drawRoundedRect(x, y, width, height, borderRadius);
    } else {
        graphics.drawRect(x, y, width, height);
    }
    graphics.endFill();

    // Generate a texture from the Graphics object
    const texture = app.renderer.generateTexture(graphics);
    // Create a sprite from the texture
    const rectangleSprite = new PIXI.Sprite(texture);
    // Set the position of the sprite
    rectangleSprite.x = x;
    rectangleSprite.y = y;
    rectangleSprite.anchor.set(0.5)
    return rectangleSprite
}

