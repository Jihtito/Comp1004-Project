console.log("'Classes.js' loaded.");

class Player {
    constructor() {
        this.image = PLAYER_IMAGE;
        this.width = FRAME_WIDTH * SF; this.height = FRAME_HEIGHT * SF;
        this.x = WIDTH/2 - this.width/2; this.y = HEIGHT/2 - this.height/2;

        this.animation_frame = [0, 0];
        this.W_pressed = false;
        this.S_pressed = false;
        this.A_pressed = false;
        this.D_pressed = false;
        this.speed = SF * 2;
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

        if (this.W_pressed || this.S_pressed || this.A_pressed || this.D_pressed) {
            this.animation_frame[0] = 1 + (frame_counter / 7).toFixed(0) % 10;
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

        if (this.W_pressed) { if (this.y > PLAYABLE_REGION[1] - this.height/2) {
            this.y -= this.speed;
        }} else if (this.S_pressed) { if (this.y < PLAYABLE_REGION[3] - this.height) {
            this.y += this.speed;
        }} else if (this.A_pressed) { if (this.x > PLAYABLE_REGION[0]) {
            this.x -= this.speed;
        }} else if (this.D_pressed) { if (this.x < PLAYABLE_REGION[2] - this.width) {
            this.x += this.speed;
        }}

        this.handle_player_model(frame_counter);
    }

    draw(WIN) {
        WIN.drawImage(this.image, FRAME_WIDTH * this.animation_frame[0], 
            FRAME_HEIGHT * this.animation_frame[1], FRAME_WIDTH, FRAME_HEIGHT, 
            this.x, this.y, this.width, this.height);
    }
}


class Zombie {
    constructor() {
        this.image = ZOMBIE_IMAGE;
        this.width = ZOMBIE_FRAME_WIDTH * SF; this.height = ZOMBIE_FRAME_HEIGHT * SF;
        this.x = Math.floor(Math.random() * (PLAYABLE_REGION[2] - this.width - PLAYABLE_REGION[0] + 1)) + PLAYABLE_REGION[0];
        this.y = Math.floor(Math.random() * (PLAYABLE_REGION[3] - this.height - PLAYABLE_REGION[1] + 1)) + PLAYABLE_REGION[1];

        this.animation_frame = [0, 0];
        this.Move_Up = false;
        this.Move_Down = false;
        this.Move_Left = false;
        this.Move_Right = false;
        this.is_attacking = false;
        this.speed = SF;
    }

    handle_model(frame_counter) {
        if (this.Move_Left) {
            this.animation_frame[1] = 1;
        } else if (this.Move_Right) {
            this.animation_frame[1] = 0;
        }

        if (!this.is_attacking) {
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

            this.animation_frame[0] = (frame_counter / 7).toFixed(0) % 6;
        }
    }

    update(frame_counter, player_x, player_y) {
        if ((-80 < this.x - player_x && this.x - player_x < 80) && (-80 < this.y - player_y && this.y - player_y < 80)) {
            this.is_attacking = true;
        } else {
            this.is_attacking = false;
        }
        
        if (!this.is_attacking) {
            if (this.x - 10 > player_x) {
                this.Move_Right = false;
                this.Move_Left = true;
            } else if (this.x + 10 < player_x) {
                this.Move_Left = false;
                this.Move_Right = true;
            } else {
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
    }

    draw(WIN) {
        WIN.drawImage(this.image,  ZOMBIE_FRAME_WIDTH * this.animation_frame[0], 
            ZOMBIE_FRAME_HEIGHT * this.animation_frame[1], ZOMBIE_FRAME_WIDTH, ZOMBIE_FRAME_HEIGHT, 
            this.x, this.y, this.width, this.height);
    }
}
