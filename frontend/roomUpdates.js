import { Sprite, Assets, Texture } from 'pixi.js';
import { onInteract } from './interactable.js';

export const ROOM_CONFIGS = {
    "Seoul": {
        interactives: []
    },
    "Busan": {
        interactive: [{
            sprite: 'amogusfront',
            x: 500,
            y: 500,
            scale: 2,
            interaction: "different message"
        }]
    },
    "Jeju Island": {
        interactives: [{
            sprite: 'amogusfront',
            x: 500,
            y: 500,
            scale: 2,
            interaction: "different message"
        }]
    }
};

export function onRoomUpdate(layers, option, app) {
    if (layers.background.children.length > 0) {
        layers.background.removeChildren();
    }

    if (layers.ui.children.length > 0) {
        layers.ui.removeChildren();
    }

    const roomConfig = ROOM_CONFIGS[option];
    if (!roomConfig) { 
        console.warn("Unknown roomConfig", roomConfig)
        return;
    }

    let background;

    if (roomConfig.background) {
        // Use the background texture from roomConfig
        const backgroundTexture = Texture.from(roomConfig.background);
        background = new Sprite(backgroundTexture);
    } else {
        // Create a black background if roomConfig.background is undefined
        background = new Sprite(Texture.WHITE);
        background.tint = 0x000000; // Set color to black
    }

    // Set background size and position
    background.width = window.innerWidth;
    background.height = window.innerHeight;
    background.anchor.set(0.5);
    layers.background.addChild(background);

    if (roomConfig.interactives) {
        for (const interactive of roomConfig.interactives) {
            const sprite = Sprite.from(interactive.sprite);
            sprite.x = interactive.x;
            sprite.y = interactive.y;
            sprite.scale.set(interactive.scale);
            //sprite.interactionMessage = roomConfig.interactive.interaction;
            layers.ui.addChild(sprite);
        }


        // If character exists, update position relative to character
        /*if (layers.characters.children.length > 0) {
            const character = layers.characters.children[0];
            interactive.x = character.x + 50;  // Offset from character
            interactive.y = character.y + 50;  // Offset from character
        }*/
    }
}
