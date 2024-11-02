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


export class KoreaMap {
    constructor(app, rectangleSprite) {
        this.app = app;
        this.rectangleSprite = rectangleSprite;

        this.init();
        this.createCityPoints()
    }
    createCityPoints() {
        const cityPoints = [
            { name: "Seoul", x: -80, y: -220 },
            { name: "Busan", x: 230, y: 150 },
            { name: "Jeju Island", x: -120, y: 270 }
        ];

        cityPoints.forEach(city => {
            const pointContainer = new PIXI.Container();

            const hitArea = new PIXI.Graphics();
            hitArea.alpha = 0
            hitArea.beginFill(0x000000, 0); // Invisible fill
            hitArea.drawRect(-10, -10, 30, 30); // Rectangle centered around (0,0) with 20x20 size
            ;
            hitArea.position.set(city.x, city.y);
            hitArea.endFill();

            const point = new PIXI.Graphics();
            point.position.set(city.x, city.y);
            point.beginFill(0xFF0000); // Red color for the points
            point.drawCircle(0, 0, 10); // Circle with radius 5
            point.endFill();


            pointContainer.interactive = true;
            pointContainer.buttonMode = true;
            pointContainer.cursor = "url(/assets/pin.png),auto"
            pointContainer.addChild(hitArea);
            pointContainer.addChild(point);
            // Click event listener
            pointContainer.on('pointerdown', () => this.onCityClick(city.name));

            this.korea.addChild(pointContainer);
        });
    }

    onCityClick(name) { 
       console.log(name) 
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
            x: 0,
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
        korea.scale.set(0.8);

        this.rectangleSprite.addChild(korea);
        return korea;
    }

    createCityLabels() {
        const cityData = [
            { name: "Seoul", x: -90, y: -220 },
            { name: "Busan", x: 160, y: 130 },
            { name: "Jeju Island", x: -120, y: 180 }
        ];

        cityData.forEach(city => {
            const cityLabel = new PIXI.Text(city.name, { fill: 0xFFFFFF, fontSize: 20 });
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

