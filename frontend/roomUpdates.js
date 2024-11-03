import { Sprite, Assets } from 'pixi.js';
import { onInteract } from './interactable.js';

const ROOM_CONFIGS = {
    "mainBackground": {
        background: 'mainBackground',
        interactives: [{
            sprite: 'meat',
            x: 300,
            y: 190,
            scale: 3,
            interaction: "hello"
        }]
    },
    "option1": {
        background: 'background1',
        interactives: [{
            sprite: 'amogusfront',
            x: 180,
            y: 190,
            scale: 2,
            interaction: "different message"
        }]
    },
    "Seoul": {
        interactives: [{
            sprite: 'amogusfront',
            x: 500,
            y: 500,
            scale: 2,
            interaction: "different message"
        }]
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

export function onRoomUpdate(layers, option) {
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

    const backgroundTexture = Sprite.from(roomConfig.background);
    const background = new Sprite(backgroundTexture);
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
