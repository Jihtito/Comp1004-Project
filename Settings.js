console.log("'Settings.js' loaded.");

const CANVAS = document.getElementById("game_window");
const WIDTH = CANVAS.width; const HEIGHT = CANVAS.height;

const MAP_WIDTH = 350; const MAP_HEIGHT = 223; 
const FRAME_WIDTH = 25; const FRAME_HEIGHT = 25;
const ZOMBIE_FRAME_WIDTH = 32; const ZOMBIE_FRAME_HEIGHT = 32;
const PROJECTILE_FRAME_WIDTH = 32; const PROJECTILE_FRAME_HEIGHT = 32;

const BLACK = "rgb(0, 0, 0)";       // Defining colors with RGB values
const GRAY = "rgb(50, 50, 50)";
const WHITE = "rgb(255, 255, 255)";
const RED = "rgb(255, 0, 0)";
const YELLOW = "rgb(255, 255, 0)";
const GREEN = "rgb(0, 255, 0)";
const CYAN = "rgb(0, 255, 255)";
const SF = 3.5;                     // Defining scale factor of all game assets

const PLAYER_IMAGE = new Image(FRAME_WIDTH * 11 * SF, FRAME_HEIGHT * 4 * SF);
PLAYER_IMAGE.src = "Files/sprite_sheet.png";

const ZOMBIE_IMAGE = new Image(ZOMBIE_FRAME_WIDTH * 9 * SF, ZOMBIE_FRAME_HEIGHT * 4 * SF);
ZOMBIE_IMAGE.src = "Files/zombie.png";

const HUMAN_IMAGE = new Image(FRAME_WIDTH * 11 * SF, FRAME_HEIGHT * 4 * SF);
HUMAN_IMAGE.src = "Files/human.png";

const PROJECTILE_IMAGE = new Image(PROJECTILE_FRAME_WIDTH * SF, PROJECTILE_FRAME_HEIGHT * 4 * SF);
PROJECTILE_IMAGE.src = "Files/projectile.png";

const HEALTH_POTION_IMAGE = new Image(FRAME_HEIGHT * SF, FRAME_HEIGHT * 4 * SF);
HEALTH_POTION_IMAGE.src = "Files/health_potion.png";

const MAP_IMAGE = new Image(MAP_WIDTH * SF, MAP_HEIGHT * SF);
MAP_IMAGE.src = "Files/background.png";

const PAUSE_MENU_IMAGE = new Image(339 * SF, 221 * SF);
PAUSE_MENU_IMAGE.src = "Files/pause_menu.png";

const MAP_POS = [CANVAS.width/2 - MAP_IMAGE.width/2, CANVAS.height/2 - MAP_IMAGE.height/2];

const PLAYABLE_REGION = [CANVAS.width/2 - MAP_IMAGE.width/2.48, CANVAS.height/2 - MAP_IMAGE.height/2.94,
                         CANVAS.width/2 + MAP_IMAGE.width/2.48, CANVAS.height/2 + MAP_IMAGE.height/2.94];

const HELP_MESSAGE = [
    "Enemies will pathfind towards the player at all times and attack if they get close enough. They spawn in waves of increasing size, with a new", 
    "wave only spawning once you have killed all members of the previous wave. At the start of every wave a new potion will spawn if there isn't", 
    "already one on the field. Touching a potion will restore half of the players max health. There are two types of enemies: Zombies, that", 
    "deal more damage but walk slower and Humans, that deal less damage but walk faster. Attacking will shoot out a sword swipe in the direction", 
    "you are facing that will damage the first enemy it hits then disappear. Leveling increases your max health and attack. The amount of experience", 
    "needed to level up to the next level is displayed on the bottom right along with your current level. Experience is gained from killing enemies."
];
