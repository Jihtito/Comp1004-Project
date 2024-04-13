console.log("'Player.js' loaded.");
// 'Player.js' is used to define the player class and any other classes relevant to the player

class Player {
    constructor() {
        this.image = PLAYER_IMAGE;
        this.width = FRAME_WIDTH * SF; this.height = FRAME_HEIGHT * SF;
        // Dividing then multipling by SF makes sure the player is centred on the pixel
        this.x = ((WIDTH/2 - this.width/2) / SF) * SF; this.y = ((HEIGHT/2 - this.height/2) / SF) * SF;

        // Invincibility frames are used for the player to ensure they dont take too much damage too quickly
        this.invincibility_frames = 0;
        this.xp_to_next_level = 100;
        this.max_health = 100;
        this.health = 100;
        this.attack = 10;
        this.level = 1;
        this.xp = 0;

        // 'animation_frame' defines which sprite on the sprite sheet is used e.g. [0, 0] = top left sprite
        this.animation_frame = [0, 0];
        this.projectile = null;
        this.W_pressed = false;
        this.S_pressed = false;
        this.A_pressed = false;
        this.D_pressed = false;
        this.speed = SF * 2;
    }

    level_up() {
        // 'difference' is used to ensure the percentage of health the player has left remains the same after level up
        let difference = this.max_health;
        this.level ++;
        this.max_health = (100 * (1 + (((this.level * 1.1) - 1) / 10))).toFixed(0);
        this.health += +(this.max_health - difference);

        this.attack = (10 * (1 + (((this.level * 1.5) - 1) / 10))).toFixed(0);
        this.xp -= this.xp_to_next_level;
        this.xp_to_next_level = (100 * (1 + (((this.level * 2.25) - 1) / 10))).toFixed(0);
    }

    handle_player_model(frame_counter) {
        if (this.W_pressed) {
            this.animation_frame[1] = 2;
        } else if (this.S_pressed) {
            this.animation_frame[1] = 0;
        } else if (this.A_pressed) {
            this.animation_frame[1] = 1;
        } else if (this.D_pressed) {
            this.animation_frame[1] = 3;
        }

        if (!this.is_attacking) {
            if (this.W_pressed || this.S_pressed || this.A_pressed || this.D_pressed) {
                this.animation_frame[0] = 1 + (frame_counter / 7).toFixed(0) % 10;
            } else {
                this.animation_frame[0] = 0;
            }
        } else {
            this.animation_frame[0] = 11;
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
            } else if ((event.code == "Space") && (this.is_attacking == false)) {
                this.is_attacking = true;
                if (this.projectile == null) {
                    this.projectile = new Projectile(this.x, this.y, this.animation_frame[1]);
                }
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
            } else if (event.code == "Space"){
                this.is_attacking = false;
            }
        });

        if (!this.is_attacking) {
            if (this.W_pressed) { if (this.y > PLAYABLE_REGION[1]) {
                this.y -= this.speed;
            }} else if (this.S_pressed) { if (this.y < PLAYABLE_REGION[3] - this.height) {
                this.y += this.speed;
            }} else if (this.A_pressed) { if (this.x > PLAYABLE_REGION[0]) {
                this.x -= this.speed;
            }} else if (this.D_pressed) { if (this.x < PLAYABLE_REGION[2] - this.width) {
                this.x += this.speed;
            }}
        }

        this.handle_player_model(frame_counter);

        if (this.invincibility_frames > 0) { this.invincibility_frames --; }
        if (this.xp >= this.xp_to_next_level) { this.level_up(); }
        // Two nested if statements are used instead of one 'if &&' because if projectile == null then trying to check projectile.is_dead will cause an error
        if (this.projectile != null) { if (this.projectile.is_dead == true) { this.projectile = null; }}

        return false;
    }

    draw(WIN) {
        // Drawing the player model
        WIN.drawImage(this.image, FRAME_WIDTH * this.animation_frame[0], 
            FRAME_HEIGHT * this.animation_frame[1], FRAME_WIDTH, FRAME_HEIGHT, 
            this.x, this.y, this.width, this.height);
        
        // Drawing the player's health bar
        WIN.fillStyle = GRAY; WIN.fillRect(MAP_POS[0] + (2.1 * SF), MAP_POS[1] + (212.9 * SF), (71.4 * SF), (8.6 * SF));

        if (this.max_health * 0.33 > this.health) { WIN.fillStyle = RED; }
        else if (this.max_health * 0.67 > this.health) { WIN.fillStyle = YELLOW; }
        else { WIN.fillStyle = GREEN; }
        WIN.fillRect(MAP_POS[0] + (3.6 * SF), MAP_POS[1] + (214.3 * SF), (68.6 * SF) / (this.max_health / this.health), (5.7 * SF));

        WIN.fillStyle = BLACK; WIN.font = `${5.7 * SF}px Arial`; WIN.fillText(`${this.health}/${this.max_health}`, MAP_POS[0] + (3.9 * SF), MAP_POS[1] + (219.1 * SF));

        // Drawing the player's xp bar
        WIN.fillStyle = GRAY; WIN.fillRect(MAP_POS[0] + (276.4 * SF), MAP_POS[1] + (212.9 * SF), (71.4 * SF), (8.6 * SF));
        WIN.fillStyle = CYAN; WIN.fillRect(MAP_POS[0] + (277.8 * SF), MAP_POS[1] + (214.3 * SF), ((68.6 * SF) / (this.xp_to_next_level / this.xp)) % (68.6 * SF), (5.7 * SF));
        WIN.fillStyle = BLACK; WIN.font = `${5.7 * SF}px Arial`;
        WIN.fillText(`Lvl: ${this.level} | ${this.xp}/${this.xp_to_next_level}`, MAP_POS[0] + (278 * SF), MAP_POS[1] + (219.1 * SF));

        // Drawing the player's projectile
        if (this.projectile != null) {
            this.projectile.draw(WIN);
        }
    }
}


class Projectile {
    constructor(x, y, direction) {
        this.image = PROJECTILE_IMAGE;
        this.width = PROJECTILE_FRAME_WIDTH * SF; this.height = PROJECTILE_FRAME_HEIGHT * SF;
        this.x = x; this.y = y;

        this.animation_frame = direction;
        this.is_dead = false;
        this.speed = (SF * 2.8);
    }

    update(entity_list) {
        if (this.animation_frame == 0) {
            this.y += this.speed;
        } else if (this.animation_frame == 1) {
            this.x -= this.speed;
        } else if (this.animation_frame == 2) {
            this.y -= this.speed;
        } else {
            this.x += this.speed;
        }
        
        for (let i = 1; i < entity_list.length; i++) {
            if (entity_list[i].invincibility_frames == 0) {
                if ((this.x < (entity_list[i].x + entity_list[i].width)) && ((this.x + this.width) > entity_list[i].x) && 
                (this.y < (entity_list[i].y + entity_list[i].height)) && ((this.y + this.height) > entity_list[i].y)) {
                    entity_list[i].health -= +(entity_list[0].attack);
                    entity_list[i].invincibility_frames = 35;
                    this.is_dead = true;
                    break;
                }
            }
        }

        /*
        This if statement checks if the projectile is colliding with any of the four walls and kills it if it is.
        This large if statement will three || are used instead of a more simple if && statement because the projectile should
        only be killed if it collides with the wall it is currently moving towards (hence why we check the animation frame
        that determines the direction) and not any of the other three walls. This is because otherwise you could not
        fire a projectile whilst standing next to a wall.
        */
        if (((this.y < PLAYABLE_REGION[1]) && (this.animation_frame == 2)) 
        || ((this.y > PLAYABLE_REGION[3] - this.height) && (this.animation_frame == 0))
        || ((this.x < PLAYABLE_REGION[0]) && (this.animation_frame == 1))
        || ((this.x > PLAYABLE_REGION[2] - this.width) && (this.animation_frame == 3))) {
            this.is_dead = true;
        }
    }

    draw(WIN) {
        WIN.drawImage(this.image, 0, PROJECTILE_FRAME_HEIGHT * this.animation_frame, 
            PROJECTILE_FRAME_WIDTH, PROJECTILE_FRAME_HEIGHT, this.x, this.y, this.width, this.height);
    }
}


class Health_Potion {
    constructor(player_health) {
        this.image = HEALTH_POTION_IMAGE;
        this.width = FRAME_WIDTH * SF; this.height = FRAME_HEIGHT * SF;
        this.x = (((Math.floor(Math.random() * (PLAYABLE_REGION[2] - this.width - PLAYABLE_REGION[0] + 1)) + PLAYABLE_REGION[0]) / SF) * SF);
        this.y = (((Math.floor(Math.random() * (PLAYABLE_REGION[3] - this.height - PLAYABLE_REGION[1] + 1)) + PLAYABLE_REGION[1]) / SF) * SF);
        this.health = (player_health/2).toFixed(0);
    }

    draw(WIN) {
        WIN.drawImage(this.image, 0, 0, FRAME_WIDTH, FRAME_HEIGHT, this.x, this.y, this.width, this.height);
    }
}
