console.log("'Main.js' loaded.");

class Game {
    constructor() {
        this.WIN = CANVAS.getContext("2d");
        this.WIN.imageSmoothingEnabled = false;
        this.player = new Player();
        this.zombie = new Zombie();
        this.frame_counter = 0;
    }

    update() {
        this.player.update(this.frame_counter);
        this.zombie.update(this.frame_counter, this.player.x, this.player.y);
    }

    draw() {
        this.WIN.fillStyle = GRAY; this.WIN.fillRect(0, 0, WIDTH, HEIGHT);

        this.WIN.drawImage(this.player.image, 
            FRAME_WIDTH * this.player.animation_frame[0], FRAME_HEIGHT * this.player.animation_frame[1],
            FRAME_WIDTH, FRAME_HEIGHT, this.player.x, this.player.y, this.player.width, this.player.height);

        this.WIN.drawImage(this.zombie.image, 
            ZOMBIE_FRAME_WIDTH * this.zombie.animation_frame[0], ZOMBIE_FRAME_HEIGHT * this.zombie.animation_frame[1],
            ZOMBIE_FRAME_WIDTH, ZOMBIE_FRAME_HEIGHT, this.zombie.x, this.zombie.y, this.zombie.width, this.zombie.height);
    }

    run_game() {
        this.update();
        this.draw();
        this.frame_counter += 1;
        requestAnimationFrame(() => this.run_game());
    }
}

const game = new Game();
game.run_game();