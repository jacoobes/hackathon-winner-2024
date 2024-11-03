import { sound } from '@pixi/sound';

export const loadSounds = () => {
    sound.add('crying', '/assets/gojocry.mp3');
    sound.add('woodsteps', '/assets/woodstep.mp3');
};

export const playSound = (soundAlias) => {
    sound.play(soundAlias);
};
