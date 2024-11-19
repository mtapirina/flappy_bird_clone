export default class PauseScene extends Phaser.Scene {
  constructor(config) {
    super("PauseScene");
    this.config = config;
  }

  create() {
    this.createBG();
  }

  //functions
  createBG() {
    this.add.image(0, 0, "sky").setOrigin(0, 0);
  }
}
