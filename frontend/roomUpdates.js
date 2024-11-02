import { Assets, Sprite } from 'pixi.js';

export function onRoomUpdate(app, option){
    if (app.stage.children.length > 0) {
        app.stage.removeChildAt(0);
    }

    let backgroundTexture;
    switch (option) {
      case "option1":
        backgroundTexture = Assets.get('backgroundOption1')
        break;
      case "option2":
        backgroundTexture = Assets.get('backgroundOption2')
    }

    const background = = new PIXI.Sprite(backgroundTexture);
    background.width = app.screen.width;
    background.height = app.screen.height;
    app.stage.addChildAt(background, 0);
}