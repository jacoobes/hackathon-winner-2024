import { sound } from '@pixi/sound';

export const loadSounds = () => {
    sound.add('crying', '/assets/gojocry.mp3');
    sound.add('woodsteps', '/assets/woodstep.mp3');
};

export const playSound = (soundAlias, rate = 1) => {
    sound.play(soundAlias, { loop: true, speed: rate});
};

export const stopSound = (soundAlias) => {
    sound.stop(soundAlias);
};
