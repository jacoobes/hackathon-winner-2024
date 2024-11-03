import * as PIXI from 'pixi.js';

export class GirlfriendMessage {
  constructor(app, layers) {
    this.app = app;
    this.layers = layers;
  }

  showMessage() {
    const popupContainer = new PIXI.Container();

    const boxWidth = 400;
    const boxHeight = 80;

    const borderSprite = new PIXI.Sprite(PIXI.Texture.WHITE);
    borderSprite.tint = 0x000000;
    borderSprite.width = boxWidth + 6; 
    borderSprite.height = boxHeight + 6;
    borderSprite.anchor.set(0.5);
    popupContainer.addChild(borderSprite);

    const backgroundSprite = new PIXI.Sprite(PIXI.Texture.WHITE);
    backgroundSprite.tint = 0xFFFFFF; 
    backgroundSprite.width = boxWidth; 
    backgroundSprite.height = boxHeight;
    backgroundSprite.anchor.set(0.5);
    popupContainer.addChild(backgroundSprite);

    const fullText = "Let's go to KOREA!";
    const message = new PIXI.Text('', {
      fill: 0x000000,          
      fontSize: 20,
      fontFamily: 'Monocraft',  
      wordWrap: true,
      wordWrapWidth: boxWidth - 20,
    });
    message.anchor.set(0.5);
    message.position.set(0, 0);
    popupContainer.addChild(message);

    popupContainer.position.set(
      this.app.screen.width / 2 + 20, 
      this.app.screen.height - 120 
    );
    this.layers.ui.addChild(popupContainer);

    window.isPopupActive = true;

    let currentIndex = 0;
    const typeInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        message.text += fullText[currentIndex];
        currentIndex++;
      } else {
        clearInterval(typeInterval);
      }
    }, 50);

    const onKeyDown = (event) => {
      this.layers.ui.removeChild(popupContainer);
      window.isPopupActive = false;
      clearInterval(typeInterval);  
      window.removeEventListener('keydown', onKeyDown);
    };
    window.addEventListener('keydown', onKeyDown);
  }
}
