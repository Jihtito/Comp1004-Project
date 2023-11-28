console.log("'Base.js' loaded.");

const CANVAS = document.getElementById("game_window");
const WIDTH = CANVAS.width; const HEIGHT = CANVAS.height;

const RED = "rgb(255, 0, 0)";
const BLACK = "rgb(0, 0, 0)";

class Player {
    constructor() {
        this.size = 50;
        this.x = WIDTH/2 - this.size/2;
        this.y = HEIGHT/2 - this.size/2;
        this.W_pressed = false;
        this.S_pressed = false;
        this.A_pressed = false;
        this.D_pressed = false;
        this.speed = 10;
    }

    update() {
        document.addEventListener("keydown", (event) => {
            if (event.code == "KeyW") {
                this.W_pressed = true;
            } else if (event.code == "KeyS") {
                this.S_pressed = true;
            } else if (event.code == "KeyA") {
                this.A_pressed = true;
            } else if (event.code == "KeyD") {
                this.D_pressed = true;
            }
        });
        document.addEventListener("keyup", (event) => {
            if (event.code == "KeyW") {
                this.W_pressed = false;
            } else if (event.code == "KeyS") {
                this.S_pressed = false;
            } else if (event.code == "KeyA") {
                this.A_pressed = false;
            } else if (event.code == "KeyD") {
                this.D_pressed = false;
            }
        });

        if (this.W_pressed && this.y > 0) {
            this.y -= this.speed;
        } else if (this.S_pressed && this.y < HEIGHT - this.size) {
            this.y += this.speed;
        } else if (this.A_pressed && this.x > 0) {
            this.x -= this.speed;
        } else if (this.D_pressed && this.x < WIDTH - this.size) {
            this.x += this.speed;
        }
    }
}

class Game {
    constructor() {
        this.WIN = CANVAS.getContext("2d");
        this.player = new Player();
    }

    update() {
        this.player.update();
    }

    draw() {
        this.WIN.fillStyle = BLACK; this.WIN.fillRect(0, 0, WIDTH, HEIGHT);
        this.WIN.fillStyle = RED; this.WIN.fillRect(this.player.x, this.player.y, this.player.size, this.player.size);
    }

    run_game() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.run_game());
    }
}

const game = new Game();
game.run_game();