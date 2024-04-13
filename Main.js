console.log("'Main.js' loaded.");
// 'Main.js' is used to contain the main body and logic of the entire program

class Game {
    constructor() {
        this.WIN = CANVAS.getContext("2d"); this.WIN.imageSmoothingEnabled = false;
        this.game_paused = true;
        // 'frame_counter' increases by 1 every frame and can be used with % in order to slow down actions such as animations
        // e.g. if (this.frame_counter % 60 == 0) will run once per second (assuming the game is running at full speed 60FPS)
        this.frame_counter = 0;
        this.potion = null;
        this.wave = 0;

        this.player = new Player();
        this.entity_list = [this.player];
        this.spawn_next_wave();

        // Makes the full screen black ready for drawing on top of it, only needs to be done once at the start of the program
        this.WIN.fillStyle = BLACK; this.WIN.fillRect(0, 0, WIDTH, HEIGHT);
    }

    spawn_next_wave() {
        this.wave ++;
        if (this.potion == null) { this.potion = new Health_Potion(this.player.max_health); }

        for (let i = 0; i < this.wave; i++) {
            if (Math.random() > 0.35) { this.entity_list.push(new Zombie(this.player.level)); }
            else { this.entity_list.push(new Human(this.player.level)); }
        }
    }

    update() {
        for (let i = 0; i < this.entity_list.length; i++) {
            let hit = this.entity_list[i].update(this.frame_counter, this.player.x, this.player.y);

            if (this.entity_list[i].is_dead) {
                this.player.xp += +(this.entity_list[i].max_health);
                this.entity_list[i] = null; this.entity_list.splice(i, 1);
                continue;
            }

            if (hit) {
                if (this.player.invincibility_frames == 0) {
                    this.player.health -= +(this.entity_list[i].attack);
                    this.player.invincibility_frames = 35;
                }
            }
        }

        document.addEventListener("keydown", (event) => {
            if (event.code == "Escape") {
                this.game_paused = true;
            }
        });

        if (this.potion != null) {
            // If the player is colliding with the potion increase the players health and delete the potion
            if ((this.player.x < (this.potion.x + this.potion.width)) && ((this.player.x + this.player.width) > this.potion.x) && 
            (this.player.y < (this.potion.y + this.potion.height)) && ((this.player.y + this.player.height) > this.potion.y)) {
                this.player.health += +(this.potion.health);
                if (this.player.health > this.player.max_health) { this.player.health = this.player.max_health; }
                this.potion = null;
            }
        }

        if (this.player.projectile != null) { this.player.projectile.update(this.entity_list); }
        if (this.player.health <= 0) { this.game_over_menu(); }
        if (this.entity_list.length == 1) { this.spawn_next_wave(); }
    }

    draw() {
        // Clears the canvas once every 60 frames (once per second) to reduce lag build up
        if (this.frame_counter % 60 == 0) { this.WIN.clearRect(0, 0, WIDTH, HEIGHT); }
        this.WIN.textAlign = "left";

        this.WIN.drawImage(MAP_IMAGE, 0, 0, MAP_IMAGE.width, MAP_IMAGE.height, 
            MAP_POS[0], MAP_POS[1], MAP_IMAGE.width * SF, MAP_IMAGE.height * SF);
            
        if (this.potion != null) { this.potion.draw(this.WIN); }
        
        for (let i = 0; i < this.entity_list.length; i++) {
            this.entity_list[i].draw(this.WIN);
        }
    }

    pause_menu() {
        this.WIN.drawImage(PAUSE_MENU_IMAGE, 0, 0, PAUSE_MENU_IMAGE.width, PAUSE_MENU_IMAGE.height, 
            MAP_POS[0] + (SF * 6), MAP_POS[1] + (SF * 2), PAUSE_MENU_IMAGE.width * SF, PAUSE_MENU_IMAGE.height * SF);
    
        document.addEventListener("keydown", (event) => {
            if (event.code == "Escape") {
                this.game_paused = false;
            }
        });

        this.WIN.fillStyle = WHITE; this.WIN.textAlign = "center";
        if (this.frame_counter > 0) {
            this.WIN.font = `${28 * SF}px Arial`; this.WIN.fillText("GAME PAUSED", MAP_POS[0] + (175 * SF), MAP_POS[1] + (38 * SF));
            this.WIN.font = `${11 * SF}px Arial`; this.WIN.fillText("Press escape to resume the game.", MAP_POS[0] + (175 * SF), MAP_POS[1] + (51 * SF));
        } else {
            this.WIN.font = `${14.5 * SF}px Arial`; this.WIN.fillText("Press escape to start the game.", MAP_POS[0] + (175 * SF), MAP_POS[1] + (37 * SF));
        }

        this.WIN.font = `${11 * SF}px Arial`;
        this.WIN.fillText("Controls:", MAP_POS[0] + (175 * SF), MAP_POS[1] + (93 * SF));
        this.WIN.fillText("WASD - Move Up/Left/Down/Right", MAP_POS[0] + (175 * SF), MAP_POS[1] + (107.3 * SF));
        this.WIN.fillText("Spacebar - Attack", MAP_POS[0] + (175 * SF), MAP_POS[1] + (121.6 * SF));
        this.WIN.fillText("Escape - Pause", MAP_POS[0] + (175 * SF), MAP_POS[1] + (136 * SF));

        this.WIN.font = `${5 * SF}px Arial`;
        for (let i = 0; i < HELP_MESSAGE.length; i++) {
            this.WIN.fillText(HELP_MESSAGE[i], MAP_POS[0] + (175 * SF), MAP_POS[1] + (164.5 * SF) + (i * (8.5 * SF)));
        }
    }

    game_over_menu() {
        this.WIN.drawImage(GAME_OVER_MENU_IMAGE, 0, 0, GAME_OVER_MENU_IMAGE.width, GAME_OVER_MENU_IMAGE.height, 
            MAP_POS[0] + (SF * 65), MAP_POS[1] + (SF * 24), GAME_OVER_MENU_IMAGE.width * SF, GAME_OVER_MENU_IMAGE.height * SF);
    
        this.WIN.fillStyle = WHITE; this.WIN.textAlign = "center";
        this.WIN.font = `${28 * SF}px Arial`; this.WIN.fillText("GAME OVER", MAP_POS[0] + (175 * SF), MAP_POS[1] + (62 * SF));
        this.WIN.font = `${14 * SF}px Arial`; this.WIN.fillText(`Your Score: ${this.wave}`, MAP_POS[0] + (175 * SF), MAP_POS[1] + (126 * SF));
        this.WIN.font = `${8 * SF}px Arial`; this.WIN.fillText("Downloading your score to a txt file...", MAP_POS[0] + (175 * SF), MAP_POS[1] + (137 * SF));
        this.WIN.font = `${14 * SF}px Arial`; this.WIN.fillText("Refresh the page to play again.", MAP_POS[0] + (175 * SF), MAP_POS[1] + (180 * SF));

        // Creates a .txt file containing the player's score
        let content = `Your Score = ${this.wave}!`;
        let txt_file = new File([content], "your_score.txt", {type: "text/plain"});

        // Downloads the created .txt file
        let link = document.createElement('a');
        let created_URL = window.URL.createObjectURL(txt_file);

        link.href = created_URL;
        link.download = txt_file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(created_URL);

        // Throw "Game Over." in order to end the program
        throw "Game Over.";
    }

    run_game() {
        if (!this.game_paused) {
            this.update();
            this.draw();
            this.frame_counter += 1;
        } else {
            this.pause_menu();
        }
        // 'requestAnimationFrame' loops 'run_game' up to 60 times per second allowing for smooth game play
        requestAnimationFrame(() => this.run_game());
    }
}

const game = new Game();
game.run_game();
