import './style.css';
import { Application, Assets, Sprite, Container, Rectangle } from 'pixi.js';

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

    Assets.add({ alias: 'amogusfront', src: '/assets/xak.png' });
    Assets.add({ alias: 'amogusback', src: '/assets/gojodrink.png'}); //change to actual back
    Assets.add({ alias: 'amogusleft', src: '/assets/Red_Amogus.png'}); //change to actual left
    Assets.add({ alias: 'amogusright', src: '/assets/back_hover.png'}); //change to actual right
    Assets.add({ alias: 'floor', src: '/assets/wood.png' }); //floor


    let mapBounds;
    const characterTextures = {};

    // Load the floor first
    Assets.load('floor').then(() => {
      // Create a container for the map
      const mapContainer = new Container();
      app.stage.addChild(mapContainer);

      // Define the size and layout of the flooring
      const tileWidth = 64;
      const tileHeight = 64;
      const mapRows = 10;
      const mapCols = 10;

      const centerX = (app.screen.width - (mapCols * tileWidth)) / 2;
      const centerY = (app.screen.height - (mapRows * tileHeight)) / 2;

      mapContainer.x = centerX;
      mapContainer.y = centerY;

      for (let row = 0; row < mapRows; row++) {
        for (let col = 0; col < mapCols; col++) {
          const tileSprite = new Sprite(Assets.get('floor'));
          tileSprite.anchor.set(0.5);
          tileSprite.x = col * tileWidth + tileWidth / 2;
          tileSprite.y = row * tileHeight + tileHeight / 2;

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
      return Promise.all([
              Assets.load('amogusfront').then(texture => characterTextures.front = texture),
              Assets.load('amogusback').then(texture => characterTextures.back = texture),
              Assets.load('amogusleft').then(texture => characterTextures.left = texture),
              Assets.load('amogusright').then(texture => characterTextures.right = texture),
      ]);
    }).then(() => {
      // Create a new Sprite from the resolved loaded texture
      const character = new Sprite(characterTextures.front);

      character.anchor.set(0.5);
      character.x = app.screen.width / 2;
      character.y = app.screen.height / 2;
      character.scale.set(3.0);
      character.eventMode = 'static';
      character.cursor = 'pointer';

      app.stage.addChild(character);
      const speed = 24;

      // Movement logic
      window.addEventListener('keydown', (event) => {
        const oriX = character.x;
        const oriY = character.y;

        switch (event.key) {
          case 'ArrowUp':
            character.texture = characterTextures.back;
            character.y -= speed;
            break;
          case 'ArrowDown':
            character.texture = characterTextures.front;
            character.y += speed;
            break;
          case 'ArrowLeft':
            character.texture = characterTextures.left;
            character.x -= speed;
            break;
          case 'ArrowRight':
            character.texture = characterTextures.right;
            character.x += speed;
            break;
        }

        if (!isWithinBounds(character, mapBounds)) {
            character.x = oriX;
            character.y = oriY;
        }

        character.scale.set(3.0);
      });
    });
  });
})();
