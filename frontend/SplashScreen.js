import { Assets, Container, Graphics, Text, Sprite } from 'pixi.js'

class SplashScreen {
/**
 * @param {Application} app - PIXI Application instance
 * @param {Object} options - Configuration options
 * @param {string} [options.backgroundColor=0x000000] - Background color
 * @param {string} [options.logoUrl] - URL to logo image
 * @param {Object} [options.progressBar] - Progress bar customization
 * @param {number} [options.progressBar.width=300] - Progress bar width
 * @param {number} [options.progressBar.height=20] - Progress bar height
 * @param {number} [options.progressBar.color=0xffffff] - Progress bar color
 * @param {string} [options.loadingText="Loading..."] - Loading text
 */
constructor(app, options = {}) {
    this.app = app;
    this.options = {
        backgroundColor: options.backgroundColor || 0x000000,
        logoUrl: options.logoUrl || null,
        progressBar: {
            width: options.progressBar?.width || 300,
            height: options.progressBar?.height || 20,
            color: options.progressBar?.color || 0xffffff
        },
        loadingText: options.loadingText || "Loading..."
    };

    // Create container for splash screen elements
    this.container = new Container();
    this.app.stage.addChild(this.container);

    // Create background
    this.background = new Graphics();
    this.container.addChild(this.background);

    // Create progress bar
    this.progressBarContainer = new Container();
    this.progressBarBg = new Graphics();
    this.progressBarFill = new Graphics();
    this.progressBarContainer.addChild(this.progressBarBg, this.progressBarFill);
    this.container.addChild(this.progressBarContainer);

    // Create loading text
    this.loadingText = new Text({
        text: this.options.loadingText, 
        fontFamily: 'Arial',
        fontSize: 24,
        fill: 0xffffff
    });
    this.container.addChild(this.loadingText);

    this.setup();
}

/**
 * Set up the splash screen layout
 * @private
 */
async setup() {
    // Draw background
    this.background.fill(this.options.backgroundColor);
    this.background.rect(0, 0, this.app.screen.width, this.app.screen.height);
    this.background.endFill();

    // Load and set up logo if provided
    if (this.options.logoUrl) {
        try {
            const texture = await Assets.load(this.options.logoUrl);
            this.logo = new Sprite(texture);
            this.logo.anchor.set(0.5);
            this.logo.x = this.app.screen.width / 2;
            this.logo.y = this.app.screen.height / 2 - 100;
            this.container.addChild(this.logo);
        } catch (error) {
            console.warn('Failed to load logo:', error);
        }
    }

    // Set up progress bar background
    this.progressBarBg.beginFill(0x333333);
    this.progressBarBg.roundRect(0, 0, 
        this.options.progressBar.width, 
        this.options.progressBar.height, 
        10);
    this.progressBarBg.endFill();

    // Position progress bar
    this.progressBarContainer.x = (this.app.screen.width - this.options.progressBar.width) / 2;
    this.progressBarContainer.y = this.app.screen.height / 2;

    // Position loading text
    this.loadingText.anchor.set(0.5);
    this.loadingText.x = this.app.screen.width / 2;
    this.loadingText.y = this.progressBarContainer.y + this.options.progressBar.height + 20;

    // Initial progress update
    this.updateProgress(0);
}

    /**
     * Update the loading progress
     * @param {number} progress - Progress value between 0 and 1
     */
    updateProgress(progress) {
        // Ensure progress is between 0 and 1
        progress = Math.max(0, Math.min(1, progress));

        // Update progress bar fill
        this.progressBarFill.clear();
        this.progressBarFill.beginFill(this.options.progressBar.color);
        this.progressBarFill.roundRect(0, 0,
            this.options.progressBar.width * progress,
            this.options.progressBar.height,
            10);
        this.progressBarFill.endFill();

        // Update loading text
        this.loadingText.text = `${this.options.loadingText} ${Math.round(progress * 100)}%`;
    }
    
    /**
     * Start loading assets and track progress
     * @param {Array} assets - Array of asset objects to load
     * @returns {Promise} Resolves when all assets are loaded
     */
    async loadAssets(assets) {
        // Add all assets to Assets
        assets.forEach(asset => {
            Assets.add(asset);
        });

        try {
            // Load all assets and track progress
            await Assets.load(assets.map(asset => asset.alias), (progress) => {
                this.updateProgress(progress);
            });

            // Add a small delay to show 100% completion
            await new Promise(resolve => setTimeout(resolve, 200));

            return true;
        } catch (error) {
            console.error('Error loading assets:', error);
            throw error;
        }
    }

    /**
     * Hide the splash screen with a fade out animation
     * @returns {Promise} Resolves when the animation is complete
     */
    async hide() {
        // Animate fade out
        const duration = 1000; // milliseconds
        const startTime = Date.now();

        return new Promise(resolve => {
            const fade = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                this.container.alpha = 1 - progress;

                if (progress < 1) {
                    requestAnimationFrame(fade);
                } else {
                    this.container.destroy();
                    resolve();
                }
            };

            fade();
        });
    }
}

export default SplashScreen;
