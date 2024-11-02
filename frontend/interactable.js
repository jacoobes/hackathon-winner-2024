import * as PIXI from 'pixi.js';

export function onInteract(event, app, text) {
  const sprite = event.currentTarget; 

  const popUpBackground = new PIXI.Graphics();
  popUpBackground.beginFill(0x000000, 0.9); // Semi-transparent black
  popUpBackground.drawRoundedRect(0, 0, 250, 100, 10); // Width, height, and rounded corners
  popUpBackground.endFill();
  popUpBackground.x = (app.screen.width - popUpBackground.width) / 2;
  popUpBackground.y = (app.screen.height - popUpBackground.height) / 2;

  const popUpText = new PIXI.Text(text, {
    fontFamily: 'Arial', 
    fontSize: 20, 
    fill: 0x000000, 
    align: 'center', 
  }); 

  //positions the text
  popUpText.x = (app.screen.width - popUpText.width) / 2; 
  popUpText.y = (app.screen.height - popUpText.height) / 2; 

  // Create the "X" close button
  const closeButton = new PIXI.Text("X", {
    fontFamily: 'Arial',
    fontSize: 24,
    fill: 0xff0000, // Red color for the close button
    align: 'center',
  });
  closeButton.interactive = true;
  closeButton.buttonMode = true; // Makes the cursor look like a pointer on hover
  closeButton.x = popUpBackground.x + popUpBackground.width - closeButton.width - 10;
  closeButton.y = popUpBackground.y + 5;
  
  // Add the click event to the "X" button to close the pop-up
  closeButton.on('pointerdown', () => {
    app.stage.removeChild(popUpBackground);
    app.stage.removeChild(popUpText);
    app.stage.removeChild(closeButton);
  });

  // Add the pop-up elements to the stage
  app.stage.addChild(popUpBackground);
  app.stage.addChild(popUpText);
  app.stage.addChild(closeButton);
}