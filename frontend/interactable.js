import * as PIXI from 'pixi.js';

//make text bottom
//truncate 
//focus using space 
window.isPopupActive = false; 

export function onInteract(app, ui_el, text) {
  const indent = 10; 
  const popupContainer = new PIXI.Container();
  window.isPopupActive = true; 
  popupContainer.name = "popupContainer"; 

  //deletes current popup if another popup is requested
  const existingPopup = app.stage.getChildByName("popupContainer"); 
  if (existingPopup) {
    app.stage.removeChild(existingPopup); 
  }

  const popUpBackground = new PIXI.Graphics();
  popUpBackground.beginFill(0x000000, 0.9); // Semi-transparent black
  popUpBackground.drawRoundedRect(0, 0, app.screen.width * 0.92, 100, 10); // Width, height, and rounded corners
  popUpBackground.endFill();
  popUpBackground.name = "popupBackground"; 
  popUpBackground.x = (app.screen.width - popUpBackground.width) / 2;
  popUpBackground.y = (app.screen.height - popUpBackground.height * 1.55);

  const popUpStyle = {
    fontFamily: 'Space Mono',
    fontSize: 19,
    fill: 0x000000,
    align: 'left'
  }
  const {truncatedText, remainingText} = wrapText(popUpBackground.width - (indent * 2), text, popUpStyle, 4);
  const popUpText = new PIXI.Text(truncatedText, popUpStyle);

  //positions the text
  popUpText.x = (popUpBackground.x + indent) ; 
  popUpText.y = (app.screen.height - popUpBackground.height * 1.5);
  
  // Add the pop-up elements to the container
  popupContainer.addChild(popUpBackground);
  popupContainer.addChild(popUpText);

// Function to handle keyboard interaction
  const handleKeyDown = (event) => {
    if (event.key == ' ' && window.isPopupActive == true) {
      if (remainingText) {
        app.stage.removeChild(popupContainer);
        onInteract(app, ui_el, remainingText);
      } else {
        app.stage.removeChild(popupContainer); 
        window.isPopupActive = false; 
      }
    }
  };
  // Add event listener for space key
  window.addEventListener('keydown', handleKeyDown);

  // Clean up on removing popup
  popupContainer.on('removed', () => {
  window.removeEventListener('keydown', handleKeyDown);
  });

  app.stage.addChild(popupContainer); 
}

//wraps the text and truncates the text
function wrapText(maxWidth, text, style, maxLines) {
  const words = text.split(" "); // Split text by letter
  let line = ""; 
  let wrappedText = "";
  let remainingText = "";
  let lineCount = 0;

  const tempText = new PIXI.Text("", style);

  for (let i = 0; i < words.length; i++) {
    const word = words[i]; 
    const testLine = line + word + " ";
    tempText.text = testLine;

    if (tempText.width > maxWidth && line.length > 0) {
      wrappedText += line + "\n";
      line = word; // Start new line with the current letter
      lineCount += 1;
      if (lineCount >= maxLines) {
        wrappedText = wrappedText.trimEnd() + "...";
        remainingText = words.slice(i).join(" "); // Remaining letters
        return { truncatedText: wrappedText.trimEnd(), remainingText };
      }
    } else {
      line = testLine;
    }
  }  
  wrappedText += line; 
  return { truncatedText: wrappedText, remainingText}; 
}


