import { ROOM_CONFIGS } from './roomUpdates.js';
import { Graphics, Text, Container } from 'pixi.js';

export function createMenu(layers, koreaMap) {
    const menuWidth = 200;
    const menuHeight = window.innerHeight;
    let isOpen = false;
    let isAnimating = false;

    const menuContainer = new Container();
    layers.menu.addChild(menuContainer);

    // Create menu background
    const menuBackground = new Graphics();
    menuBackground.beginFill(0xffffff, 0.9);
    menuBackground.drawRect(0, 0, menuWidth, menuHeight);
    menuBackground.endFill();
    menuBackground.position.set(-menuWidth, 0);
    menuContainer.addChild(menuBackground);

    // Create title
    const title = new Text('Select Background', {
        fill: '#000',
        fontSize: 20,
        fontWeight: 'bold'
    });
    title.position.set(10, 50);
    menuBackground.addChild(title);

    const options = Object.keys(ROOM_CONFIGS);

    // Make buttons interactive
    options.forEach((option, index) => {
        const button = new Text(option, {
            fill: '#000',
            fontSize: 16,
        });

        // Make the button interactive
        button.interactive = true;
        button.buttonMode = true;

        // Create a hit area for better click detection
        const padding = 10;
        const buttonBackground = new Graphics();
        buttonBackground.beginFill(0xeeeeee);
        buttonBackground.drawRect(
            0,
            0,
            menuWidth - 20,
            30
        );
        buttonBackground.endFill();
        buttonBackground.position.set(10, 90 + index * 40);

        // Position text on top of background
        button.position.set(
            buttonBackground.position.x + padding,
            buttonBackground.position.y + 5
        );

        // Add hover effects
        buttonBackground.interactive = true;
        buttonBackground.buttonMode = true;
        buttonBackground.on('mouseover', () => buttonBackground.tint = 0xdddddd);
        buttonBackground.on('mouseout', () => buttonBackground.tint = 0xffffff);

        // Add click handler
        buttonBackground.on('pointerdown', () => {
            if (layers.background) {
                // Clear existing background
                while (layers.background.children.length > 0) {
                    layers.background.removeChild(layers.background.children[0]);
                }
                // Call room update
                koreaMap.onRoomUpdate(option);
            }
        });

        menuBackground.addChild(buttonBackground);
        menuBackground.addChild(button);
    });

    // Create toggle button using PixiJS
    const toggleButton = new Container();

    // Toggle button background
    const toggleBackground = new Graphics();
    toggleBackground.beginFill(0x4a90e2);
    toggleBackground.drawRoundedRect(0, 0, 60, 30, 5);
    toggleBackground.endFill();

    // Toggle button text
    const toggleText = new Text('Menu', {
        fill: '#ffffff',
        fontSize: 16,
    });
    toggleText.position.set(
        (toggleBackground.width - toggleText.width) / 2,
        (toggleBackground.height - toggleText.height) / 2
    );

    toggleButton.addChild(toggleBackground);
    toggleButton.addChild(toggleText);
    toggleButton.position.set(10, 10);

    // Make toggle button interactive
    toggleButton.interactive = true;
    toggleButton.buttonMode = true;

    // Add hover effects
    toggleButton.on('mouseover', () => toggleBackground.tint = 0x357abd);
    toggleButton.on('mouseout', () => toggleBackground.tint = 0xffffff);

    // Handle toggle click with animation lock
    toggleButton.on('pointerdown', () => {
        if (isAnimating) return; // Prevent multiple animations

        isAnimating = true;
        isOpen = !isOpen;
        const targetX = isOpen ? 0 : -menuWidth;
        let startTime = null;
        const animationDuration = 200; // Animation duration in milliseconds

        // Animate using requestAnimationFrame with timing control
        function animate(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = (timestamp - startTime) / animationDuration;

            if (progress < 1) {
                const currentX = isOpen
                    ? -menuWidth + (menuWidth * progress)
                    : -menuWidth * progress;
                menuBackground.position.x = currentX;
                requestAnimationFrame(animate);
            } else {
                // Ensure we end exactly at the target position
                menuBackground.position.x = targetX;
                isAnimating = false; // Release animation lock
            }
        }

        requestAnimationFrame(animate);
    });

    menuContainer.addChild(toggleButton);
}
