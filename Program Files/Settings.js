console.log("'Settings.js' loaded.");

const CANVAS = document.getElementById("game_window");
const WIDTH = CANVAS.width; const HEIGHT = CANVAS.height;
const FRAME_WIDTH = 25; const FRAME_HEIGHT = 25;
const ZOMBIE_FRAME_WIDTH = 32; const ZOMBIE_FRAME_HEIGHT = 32;

const GRAY = "rgb(50, 50, 50)";     // Defining colors with RGB values
const SF = 5;                       // Defining scale factor of pixel images

var player_image = new Image(FRAME_WIDTH * 11 * SF, FRAME_HEIGHT * 4 * SF);
player_image.src = "Files/sprite_sheet.png";

var zombie_image = new Image(ZOMBIE_FRAME_WIDTH * 9 * SF, ZOMBIE_FRAME_HEIGHT * 4 * SF);
zombie_image.src = "Files/zombie.png";
