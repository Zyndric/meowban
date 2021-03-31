namespace SpriteKind {
    export const Crate = SpriteKind.create()
}
/**
 * Check win condition and manage buttons in a continuous loop.
 * 
 * A win is when all boxes stand on a target tile (pink).
 * 
 * Direction buttons can be pressed repeatedly without delay. They can be pressed continuously, in which case Meowban continues to move, but not too fast.
 * 
 * Button B must be blocked during menu, otherwise a B press during menu will be handled as undo action when the menu returns.
 */
/**
 * Set up
 */
/**
 * Determine if a box is on a specific tile by comparing their absolute x and y pixel coordiates. Use pixels, because the color-coded Tile object lacks a mechanism to get its tileset coordinates.
 */
controller.down.onEvent(ControllerButtonEvent.Released, function () {
    pressed_down = 0
})
controller.up.onEvent(ControllerButtonEvent.Released, function () {
    pressed_up = 0
})
/**
 * Tile coding:
 * 
 * 14 brown  -- wall (#)
 * 
 *   3 pink     -- target (.)
 * 
 *   7 green   -- player (@)
 * 
 *   6 teal      -- player on target (+)
 * 
 *   4 orange -- crate ($)
 * 
 *   2 red       -- crate on target (*)
 * 
 * 13 tan       -- floor
 */
function init_states () {
    pressed_up = 0
    pressed_down = 0
    pressed_left = 0
    pressed_right = 0
    undo_ban = []
    undo_box = []
}
function show_menu () {
    game.splash("A - Menu", "B - Undo")
    if (game.ask("Menu", "Reset this level?")) {
    	
    } else {
        if (game.ask("Menu", "Go to level selection?")) {
        	
        } else {
            if (game.ask("Menu", "See credits?")) {
            	
            }
        }
    }
}
function move_to (tx: number, ty: number, push_tx: number, push_ty: number) {
    if (!(tiles.tileIsWall(tiles.getTileLocation(tx, ty)))) {
        if (box_on_tile(tx, ty)) {
            if (!(tiles.tileIsWall(tiles.getTileLocation(push_tx, push_ty)))) {
                if (!(box_on_tile(push_tx, push_ty))) {
                    move_box(tx, ty, push_tx, push_ty)
                    move_ban(tx, ty)
                    info.changeScoreBy(-1)
                }
            }
        } else {
            undo_box = []
            move_ban(tx, ty)
            info.changeScoreBy(-1)
        }
    }
}
/**
 * tx, ty are tileset coordinates
 * 
 * dtx, dty are relative deviations of tileset coordinates
 * 
 * x, y are pixel screen coordinates
 */
function walk (dtx: number, dty: number) {
    move_to(tiles.locationXY(tiles.locationOfSprite(ban), tiles.XY.column) + dtx, tiles.locationXY(tiles.locationOfSprite(ban), tiles.XY.row) + dty, tiles.locationXY(tiles.locationOfSprite(ban), tiles.XY.column) + 2 * dtx, tiles.locationXY(tiles.locationOfSprite(ban), tiles.XY.row) + 2 * dty)
}
controller.left.onEvent(ControllerButtonEvent.Released, function () {
    pressed_left = 0
})
function all_boxes_fit () {
    for (let c of sprites.allOfKind(SpriteKind.Crate)) {
        if (!(target_tile(c.x, c.y))) {
            return 0
        }
    }
    return 1
}
function init_level_by_tilemap () {
    scene.setTileMap(img`
        . . e e e e . . . . 
        . . e d 3 e . . . . 
        . . e d d e e e . . 
        . . e 2 7 d d e . . 
        . . e d d 4 d e . . 
        . . e d d e e e . . 
        . . e e e e . . . . 
        `)
    for (let t of scene.getTilesByType(2)) {
        box = sprites.create(img`
            . f f f f f f f f f f f f f f . 
            f e e e e e e e e e e e e e e f 
            f e e e e e e e e e e e e e e f 
            f f f f f f f f f f f f f f f f 
            f e e f 4 4 4 4 4 f e e f e e f 
            f e e f 4 4 4 4 f e e e f e e f 
            f e e f 4 4 4 f e e e f f e e f 
            f e e f 4 4 f e e e f 4 f e e f 
            f e e f 4 f e e e f 4 4 f e e f 
            f e e f f e e e f 4 4 4 f e e f 
            f e e f e e e f 4 4 4 4 f e e f 
            f e e f e e f 4 4 4 4 4 f e e f 
            f f f f f f f f f f f f f f f f 
            f e e e e e e e e e e e e e e f 
            f e e e e e e e e e e e e e e f 
            . f f f f f f f f f f f f f f . 
            `, SpriteKind.Crate)
        scene.place(t, box)
        scene.setTileAt(t, 3)
    }
    for (let t of scene.getTilesByType(4)) {
        box = sprites.create(img`
            . f f f f f f f f f f f f f f . 
            f 4 4 4 4 4 4 4 4 4 4 4 4 4 4 f 
            f 4 4 4 4 4 4 4 4 4 4 4 4 4 4 f 
            f e e e e e e e e e e e e e e f 
            f 4 4 e 4 4 4 4 4 e 4 4 e 4 4 f 
            f 4 4 e 4 4 4 4 e 4 4 4 e 4 4 f 
            f 4 4 e 4 4 4 e 4 4 4 e e 4 4 f 
            f 4 4 e 4 4 e 4 4 4 e 4 e 4 4 f 
            f 4 4 e 4 e 4 4 4 e 4 4 e 4 4 f 
            f 4 4 e e 4 4 4 e 4 4 4 e 4 4 f 
            f 4 4 e 4 4 4 e 4 4 4 4 e 4 4 f 
            f 4 4 e 4 4 e 4 4 4 4 4 e 4 4 f 
            f e e e e e e e e e e e e e e f 
            f 4 4 4 4 4 4 4 4 4 4 4 4 4 4 f 
            f 4 4 4 4 4 4 4 4 4 4 4 4 4 4 f 
            . f f f f f f f f f f f f f f . 
            `, SpriteKind.Crate)
        scene.place(t, box)
    }
    for (let t of scene.getTilesByType(6)) {
        ban = sprites.create(img`
            . . f f f . f f f f . f f f . . 
            . f f f f f c c c c f f f f f . 
            . f f f f b c c c c b f f f f . 
            . f f f b a c c c c a b f f f . 
            . . f a a c c c c c c a a f . . 
            . . f c c c c 4 4 c c c c f . . 
            . . f f c c 4 4 4 4 c c f f . . 
            . . f f f b f 4 4 f b f f f . . 
            . . f f 4 1 f d d f 1 4 f f . . 
            . . . f f d d d d d d f f . . . 
            . . . e f e 4 4 4 4 e f e . . . 
            . . e 4 f b a a a a b f 4 e . . 
            . . 4 d f a a a a a a c d 4 . . 
            . . 4 4 f 8 8 8 8 8 8 f 4 4 . . 
            . . . . . f f f f f f . . . . . 
            . . . . . f f . . f f . . . . . 
            `, SpriteKind.Player)
        scene.place(t, ban)
        scene.setTileAt(t, 3)
    }
    for (let t of scene.getTilesByType(7)) {
        ban = sprites.create(img`
            . . f f f . f f f f . f f f . . 
            . f f f f f c c c c f f f f f . 
            . f f f f b c c c c b f f f f . 
            . f f f c 3 c c c c 3 c f f f . 
            . . f 3 3 c c c c c c 3 3 f . . 
            . . f c c c c 4 4 c c c c f . . 
            . . f f c c 4 4 4 4 c c f f . . 
            . . f f f b f 4 4 f b f f f . . 
            . . f f 4 1 f d d f 1 4 f f . . 
            . . . f f d d d d d d f f . . . 
            . . . e f e 4 4 4 4 e f e . . . 
            . . e 4 f b 3 3 3 3 b f 4 e . . 
            . . 4 d f 3 3 3 3 3 3 c d 4 . . 
            . . 4 4 f 6 6 6 6 6 6 f 4 4 . . 
            . . . . . f f f f f f . . . . . 
            . . . . . f f . . f f . . . . . 
            `, SpriteKind.Player)
        scene.place(t, ban)
    }
    scene.setTile(3, img`
        d d d d d d d d d d d d d d d d 
        d d d d d d d d d d d d d d d d 
        d d d d d d d d d d d d d d d d 
        d d d d d d d d d d d d d d d d 
        d d d d d d d d d d d d d d d d 
        d d d d d d d d d d d d d d d d 
        d d d d d d 2 2 2 2 d d d d d d 
        d d d d d d 2 d d 2 d d d d d d 
        d d d d d d 2 d d 2 d d d d d d 
        d d d d d d 2 2 2 2 d d d d d d 
        d d d d d d d d d d d d d d d d 
        d d d d d d d d d d d d d d d d 
        d d d d d d d d d d d d d d d d 
        d d d d d d d d d d d d d d d d 
        d d d d d d d d d d d d d d d d 
        d d d d d d d d d d d d d d d d 
        `, false)
    scene.setTile(4, img`
        d d d d d d d d d d d d d d d d 
        d d d d d d d d d d d d d d d d 
        d d d d d d d d d d d d d d d d 
        d d d d d d d d d d d d d d d d 
        d d d d d d d d d d d d d d d d 
        d d d d d d d d d d d d d d d d 
        d d d d d d d d d d d d d d d d 
        d d d d d d d d d d d d d d d d 
        d d d d d d d d d d d d d d d d 
        d d d d d d d d d d d d d d d d 
        d d d d d d d d d d d d d d d d 
        d d d d d d d d d d d d d d d d 
        d d d d d d d d d d d d d d d d 
        d d d d d d d d d d d d d d d d 
        d d d d d d d d d d d d d d d d 
        d d d d d d d d d d d d d d d d 
        `, false)
    scene.setTile(7, img`
        d d d d d d d d d d d d d d d d 
        d d d d d d d d d d d d d d d d 
        d d d d d d d d d d d d d d d d 
        d d d d d d d d d d d d d d d d 
        d d d d d d d d d d d d d d d d 
        d d d d d d d d d d d d d d d d 
        d d d d d d d d d d d d d d d d 
        d d d d d d d d d d d d d d d d 
        d d d d d d d d d d d d d d d d 
        d d d d d d d d d d d d d d d d 
        d d d d d d d d d d d d d d d d 
        d d d d d d d d d d d d d d d d 
        d d d d d d d d d d d d d d d d 
        d d d d d d d d d d d d d d d d 
        d d d d d d d d d d d d d d d d 
        d d d d d d d d d d d d d d d d 
        `, false)
    scene.setTile(14, img`
        c c c c c c b c c c c c c c b c 
        b b b b b b b b b b b b b b b b 
        c c b c c c c c c c b c c c c c 
        c c b c c c c c c c b c c c c c 
        c c b c c c c c c c b c c c c c 
        b b b b b b b b b b b b b b b b 
        c c c c c c b c c c c c c c b c 
        c c c c c c b c c c c c c c b c 
        c c c c c c b c c c c c c c b c 
        b b b b b b b b b b b b b b b b 
        c c b c c c c c c c b c c c c c 
        c c b c c c c c c c b c c c c c 
        c c b c c c c c c c b c c c c c 
        b b b b b b b b b b b b b b b b 
        c c c c c c b c c c c c c c b c 
        c c c c c c b c c c c c c c b c 
        `, true)
    scene.setTile(14, img`
        d d d d d c c c d d d d d d d d 
        b b b b b d c b b b b b b b b b 
        b b b b b d c b b b b b b b b b 
        b b b b b b c b b b b b b b b b 
        c c c c c c c c c c c c c c c c 
        d d d d d d d d d c c c d d d d 
        b b b b b b b b b d c b b b b b 
        b b b b b b b b b d c b b b b b 
        b b b b b b b b b d c b b b b b 
        b b b b b b b b b c c c b b b b 
        c c c c c c c c c c c c c c c c 
        d d c c c d d d d d d d d d d d 
        b b d c b b b b b b b b b b b b 
        b b d c b b b b b b b b b b b b 
        b b b c b b b b b b b b b b b b 
        c c c c c c c c c c c c c c c c 
        `, true)
    scene.setTile(14, img`
        b b b b b b b b b b f f f b b b 
        c c c c c c c c c c b f c c c c 
        c c c c c c c c c c b f c c c c 
        c c c c c c c c c c f f f c c c 
        f f f f f f f f f f f f f f f f 
        f f b b b b b b b b b b b b b f 
        f c c c c c c c c c c c c c c b 
        f c c c c c c c c c c c c c c b 
        f c c c c c c c c c c c c c c b 
        f f c c c c c c c c c c c c c f 
        f f f f f f f f f f f f f f f f 
        b b b f f f b b b b b b b b b b 
        c c c b f c c c c c c c c c c c 
        c c c b f c c c c c c c c c c c 
        c c c f f f c c c c c c c c c c 
        f f f f f f f f f f f f f f f f 
        `, true)
    scene.cameraFollowSprite(ban)
    info.setScore(0)
}
function undo_move () {
    if (undo_ban.length == 2) {
        move_ban(undo_ban[0], undo_ban[1])
        info.changeScoreBy(1)
    }
    if (undo_box.length == 4) {
        move_box(undo_box[2], undo_box[3], undo_box[0], undo_box[1])
    }
    undo_ban = []
    undo_box = []
}
controller.B.onEvent(ControllerButtonEvent.Released, function () {
    pressed_B = 0
})
function move_ban (to_tx: number, to_ty: number) {
    undo_ban = [tiles.locationXY(tiles.locationOfSprite(ban), tiles.XY.column), tiles.locationXY(tiles.locationOfSprite(ban), tiles.XY.row)]
    tiles.placeOnTile(ban, tiles.getTileLocation(to_tx, to_ty))
    if (target_tile(tiles.locationXY(tiles.getTileLocation(to_tx, to_ty), tiles.XY.x), tiles.locationXY(tiles.getTileLocation(to_tx, to_ty), tiles.XY.y))) {
        ban.setImage(img`
            . . f f f . f f f f . f f f . . 
            . f f f f f c c c c f f f f f . 
            . f f f f b c c c c b f f f f . 
            . f f f b a c c c c a b f f f . 
            . . f a a c c c c c c a a f . . 
            . . f c c c c 4 4 c c c c f . . 
            . . f f c c 4 4 4 4 c c f f . . 
            . . f f f b f 4 4 f b f f f . . 
            . . f f 4 1 f d d f 1 4 f f . . 
            . . . f f d d d d d d f f . . . 
            . . . e f e 4 4 4 4 e f e . . . 
            . . e 4 f b a a a a b f 4 e . . 
            . . 4 d f a a a a a a c d 4 . . 
            . . 4 4 f 8 8 8 8 8 8 f 4 4 . . 
            . . . . . f f f f f f . . . . . 
            . . . . . f f . . f f . . . . . 
            `)
    } else {
        ban.setImage(img`
            . . f f f . f f f f . f f f . . 
            . f f f f f c c c c f f f f f . 
            . f f f f b c c c c b f f f f . 
            . f f f c 3 c c c c 3 c f f f . 
            . . f 3 3 c c c c c c 3 3 f . . 
            . . f c c c c 4 4 c c c c f . . 
            . . f f c c 4 4 4 4 c c f f . . 
            . . f f f b f 4 4 f b f f f . . 
            . . f f 4 1 f d d f 1 4 f f . . 
            . . . f f d d d d d d f f . . . 
            . . . e f e 4 4 4 4 e f e . . . 
            . . e 4 f b 3 3 3 3 b f 4 e . . 
            . . 4 d f 3 3 3 3 3 3 c d 4 . . 
            . . 4 4 f 6 6 6 6 6 6 f 4 4 . . 
            . . . . . f f f f f f . . . . . 
            . . . . . f f . . f f . . . . . 
            `)
    }
}
function box_on_tile (tx: number, ty: number) {
    for (let c of sprites.allOfKind(SpriteKind.Crate)) {
        if (tiles.locationXY(tiles.locationOfSprite(c), tiles.XY.column) == tx && tiles.locationXY(tiles.locationOfSprite(c), tiles.XY.row) == ty) {
            return 1
        }
    }
    return 0
}
controller.right.onEvent(ControllerButtonEvent.Released, function () {
    pressed_right = 0
})
function move_box (from_tx: number, from_ty: number, to_tx: number, to_ty: number) {
    for (let c of sprites.allOfKind(SpriteKind.Crate)) {
        if (c.x == tiles.locationXY(tiles.getTileLocation(from_tx, from_ty), tiles.XY.x) && c.y == tiles.locationXY(tiles.getTileLocation(from_tx, from_ty), tiles.XY.y)) {
            undo_box = [from_tx, from_ty, to_tx, to_ty]
            tiles.placeOnTile(c, tiles.getTileLocation(to_tx, to_ty))
            if (target_tile(tiles.locationXY(tiles.getTileLocation(to_tx, to_ty), tiles.XY.x), tiles.locationXY(tiles.getTileLocation(to_tx, to_ty), tiles.XY.y))) {
                c.setImage(img`
                    . f f f f f f f f f f f f f f . 
                    f e e e e e e e e e e e e e e f 
                    f e e e e e e e e e e e e e e f 
                    f f f f f f f f f f f f f f f f 
                    f e e f 4 4 4 4 4 f e e f e e f 
                    f e e f 4 4 4 4 f e e e f e e f 
                    f e e f 4 4 4 f e e e f f e e f 
                    f e e f 4 4 f e e e f 4 f e e f 
                    f e e f 4 f e e e f 4 4 f e e f 
                    f e e f f e e e f 4 4 4 f e e f 
                    f e e f e e e f 4 4 4 4 f e e f 
                    f e e f e e f 4 4 4 4 4 f e e f 
                    f f f f f f f f f f f f f f f f 
                    f e e e e e e e e e e e e e e f 
                    f e e e e e e e e e e e e e e f 
                    . f f f f f f f f f f f f f f . 
                    `)
            } else {
                c.setImage(img`
                    . f f f f f f f f f f f f f f . 
                    f 4 4 4 4 4 4 4 4 4 4 4 4 4 4 f 
                    f 4 4 4 4 4 4 4 4 4 4 4 4 4 4 f 
                    f e e e e e e e e e e e e e e f 
                    f 4 4 e 4 4 4 4 4 e 4 4 e 4 4 f 
                    f 4 4 e 4 4 4 4 e 4 4 4 e 4 4 f 
                    f 4 4 e 4 4 4 e 4 4 4 e e 4 4 f 
                    f 4 4 e 4 4 e 4 4 4 e 4 e 4 4 f 
                    f 4 4 e 4 e 4 4 4 e 4 4 e 4 4 f 
                    f 4 4 e e 4 4 4 e 4 4 4 e 4 4 f 
                    f 4 4 e 4 4 4 e 4 4 4 4 e 4 4 f 
                    f 4 4 e 4 4 e 4 4 4 4 4 e 4 4 f 
                    f e e e e e e e e e e e e e e f 
                    f 4 4 4 4 4 4 4 4 4 4 4 4 4 4 f 
                    f 4 4 4 4 4 4 4 4 4 4 4 4 4 4 f 
                    . f f f f f f f f f f f f f f . 
                    `)
            }
            return
        }
    }
}
function target_tile (x: number, y: number) {
    for (let t of scene.getTilesByType(3)) {
        if (x == t.x) {
            if (y == t.y) {
                return 1
            }
        }
    }
    return 0
}
let pressed_B = 0
let box: Sprite = null
let ban: Sprite = null
let undo_box: number[] = []
let undo_ban: number[] = []
let pressed_right = 0
let pressed_left = 0
let pressed_up = 0
let pressed_down = 0
init_states()
init_level_by_tilemap()
forever(function () {
    if (all_boxes_fit()) {
        game.over(true)
    }
    if (controller.up.isPressed()) {
        if (!(pressed_up)) {
            walk(0, -1)
            pressed_up = 10
        } else {
            pressed_up += -1
        }
    }
    if (controller.down.isPressed()) {
        if (!(pressed_down)) {
            walk(0, 1)
            pressed_down = 10
        } else {
            pressed_down += -1
        }
    }
    if (controller.left.isPressed()) {
        if (!(pressed_left)) {
            walk(-1, 0)
            pressed_left = 10
        } else {
            pressed_left += -1
        }
    }
    if (controller.right.isPressed()) {
        if (!(pressed_right)) {
            walk(1, 0)
            pressed_right = 10
        } else {
            pressed_right += -1
        }
    }
    if (controller.A.isPressed()) {
        show_menu()
        pressed_B = 10
    }
    if (controller.B.isPressed()) {
        if (!(pressed_B)) {
            undo_move()
        } else {
            pressed_B += -1
        }
    }
})
