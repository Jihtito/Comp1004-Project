console.log("'Main.js' loaded.");

class Game {
    constructor() {
        this.WIN = CANVAS.getContext("2d"); this.WIN.imageSmoothingEnabled = false;
        this.frame_counter = 0;
        this.escape_menu_open = false;
        
        this.player = new Player();
        this.entity_list = [this.player];
        for (let i = 0; i < 3; i++) {
            this.entity_list.push(new Zombie());
        }

        this.WIN.fillStyle = BLACK; this.WIN.fillRect(0, 0, WIDTH, HEIGHT);
    }

    update() {
        for (let i = 0; i < this.entity_list.length; i++) {
            this.entity_list[i].update(this.frame_counter, this.player.x, this.player.y);
        }
    }

    draw() {
        this.WIN.drawImage(MAP_IMAGE, 0, 0, MAP_IMAGE.width, MAP_IMAGE.height, 
            MAP_POS[0], MAP_POS[1], MAP_IMAGE.width * SF, MAP_IMAGE.height * SF);
        
        for (let i = 0; i < this.entity_list.length; i++) {
            this.entity_list[i].draw(this.WIN);
        }
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
