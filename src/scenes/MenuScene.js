//MENU SCENE
export default class MenuScene extends Phaser.Scene {
  constructor(config) {
    super("MenuScene");
    this.config = config;
    this.menu = [
      {scene: "PlayScene", text: "PLAY GAME"},
      {scene: "ScoreScene", text: "Best Score"},
      {scene: null, text: "Exit Game"},
    ];
    //
    this.fontLineHeight = 70;
  }

  create() {
    this.createBG();
    this.createMenu(this.menu);
  }

  //functions
  createBG() {
    this.add.image(0, 0, "sky").setOrigin(0, 0);
  }

  createMenu(menu) {
    let lastBtnPosY = 0;
    menu.forEach((btn) => {
      const btnPosition = [
        this.config.screenCenter[0],
        this.config.screenCenter[1] - this.fontLineHeight + lastBtnPosY,
      ];
      let btnText = this.add
        .text(...btnPosition, btn.text, this.config.fontOptions)
        .setOrigin(0.5, 1)
        .setInteractive();
      lastBtnPosY += this.fontLineHeight;
      btnText.on("pointerover", () => {
        btnText.setStyle({fill: "#ff3f2c"});
      });
      btnText.on("pointerout", () => {
        btnText.setStyle(this.config.fontOptions);
      });

      btnText.on("pointerup", () => {
        btn.scene && this.scene.start(btn.scene);
        if (btn.text === "Exit Game") {
          this.scene.stop();
          this.game.destroy(true);
        }
      });
    });
  }
}
