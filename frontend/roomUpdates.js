import { Sprite, Assets } from 'pixi.js';
import { onInteract } from './interactable.js';

const ROOM_CONFIGS = {
    "mainBackground": {
        background: 'mainBackground',
        interactive: {
            sprite: 'meat',
            x: 180,
            y: 190,
            scale: 3,
            interaction: "hello"
        }
    },
    "option1": {
        background: 'background1',
        interactive: {
            sprite: 'amogusfront',
            x: 180,
            y: 190,
            scale: 2,
            interaction: "different message"
        }
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
    if (!roomConfig) return;

    const backgroundTexture = Sprite.from(roomConfig.background);
    const background = new Sprite(backgroundTexture);
    background.width = window.innerWidth;
    background.height = window.innerHeight;
    background.anchor.set(0.5);
    layers.background.addChild(background);

    if (roomConfig.interactive) {
            const interactive = Sprite.from(roomConfig.interactive.sprite);
            interactive.x = roomConfig.interactive.x;
            interactive.y = roomConfig.interactive.y;
            interactive.scale.set(roomConfig.interactive.scale);
            interactive.interactionMessage = roomConfig.interactive.interaction;
            layers.ui.addChild(interactive);

            // If character exists, update position relative to character
            /*if (layers.characters.children.length > 0) {
                const character = layers.characters.children[0];
                interactive.x = character.x + 50;  // Offset from character
                interactive.y = character.y + 50;  // Offset from character
            }*/
    }
}