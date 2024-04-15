Dungeon Simulator is a single player 2d pixel art game that takes inspiration from games such as the early Legend of Zelda titles and roguelikes such as The Binding of Isaac.
The player's goal is to survive for as long as possible against the ever increasing hords of enemies. Enemies will pathfind towards the player at all times and attack if they get close enough.
Enemies spawn in waves of increasing size, with a new wave spawning once the player has killed all members of the previous wave. At the start of every wave a new potion will spawn if there
isn't already one on the field. Touching a potion will restore half of the what players max health was when the potion was generated. There are two types of enemies:
Zombies, that deal more damage but walk more slowly and Humans, that deal less damage but walk faster.

Attacking will shoot out a sword swipe that moves in the direction the player was facing when the attack button (spacebar) was pressed. This sword swipe will damage the first enemy it hits
then disappear, with the amount of damage it deals scaling based off of the player's attack stat. Leveling up increases the player's max health and attack stats. The amount of experience needed to
level up to the next level is displayed on the bottom right side of the screen along with the player's current level. Experience is gained from killing enemies, with the amount being determined
by how much max health the enemy had. When enemies spawns in there is a 35% chance of it being a human and a 65% chance of it being a zombie. The level of the enemy is a random number
between 1 and 2 + the player's current level. Enemies max health and attack stats scale of their level, like the player's does. Once the player dies a score is generated based off of the wave
number they got to, and a .json file is downloaded containing this score, their level and their playtime.
