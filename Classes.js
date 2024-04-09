console.log("'Classes.js' loaded.");

class Player {
    constructor() {
        this.image = PLAYER_IMAGE;
        this.width = FRAME_WIDTH * SF; this.height = FRAME_HEIGHT * SF;
        this.x = WIDTH/2 - this.width/2; this.y = HEIGHT/2 - this.height/2;

        this.invincibility_frames = 0;
        this.xp_to_next_level = 100;
        this.max_health = 100;
        this.health = 100;
        this.attack = 10;
        this.level = 1;
        this.xp = 0;

        this.animation_frame = [0, 0];
        this.projectile = null;
        this.W_pressed = false;
        this.S_pressed = false;
        this.A_pressed = false;
        this.D_pressed = false;
        this.speed = SF * 2;
    }

    level_up() {
        this.level ++;
        this.health /= this.max_health;
        this.max_health = (100 * (1 + (((this.level * 1.1) - 1) / 10))).toFixed(0);
        this.health = (this.health * this.max_health).toFixed(0);
        this.attack = (10 * (1 + (((this.level * 1.5) - 1) / 10))).toFixed(0);
        this.xp -= this.xp_to_next_level;
        this.xp_to_next_level = (100 * (1 + (((this.level * 2.25) - 1) / 10))).toFixed(0);
        //console.log(`Player:\nlvl = ${this.level}\nmaxhlth = ${this.max_health}\nhlth = ${this.health}\natk = ${this.attack}`);
    }

    handle_player_model(frame_counter) {
        if (this.W_pressed) {
            this.animation_frame[1] = 2;
        } else if (this.S_pressed) {
            this.animation_frame[1] = 0;
        } else  if (this.A_pressed) {
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
            if (this.W_pressed) { if (this.y > PLAYABLE_REGION[1] - this.height/2) {
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
        if (this.projectile != null) { if (this.projectile.is_dead == true) { this.projectile = null; }}

        return false;
    }

    draw(WIN) {
        // Drawing the player model
        WIN.drawImage(this.image, FRAME_WIDTH * this.animation_frame[0], 
            FRAME_HEIGHT * this.animation_frame[1], FRAME_WIDTH, FRAME_HEIGHT, 
            this.x, this.y, this.width, this.height);
        
        // Drawing the player's health bar
        WIN.fillStyle = GRAY; WIN.fillRect(15, HEIGHT - 45, 250, 30);

        if (this.max_health * 0.33 > this.health) { WIN.fillStyle = RED; }
        else if (this.max_health * 0.67 > this.health) { WIN.fillStyle = YELLOW; }
        else { WIN.fillStyle = GREEN; }
        WIN.fillRect(20, HEIGHT - 40, 240 / (this.max_health / this.health), 20);

        WIN.fillStyle = BLACK; WIN.font = "20px Arial"; WIN.fillText(`${this.health}/${this.max_health}`, 21, HEIGHT - 23);

        // Drawing the player's xp bar
        WIN.fillStyle = GRAY; WIN.fillRect(WIDTH - 265, HEIGHT - 45, 250, 30);
        WIN.fillStyle = CYAN; WIN.fillRect(WIDTH - 260, HEIGHT - 40, (240 / (this.xp_to_next_level / this.xp)) % 240, 20);
        WIN.fillStyle = BLACK; WIN.font = "20px Arial"; 
        WIN.fillText(`Lvl: ${this.level} | ${this.xp}/${this.xp_to_next_level}`, WIDTH - 259, HEIGHT - 23);
    }
}


class Zombie {
    constructor(player_level) {
        this.image = ZOMBIE_IMAGE;
        this.width = ZOMBIE_FRAME_WIDTH * SF; this.height = ZOMBIE_FRAME_HEIGHT * SF;
        this.x = Math.floor(Math.random() * (PLAYABLE_REGION[2] - this.width - PLAYABLE_REGION[0] + 1)) + PLAYABLE_REGION[0];
        this.y = Math.floor(Math.random() * (PLAYABLE_REGION[3] - this.height - PLAYABLE_REGION[1] + 1)) + PLAYABLE_REGION[1];

        this.invincibility_frames = 0;
        this.max_health = 0; this.health = 0; this.attack = 0; this.level = 0;
        this.set_level(player_level);
        this.is_dead = false;

        this.animation_frame = [0, 0];
        this.walk_randomiser = Math.floor(Math.random() * (45 - 15) + 15);
        this.attack_cooldown = 0;
        this.Move_Up = false;
        this.Move_Down = false;
        this.Move_Left = false;
        this.Move_Right = false;
        this.is_attacking = false;
        this.speed = SF;
    }

    set_level(level) {
        this.level = level;
        this.max_health = (50 * (1 + (((this.level - 1) * 1.25) / 10))).toFixed(0);
        this.health = this.max_health;
        this.attack = (10 * (1 + (((this.level - 1) * 1.25) / 10))).toFixed(0);
        //console.log(`Zombie:\nlvl = ${this.level}\nmaxhlth = ${this.max_health}\nhlth = ${this.health}\natk = ${this.attack}`);
    }

    move_up_down(player_y) {
        this.Move_Left = false;
        this.Move_Right = false;
        if (this.y - 10 > player_y) {
            this.Move_Down = false;
            this.Move_Up = true;
        } else if (this.y + 10 < player_y) {
            this.Move_Up = false;
            this.Move_Down = true;
        } else {
            this.Move_Up = false;
            this.Move_Down = false;
        }
    }

    move_left_right(player_x) {
        if (this.x - 10 > player_x) {
            this.Move_Right = false;
            this.Move_Left = true;
        } else if (this.x + 10 < player_x) {
            this.Move_Left = false;
            this.Move_Right = true;
        }
    }

    handle_model(frame_counter) {
        if (this.attack_cooldown == 0) {
            if (this.Move_Left) {
                this.animation_frame[1] = 1;
            } else if (this.Move_Right) {
                this.animation_frame[1] = 0;
            }

            if (this.animation_frame[1] == 2 || this.animation_frame[1] == 3) {
                this.animation_frame[1] -= 2;
            }

            if (this.Move_Up || this.Move_Down || this.Move_Left || this.Move_Right) {
                this.animation_frame[0] = 1 + (frame_counter / 7).toFixed(0) % 8;
            } else {
                this.animation_frame[0] = 0;
            }
        }
        else {
            if (this.animation_frame[1] == 0 || this.animation_frame[1] == 1) {
                this.animation_frame[1] += 2;
            }

            this.animation_frame[0] = (this.attack_cooldown / 7).toFixed(0) % 6;
        }
    }

    update(frame_counter, player_x, player_y) {
        if ((-80 < this.x - player_x && this.x - player_x < 80) && (-80 < this.y - player_y && this.y - player_y < 80)) {
            this.is_attacking = true;
        }

        if (this.is_attacking) {
            this.attack_cooldown ++;
            if (this.attack_cooldown == 35) { 
                this.is_attacking = false;
                this.attack_cooldown = 0;
            }
        }

        if (this.attack_cooldown == 0) {
            if (frame_counter % 60 > this.walk_randomiser) {
                this.move_up_down(player_y);
                if (!this.Move_Up && !this.Move_Down) {
                    this.move_left_right(player_x);
                }
            } else {
                this.move_left_right(player_x);
            }
            
            if (this.Move_Left) { if (this.x > 0) {
                this.x -= this.speed;
            }} else if (this.Move_Right) { if (this.x < WIDTH - this.width) {
                this.x += this.speed;
            }} else {
                if (this.Move_Up) { if (this.y > 0) {
                    this.y -= this.speed;
                }} else if (this.Move_Down) { if (this.y < HEIGHT - this.height) {
                    this.y += this.speed;
                }}
            }
        }

        this.handle_model(frame_counter);

        if (this.invincibility_frames > 0) { this.invincibility_frames --; }
        if (this.health <= 0) { this.is_dead = true; }

        return this.is_attacking;
    }

    draw(WIN) {
        // Drawing the zombie model
        WIN.drawImage(this.image,  ZOMBIE_FRAME_WIDTH * this.animation_frame[0], 
            ZOMBIE_FRAME_HEIGHT * this.animation_frame[1], ZOMBIE_FRAME_WIDTH, ZOMBIE_FRAME_HEIGHT, 
            this.x, this.y, this.width, this.height);

        // Drawing the zombie's health bar
        WIN.fillStyle = GRAY; WIN.fillRect(this.x, this.y + 110, 100, 20);

        if (this.max_health * 0.33 > this.health) { WIN.fillStyle = RED; }
        else if (this.max_health * 0.67 > this.health) { WIN.fillStyle = YELLOW; }
        else { WIN.fillStyle = GREEN; }
        WIN.fillRect(this.x + 3, this.y + 113, 94 / (this.max_health / this.health), 14);
    }
}


class Projectile {
    constructor(x, y, direction) {
        this.image = PROJECTILE_IMAGE;
        this.width = PROJECTILE_FRAME_WIDTH * SF; this.height = PROJECTILE_FRAME_HEIGHT * SF;
        this.x = x; this.y = y;

        this.animation_frame = direction;
        this.is_dead = false;
        this.speed = 10;
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
                    entity_list[i].health -= entity_list[0].attack;
                    entity_list[i].invincibility_frames = 35;
                    this.is_dead = true;
                    break;
                }
            }
        }

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
