import { Sprite, Texture, Container } from 'pixi.js';
import { onInteract } from './interactable.js';

export const createTable = (app, mapBounds) => {
    const table = Sprite.from('table')
    table.uid = 'table'
    table.anchor.set(0.5)
    table.scale.set(2)
    table.position.set(app.canvas.width / 2,app.canvas.height - mapBounds.height)
    return table;
}

export const ROOM_CONFIGS = {
    "Seoul": {
        interactives: [ 
            {
                sprite: 'meat',
                x: 275+500,
                y: 200,
                scale: 2,
                type: "info",
            },
            {
                sprite: 'meat',
                x: 175+500,
                y: 300,
                scale: 2,
                type: "info",
            },
            {
                sprite: 'meat',
                x: 175+500,
                y: 400,
                scale: 2,
                type: "info",
            },
            
        ]
    },
    "Busan": {
        interactives: [
            {
                sprite: 'meat',
                x: 500+500,
                y: 500,
                scale: 2,
                interaction: "different message",
                type: "info",
            },
            {
                sprite: 'meat',
                x: 175+500,
                y: 400,
                scale: 2,
                type: "info",
            },
        ]
    },
    "Jeju Island": {
        interactives: [
            {
                sprite: 'meat',
                x: 175+500,
                y: 400,
                scale: 2,
                type: "info",
            },

        ]
    }
};


