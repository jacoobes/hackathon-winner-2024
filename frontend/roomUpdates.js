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
    "Home": {
        interactives: [
            {
                sprite: 'bed',
                uid: 'bed',
                position: 'center top right',
                type: "info",
                scale: 2
            },
            { 
                sprite: 'gf',
                uid: 'gf',
                position: 'center top left',
                type: "info",
                scale: 3
            }

        ]
    },
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
                uid: 'fhanbok',
                position: 'center top right',
                type: "info",
            },
            {
                sprite: 'mhanbok',
                position: 'center left',
                scale: 2,
                type: "info",
            },
            {
                //from right to left, kimchi, korean chicken wings, Samgyeopsal, Tteokbokki
                sprite: 'tableseoul',
                position: 'center bot',
                uid: 'tableseoul',
                scale: 3,
                type: "info",
            },

            {
                sprite: 'myeongdong',
                position: 'center right',
                type: "info",
            }
            
        ]
    },
    "Busan": {
        interactives: [
            // from left to right "Sashimi (Hoe)", "Grilled Eel (Jangeo-gui)",
            // "Busan-style Dwaeji Gukbap", "Bindaetteok (Mung Bean Pancakes)"
            {
                uid: 'tablebusan',
                sprite: 'tablebusan',
                position: 'center bot',
                scale: 3,
                type: "info",
            },
            {
                sprite: 'busan-boat',
                position: 'center right',
                scale: 3,
                type: "info",
            },
            {
                sprite: 'busan-zombie',
                position: 'center left',
                scale: 3,
                type: "info",
            }
        ]
    },
    "Jeju Island": {
        interactives: [
            {
                sprite: 'palm',
                uid: 'palm',
                position: 'center left',
                scale: 2,
                type: "info",
            },
            {
                sprite: 'table-jeju',
                uid: 'tablejeju',
                position: 'center bot',
                type: "info",
            }

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



