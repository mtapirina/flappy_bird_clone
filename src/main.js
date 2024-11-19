/**@type {import("./types/phaser.js")} */
import PreloadScene from "./scenes/PreloadScene.js";
import MenuScene from "./scenes/MenuScene.js";
import PlayScene from "./scenes/PlayScene.js";
import ScoreScene from "./scenes/ScoreScene.js";
import PauseScene from "./scenes/PauseScene.js";
//CONST &&  variables
const WIDTH = 800;
const HEIGHT = 600;
const BIRD_PSITION = {x: WIDTH * 0.1, y: HEIGHT * 0.5};
const SCREEN_CENTER = [WIDTH * 0.5, HEIGHT * 0.5];
const FONT_OPTIONS = {fontSize: "3.5rem", fill: "#fbdc85"};
const GAME_CONFIG = {
  width: WIDTH,
  height: HEIGHT,
  startPosition: BIRD_PSITION,
  screenCenter: SCREEN_CENTER,
  fontOptions: FONT_OPTIONS,
};
//SHARE SCENES FUNCTION
const Scenes = [PreloadScene, MenuScene, ScoreScene, PlayScene, PauseScene];
const createScene = (Scene) => new Scene(GAME_CONFIG);
//initScenes function iterate array of scenes and .map() will create new instaces of pased scenes
const initScenes = () => Scenes.map(createScene);
//GAME CONFIGURATION
const config = {
  type: Phaser.AUTO,
  scale: {
    parent: "map",
    // full screen of parent div container
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    ...GAME_CONFIG,
  },
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      //gravity: { y: 400},
      //debug: true,
    },
  },
  backgroundColor: 0x000,
  scene: initScenes(),
};
const game = new Phaser.Game(config);
