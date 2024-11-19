//PLAY_SCENE
export default class PlayScene extends Phaser.Scene {
  constructor(config) {
    super("PlayScene");
    this.config = config;
    //distanceRangeHorizontal = pipes horizontal distance
    //distanceRangeOpen = pipes vertical  distance rande
    this.flapVelocity = -250;
    //
    this.currentDifficulty = "easy";
    this.difficulties = {
      easy: {
        distanceRangeHorizontal: [450, 500],
        distanceRangeOpen: [150, 200],
      },
      normal: {
        distanceRangeHorizontal: [370, 450],
        distanceRangeOpen: [140, 190],
      },
      hard: {
        distanceRangeHorizontal: [280, 360],
        distanceRangeOpen: [120, 160],
      },
    };
    //
    this.bird = null;
    this.pipesGroup = null;
    this.pipesToShow = 4;
    this.score = 0;
    this.scoreText = "";
    this.pipesVelocityY = -200;
    this.BG = 0xfff;
  }

  create() {
    this.currentDifficulty = "easy";
    this.createBG();
    this.createBird();
    this.createPipes();
    this.createColliders();
    this.createScore();
    this.createPauseButton();
    this.handleInputs();
    this.anims.create({
      key: "fly",
      frames: this.anims.generateFrameNumbers("bird", {start: 8, end: 15}),
      frameRate: 16,
      //frames repeat infinitly -1
      repeat: -1,
    });
    this.bird.play("fly");
  }
  update(time, delta) {
    this.checkGameStatus();
    this.recyclePipes();
  }
  //INPUTS
  handleInputs() {
    this.input.on("pointerdown", this.flap, this);
    this.input.keyboard.on("keydown-SPACE", this.flap, this);
  }

  //GAME STATUS
  checkGameStatus() {
    if (
      this.bird.getBounds().bottom >= this.config.height ||
      this.bird.y <= 0
    ) {
      this.gameOver();
    }
  }
  //2D COLLIDERS
  createColliders() {
    this.physics.add.collider(
      this.bird,
      this.pipesGroup,
      this.gameOver,
      null,
      this
    );
  }

  //GAME OVER - RESTART GAME
  gameOver() {
    
    this.physics.pause();
    this.bird.setTint(0xee4850);
    this.saveBestScore();
    //restart game
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.scene.restart();
      },
      loop: false,
    });
  }

  //SCORE TEXT
  createScore() {
    this.score = 0;
    const bestScore = localStorage.getItem("bestScore");
    this.scoreText = this.add.text(30, 20, `Score: ${0}`, {
      fontSize: "2.5rem",
      fill: "#fbdc85",
    });
    //best score
    this.bestScoreText = this.add.text(
      (this.config.width - this.scoreText.width) * 0.5,
      25,
      `Best Score: ${bestScore || 0}`,
      {fontSize: "2rem", fill: "#fbe900"}
    );
  }
  increaseScore() {
    this.score++;
    this.scoreText.setText(`Score: ${this.score}`);
  }
  saveBestScore() {
    //search the "bestScore" saved in local storage
    const bestScoreText = localStorage.getItem("bestScore");
    //if there is - transform text score to numeric value
    const bestScore = bestScoreText && parseInt(bestScoreText, 10);
    // if "bestScore" no exist in local storage => create "bestScore" from exist score value
    if (!bestScore || this.score > bestScore) {
      localStorage.setItem("bestScore", this.score);
    }
  }
  //PAUSE BUTTON
  createPauseButton() {
    const pauseButton = this.add
      .image(this.config.width - 20, this.config.height - 20, "pause")
      .setInteractive()
      .setScale(3)
      .setOrigin(1);
    const returnButton = this.add
      .image(this.config.width - 20, this.config.height - 20, "return")
      .setScale(2)
      .setOrigin(1);
    pauseButton.depth = 5;
    pauseButton.on("pointerdown", () => {
      pauseButton.depth = -5;
      returnButton.depth = 5;
      returnButton.setInteractive();
      
      this.physics.pause();
    });
    returnButton.on("pointerdown", () => {
      returnButton.depth = -5;
      pauseButton.depth = 5;
      this.physics.resume();
    });

    const menuBtn = this.add
      .text(this.config.width - 80, this.config.height - 20, "MENU", {
        fontSize: "2.5rem",
        fill: "#445ef3",
      })
      .setOrigin(1)
      .setInteractive();

    menuBtn.on("pointerdown", () => {
      this.scene.start("MenuScene");
    });
  }

  //BACKGROUND
  createBG() {
    this.BG = this.add.image(0, 0, "sky").setOrigin(0, 0);
    this.BG.depth = -10;
  }
  //BIRD
  createBird() {
    this.bird = this.physics.add
      .sprite(this.config.startPosition.x, this.config.startPosition.y, "bird")
      .setScale(5)
      .setFlipX(true)
      .setOrigin(0, 0);
    this.bird.setBodySize(this.bird.width - 6, this.bird.height - 10);
    this.bird.body.gravity.y = 600;
    this.bird.setCollideWorldBounds(true);
  }
  flap() {
    this.bird.body.velocity.y = this.flapVelocity;
  }

  //PIPES
  createPipes() {
    //create pipes group, set horizontal velocity
    this.pipesGroup = this.physics.add.group();
    for (let i = 0; i < this.pipesToShow; i++) {
      const upperPipe = this.pipesGroup
        .create(0, 0, "pipe")
        .setImmovable(true)
        .setOrigin(0, 1);
      const lowerPipe = this.pipesGroup
        .create(0, 0, "pipe")
        .setImmovable(true)
        .setOrigin(0, 0);
      this.placePipes(upperPipe, lowerPipe);
    }
    this.pipesGroup.setVelocityX(this.pipesVelocityY);
  }
  //place on scene this pipes group - calculate distance between them
  placePipes(upperP, lowerP) {
    const difficulty = this.difficulties[this.currentDifficulty];

    const pipesRightMostX = this.getRightMostPipes();
    //pipes Vertical Distance - between open pipes
    const distanceBetweenOpenPipes = Phaser.Math.Between(
      difficulty.distanceRangeOpen[0],
      difficulty.distanceRangeOpen[1]
    );
    const pipesVerticalPosition = Phaser.Math.Between(
      0 + 20,
      this.config.height - 20 - distanceBetweenOpenPipes
    );
    const pipesHorizontalDistance = Phaser.Math.Between(
      difficulty.distanceRangeHorizontal[0],
      difficulty.distanceRangeHorizontal[1]
    );
    upperP.x = pipesRightMostX + pipesHorizontalDistance;
    upperP.y = pipesVerticalPosition;
    lowerP.x = upperP.x;
    lowerP.y = upperP.y + distanceBetweenOpenPipes;
  }
  //recycle pipers group
  recyclePipes() {
    const tempPipes = [];
    this.pipesGroup.getChildren().forEach((pipe) => {
      if (pipe.getBounds().right <= 0) {
        //recicle pipe
        tempPipes.push(pipe);
        if (tempPipes.length === 2) {
          this.placePipes(tempPipes[0], tempPipes[1]);
          this.increaseScore();
          this.saveBestScore();
          this.increaseDifficulty();
        }
      }
    });
  }

  increaseDifficulty() {
    if (this.score === 1) {
      this.currentDifficulty = "normal";
    }
    if (this.score === 10) {
      this.currentDifficulty = "normal";
    }
    if (this.score === 20) {
      this.currentDifficulty = "hard";
    }
  }
  getRightMostPipes() {
    let rightMostX = 0;
    this.pipesGroup.getChildren().forEach(function (pipe) {
      rightMostX = Math.max(pipe.x, rightMostX);
    });
    return rightMostX;
  }
}
