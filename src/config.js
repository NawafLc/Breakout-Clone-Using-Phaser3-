import myGame from './GlobalVariables';
import GameScene from "./scenes/GameScene";


 export default {
  type: Phaser.AUTO,
  parent: "game",
  width: 800,
  height: 640,
  backgroundColor:'#FFF3D2',
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: false
    },
	},
  scene: [GameScene]
};