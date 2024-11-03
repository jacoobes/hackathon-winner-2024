import * as PIXI from 'pixi.js'
import { ROOM_CONFIGS, updateRoom, cleanup } from './roomUpdates.js'

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
    constructor(app, layers, mapBounds) {
        this.app = app;
        const mapLayer = createRectangle(app, {
            x: app.centerX,
            y: app.centerY,
            borderRadius: 50,
            outline: { thickness: 6, color: 0x000080 },
            width: 500,
            height: 500,
          });
        mapLayer.anchor.set(0.5);
        mapLayer.eventMode = 'static';
        this.rectangleSprite = mapLayer;
        this.rectangleSprite.uid = 'KOREAMAP'
        this.layers = layers;
        this.mapBounds = mapBounds;
        this.rectangleSprite.visible = false;
        this.init();
        this.city = null
        this.createCityPoints()
    }
    get mapSprite() {
        return this.rectangleSprite;
    }


    createCityPoints() {
        const cityPoints = [
            { name: "Seoul", x: -80, y: -220 },
            { name: "Busan", x: 230, y: 150 },
            { name: "Jeju Island", x: -120, y: 270 }
        ];

        cityPoints.forEach((city, i) => {
            const pointContainer = new PIXI.Container();
            pointContainer.name = "pointerContainer"+i

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
            pointContainer.cursor = "url('/assets/pin.png'),auto"
            pointContainer.addChild(hitArea);
            pointContainer.addChild(point);
            // Click event listener
            
            pointContainer.addEventListener('pointerdown', (e) => {
                this.onRoomUpdate(city.name);
            });
            this.korea.addChild(pointContainer);
        });
    }
    onRoomUpdate(option) {
        const layers = this.layers;
        cleanup(layers.ui);
        if (layers.background.children.length > 0) {
            layers.background.removeChildren();
        }
        if (layers.ui.children.length > 0) {
            for (const child of layers.ui.children) {
                if(child.uid === 'KOREAMAP' || child.uid === 'table') {
                    continue
                }
                layers.ui.removeChild(child);
                child.destroy({ children: true, texture: true, baseTexture: true});

            }
            const map = layers.ui.children.find(child => child.uid === 'KOREAMAP')
            // to put map in foreground
            map.zIndex = 1
            layers.ui.setChildIndex(map, layers.ui.children.length - 1);
            if(map.visible) {
                map.visible = false;
            }
        }


        const roomConfig = ROOM_CONFIGS[option];
        if (!roomConfig) {
            console.warn("Unknown roomConfig", roomConfig)
            return;
        }

        updateRoom(option, layers);

        this.app.renderer.render(this.app.stage);

        let background;

        if (roomConfig.background) {
            // Use the background texture from roomConfig
            const backgroundTexture = PIXI.Texture.from(roomConfig.background);
            background = new PIXI.Sprite(backgroundTexture);
        } else {
            // Create a black background if roomConfig.background is undefined
            background = new PIXI.Sprite(PIXI.Texture.WHITE);
            background.tint = 0x000000; // Set color to black
        }

        // Set background size and position
        background.width = window.innerWidth;
        background.height = window.innerHeight;
        background.anchor.set(0.5);
        layers.background.addChild(background);
        if (roomConfig.interactives) {
            for (const interactive of roomConfig.interactives) {
                console.log(interactive)
                const sprite = PIXI.Sprite.from(interactive.sprite);

                sprite.anchor.set(0.5);
                if(interactive.uid) {
                    sprite.uid = interactive.uid;
                }
                if(interactive.position) {
                    switch (interactive.position) {
                        case 'top center': {
                           sprite.position.set(app.canvas.width / 2,app.canvas.height - mapBounds.height);
                        } break;
                        case 'bot center': {
                           sprite.position.set(app.canvas.width / 2, 10);
                        } break;
                    }
                } else {
                    sprite.position.set(interactive.x,interactive.y)
                }
                if(interactive.scale) {
                    sprite.scale.set(interactive.scale);
                }

                if(interactive.type == 'info') {
                    //sprite.interactionMessage = roomConfig.interactive.interaction;
                    //
                    layers.ui.addChild(sprite);
                } else if (interactive.type == 'map') {
    //                const koreaMap = new KoreaMap(app, ({ name }) => {
    //                    onRoomUpdate(layers, name, mapBounds, app);
    //                });
    //
    //                layers.ui.addChild(sprite);
    //                layers.ui.addChild(koreaMap.rectangleSprite);
                    //sprite.interactionMessage = roomConfig.interactive.interaction;
                }

            }


            // If character exists, update position relative to character
            /*if (layers.characters.children.length > 0) {
                const character = layers.characters.children[0];
                interactive.x = character.x + 50;  // Offset from character
                interactive.y = character.y + 50;  // Offset from character
            }*/
        } else {
            console.warn("no interactives")
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
            const cityLabel = new PIXI.Text({ 
                text: city.name,
                fill: 0xffffff,
                fontSize: 20,
                style: {
                    fontFamily:'Space Mono',
                    color: 'white'
                }
            });
            cityLabel.position.set(city.x, city.y);
            this.rectangleSprite.addChild(cityLabel);
        });
    }
    destroy( ){ 

        if (this.ocean) {
            this.ocean.destroy({ children: true });
            this.ocean = null;
        }
        
        if (this.korea) {
            this.korea.destroy({ children: true });
            this.korea = null;
        }

        // Destroy the main rectangle sprite container
        if (this.rectangleSprite) {
            this.rectangleSprite.destroy({ children: true });
            this.rectangleSprite = null;
        }
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

