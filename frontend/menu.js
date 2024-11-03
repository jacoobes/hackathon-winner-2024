import { onRoomUpdate } from './roomUpdates.js';
import { Graphics, Text, Container } from 'pixi.js';

export function createMenu(layers) {
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

    const title = new Text('Select Background', {
        fill: '#000',
        fontSize: 20,
        fontWeight: 'bold'
    });
    title.position.set(10, 50);
    menuBackground.addChild(title);

    const options = ['mainBackground', 'option1'];

    // Create buttons with press effect
    options.forEach((option, index) => {
        const buttonContainer = new Container();
        buttonContainer.interactive = true;
        buttonContainer.buttonMode = true;
        buttonContainer.position.set(10, 90 + index * 40);

        const buttonBackground = new Graphics();
        buttonBackground.beginFill(0xeeeeee);
        buttonBackground.drawRect(0, 0, menuWidth - 20, 30);
        buttonBackground.endFill();

        const buttonText = new Text(option, {
            fill: '#000',
            fontSize: 16,
        });
        buttonText.position.set(10, 5);

        // Add hover and press effects
        buttonContainer.on('mouseover', () => buttonBackground.tint = 0xdddddd);
        buttonContainer.on('mouseout', () => buttonBackground.tint = 0xffffff);

        // Add "pressed" effect on pointer down and up
        buttonContainer.on('pointerdown', () => {
            buttonContainer.scale.set(0.95);
        });

        buttonContainer.on('pointerup', () => {
            buttonContainer.scale.set(1);
            if (layers.background) {
                while (layers.background.children.length > 0) {
                    layers.background.removeChild(layers.background.children[0]);
                }
                onRoomUpdate(layers, option);
            }
        });

        buttonContainer.on('pointerupoutside', () => {
            buttonContainer.scale.set(1);
        });

        buttonContainer.addChild(buttonBackground);
        buttonContainer.addChild(buttonText);
        menuBackground.addChild(buttonContainer);
    });

    const toggleButton = new Container();
    const toggleBackground = new Graphics();
    toggleBackground.beginFill(0x4a90e2);
    toggleBackground.drawRoundedRect(0, 0, 60, 30, 5);
    toggleBackground.endFill();

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

    toggleButton.interactive = true;
    toggleButton.buttonMode = true;

    toggleButton.on('mouseover', () => toggleBackground.tint = 0x357abd);
    toggleButton.on('mouseout', () => toggleBackground.tint = 0x4a90e2);

    toggleButton.on('pointerdown', () => {
        if (isAnimating) return;
        isAnimating = true;
        isOpen = !isOpen;
        const targetX = isOpen ? 0 : -menuWidth;
        let startTime = null;
        const animationDuration = 200;

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
                menuBackground.position.x = targetX;
                isAnimating = false;
            }
        }

        requestAnimationFrame(animate);
    });

    menuContainer.addChild(toggleButton);
}
