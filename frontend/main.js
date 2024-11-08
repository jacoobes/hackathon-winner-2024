import './style.css';
import { createRectangle, toggle , KoreaMap } from './map.js';
import { AnimatedSprite, Application, Assets, Sprite, Container, Rectangle, SCALE_MODES, Texture, Spritesheet, TextureStyle } from 'pixi.js';
import { onInteract } from './interactable.js';
import SplashScreen from './SplashScreen.js';
import { createTable } from './roomUpdates.js';
import { createMenu } from './menu.js';
import { loadSounds, playSound, stopSound } from './soundfx.js'
let bgmIsPlaying = true;
TextureStyle.defaultOptions.scaleMode = 'nearest';
  const tileWidth = 64;
  const tileHeight = 64;
  const mapRows = 10;
  const mapCols = 10;
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
    { alias: 'floor', src: '/assets/floorv6.png' },
    { alias: 'meat', src: '/assets/meat.png' },
    { alias: 'mainBackground', src: '/assets/seoultower.png' },
    { alias: 'background1', src: '/assets/skysunset.png' },
    { alias: 'sprite', src: '/assets/spritesheet.png'},
    { alias: 'table', src: '/assets/table.png'},
    { alias: 'pin', src: '/assets/pin.png'},
    { alias: 'wallnorth', src: '/assets/wallv1.png'},
    { alias: 'wallside', src: '/assets/wallside.png'}, { alias: 'tableseoul', src: '/assets/table-seoul.png' },
    { alias: 'tablebusan', src: '/assets/table-busan.png' },
    { alias: 'koreanflag', src: '/assets/koreanflag.png' },
    { alias: 'fhanbok', src: '/assets/fhanbok.png' },
    { alias: 'mhanbok', src: '/assets/mhanbok.png' },
    { alias: 'myeongdong', src: '/assets/myeongdong.png' },
    { alias: 'palm', src: '/assets/palm.png' },
    { alias: 'table-jeju', src: '/assets/table-jeju.png' },
    { alias: 'busan-boat', src: '/assets/busan-boat.png' },
    { alias: 'busan-zombie', src: '/assets/busan-zombie.png' },
    { alias: 'bed', src: '/assets/bed.png' },
    { alias: 'gf', src: '/assets/girlfriend.png' }
    //{ alias: 'busan-arch', src: '/assets/busan-arch.png' }
  ]);
  loadSounds()
  playSound('bgm', 1, true, 0.1)
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
    
  const muteButton = document.createElement('button');
  muteButton.textContent = 'Mute';
  muteButton.style.position = 'absolute';
  muteButton.style.top = '10px';
  muteButton.style.right = '10px';
  muteButton.disabled = true; // Initially disable the button

  document.body.appendChild(muteButton);

  // Enable the button on mouseover, disable it on mouseout
  muteButton.addEventListener('mouseover', () => {
      muteButton.disabled = false;
  });
  muteButton.addEventListener('mouseout', () => {
      muteButton.disabled = true;
  });
  muteButton.addEventListener('click', () => {
      if (bgmIsPlaying) {
          stopSound('bgm');
          muteButton.textContent = 'Unmute';
      } else {
          playSound('bgm', 1, true, 0.1);
          muteButton.textContent = 'Mute';
      }
      bgmIsPlaying = !bgmIsPlaying;
  });
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
  app.centerX = app.screen.width / 2; 
  app.centerY = app.screen.height / 2; 


  const mapBounds = new Rectangle(
    app.centerX - (mapCols * tileWidth) / 2,
    app.centerY - (mapRows * tileHeight) / 2,
    mapCols * tileWidth,
    mapRows * tileHeight
  );
  createMenu(layers);
  
  return { layers, app, spritesheet, mapBounds };
};

// create new PixiJS application
(async () => {
  const { layers, app, spritesheet, mapBounds } = await initApp();

  // initialize floor
  const floorSprite = Sprite.from('floor');
  layers.flooring.addChild(floorSprite);

  // define the size and layout of the flooring



  layers.background.x = app.centerX;
  layers.background.y = app.centerY;
  layers.flooring.x = app.centerX;
  layers.flooring.y = app.centerY;

  function createWall(x, y, orientation) {
      const wall = new Container();
      let wallSprite;

      // Choose asset based on orientation
      if (orientation === 'north') {
          wallSprite = Sprite.from('wallnorth'); // Asset for north wall
          wallSprite.width = 64;
          wallSprite.height = 128;
          wallSprite.anchor.set(0);
      } else if (orientation === 'south') {
          wallSprite = Sprite.from('bordersouth'); // New asset for south wall
          wallSprite.width = 64; // Adjust width as needed
          wallSprite.height = 10; // Height can be adjusted if different
          wallSprite.anchor.set(0);
      } else if (orientation === 'west') {
          wallSprite = Sprite.from('wallside'); // Asset for west wall
          wallSprite.width = 32; // Slimmer for west wall
          wallSprite.height = 240;
          wallSprite.anchor.set(0); // Anchor to the left for west wall
      } else {
          wallSprite = Sprite.from('wallside'); // Asset for east wall
          wallSprite.width = 32; // Slimmer for east wall
          wallSprite.height = 240;
          wallSprite.anchor.set(0); // Anchor to the left for east wall
      }

      wall.addChild(wallSprite);

      // Adjust wall position to align with tiles
      wall.position.set(x, y);
      return wall;
  }

  /*const createCorner = (x, y, cornerType, cornerWidth, cornerHeight) => {
      const corner = new Container();
      let cornerSprite;

      // Choose corner asset based on corner type
      switch (cornerType) {
          case 'NW':
              cornerSprite = Sprite.from('cornerNW'); // Top-left corner
              break;
          case 'NE':
              cornerSprite = Sprite.from('cornerNE'); // Top-right corner
              break;
          case 'SW':
              cornerSprite = Sprite.from('cornerSW'); // Bottom-left corner
              break;
          case 'SE':
              cornerSprite = Sprite.from('cornerSE'); // Bottom-right corner
              break;
      }

      // Scale the corner sprite
      cornerSprite.width = cornerWidth;
      cornerSprite.height = cornerHeight;

      corner.addChild(cornerSprite);
      corner.position.set(x, y);
      return corner;
  }*/

  const createWalls = (mapCols, mapRows, layers) => {
      const walls = [];
      const mapWidth = mapCols * tileWidth;
      const mapHeight = mapRows * tileHeight;

      //const cornerWidth = 13; // Set desired width for corners
      //const cornerHeight = 20; // Set desired height for corners

      // Create floor tiles
      for (let row = 0; row <= mapRows - 1; row++) {
          for (let col = 0; col <= mapCols - 1; col++) {
              const tileSprite = Sprite.from('floor');
              tileSprite.anchor.set(0.5);
              tileSprite.x = col * tileWidth - (mapCols * tileWidth) / 2 + tileWidth / 2;
              tileSprite.y = row * tileHeight - (mapRows * tileHeight) / 2 + tileHeight / 2;
              layers.flooring.addChild(tileSprite);
          }
      }

      // Create north walls
      for (let col = 0; col < mapCols; col++) {
          walls.push(createWall(
              col * tileWidth - (mapWidth / 2),
              -(app.screen.height / 2), // Adjust the Y position to 64 (half of the wall height)
              'north'
          ));
      }

      // Create south walls
      for (let col = 0; col < mapCols; col++) {
          walls.push(createWall(
              col * tileWidth - (mapWidth / 2),
              mapHeight / 2,
              'south'
          ));
      }

      // Create west walls
      for (let row = 0; row < mapRows; row++) {
          walls.push(createWall(
              -mapWidth / 2,
              row * tileHeight - (mapHeight / 2) - 90,
              'west'
          ));
      }

      // Create east walls
      for (let row = 0; row < mapRows; row++) {
          walls.push(createWall(
              mapWidth / 2,
              row * tileHeight - (mapHeight / 2) - 90,
              'east'
          ));
      }

      // Add corner pieces with specified width and height
     /* walls.push(createCorner(-mapWidth / 2, -mapHeight / 2, 'NW', cornerWidth, cornerHeight)); // Top-left
      walls.push(createCorner((mapWidth / 2 - cornerWidth) + 13, -mapHeight / 2, 'NE', cornerWidth, cornerHeight)); // Top-right
      walls.push(createCorner(-mapWidth / 2, (mapHeight / 2 - cornerHeight) + 13, 'SW', cornerWidth, cornerHeight - 3)); // Bottom-left
      walls.push(createCorner((mapWidth / 2 - cornerWidth) + 13, mapHeight / 2 - cornerHeight, 'SE', cornerWidth, cornerHeight+10)); // Bottom-right

      // Add walls to the layer*/
      walls.forEach(wall => layers.flooring.addChild(wall));
  };

  const initializeRoom = (mapCols, mapRows, layers) => {
      createWalls(mapCols, mapRows, layers);
  };

  initializeRoom(mapCols, mapRows, layers);


  const character = new MainSprite({ app, spritesheet });
  layers.characters.addChild(character);

  const koreaMap = new KoreaMap(app, layers, mapBounds);
  koreaMap.onRoomUpdate('Home');
  const table = createTable(app, mapBounds);

  layers.ui.addChild(table);
  layers.ui.addChild(koreaMap.rectangleSprite)
  
  koreaMap.city = "Seoul"
  
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
    if (event.code === 'Space' ) {
      for (const ui_el of layers.ui.children) {
        if (testForAABB(character.sprite, ui_el)) {
          if (ui_el.uid === 'table') {
            toggle(koreaMap.rectangleSprite);
            playSound('mapinteract'); // Play the map interaction sound
            break;
          }
          if (ui_el.uid === 'palm') {
              onInteract(app, ui_el, "Jeju island is known for their beaches")
              break;
          }
          if (ui_el.uid === 'fhanbok') {
              const message = "This is a hanbok from Gyeongbokgung Palace. " +
              "The grandest of Seoul's five palaces, dating back to the Joseon Dynasty, with changing of the guard ceremonies and beautiful gardens."

              onInteract(app, ui_el, message)
              break;
          }

          if (ui_el.uid == 'gf') {
              onInteract(app, ui_el, "I love you. Lets go to KOREA!!! (Click on the map in the middle of the room");
              break;
          }
          if (ui_el.uid == 'tableseoul') {
              const foods = [
                  "Kimchi",
                  "Tteokbokki",
                  "Samgyeopsal",
                  "Korean Fried Chicken"
              ];
              onInteract(app, ui_el, "Table contains many delicious Korean foods: " + foods.join(","));
              break;

          }
          if (ui_el.uid == 'tablebusan') {
              const foods = [
                  "Sashimi (Hoe)",
                  "Grilled Eel (Jangeo-gui)",
                  "Busan-style Dwaeji Gukbap",
                  "Bindaetteok (Mung Bean Pancakes)"
              ];
              onInteract(app, ui_el, "Table contains many delicious Korean foods: " + foods.join(","));

              break
          }
          if (ui_el.uid == 'tablejeju') {
              const foods = [
                  "Sashimi (Hoe)",
                  "Grilled Eel (Jangeo-gui)",
                  "Busan-style Dwaeji Gukbap",
                  "Bindaetteok (Mung Bean Pancakes)"
              ];
              onInteract(app, ui_el, "Table contains many delicious Korean foods: " + foods.join(","));

              break
          }
          if (ui_el.uid === 'tablejeju') {
              const foods = [ "Black Pork (Heuk Dwaeji)",
                  "Abalone (Jeonbok)",
                  "Jeju Tangerines",
                  "Seaweed Soup (Miyeok-guk)",
                  "Hallabong Orange"
            ]
            onInteract(app, ui_el, "Table contains many delicious Korean foods: " + foods.join(","));
          }
          

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

  const menu = createMenu(layers, koreaMap);
})();
