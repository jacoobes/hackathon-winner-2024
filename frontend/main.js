import './style.css';
import { AnimatedSprite, Application, Assets, Sprite, Container, Rectangle, SCALE_MODES } from 'pixi.js';
import { createRectangle, toggle , KoreaMap} from './map.js'
import { onInteract } from './interactable.js';
import SplashScreen from './SplashScreen.js'
import { onRoomUpdate } from './roomUpdates.js';
import { createMenu } from './menu.js'
import { loadSounds, playSound } from './soundfx.js'


//generic collision detection between two sprites
function testForAABB(object1, object2)
{
    const bounds1 = object1.getBounds();
    const bounds2 = object2.getBounds();

    return (
        bounds1.x < bounds2.x + bounds2.width
        && bounds1.x + bounds1.width > bounds2.x
        && bounds1.y < bounds2.y + bounds2.height
        && bounds1.y + bounds1.height > bounds2.y
    );
}


function isWithinBounds(character, bounds) {
    const characterBounds = character.getBounds();
    return (
        characterBounds.x >= bounds.x &&
        characterBounds.x + characterBounds.width <= bounds.x + bounds.width &&
        characterBounds.y >= bounds.y &&
        characterBounds.y + characterBounds.height <= bounds.y + bounds.height
    );
}


// Main character
class MainSprite extends Sprite {
    constructor(texture, options) {
        super(Assets.get(texture))
        this.characterTextures = {
            front : Assets.get('amogusfront'),
            back : Assets.get('amogusfront'),
            left : Assets.get('amogusfront'),
            right : Assets.get('amogusfront'),
        };
        this.anchor.set(0.5);
        this.x = options.app.screen.width / 2;
        this.y = options.app.screen.height / 2;
        this.scale.set(3.0);
        this.eventMode = 'static';
        this.cursor = 'pointer';
        Assets.get(texture).baseTexture.scaleMode = SCALE_MODES.NEAREST

    }
    moveUp(speed) {
        this.texture = this.characterTextures.front;
        this.y -= speed;
    }

    moveDown(speed) {
        this.texture = this.characterTextures.front;
        this.y += speed;
    }

    moveLeft(speed) {
        this.texture = this.characterTextures.front;
        this.x -= speed;
    }

    moveRight(speed) {
        this.texture = this.characterTextures.front;
        this.x += speed;
    }
}

const initApp = async () => {
  await document.fonts.load("10pt 'Monocraft'");
  const app = new Application();
  await app.init({
    background: '#1099bb',
    resizeTo: window,
  })

  document.body.appendChild(app.canvas); // Use app.view to append the canvas
  const splash = new SplashScreen(app, {})

  await splash.loadAssets([ 
      { alias: 'korea', src: '/assets/korea.png' },
      { alias: 'amogusfront', src: '/assets/xak.png' },
      { alias: 'amogusback', src: '/assets/gojodrink.png'}, //change to actual back
      { alias: 'amogusleft', src: '/assets/Red_Amogus.png'}, //change to actual left
      { alias: 'amogusright', src: '/assets/back_hover.png'}, //change to actual right
      { alias: 'floor', src: '/assets/wood.png' }, //floor
      { alias: 'meat', src: '/assets/meat.png' },
      { alias: 'mainBackground', src: '/assets/seoultower.png'},
      { alias: 'background1', src: '/assets/skysunset.png'}
  ])

  loadSounds();

  const layers = {
    background: new Container(),
    flooring: new Container(),
    menu: new Container(),
    characters: new Container(),
    ui: new Container()
  }
 // Add layers to stage in order (bottom to top)
  Object.values(layers).forEach(layer => {
        app.stage.addChild(layer);
  });

  createMenu(layers);
  onRoomUpdate(layers, 'mainBackground');

  return { layers, app }

}

// Create a new PixiJS application
(async () => {
  const { layers, app } = await initApp();

  //initialize floor
  const floorSprite = Sprite.from('floor');
  layers.flooring.addChild(floorSprite)

  let mapBounds;

  // Load the floor first
  // Create a container for the map

  // Define the size and layout of the flooring
  const tileWidth = 64;
  const tileHeight = 64;
  const mapRows = 10;
  const mapCols = 10;

  const centerX = (app.screen.width/2); //Use these for centering
  const centerY = (app.screen.height/2); //Use these for centering

  layers.background.x = centerX;
  layers.background.y = centerY;
  layers.flooring.x = centerX;
  layers.flooring.y = centerY;

  for (let row = 0; row < mapRows; row++) {
    for (let col = 0; col < mapCols; col++) {
      const tileSprite = Sprite.from('floor');
      tileSprite.anchor.set(0.5);
      tileSprite.x = col * tileWidth - (mapCols * tileWidth) / 2 + tileWidth / 2; // Adjust position based on center
      tileSprite.y = row * tileHeight - (mapRows * tileHeight) / 2 + tileHeight / 2; // Adjust position based on center

      layers.flooring.addChild(tileSprite);
    }
  }

  mapBounds = new Rectangle(
    centerX - (mapCols * tileWidth) / 2,
    centerY - (mapRows * tileHeight) / 2,
    mapCols * tileWidth,
    mapRows * tileHeight
  );

  const character = new MainSprite('amogusfront', { app })
  layers.characters.addChild(character);
  //character.position.set(centerX, centerY); //might be unnecessary

  /*const meat = Sprite.from('meat')
  meat.x = character.x + 50
  meat.scale.set(3)
  meat.y = character.y + 50
  layers.ui.addChild(meat)*/

  const table = Sprite.from('meat')
  table.x = app.view.width / 2
  table.y =  app.view.height - mapBounds.height 
  table.anchor.set(0.5)
  layers.ui.addChild(table)

  const mapLayer = createRectangle(app, { x: centerX,
                                          y: centerY,
                                          borderRadius: 50,
                                          outline: { thickness: 6, color: 0x000080 },
                                          width: 500,
                                          height: 500 })
  mapLayer.visible = false;
  mapLayer.anchor.set(0.5)
  const koreaMap = new KoreaMap(app, mapLayer, ({ name, event }) => {
    switch (name) {
        case 'Seoul': {
            onRoomUpdate(layers, 'Seoul')
        } break;
        case 'Busan': {
            onRoomUpdate(layers, 'Busan')
        } break;
        case 'Jeju Island': {
            onRoomUpdate(layers, 'Jeju Island')
        } break;
    }
  })

  mapLayer.eventMode  = 'static'
  layers.ui.addChild(mapLayer) 

  const speed = 24
  
  // Movement logic
  window.addEventListener('keydown', (event) => {
    const oriX = character.x;
    const oriY = character.y;

    switch (event.key) {
        case 'ArrowUp':
            character.moveUp(speed);
            playSound('woodsteps');
            break;
        case 'ArrowDown':
            character.moveDown(speed);
            playSound('woodsteps');
            break;
        case 'ArrowLeft':
            character.moveLeft(speed);
            playSound('woodsteps');
            break;
        case 'ArrowRight':
            character.moveRight(speed);
            playSound('woodsteps');
            break;
        case ' ': //space key
            for (const ui_el of layers.ui.children) {
              
                if(testForAABB(character, ui_el)){ 
                    if(ui_el.uid == table.uid) {
                        koreaMap.toggleVisibility()
                        break; 
                    }
                    
                    if(ui_el.uid != mapLayer.uid && window.isPopupActive == false) {
                        onInteract(app, ui_el, "Kimchi is pretty good. It's both rich in flavor and in culture. mmmm kimchi. I could really use some kimchi right now, but i don't really want kimchi. But kimchi sounds so good rn. Maybe next time I'll get some Kimchi to eat. ")
                        break;
                    }
                }
            }
            //if item nearby
            // open menu
            break;
        default:
            console.log(event.key)
            break;
    }
    if (!isWithinBounds(character, mapBounds)) {
        character.x = oriX;
        character.y = oriY;
    }

  });
  const menu = createMenu(layers);
})();
