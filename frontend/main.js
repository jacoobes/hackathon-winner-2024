import './style.css';
import { createRectangle, toggle , KoreaMap } from './map.js';
import { AnimatedSprite, Application, Assets, Sprite, Container, Rectangle, SCALE_MODES, Texture, Spritesheet, TextureStyle } from 'pixi.js';
import { onInteract } from './interactable.js';
import SplashScreen from './SplashScreen.js';
import { onRoomUpdate } from './roomUpdates.js';
import { createMenu } from './menu.js';
import { loadSounds, playSound, stopSound } from './soundfx.js'

TextureStyle.defaultOptions.scaleMode = 'nearest';
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

// global variables for key tracking
const keys = {};

// main character class using AnimatedSprite
class MainSprite extends Container {
  constructor(options) {
    super();
    this.spritesheet = options.spritesheet;
    
    // start with standSouth animation
    this.sprite = new AnimatedSprite(this.spritesheet.animations['standSouth']);
    this.sprite.anchor.set(0.5);
    this.sprite.x = options.app.screen.width / 2;
    this.sprite.y = options.app.screen.height / 2;
    this.sprite.scale.set(3.0);
    this.sprite.animationSpeed = 0.18;
    this.sprite.loop = false;
    this.sprite.eventMode = 'static';
    this.sprite.cursor = 'pointer';
    this.sprite.play();

    // add animated sprite to the MainSprite container
    this.addChild(this.sprite);
  }

  moveUp(speed) {
    if (!this.sprite.playing || this.sprite.textures !== this.spritesheet.animations['walkNorth']) {
      this.sprite.textures = this.spritesheet.animations['walkNorth'];
      this.sprite.play();
    }
    this.sprite.y -= speed;
  }

  moveDown(speed) {
    if (!this.sprite.playing || this.sprite.textures !== this.spritesheet.animations['walkSouth']) {
      this.sprite.textures = this.spritesheet.animations['walkSouth'];
      this.sprite.play();
    }
    this.sprite.y += speed;
  }

  moveLeft(speed) {
    if (!this.sprite.playing || this.sprite.textures !== this.spritesheet.animations['walkWest']) {
      this.sprite.textures = this.spritesheet.animations['walkWest'];
      this.sprite.play();
    }
    this.sprite.x -= speed;
  }

  moveRight(speed) {
    if (!this.sprite.playing || this.sprite.textures !== this.spritesheet.animations['walkEast']) {
      this.sprite.textures = this.spritesheet.animations['walkEast'];
      this.sprite.play();
    }
    this.sprite.x += speed;
  }

  standStill() {
    if (this.sprite.playing) {
      switch (this.sprite.textures) {
        case this.spritesheet.animations['walkNorth']:
          this.sprite.textures = this.spritesheet.animations['standNorth'];
          break;
        case this.spritesheet.animations['walkWest']:
          this.sprite.textures = this.spritesheet.animations['standWest'];
          break;
        case this.spritesheet.animations['walkSouth']:
          this.sprite.textures = this.spritesheet.animations['standSouth'];
          break;
        case this.spritesheet.animations['walkEast']:
          this.sprite.textures = this.spritesheet.animations['standEast'];
          break;
      }
      this.sprite.gotoAndStop(0); // show standing frame
    }
  }

  get x() {
    return this.sprite.x;
  }

  set x(value) {
    this.sprite.x = value;
  }

  get y() {
    return this.sprite.y;
  }

  set y(value) {
    this.sprite.y = value;
  }

  get width() {
    return this.sprite.width;
  }

  get height() {
    return this.sprite.height;
  }

  getBounds() {
    return this.sprite.getBounds();
  }
}

const initApp = async () => {
    const app = new Application();
    await app.init({
      background: '#1099bb',
      resizeTo: window,
    });

  document.body.appendChild(app.canvas);
  const splash = new SplashScreen(app, {});

  await splash.loadAssets([
    { alias: 'korea', src: '/assets/korea.png' },
    { alias: 'floor', src: '/assets/floorv5.png' },
    { alias: 'meat', src: '/assets/meat.png' },
    { alias: 'mainBackground', src: '/assets/seoultower.png' },
    { alias: 'background1', src: '/assets/skysunset.png' },
    { alias: 'sprite', src: '/assets/spritesheet.png'},
    { alias: 'table', src: '/assets/table.png'},
    { alias: 'pin', src: '/assets/pin.png'},
    { alias: 'wall', src: '/assets/wallv1.png'},
    { alias: 'wallside', src: '/assets/wallside.png'}
  ]);
  loadSounds()
  const w = 34;
  const h = 34;

  const atlasData = {
    frames: {
      // standin frames
      'standSouth': { frame: { x: 1 * w, y: 0, w: w, h: h } }, // x=34
      'standWest': { frame: { x: 4 * w, y: 0, w: w, h: h } },  // x=136
      'standEast': { frame: { x: 7 * w, y: 0, w: w, h: h } },  // x=238
      'standNorth': { frame: { x: 10 * w, y: 0, w: w, h: h } },// x=340

      // walk south frames
      'walkSouth_0': { frame: { x: 0 * w, y: 0, w: w, h: h } },// x=0
      'walkSouth_1': { frame: { x: 1 * w, y: 0, w: w, h: h } },// x=34
      'walkSouth_2': { frame: { x: 2 * w, y: 0, w: w, h: h } },// x=68

      // walk west frames
      'walkWest_0': { frame: { x: 3 * w, y: 0, w: w, h: h } },// x=102
      'walkWest_1': { frame: { x: 4 * w, y: 0, w: w, h: h } },// x=136
      'walkWest_2': { frame: { x: 5 * w, y: 0, w: w, h: h } },// x=170

      // walk east frames
      'walkEast_0': { frame: { x: 6 * w, y: 0, w: w, h: h } },// x=204
      'walkEast_1': { frame: { x: 7 * w, y: 0, w: w, h: h } },// x=238
      'walkEast_2': { frame: { x: 8 * w, y: 0, w: w, h: h } },// x=272

      // walk north frames
      'walkNorth_0': { frame: { x: 9 * w, y: 0, w: w, h: h } },// x=306
      'walkNorth_1': { frame: { x: 10 * w, y: 0, w: w, h: h } },// x=340
      'walkNorth_2': { frame: { x: 11 * w, y: 0, w: w, h: h } },// x=374
    },
    animations: {
      'standSouth': ['standSouth'],
      'standWest': ['standWest'],
      'standEast': ['standEast'],
      'standNorth': ['standNorth'],
      'walkSouth': ['walkSouth_0', 'walkSouth_1', 'walkSouth_2'],
      'walkWest': ['walkWest_0', 'walkWest_1', 'walkWest_2'],
      'walkEast': ['walkEast_0', 'walkEast_1', 'walkEast_2'],
      'walkNorth': ['walkNorth_0', 'walkNorth_1', 'walkNorth_2'],
    },
    meta: {
      image: '/assets/spritesheet.png',
    },
  };

  // create Spritesheet instance
  const ssheetTexture = Texture.from(atlasData.meta.image);
  const spritesheet = new Spritesheet(ssheetTexture, atlasData);
  await spritesheet.parse();

  const layers = {
    background: new Container(),
    flooring: new Container(),
    menu: new Container(),
    characters: new Container(),
    ui: new Container(),
  };
  // add layers to stage in order (bottom to top)
  Object.values(layers).forEach((layer) => {
    app.stage.addChild(layer);
  });

  createMenu(layers);
  onRoomUpdate(layers, 'mainBackground');

  return { layers, app, spritesheet };
};

// create new PixiJS application
(async () => {
  const { layers, app, spritesheet } = await initApp();

  // initialize floor
  const floorSprite = Sprite.from('floor');
  layers.flooring.addChild(floorSprite);

  let mapBounds;

  // define the size and layout of the flooring
  const tileWidth = 64;
  const tileHeight = 64;
  const mapRows = 10;
  const mapCols = 10;

  const centerX = app.screen.width / 2; 
  const centerY = app.screen.height / 2; 

  layers.background.x = centerX;
  layers.background.y = centerY;
  layers.flooring.x = centerX;
  layers.flooring.y = centerY;

  function createWall(x, y, isNorthWall = false) {
      const wall = new Container();

      if (isNorthWall) {
          // Taller north wall
          const wallFront = Sprite.from('wall');
          wallFront.width = 64;
          wallFront.height = 96; // Much taller for north wall
          wallFront.anchor.set(0.5);
          wall.addChild(wallFront);
      } else {
          // Side and bottom walls
          const wallFront = Sprite.from('wallside');
          wallFront.width = 32; // Slimmer for side walls
          wallFront.height = 64;
          wallFront.anchor.set(1);
          wall.addChild(wallFront);
      }

      // Adjust wall position to align with tiles
      wall.position.set(x + tileWidth/2, y);
      return wall;
  }

  const createWalls = (mapCols, mapRows, layers) => {
      const walls = [];
      const mapWidth = mapCols * tileWidth;
      const mapHeight = mapRows * tileHeight;

      // First create floor tiles (including corners)
      for (let row = 0; row <= mapRows - 1; row++) {
          for (let col = 0; col <= mapCols - 1; col++) {
              const tileSprite = Sprite.from('floor');
              tileSprite.anchor.set(0.5);
              tileSprite.x = col * tileWidth - (mapCols * tileWidth) / 2 + tileWidth / 2;
              tileSprite.y = row * tileHeight - (mapRows * tileHeight) / 2 + tileHeight / 2;
              layers.flooring.addChild(tileSprite);
          }
      }

      // Create north walls (taller)
      for (let col = 0; col < mapCols; col++) {
          walls.push(createWall(
              col * tileWidth - (mapWidth / 2),
              -mapHeight / 2,
              true
          ));
      }

      // Create south walls
      for (let col = 0; col < mapCols; col++) {
          walls.push(createWall(
              col * tileWidth - (mapWidth / 2),
              mapHeight / 2
          ));
      }

      // Create west walls
      for (let row = 0; row < mapRows; row++) {
          walls.push(createWall(
              -mapWidth / 2,
              row * tileHeight - (mapHeight / 2)
          ));
      }

      // Create east walls
      for (let row = 0; row < mapRows; row++) {
          walls.push(createWall(
              mapWidth / 2,
              row * tileHeight - (mapHeight / 2)
          ));
      }

      // Add corner pieces to ensure complete coverage
      const corners = [
          createWall(-mapWidth / 2, -mapHeight / 2), // Top-left
          createWall(mapWidth / 2, -mapHeight / 2),  // Top-right
          createWall(-mapWidth / 2, mapHeight / 2),  // Bottom-left
          createWall(mapWidth / 2, mapHeight / 2)    // Bottom-right
      ];

      walls.push(...corners);

      walls.forEach(wall => layers.flooring.addChild(wall));
  };

  const initializeRoom = (mapCols, mapRows, layers) => {
      createWalls(mapCols, mapRows, layers);
  };

  initializeRoom(mapCols, mapRows, layers);

  mapBounds = new Rectangle(
    centerX - (mapCols * tileWidth) / 2,
    centerY - (mapRows * tileHeight) / 2,
    mapCols * tileWidth,
    mapRows * tileHeight
  );

  const character = new MainSprite({ app, spritesheet });
  layers.characters.addChild(character);

  const table = Sprite.from('table');
  table.position.set(app.canvas.width / 2,app.canvas.height - mapBounds.height)
  table.anchor.set(0.5);
  table.scale.set(2);
  table.uid = 'table'; // Assign a unique UID
  layers.ui.addChild(table);

  const anotherElement = Sprite.from('someAsset');
  anotherElement.uid = 'anotherElement';
  layers.ui.addChild(anotherElement);


  const koreaMap = new KoreaMap(app, centerX, centerY, ({ event, name }) => {
        onRoomUpdate(layers, name);
  });

  layers.ui.addChild(koreaMap.rectangleSprite);

  // movement speed
  const speed = 3.5;

  // function to hide the mapLayer

  // key tracking
  window.addEventListener('keydown', (event) => {
    keys[event.code] = true;

    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(event.code)) {
        if(koreaMap.rectangleSprite.visible) {
            koreaMap.rectangleSprite.visible = false
        }
      }

    // handle interaction on space bar press
    if (event.code === 'Space' && !window.isPopupActive) {
      for (const ui_el of layers.ui.children) {
        if (testForAABB(character.sprite, ui_el)) {
          if (ui_el.uid === 'table') {
            koreaMap.toggleVisibility();
            playSound('mapinteract'); // Play the map interaction sound
            break;
          }

//          if (ui_el.uid != mapLayer.uid) {
//            onInteract(app, ui_el, 'hello');
//            break;
//          }
        }
      }
    }
  });


  window.addEventListener('keyup', (event) => {
    keys[event.code] = false;
  });

  let isMovingSoundPlaying = false;
  // game loop for movement and animation
  app.ticker.add((delta) => {
    let moving = false;

    const oriX = character.x;
    const oriY = character.y;

    if (keys['ArrowUp'] || keys['KeyW']) {
      character.moveUp(speed);
      moving = true;
    }
    if (keys['ArrowDown'] || keys['KeyS']) {
      character.moveDown(speed);
      moving = true;
    }
    if (keys['ArrowLeft'] || keys['KeyA']) {
      character.moveLeft(speed);
      moving = true;
    }
    if (keys['ArrowRight'] || keys['KeyD']) {
      character.moveRight(speed);
      moving = true;
    }

    // Play movement sound if moving and sound is not already playing
if (moving && !isMovingSoundPlaying) {
  playSound('woodsteps', 1.5, true); // Specify loop as true
  isMovingSoundPlaying = true;
}


    // Stop movement sound if not moving
    if (!moving && isMovingSoundPlaying) {
      stopSound('woodsteps'); // Make sure to implement this function in `soundfx.js`
      isMovingSoundPlaying = false;
    }
    if(testForAABB(table, character.sprite)) {
        moving = false;
    }
    // only play sound if moving
    //moving && playSound('woodsteps')

    if (!moving) {
      character.standStill();
    }

    // check bounds
    if (!isWithinBounds(character.sprite, mapBounds)) {
      character.x = oriX;
      character.y = oriY;
    }
  });

  const menu = createMenu(layers);
})();
