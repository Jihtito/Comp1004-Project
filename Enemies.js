console.log("'Enemies.js' loaded.");
// 'Enemies.js' is used to define all classes and sub-classes needed for the in-game enemies

class Basic_Enemy {
    constructor() {
        this.max_health = 0; this.health = 0; this.attack = 0; this.level = 0;
        // Invincibility frames are used for enemies to ensure they dont take too much damage too quickly
        this.invincibility_frames = 0;
        this.is_dead = false;

        this.walk_randomiser = Math.floor(Math.random() * (45 - 15) + 15);
        // 'animation_frame' defines which sprite on the sprite sheet is used e.g. [0, 0] = top left sprite
        this.animation_frame = [0, 0];
        this.attack_cooldown = 0;
        this.is_attacking = false;
        this.Move_Right = false;
        this.Move_Down = false;
        this.Move_Left = false;
        this.Move_Up = false;
    }

    set_level(level) {
        this.level = Math.floor(Math.random() * (level + 2)) + 1;
        this.max_health = (50 * (1 + (((this.level - 1) * 1.25) / 10))).toFixed(0);
        this.health = this.max_health;
        this.attack = (10 * (1 + (((this.level - 1) * 1.25) / 10))).toFixed(0);
    }

    move_up_down(player_y) {
        this.Move_Left = false;
        this.Move_Right = false;
        if (this.y - (SF * 2.5) > player_y) {
            this.Move_Down = false;
            this.Move_Up = true;
        } else if (this.y + (SF * 2.5) < player_y) {
            this.Move_Up = false;
            this.Move_Down = true;
        } else {
            this.Move_Up = false;
            this.Move_Down = false;
        }
    }

    move_left_right(player_x) {
        if (this.x - (SF * 2.5) > player_x) {
            this.Move_Right = false;
            this.Move_Left = true;
        } else if (this.x + (SF * 2.5) < player_x) {
            this.Move_Left = false;
            this.Move_Right = true;
        }
    }

    update(frame_counter, player_x, player_y) {
        // If the enemy is within a certain distance of the player, start attacking
        if ((-(SF * 20) < this.x - player_x && this.x - player_x < (SF * 20)) && (-(SF * 20) < this.y - player_y && this.y - player_y < (SF * 20))) {
            this.is_attacking = true;
        }

        if (this.is_attacking) {
            this.attack_cooldown ++;
            if (this.attack_cooldown == 35) { 
                this.is_attacking = false;
                this.attack_cooldown = 0;
            }
        }

        // 'attack_cooldown' used instead of checking 'is_attacking' == true or false in order to let the animation finish even if the player moves away
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
        // Drawing the enemy model
        WIN.drawImage(this.image,  this.frame_width * this.animation_frame[0], 
            this.frame_height * this.animation_frame[1], this.frame_width, this.frame_height, 
            this.x, this.y, this.width, this.height);

        // Drawing the enemy's health bar
        WIN.fillStyle = GRAY; WIN.fillRect(this.x, this.y + this.height + SF, (SF * 28.5), (SF * 6));

        if (this.max_health * 0.33 > this.health) { WIN.fillStyle = RED; }
        else if (this.max_health * 0.67 > this.health) { WIN.fillStyle = YELLOW; }
        else { WIN.fillStyle = GREEN; }
        WIN.fillRect(this.x + (SF * 0.8), this.y + this.height + (SF * 2), (SF * 27) / (this.max_health / this.health), (SF * 4));

        // Drawing the enemy's level as text
        WIN.fillStyle = BLACK; WIN.font = `${4 * SF}px Arial`;
        WIN.fillText(`Lvl: ${this.level}`, this.x + (SF * 2), this.y + this.height + (SF * 5.5));
    }
}


class Zombie extends Basic_Enemy {
    constructor(player_level) {
        super();
        this.image = ZOMBIE_IMAGE;
        this.frame_width = ZOMBIE_FRAME_WIDTH; this.frame_height = ZOMBIE_FRAME_HEIGHT;
        this.width = this.frame_width * SF; this.height = ZOMBIE_FRAME_HEIGHT * SF;
        this.x = (((Math.floor(Math.random() * (PLAYABLE_REGION[2] - this.width - PLAYABLE_REGION[0] + 1)) + PLAYABLE_REGION[0]) / SF) * SF);
        this.y = (((Math.floor(Math.random() * (PLAYABLE_REGION[3] - this.height - PLAYABLE_REGION[1] + 1)) + PLAYABLE_REGION[1]) / SF) * SF);
        this.set_level(player_level);
        this.speed = SF;
    }

    // 'handle_model' is defined in the child class not the parent class because the size and shape of the sprite sheet may differ
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
}


class Human extends Basic_Enemy {
    constructor(player_level) {
        super();
        this.image = HUMAN_IMAGE;
        this.frame_width = FRAME_HEIGHT; this.frame_height = FRAME_HEIGHT;
        this.width = this.frame_width * SF; this.height = this.frame_height * SF;
        this.x = (((Math.floor(Math.random() * (PLAYABLE_REGION[2] - this.width - PLAYABLE_REGION[0] + 1)) + PLAYABLE_REGION[0]) / SF) * SF);
        this.y = (((Math.floor(Math.random() * (PLAYABLE_REGION[3] - this.height - PLAYABLE_REGION[1] + 1)) + PLAYABLE_REGION[1]) / SF) * SF);
        this.set_level(player_level);
        this.speed = SF * 1.25;
        this.attack = (this.attack * 0.75).toFixed(0);
    }

    // 'handle_model' is defined in the child class not the parent class because the size and shape of the sprite sheet may differ
    handle_model(frame_counter) {
        if (this.Move_Left) {
            this.animation_frame[1] = 1;
        } else if (this.Move_Right) {
            this.animation_frame[1] = 3;
        } else if (this.Move_Up) {
            this.animation_frame[1] = 2;
        } else if (this.Move_Down) {
            this.animation_frame[1] = 0;
        }

        if (this.attack_cooldown == 0) {
            this.animation_frame[0] = 1 + (frame_counter / 7).toFixed(0) % 10;
        } else {
            this.animation_frame[0] = 11;
        }
    }
}
