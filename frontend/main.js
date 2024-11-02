import './style.css';
import { Application, Assets, Sprite, Container, Rectangle } from 'pixi.js';
import { onInteract } from './interactable.js';
import SplashScreen from './SplashScreen.js'


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
            back : Assets.get('amogusback'),
            left : Assets.get('amogusleft'),
            right : Assets.get('amogusright'),
        };
        this.anchor.set(0.5);
        this.x = options.app.screen.width / 2;
        this.y = options.app.screen.height / 2;
        this.scale.set(3.0);
        this.eventMode = 'static';
        this.cursor = 'pointer';

    }
    moveUp(speed) {
        this.texture = this.characterTextures.back;
        this.y -= speed;
    }

    moveDown(speed) {
        this.texture = this.characterTextures.front;
        this.y += speed;
    }

    moveLeft(speed) {
        this.texture = this.characterTextures.left;
        this.x -= speed;
    }

    moveRight(speed) {
        this.texture = this.characterTextures.right;
        this.x += speed;
    }
}


const initApp = async () => {
  const app = new Application();
  await app.init({
    background: '#1099bb',
    resizeTo: window,
  })

  document.body.appendChild(app.canvas); // Use app.view to append the canvas
  const splash = new SplashScreen(app, {})

  await splash.loadAssets([ 
      { alias: 'amogusfront', src: '/assets/xak.png' },
      { alias: 'amogusback', src: '/assets/gojodrink.png'}, //change to actual back
      { alias: 'amogusleft', src: '/assets/Red_Amogus.png'}, //change to actual left
      { alias: 'amogusright', src: '/assets/back_hover.png'}, //change to actual right
      { alias: 'floor', src: '/assets/wood.png' }, //floor
      { alias: 'meat', src: '/assets/meat.png' }
  ])
  
  const layers = {
    background: new Container(),
    characters: new Container(),
    ui: new Container()
  }
 // Add layers to stage in order (bottom to top)
  Object.values(layers).forEach(layer => {
        app.stage.addChild(layer);
  });
  return { layers, app }

}

// Create a new PixiJS application
(async () => {
  const { layers, app } = await initApp();

  //initialize floor
  const floorSprite = new Sprite(Assets.get('floor'));
  layers.background.addChild(floorSprite)

  let mapBounds;

  // Load the floor first
  // Create a container for the map

  // Define the size and layout of the flooring
  const tileWidth = 64;
  const tileHeight = 64;
  const mapRows = 10;
  const mapCols = 10;

  const centerX = (app.screen.width - (mapCols * tileWidth)) / 2;
  const centerY = (app.screen.height - (mapRows * tileHeight)) / 2;

  layers.background.x = centerX;
  layers.background.y = centerY;

  for (let row = 0; row < mapRows; row++) {
    for (let col = 0; col < mapCols; col++) {
      const tileSprite = new Sprite(Assets.get('floor'));
      tileSprite.anchor.set(0.5);
      tileSprite.x = col * tileWidth + tileWidth / 2;
      tileSprite.y = row * tileHeight + tileHeight / 2;

      layers.background.addChild(tileSprite);
    }
  }

  mapBounds = new Rectangle(
    centerX,
    centerY,
    mapCols * tileWidth,
    mapRows * tileHeight
  );

  const character = new MainSprite('amogusfront', { app })
  layers.characters.addChild(character);


  const meat = Sprite.from('meat')
  meat.x = character.x + 50
  meat.scale.set(3)
  meat.y = character.y + 50
  layers.ui.addChild(meat)

  const speed = 24

  // Movement logic
  window.addEventListener('keydown', (event) => {
    const oriX = character.x;
    const oriY = character.y;

    switch (event.key) {
        case 'ArrowUp':
            character.moveUp(speed);
            break;
        case 'ArrowDown':
            character.moveDown(speed);
            break;
        case 'ArrowLeft':
            character.moveLeft(speed);
            break;
        case 'ArrowRight':
            character.moveRight(speed);
            break;
        case ' ': //space key
            for (const ui_el of layers.ui.children) {
                if(testForAABB(character, ui_el)){ 
                    onInteract(app, ui_el, "hello")
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
})();
