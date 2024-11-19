//export default
export default class ScoreScene extends Phaser.Scene {
  constructor(config) {
    super("ScoreScene");
    this.config = config;
    this.menu = [
      {scene: "MenuScene", text: "GAME MENU"},
      {scene: null, text: "Exit Game"},
    ];
    this.fontLineHeight = 70;
  }

  create() {
    this.createBG();
    this.createMenu(this.menu);
    const bestScore = localStorage.getItem("bestScore");
    this.add
      .text(
        this.config.width * 0.5,
        this.config.height * 0.5 * 0.95,
        `Best Score: ${bestScore || 0}`,
        {fontSize: "5rem", fill: "#445ef3"}
      )
      .setOrigin(0.5);
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
      lastBtnPosY += this.fontLineHeight * 2;
      btnText.on("pointerover", () => {
        btnText.setStyle({fill: "#ff3f2c"});
      });
      btnText.on("pointerout", () => {
        btnText.setStyle(this.config.fontOptions);
      });

      btnText.on("pointerup", () => {
        btn.scene && this.scene.start(btn.scene);
        if (btn.text === "Exit Game") {
          this.game.destroy(true);
        }
      });
    });
  }
}
