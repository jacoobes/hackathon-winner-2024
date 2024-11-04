import { sound } from '@pixi/sound';

export const loadSounds = () => {
    sound.add('crying', '/assets/gojocry.mp3');
    sound.add('woodsteps', '/assets/woodstep.mp3');
    sound.add('mapinteract', '/assets/mapinteract.mp3');
    sound.add('bgm', '/assets/bgm1.mp3');
};

export const playSound = (soundAlias, rate = 1, loop = false) => {
    sound.play(soundAlias, { loop: loop, speed: rate });
};

export const stopSound = (soundAlias) => {
    sound.stop(soundAlias);
};
