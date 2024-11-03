import { Sprite, Texture, Container, Assets } from 'pixi.js';
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
                sprite: 'koreanflag',
                x: 270+500,
                y: 65,
                type: "info",
            },
            {
                sprite: 'fhanbok',
                x: 1050,
                y: 300,
                type: "info",
            },
            {
                sprite: 'mhanbok',
                x: 1050,
                y: 400,
                scale: 2,
                type: "info",
            },
            {
                //from right to left, kimchi, korean chicken wings, Samgyeopsal, Tteokbokki
                sprite: 'tableseoul',
                x: 150+500,
                y: 650,
                scale: 3,
                type: "info",
            },

            {
                sprite: 'myeongdong',
                x: 500+500,
                y: 550,
                type: "info",
            }
            
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
            // from left to right "Sashimi (Hoe)", "Grilled Eel (Jangeo-gui)",
            // "Busan-style Dwaeji Gukbap", "Bindaetteok (Mung Bean Pancakes)"
            {
                sprite: 'tablebusan',
                x: 150+500,
                y: 650,
                scale: 3,
                type: "info",
            }
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

// roomUpdates.js
export function cleanup(layer) {
    for (let i = layer.children.length - 1; i >= 0; i--) {
        const child = layer.children[i];

        // Skip elements that should persist
        if (child.uid === 'KOREAMAP' || child.uid === 'table') {
            continue;
        }

        // Unload asset if it's managed by PIXI.Assets, or destroy otherwise
        if (child.texture) {
            Assets.unload(child.texture);
        }

        // Finally, destroy the child safely
        child.destroy({ children: true, texture: true, baseTexture: true });
    }
}


export function updateRoom(option, layers) {
    const roomConfig = ROOM_CONFIGS[option];
    if (!roomConfig) {
        console.warn(`No configuration found for option: ${option}`);
        return;
    }

    if (roomConfig.interactives) {
        for (const interactive of roomConfig.interactives) {
            const sprite = Sprite.from(interactive.sprite);
            sprite.anchor.set(0.5);
            sprite.position.set(interactive.x, interactive.y);
            if (interactive.scale) {
                sprite.scale.set(interactive.scale);
            }
            layers.ui.addChild(sprite);
        }
    }
}

