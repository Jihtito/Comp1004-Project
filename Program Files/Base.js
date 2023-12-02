console.log("'Base.js' loaded.");

const CANVAS = document.getElementById("game_window");
const WIDTH = CANVAS.width; const HEIGHT = CANVAS.height;
const FRAME_WIDTH = 14; const FRAME_HEIGHT = 18;

const GRAY = "rgb(50, 50, 50)";     // Defining colors with RGB values
const SF = 6;                       // Defining scale factor of pixel images

var player_image = new Image(FRAME_WIDTH * 4 * SF, FRAME_HEIGHT * 4 * SF);
player_image.src = "Files/character_animations.png";

class Player {
    constructor() {
        this.image = player_image;
        this.width = FRAME_WIDTH * SF; this.height = FRAME_HEIGHT * SF;
        this.x = WIDTH/2 - this.width/2; this.y = HEIGHT/2 - this.height/2;

        this.animation_frame = [0, 0];
        this.W_pressed = false;
        this.S_pressed = false;
        this.A_pressed = false;
        this.D_pressed = false;
        this.speed = SF;
    }

    handle_player_model(frame_counter) {
        if (this.W_pressed) {
            this.animation_frame[1] = 3;
        } else if (this.S_pressed) {
            this.animation_frame[1] = 0;
        } else  if (this.A_pressed) {
            this.animation_frame[1] = 2;
        } else if (this.D_pressed) {
            this.animation_frame[1] = 1;
        }

        if (this.W_pressed || this.S_pressed || this.A_pressed || this.D_pressed) {
            this.animation_frame[0] = (frame_counter / 12).toFixed(0) % 4;
        } else {
            this.animation_frame[0] = 0;
        }
    }

    update(frame_counter) {
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
        } else if (this.S_pressed && this.y < HEIGHT - this.height) {
            this.y += this.speed;
        } else if (this.A_pressed && this.x > 0) {
            this.x -= this.speed;
        } else if (this.D_pressed && this.x < WIDTH - this.width) {
            this.x += this.speed;
        }

        this.handle_player_model(frame_counter);
    }
}

class Game {
    constructor() {
        this.WIN = CANVAS.getContext("2d");
        this.WIN.imageSmoothingEnabled = false;
        this.player = new Player();
        this.frame_counter = 0;
    }

    update() {
        this.player.update(this.frame_counter);
    }

    draw() {
        this.WIN.fillStyle = GRAY; this.WIN.fillRect(0, 0, WIDTH, HEIGHT);
        this.WIN.drawImage(this.player.image, 
            FRAME_WIDTH * this.player.animation_frame[0], FRAME_HEIGHT * this.player.animation_frame[1],
            FRAME_WIDTH, FRAME_HEIGHT, this.player.x, this.player.y, this.player.width, this.player.height);
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