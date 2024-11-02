import { Assets } from 'pixi.js';

/**
 * Creates and loads assets for PixiJS applications
 * @param {Object} options - Configuration options for the asset
 * @param {string} options.name - Unique identifier for the asset
 * @param {string} options.url - URL or path to the asset
 * @param {string} options.type - Asset type ('texture', 'spritesheet', 'sound', 'json')
 * @param {Object} [options.metadata] - Additional metadata for the asset
 * @returns {Promise} Promise that resolves with the loaded asset
 */
function createAsset(options) {
    const { name, url, type, metadata = {} } = options;

    // Validate required parameters
    if (!name || !url || !type) {
        throw new Error('Missing required parameters: name, url, and type are required');
    }

    // Initialize PIXI Assets if not already done
    if (!PIXI.Assets.resolver) {
        PIXI.Assets.init();
    }

    // Handle different asset types
    switch (type.toLowerCase()) {
        case 'texture':
            return loadTexture(name, url, metadata);
        case 'spritesheet':
            return loadSpritesheet(name, url, metadata);
        case 'sound':
            return loadSound(name, url, metadata);
        
        default:
            throw new Error(`Unsupported asset type: ${type}`);
    }
}

/**
 * Loads a texture asset
 * @private
 */
async function loadTexture(name, url, metadata) {
    try {
        Assets.add(name, url);
        const texture = await Assets.load(name);
        
        if (metadata.scale) {
            texture.scale = metadata.scale;
        }
        
        return texture;
    } catch (error) {
        throw new Error(`Failed to load texture ${name}: ${error.message}`);
    }
}

/**
 * Loads a spritesheet asset
 * @private
 */
async function loadSpritesheet(name, url, metadata) {
    try {
        Assets.add(name, url);
        const spritesheet = await Assets.load(name);
        
        if (metadata.animations) {
            // Process any custom animations defined in metadata
            metadata.animations.forEach(animation => {
                spritesheet.animations[animation.name] = 
                    spritesheet.animations[animation.name] || [];
            });
        }
        
        return spritesheet;
    } catch (error) {
        throw new Error(`Failed to load spritesheet ${name}: ${error.message}`);
    }
}

/**
 * Loads a sound asset
 * @private
 */
async function loadSound(name, url, metadata) {
    try {
        PIXI.Assets.add(name, url);
        const sound = await Assets.load(name);
        
        if (metadata.volume) {
            sound.volume = metadata.volume;
        }
        
        return sound;
    } catch (error) {
        throw new Error(`Failed to load sound ${name}: ${error.message}`);
    }
}


// Export the main function
export default createAsset;
