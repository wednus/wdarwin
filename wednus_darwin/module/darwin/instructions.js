/**
 * \file instructions.js   Instructions for Creature class
 *
 * This file extends the Creature class with more instructions; the more
 * instructions, the smarter the creature is.
 * @author Sundew H. Shin
 * @version 0.1.1
 * @note built-in commands:
 * - still: be still
 * - left,right,backward,rturn,north,east,south,west: change dir
 */


/**
 * behavior definition for: hitting wall
 */
W.Creature.prototype.ifWall  = 'rturn';