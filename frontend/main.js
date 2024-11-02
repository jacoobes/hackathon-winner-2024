import './style.css';
import { Application, Assets, Sprite, Container, Rectangle } from 'pixi.js';
import { onInteract } from './interactable.js';

function isWithinBounds(character, bounds) {
    const characterBounds = character.getBounds();
    return (
        characterBounds.x >= bounds.x &&
        characterBounds.x + characterBounds.width <= bounds.x + bounds.width &&
        characterBounds.y >= bounds.y &&
        characterBounds.y + characterBounds.height <= bounds.y + bounds.height
    );
}

// Create a new PixiJS application
(async () => {
  const app = new Application();

  await app.init({
    background: '#1099bb',
    resizeTo: window,
  }).then(() => {
    document.body.appendChild(app.canvas); // Use app.view to append the canvas

    Assets.add({ alias: 'amogus', src: '/assets/xak.png' });
    Assets.add({ alias: 'floor', src: '/assets/wood.png' });

    let mapBounds;
    // Load the floor first
    Assets.load('floor').then(() => {
      // Create a container for the map
      const mapContainer = new Container();
      app.stage.addChild(mapContainer);

      // Define the size and layout of the flooring
      const tileWidth = 64; // Width of each tile
      const tileHeight = 64; // Height of each tile
      const mapRows = 10; // Number of rows
      const mapCols = 10; // Number of columns

      const centerX = (app.screen.width - (mapCols * tileWidth)) / 2;
      const centerY = (app.screen.height - (mapRows * tileHeight)) / 2;

      mapContainer.x = centerX;
      mapContainer.y = centerY;

      for (let row = 0; row < mapRows; row++) {
        for (let col = 0; col < mapCols; col++) {
          const tileSprite = new Sprite(Assets.get('floor'));
          tileSprite.anchor.set(0.5);
          tileSprite.x = col * tileWidth + tileWidth / 2; // Center the tile
          tileSprite.y = row * tileHeight + tileHeight / 2; // Center the tile

          mapContainer.addChild(tileSprite);
        }
      }
      mapBounds = new Rectangle(
        centerX,
        centerY,
        mapCols * tileWidth,
        mapRows * tileHeight
      );

      // Now load the character sprite
      return Assets.load('amogus');
    }).then((texture) => {
      // Create a new Sprite from the resolved loaded texture
      const character = new Sprite(texture);

      character.anchor.set(0.5);
      character.x = app.screen.width / 2;
      character.y = app.screen.height / 2;
      character.scale.set(3.0);
      character.eventMode = 'static';
      character.cursor = 'pointer';

      app.stage.addChild(character);
      const speed = 20;

      // Movement logic
      window.addEventListener('keydown', (event) => {
        const oriX = character.x;
        const oriY = character.y;

        switch (event.key) {
          case 'ArrowUp':
            character.y -= speed; // Move up
            break;
          case 'ArrowDown':
            character.y += speed; // Move down
            break;
          case 'ArrowLeft':
            character.x -= speed; // Move left
            break;
        case 'ArrowRight':
            character.moveRight(speed);
            break;
        case ' ': //space key
            for (const ui_el of layers.ui.children) {
                if(testForAABB(character, ui_el)){ 
                    onInteract(app, ui_el, "This text needs to be wrapped severely bad because This text needs to be wrapped severely bad because This text needs to be wrapped severely bad because This text needs to be wrapped severely bad because This text needs to be wrapped severely bad because This text needs to be wrapped severely bad because This text needs to be wrapped severely bad because"); 
                }
            }
            //if item nearby
            // open menu
            break;
        default:
            console.log(event.key)
          case 'ArrowRight':
            character.x += speed; // Move right
            break;
        }

        const tempChar = new Sprite(texture);
        tempChar.x = character.x;
        tempChar.y = character.y;
        tempChar.width = character.width;
        tempChar.height = character.height;

        if (!isWithinBounds(character, mapBounds)) {
            character.x = oriX;
            character.y = oriY;
        }
      });
    });
  });
})();
