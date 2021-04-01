namespace SpriteKind {
    export const Crate = SpriteKind.create()
}
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
function reset_states () {
    pressed_up = 0
    pressed_down = 0
    pressed_left = 0
    pressed_right = 0
    pressed_A = 0
    pressed_B = 0
    undo_ban = []
    undo_box = []
    for (let c of sprites.allOfKind(SpriteKind.Player)) {
        c.destroy()
    }
    for (let c of sprites.allOfKind(SpriteKind.Crate)) {
        c.destroy()
    }
    info.setScore(0)
}
controller.A.onEvent(ControllerButtonEvent.Released, function () {
    pressed_A = 0
})
function set_up_level () {
    reset_states()
    if (level == 1) {
        scene.setTileMap(img`
            . . . . . . . . . . 
            . e e e e e . . . . 
            . e d 7 d e e . . . 
            . e d d d d e e e . 
            . e d d 4 d d 3 e . 
            . e d d d e e e e . 
            . e e e e e . . . . 
            . . . . . . . . . . 
            `)
        center_camera()
    } else if (level == 2) {
        scene.setTileMap(img`
            . . . . . . . . . . 
            . . e e e e . . . . 
            . . e d 3 e . . . . 
            . . e d d e e e . . 
            . . e 2 7 d d e . . 
            . . e d d 4 d e . . 
            . . e d d e e e . . 
            . . e e e e . . . . 
            . . . . . . . . . . 
            `)
        center_camera()
    } else {
        game.over(true)
    }
    realize_tilemap()
    reset_buttons()
}
controller.down.onEvent(ControllerButtonEvent.Released, function () {
    pressed_down = 0
})
controller.up.onEvent(ControllerButtonEvent.Released, function () {
    pressed_up = 0
})
function reset_buttons () {
    pressed_up = button_lag
    pressed_down = button_lag
    pressed_left = button_lag
    pressed_right = button_lag
    pressed_A = button_lag
    pressed_B = button_lag
}
function sprite_cache () {
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
    box = sprites.create(img`
        e 3 3 3 3 3 3 3 3 3 3 3 3 3 3 e 
        e 4 4 4 4 4 4 4 4 4 4 4 4 4 4 e 
        e e e e e e e e e e e e e e e e 
        e 4 e 4 4 4 4 4 4 4 4 4 4 e 4 e 
        e 4 e e e e e e e e e e e e 4 e 
        e 4 e 3 3 3 3 3 3 3 3 3 3 e 4 e 
        e 4 e 4 4 4 4 4 4 4 4 4 4 e 4 e 
        e 4 e e e e e e e e e e e e 4 e 
        e 4 e 3 3 3 3 3 3 3 3 3 3 e 4 e 
        e 4 e 4 4 4 4 4 4 4 4 4 4 e 4 e 
        e 3 3 3 3 3 3 3 3 3 3 3 3 3 3 e 
        e 4 4 4 4 4 4 4 4 4 4 4 4 4 4 e 
        e e e e e e e e e e e e e e e e 
        e e c c c c c c c c c c c c e e 
        e e c c c c c c c c c c c c e e 
        e e e e e e e e e e e e e e e e 
        `, SpriteKind.Crate)
    box = sprites.create(img`
        e 2 2 2 2 2 2 2 2 2 2 2 2 2 2 e 
        e 4 4 4 4 4 4 4 4 4 4 4 4 4 4 e 
        e e e e e e e e e e e e e e e e 
        e 4 e 4 4 4 4 4 4 4 4 4 4 e 4 e 
        e 4 e e e e e e e e e e e e 4 e 
        e 4 e 2 2 2 2 2 2 2 2 2 2 e 4 e 
        e 4 e 4 4 4 4 4 4 4 4 4 4 e 4 e 
        e 4 e e e e e e e e e e e e 4 e 
        e 4 e 2 2 2 2 2 2 2 2 2 2 e 4 e 
        e 4 e 4 4 4 4 4 4 4 4 4 4 e 4 e 
        e 2 2 2 2 2 2 2 2 2 2 2 2 2 2 e 
        e 4 4 4 4 4 4 4 4 4 4 4 4 4 4 e 
        e e e e e e e e e e e e e e e e 
        e e 7 7 7 7 7 7 7 7 7 7 7 7 e e 
        e e 7 7 7 7 7 7 7 7 7 7 7 7 e e 
        e e e e e e e e e e e e e e e e 
        `, SpriteKind.Crate)
    box = sprites.create(img`
        . . b b b b b b b b b b b b . . 
        . b e 4 4 4 4 4 4 4 4 4 4 e b . 
        b e 4 4 4 4 4 4 4 4 4 4 4 4 e b 
        b e 4 4 4 4 4 4 4 4 4 4 4 4 e b 
        b e 4 4 4 4 4 4 4 4 4 4 4 4 e b 
        b e e 4 4 4 4 4 4 4 4 4 4 e e b 
        b e e e e e e e e e e e e e e b 
        b e e e e e e e e e e e e e e b 
        b b b b b b b d d b b b b b b b 
        c b b b b b b c c b b b b b b c 
        c c c c c c b c c b c c c c c c 
        b e e e e e c b b c e e e e e b 
        b e e e e e e e e e e e e e e b 
        b c e e e e e e e e e e e e c b 
        b b b b b b b b b b b b b b b b 
        . b b . . . . . . . . . . b b . 
        `, SpriteKind.Crate)
    box = sprites.create(img`
        . b b b b b b b b b b b b b b . 
        b e 4 4 4 4 4 4 4 4 4 4 4 4 4 b 
        b e 4 4 4 4 4 4 4 4 4 4 4 4 e b 
        b e e 4 4 4 4 4 4 4 4 4 4 e e b 
        b b b b b b b d d b b b b b b b 
        . b b b b b b c c b b b b b b . 
        b c c c c c b c c b c c c c c b 
        b c c c c c c b b c c c c c c b 
        b c c c c c c c c c c c c c c b 
        b c c c c c c c c c c c c c c b 
        b b b b b b b b b b b b b b b b 
        b e e e e e e e e e e e e e e b 
        b e e e e e e e e e e e e e e b 
        b c e e e e e e e e e e e e c b 
        b b b b b b b b b b b b b b b b 
        . b b . . . . . . . . . . b b . 
        `, SpriteKind.Crate)
    box = sprites.create(img`
        . c c c c c c c c c c c c c c . 
        c b d d d d d d d d d d d d b c 
        c d d d d d d d d d d d d d d c 
        c d d d d d d d d d d d d d d c 
        c d d d d d d d d d d d d d d c 
        c d d d d d d d d d d d d d d c 
        c d d d d d d d d d d d d d d c 
        c d b b b b b b b b b b b b d c 
        c b b b b b b b b b b b b b b c 
        c b d d d d d d d d d d d d b c 
        c b c b b b c b b c b b b c b c 
        f b c b b b c d d c b b b c b f 
        f b c b b b b c c b b b b c b f 
        f b c c c c c c c c c c c c b f 
        f b b b b b b b b b b b b b b f 
        f b f f f f f f f f f f f f b f 
        `, SpriteKind.Crate)
    box = sprites.create(img`
        . c c c c c c c c c c c c c c . 
        c b 7 7 7 7 7 7 7 7 7 7 7 7 b c 
        c 7 7 7 7 7 7 7 7 7 7 7 7 7 7 c 
        c 7 7 7 7 7 7 7 7 7 7 7 7 7 7 c 
        c 7 7 7 7 7 7 7 7 7 7 7 7 7 7 c 
        c 7 7 7 7 7 7 7 7 7 7 7 7 7 7 c 
        c 7 7 7 7 7 7 7 7 7 7 7 7 7 7 c 
        c 7 6 6 6 6 6 6 6 6 6 6 6 6 7 c 
        c 6 6 6 6 6 6 6 6 6 6 6 6 6 6 c 
        c 6 7 7 7 7 7 7 7 7 7 7 7 7 6 c 
        c 6 c 6 6 6 c 6 6 c 6 6 6 c 6 c 
        f 6 c 6 6 6 c d d c 6 6 6 c 6 f 
        f 6 c 6 6 6 6 c c 6 6 6 6 c 6 f 
        f 6 c c c c c c c c c c c c 6 f 
        f 6 6 6 6 6 6 6 6 6 6 6 6 6 6 f 
        f 6 f f f f f f f f f f f f 6 f 
        `, SpriteKind.Crate)
    box = sprites.create(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . 6 6 6 6 . . . . . . 
        . . . . 6 6 6 5 5 6 6 6 . . . . 
        . . . 7 7 7 7 6 6 6 6 6 6 . . . 
        . . 6 7 7 7 7 8 8 8 1 1 6 6 . . 
        . . 7 7 7 7 7 8 8 8 1 1 5 6 . . 
        . 6 7 7 7 7 8 8 8 8 8 5 5 6 6 . 
        . 6 7 7 7 8 8 8 6 6 6 6 5 6 6 . 
        . 6 6 7 7 8 8 6 6 6 6 6 6 6 6 . 
        . 6 8 7 7 8 8 6 6 6 6 6 6 6 6 . 
        . . 6 8 7 7 8 6 6 6 6 6 8 6 . . 
        . . 6 8 8 7 8 8 6 6 6 8 6 6 . . 
        . . . 6 8 8 8 8 8 8 8 8 6 . . . 
        . . . . 6 6 8 8 8 8 6 6 . . . . 
        . . . . . . 6 6 6 6 . . . . . . 
        . . . . . . . . . . . . . . . . 
        `, SpriteKind.Crate)
    box = sprites.create(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . 4 4 4 4 . . . . . . 
        . . . . 4 4 4 5 5 4 4 4 . . . . 
        . . . 3 3 3 3 4 4 4 4 4 4 . . . 
        . . 4 3 3 3 3 2 2 2 1 1 4 4 . . 
        . . 3 3 3 3 3 2 2 2 1 1 5 4 . . 
        . 4 3 3 3 3 2 2 2 2 2 5 5 4 4 . 
        . 4 3 3 3 2 2 2 4 4 4 4 5 4 4 . 
        . 4 4 3 3 2 2 4 4 4 4 4 4 4 4 . 
        . 4 2 3 3 2 2 4 4 4 4 4 4 4 4 . 
        . . 4 2 3 3 2 4 4 4 4 4 2 4 . . 
        . . 4 2 2 3 2 2 4 4 4 2 4 4 . . 
        . . . 4 2 2 2 2 2 2 2 2 4 . . . 
        . . . . 4 4 2 2 2 2 4 4 . . . . 
        . . . . . . 4 4 4 4 . . . . . . 
        . . . . . . . . . . . . . . . . 
        `, SpriteKind.Crate)
    box = sprites.create(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . 6 6 6 6 6 6 6 6 . . 
        . . . . . 6 c 6 6 6 6 6 6 9 6 . 
        . . . . 6 c c 6 6 6 6 6 6 9 c 6 
        . . d 6 9 c c 6 9 9 9 9 9 9 c c 
        . d 6 6 9 c b 8 8 8 8 8 8 8 6 c 
        . 6 6 6 9 b 8 8 b b b 8 b b 8 6 
        . 6 6 6 6 6 8 b b b b 8 b b b 8 
        . 6 6 6 6 8 6 6 6 6 6 8 6 6 6 8 
        . 6 d d 6 8 f 8 8 8 f 8 8 8 8 8 
        . d d 6 8 8 8 f 8 8 f 8 8 8 8 8 
        . 8 8 8 8 8 8 8 f f f 8 8 8 8 8 
        . 8 8 8 8 f f f 8 8 8 8 f f f f 
        . . . 8 f f f f f 8 8 f f f f f 
        . . . . f f f f . . . . f f f . 
        . . . . . . . . . . . . . . . . 
        `, SpriteKind.Crate)
    box = sprites.create(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . 2 2 2 2 2 2 2 2 . . 
        . . . . . 2 c 2 2 2 2 2 2 4 2 . 
        . . . . 2 c c 2 2 2 2 2 2 4 c 2 
        . . d 2 4 c c 2 4 4 4 4 4 4 c c 
        . d 2 2 4 c b e e e e e e e 2 c 
        . 2 2 2 4 b e e b b b e b b e 2 
        . 2 2 2 2 2 e b b b b e b b b e 
        . 2 2 2 2 e 2 2 2 2 2 e 2 2 2 e 
        . 2 d d 2 e f e e e f e e e e e 
        . d d 2 e e e f e e f e e e e e 
        . e e e e e e e f f f e e e e e 
        . e e e e f f f e e e e f f f f 
        . . . e f f f f f e e f f f f f 
        . . . . f f f f . . . . f f f . 
        . . . . . . . . . . . . . . . . 
        `, SpriteKind.Crate)
    box = sprites.create(img`
        . . c c c c c c c c c c c c . . 
        . . . c d d b d d b d d c . . . 
        . . . . c 3 b b 3 b 3 c . . . . 
        . . . . . c c c c c c . . . . . 
        . . . . c 3 3 3 3 3 3 c . . . . 
        . . . c 3 3 3 b 3 3 3 3 c . . . 
        . . . c 3 b 3 b 3 3 b 3 c . . . 
        . . c 3 3 b 3 b 3 3 b 3 3 c . . 
        . . c 3 3 b 3 b 3 3 b 3 3 c . . 
        . c 3 3 b b 3 b 3 3 b b 3 3 c . 
        . c 3 3 b 3 3 b 3 b 3 b 3 3 c . 
        c d d b 3 3 b 3 3 b 3 3 b d d c 
        f c c c d d c d d c d d c c c f 
        f b 3 c c c b c c b c c c 3 b f 
        . c b b 3 3 b 3 3 b 3 3 b b c . 
        . . f f f f f f f f f f f f . . 
        `, SpriteKind.Crate)
    box = sprites.create(img`
        . . . . . f c c c c f . . . . . 
        . . c c f b b 3 3 b b f c c . . 
        . c b 3 3 b b c c b b 3 3 b c . 
        . f 3 c c c b c c b c c c 3 f . 
        f c b b c c b c c b c c b b c f 
        c 3 c c b c c c c c c b c c 3 c 
        c 3 c c c c c c c c c c c c 3 c 
        . f b b c c c c c c c c b b f . 
        . . f b b c 8 9 9 8 c b b f . . 
        . . c c c f 9 3 1 9 f c c c . . 
        . c 3 f f f 9 3 3 9 f f f 3 c . 
        c 3 f f f f 8 9 9 8 f f f f 3 c 
        f 3 c c f f f f f f f f c c 3 f 
        f b 3 c b b f b b f b b c 3 b f 
        . c b b 3 3 b 3 3 b 3 3 b b c . 
        . . f f f f f f f f f f f f . . 
        `, SpriteKind.Crate)
    box = sprites.create(img`
        . . . . . . . c c . . . . . . . 
        . . . . c c c 6 5 c 6 6 . . . . 
        . . . . c 6 c 5 5 c 7 6 . . . . 
        . . . 6 c c 7 5 5 7 c 6 6 . . . 
        . . c c 7 7 7 7 7 5 7 7 c 6 . . 
        . 6 6 6 c 6 7 7 7 7 6 c c 6 6 . 
        c 7 7 7 6 c 7 c 6 7 6 7 7 7 7 6 
        c c c 6 6 6 c 6 6 6 6 7 7 6 6 6 
        . c c 7 6 6 6 6 6 7 7 7 7 c 6 . 
        . c 7 7 6 6 7 6 6 7 7 6 7 7 c . 
        . c c c c 7 7 6 f 7 7 c c c c . 
        . . . . c 7 c f f c 7 c . . . . 
        . . . . . 6 f e e e c . . . . . 
        . . . . . e e e e e e . . . . . 
        . . . . e e . e e . e e . . . . 
        . . . . . . . e e . . . . . . . 
        `, SpriteKind.Crate)
    box = sprites.create(img`
        . . . . . . 6 6 6 6 . . . . . . 
        . . . . . c 6 7 7 6 c . . . . . 
        . . . . c 6 7 5 7 7 6 c . . . . 
        . . 6 6 c c 6 5 5 6 c c 6 6 . . 
        6 6 6 5 5 5 6 7 5 6 5 5 7 6 6 6 
        6 6 7 7 7 5 7 6 7 5 5 7 7 7 7 6 
        . c c c 6 6 7 6 6 5 7 6 c c 6 . 
        6 c 6 6 6 6 6 c c 6 6 6 6 6 c 6 
        6 6 7 7 7 c c c c c c 7 7 7 6 6 
        6 7 7 7 6 6 c c c c 6 6 7 7 7 6 
        c 6 c c 6 7 6 c c 6 7 6 c c 6 c 
        . c c 5 5 7 6 7 7 6 7 5 5 c c . 
        . c 6 7 5 5 6 7 7 6 5 5 7 6 c . 
        . 6 6 7 7 6 6 5 5 6 6 7 7 6 6 . 
        . . 6 6 6 6 c 6 7 6 c 6 6 6 . . 
        . . . 6 6 c . 6 6 6 . c 6 . . . 
        `, SpriteKind.Crate)
    scene.setTile(3, img`
        b b b b b b b b b b b b b b b b 
        b c b b b b b b b b b b b b c b 
        b b b e 4 4 4 4 4 4 4 4 e b b b 
        b b e 4 4 4 4 4 4 4 4 4 4 e b b 
        b b 4 4 4 4 4 4 4 4 4 4 4 4 b b 
        b b 4 4 4 4 4 4 4 4 4 4 4 4 b b 
        b b 4 4 4 4 4 4 4 4 4 4 4 4 b b 
        b b 4 4 4 4 4 4 4 4 4 4 4 4 b b 
        b b 4 4 4 4 4 4 4 4 4 4 4 4 b b 
        b b d 4 4 4 4 4 4 4 4 4 4 d b b 
        b b d 4 4 4 4 4 4 4 4 4 4 d b b 
        b b 4 d 4 4 4 4 4 4 4 4 d 4 b b 
        b b c 4 d d d d d d d d 4 c b b 
        b b b c c c c c c c c c c b b b 
        b c b b b b b b b b b b b b c b 
        b b b b b b b b b b b b b b b b 
        `, false)
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
    scene.setTile(3, img`
        c c c c c c c c c c c c c c c c 
        c c c c c c c c c b c c c c b c 
        c c b c c c c c c c c c c c c c 
        c c c c c c c c c c c c c c c c 
        c c c c b b c c c c b b c c c c 
        c c c c b b b b b b b b c c c c 
        c c c c c b c c c c b c c b c c 
        c b c c c b c c c c b c c c c c 
        c c c c c b c c c c b c c c c c 
        c c c c c b c c c c b c c c c c 
        c c c c b b b b b b b b c c c c 
        c c c c b b c c c c b b c c c c 
        c c c c c c c c c c c c c c c c 
        c c b c c c c c c c c c c b c c 
        c c c c c c c b c c c c c c c c 
        c c c c c c c c c c c c c c c c 
        `, false)
    scene.setTile(3, img`
        d d d d d d d d d d d d d d d d 
        d d d 1 1 d d d d d d d d b d d 
        d d d 1 1 d d d d d d d d d d d 
        d d d d 6 6 6 d d 6 d 6 d d d d 
        d d b d 7 7 7 7 7 6 7 6 d d d d 
        d d d d 6 7 7 7 7 6 7 7 7 d d d 
        d d d d 6 7 7 7 7 7 7 7 6 6 d d 
        d d d 6 7 7 7 7 7 7 7 7 7 7 d d 
        d d d 7 7 7 7 7 7 7 7 7 7 6 d d 
        d d d 6 6 7 7 7 7 7 7 7 7 6 d d 
        d d d d 6 7 7 7 7 6 7 7 6 d d d 
        1 1 d d 6 7 7 7 7 6 7 6 6 d d d 
        1 1 d d d 7 6 7 6 6 7 d b d d d 
        d d d d d d 1 d d d d d d d d d 
        d d d d d d d d d d d d d d d d 
        d d d d d d d d d d d d d d b d 
        `, false)
    scene.setTile(3, img`
        d 1 1 1 1 1 d b b d 1 1 1 1 1 b 
        1 d d d d d b e d b d d d d d b 
        1 d d d d b e d d d b d d d d b 
        1 d d d b e d d d d d b d d d b 
        1 d d b e d d d d d d d b d d b 
        1 d b e d d d d d d d d d b d b 
        d b e d d d d d d d d d d d b b 
        b e d d d d d d d d d d d d 1 b 
        b d d d d d d d d d d d d 1 1 b 
        d b d d d d d d d d d d 1 1 b b 
        1 d b d d d d d d d d 1 1 b d b 
        1 d d b d d d d d d 1 1 b d d b 
        1 d d d b d d d d 1 1 b d d d b 
        1 d d d d b d d 1 1 b d d d d b 
        1 d d d d d b 1 1 b d d d d d b 
        b b b b b b b b b b b b b b b e 
        `, false)
    scene.setTile(13, img`
        d d d d d d d d d d d d d d d d 
        d d d 1 1 d d d d d d d d b d d 
        d d d 1 1 d d d d d d d d d d d 
        d d d d d d d d d d d d d d d d 
        d d b d d d d d d b b d d d d d 
        d d d d d d d d d b b d d d d d 
        d d d d d d d d d d d d d d d d 
        d d d d d d d d d d d d d d d d 
        d d d d d b d d d d d d d d d d 
        d d d d d d d d d d d d d d d d 
        d d d d d d d d d d d d d d d d 
        1 1 d d d d d d d d d d d d d d 
        1 1 d d d d d d d d d d b d d d 
        d d d d d d 1 d d d d d d d d d 
        d d d d d d d d d d d d d d d d 
        d d d d d d d d d d d d d d b d 
        `, false)
    scene.setTile(13, img`
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
    scene.setTile(13, img`
        d 1 1 1 1 1 1 1 1 1 1 1 1 1 1 b 
        1 d d d d d d d d d d d d d d b 
        1 d d d d d d d d d d d d d d b 
        1 d d d d d d d d d d d d d d b 
        1 d d d d d d d d d d d d d d b 
        1 d d d d d d d d d d d d d d b 
        1 d d d d d d d d d d d d d d b 
        1 d d d d d d d d d d d d d d b 
        1 d d d d d d d d d d d d d d b 
        1 d d d d d d d d d d d d d d b 
        1 d d d d d d d d d d d d d d b 
        1 d d d d d d d d d d d d d d b 
        1 d d d d d d d d d d d d d d b 
        1 d d d d d d d d d d d d d d b 
        1 d d d d d d d d d d d d d d b 
        b b b b b b b b b b b b b b b b 
        `, false)
    scene.setTile(13, img`
        c c c c c c c c c c c c c c c c 
        c c c c c c c c c b c c c c b c 
        c c b c c c c c c c c c c c c c 
        c c c c c c c c c c c c c c c c 
        c c c c c c c c c c c c c c c c 
        c c c c c c b c c c c b c c c c 
        c c c c c c c c c c c c c c c c 
        c b c c c c c c c c c c c c c c 
        c c c c c c c c c c c c c c c c 
        c c c c c b c c c c c b c c c c 
        c c c c c c c c c c c c c c c c 
        c c c c c c c c c c c c c c c c 
        c c c c c c c c c c c c c c c c 
        c c b c c c c c c c c c c b c c 
        c c c c c c c b c c c c c c c c 
        c c c c c c c c c c c c c c c c 
        `, false)
    scene.setTile(14, img`
        e e e e e e 4 e e e e e e e 4 e 
        4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 
        e e 4 e e e e e e e 4 e e e e e 
        e e 4 e e e e e e e 4 e e e e e 
        e e 4 e e e e e e e 4 e e e e e 
        4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 
        e e e e e e 4 e e e e e e e 4 e 
        e e e e e e 4 e e e e e e e 4 e 
        e e e e e e 4 e e e e e e e 4 e 
        4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 
        e e 4 e e e e e e e 4 e e e e e 
        e e 4 e e e e e e e 4 e e e e e 
        e e 4 e e e e e e e 4 e e e e e 
        4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 
        e e e e e e 4 e e e e e e e 4 e 
        e e e e e e 4 e e e e e e e 4 e 
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
    scene.setTile(14, img`
        e e e e e f e e e e e e e f e e 
        f f f f f f f f f f f f f f f f 
        e f b b b b b b b f e e e e e e 
        e f e e e e e e e f e e e e e e 
        e f e e e e e e e f e e e e e e 
        f f f f f f f f f f f f f f f f 
        c c c c c f b b b b b b b f c c 
        e e e e e f e e e e e e e f e e 
        e e e e e f e e e e e e e f e e 
        f f f f f f f f f f f f f f f f 
        e f b b b b b b b f e e e e e e 
        e f e e e e e e e f e e e e e e 
        e f e e e e e e e f e e e e e e 
        f f f f f f f f f f f f f f f f 
        b b b b b f c c c c c c c f b b 
        e e e e e f e e e e e e e f e e 
        `, true)
    scene.setTile(14, img`
        d d d d d d d d d d d d d d d d 
        d b b b b b b b b b b b b b b c 
        d b b b b b b b b b b b b b b c 
        d b b d c b b b b b b d c b b c 
        d b b b b b b b b b b b b b b c 
        d b b b b b b b b b b b b b b c 
        d b b b b b b b b b b b b b b c 
        d b b b b b b b b b b b b b b c 
        d b b b b b b b b b b b b b b c 
        d b b b b b b b b b b b b b b c 
        d b b b b b b b b b b b b b b c 
        d b b b b b b b b b b b b b b c 
        d b b d c b b b b b b d c b b c 
        d b b b b b b b b b b b b b b c 
        d b b b b b b b b b b b b b b c 
        d c c c c c c c c c c c c c c c 
        `, true)
    scene.setTile(14, img`
        e e e e e e e e e e e f f f e e 
        2 2 2 2 2 2 2 2 2 2 2 e f e 2 2 
        2 2 2 2 2 2 2 2 2 2 2 e f e 2 2 
        e e e e e e e e e e e f f f e e 
        f f f f f f f f f f f f f f f f 
        e f f f e e e e e e e e e e e e 
        2 e f e 2 2 2 2 2 2 2 2 2 2 2 2 
        2 e f e 2 2 2 2 2 2 2 2 2 2 2 2 
        e f f f e e e e e e e e e e e e 
        f f f f f f f f f f f f f f f f 
        e e e e e e e f f f e e e e e e 
        2 2 2 2 2 2 2 e f e 2 2 2 2 2 2 
        2 2 2 2 2 2 2 e f e 2 2 2 2 2 2 
        2 2 2 2 2 2 2 e f e 2 2 2 2 2 2 
        e e e e e e e f f f e e e e e e 
        f f f f f f f f f f f f f f f f 
        `, true)
    scene.setTile(14, img`
        5 5 5 5 5 5 4 5 5 5 5 5 5 5 4 5 
        4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 
        5 5 4 5 5 5 5 5 5 5 4 5 5 5 5 5 
        5 5 4 5 5 5 5 5 5 5 4 5 5 5 5 5 
        5 5 4 5 5 5 5 5 5 5 4 5 5 5 5 5 
        4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 
        5 5 5 5 5 5 4 5 5 5 5 5 5 5 4 5 
        5 5 5 5 5 5 4 5 5 5 5 5 5 5 4 5 
        5 5 5 5 5 5 4 5 5 5 5 5 5 5 4 5 
        4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 
        5 5 4 5 5 5 5 5 5 5 4 5 5 5 5 5 
        5 5 4 5 5 5 5 5 5 5 4 5 5 5 5 5 
        5 5 4 5 5 5 5 5 5 5 4 5 5 5 5 5 
        4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 
        5 5 5 5 5 5 4 5 5 5 5 5 5 5 4 5 
        5 5 5 5 5 5 4 5 5 5 5 5 5 5 4 5 
        `, true)
    scene.setTile(14, img`
        6 6 6 6 6 6 7 6 6 6 6 6 6 6 7 6 
        7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 
        6 6 7 6 6 6 6 6 6 6 7 6 6 6 6 6 
        6 6 7 6 6 6 6 6 6 6 7 6 6 6 6 6 
        6 6 7 6 6 6 6 6 6 6 7 6 6 6 6 6 
        7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 
        6 6 6 6 6 6 7 6 6 6 6 6 6 6 7 6 
        6 6 6 6 6 6 7 6 6 6 6 6 6 6 7 6 
        6 6 6 6 6 6 7 6 6 6 6 6 6 6 7 6 
        7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 
        6 6 7 6 6 6 6 6 6 6 7 6 6 6 6 6 
        6 6 7 6 6 6 6 6 6 6 7 6 6 6 6 6 
        6 6 7 6 6 6 6 6 6 6 7 6 6 6 6 6 
        7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 
        6 6 6 6 6 6 7 6 6 6 6 6 6 6 7 6 
        6 6 6 6 6 6 7 6 6 6 6 6 6 6 7 6 
        `, true)
    scene.setTile(14, img`
        6 6 6 c c 6 6 6 6 6 6 c c 6 6 6 
        7 7 7 7 c 7 7 7 7 7 7 7 c 7 7 7 
        7 7 7 7 6 7 7 7 7 7 7 7 6 7 7 7 
        6 6 7 7 6 7 7 7 7 7 7 7 6 c 6 6 
        c 6 6 6 c c c 7 7 7 6 6 6 6 c c 
        c 7 7 7 7 7 7 7 7 7 7 7 7 7 7 6 
        c c 7 7 7 7 7 7 7 7 7 7 7 6 6 6 
        c c c 6 7 c c c c c 7 7 6 c c c 
        6 6 7 7 7 7 6 6 6 6 6 6 6 6 6 6 
        6 6 6 7 7 7 6 6 6 6 6 6 6 6 6 6 
        c c c c 7 6 c c c c c 6 6 c c c 
        c 6 6 6 6 6 6 6 6 6 6 6 6 6 6 c 
        c c c c c c c c c c c c c c c c 
        6 6 c c 6 6 6 6 6 6 c c 6 6 6 6 
        c c c c c c c c c c c c c c c c 
        c c c c c c c c c c c c c c c c 
        `, true)
    scene.setTile(14, img`
        . . . 6 6 6 6 6 6 6 6 6 6 . . . 
        . 6 6 6 7 7 7 7 7 7 7 7 6 6 6 . 
        . 6 7 7 7 7 7 7 7 7 7 7 7 7 6 . 
        6 7 7 7 7 7 7 7 7 7 7 7 7 7 7 6 
        6 7 7 7 7 7 7 7 7 7 7 7 7 7 7 6 
        6 7 6 7 7 7 7 7 7 7 7 7 7 6 7 6 
        8 6 7 7 7 7 7 7 7 7 7 7 7 7 6 8 
        8 7 7 7 7 7 7 7 7 7 7 7 7 7 7 8 
        6 7 6 7 7 7 6 7 7 7 7 6 7 7 7 6 
        6 8 6 7 7 6 7 7 7 6 7 7 6 6 8 6 
        8 6 6 7 6 6 7 7 6 6 6 7 6 6 6 8 
        8 6 8 6 6 6 7 6 6 6 6 6 8 6 6 8 
        8 8 6 6 8 6 6 6 8 6 6 6 8 8 8 8 
        8 e 6 e e 8 6 6 8 8 6 8 8 8 e 8 
        8 e e e e e 6 e 8 8 e e 8 e e f 
        f e e e e f 8 e e 8 e e e e e f 
        `, true)
    scene.setTile(14, img`
        . . . . b b b b 3 3 3 b . . . . 
        . . 3 b d d 3 3 3 d d d b 3 . . 
        . 3 3 d d d d d d d d d d 3 3 . 
        3 3 d d d d d d d d d d d d 3 3 
        3 d d d d d d d d d d d d d d b 
        b d d d d d d d d 1 d d d d d b 
        b d d d d d 3 d d d d d d d 3 b 
        b d 3 3 3 d d d 3 d 3 3 3 d d b 
        b 3 d 3 b 3 d d d 3 d 3 b 3 d b 
        c 3 3 3 3 3 3 b 3 3 3 3 3 3 3 c 
        c 3 3 3 3 d 3 3 3 3 3 3 3 d 3 c 
        c 3 c c c 3 3 d d 3 c c c 3 3 c 
        c b b b b c 3 d d b b b b c 3 c 
        c b b b b b c c b b b b b b c c 
        c b b b b b b b b b b b b b b b 
        c b b b b b b b b b b b b b b b 
        `, true)
    scene.setTile(14, img`
        . . e e b b b b b b b b e e . . 
        . e b b b b b b b b b b b b e . 
        e b b b b b b b b b b b b b b e 
        b b b b b b b b b b b b b b b b 
        b b b b b b b b b b b b b b b b 
        b b b b b b b b b b b b b b b b 
        b b b b b b b b b b b b b b b b 
        b b b b b b b b b b b b b b b b 
        b b b b b b b b b b b b b b b b 
        b b b b b e e e b b b b b b b b 
        e e b e e e e b b b e e b b b e 
        b b e e b b e b b b e e e e e b 
        b e e e b b e e e f f b b e b b 
        f e b b e f f e f e e f e e e f 
        f f e e e e e f f e e f f f f f 
        f f f f e e f f f f f f f f f f 
        `, true)
    scene.setTile(14, img`
        4 4 4 4 4 d 7 7 7 7 7 7 7 d 4 4 
        4 4 4 4 d 2 d 7 7 7 7 7 d 4 4 4 
        4 4 4 d 2 2 2 d d d d d 2 d 4 4 
        4 4 d 2 2 2 2 2 2 2 2 2 2 2 d 4 
        d d d d d d 2 2 2 2 2 2 2 2 2 d 
        3 3 3 3 3 3 d 2 2 2 2 2 2 2 d 3 
        3 3 3 3 3 3 3 d 2 2 2 2 2 d 3 3 
        3 3 3 3 3 3 3 3 d d d d d 3 3 3 
        3 3 3 3 3 3 3 d 6 6 6 6 6 d 3 3 
        3 3 3 3 3 3 d 6 6 6 6 6 6 6 d 3 
        d d d d d d 6 6 6 6 6 6 6 6 6 d 
        8 8 8 8 d 7 d d d d d d d 6 d 8 
        8 8 8 d 7 7 7 7 7 7 7 7 7 d 8 8 
        8 8 d 7 7 7 7 7 7 7 7 7 7 7 d 8 
        d d 4 d 7 7 7 7 7 7 7 7 7 7 7 d 
        4 4 4 4 d 7 7 7 7 7 7 7 7 7 d 4 
        `, true)
}
function show_menu () {
    game.splash("A - Menu", "B - Undo")
    if (game.ask("Menu", "Reset this level?")) {
        set_up_level()
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
/**
 * Set up
 * 
 * Variables ban, level, "undo ban" and "undo box" are unique and used by name.
 * 
 * Variables box, c and t are loop and temporary variables.
 */
function next_level () {
    level += 1
    set_up_level()
}
/**
 * Determine if a box is on a specific tile by comparing their absolute x and y pixel coordiates. Use pixels, because the color-coded Tile object lacks a mechanism to get its tileset coordinates.
 */
function all_boxes_fit () {
    for (let c of sprites.allOfKind(SpriteKind.Crate)) {
        if (!(target_tile(c.x, c.y))) {
            return 0
        }
    }
    return 1
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
function center_camera () {
    scene.centerCameraAt(tiles.tilemapColumns() * tiles.tileWidth() / 2, tiles.tilemapRows() * tiles.tileWidth() / 2)
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
        if (tiles.locationXY(tiles.locationOfSprite(c), tiles.XY.column) == tx) {
            if (tiles.locationXY(tiles.locationOfSprite(c), tiles.XY.row) == ty) {
                return 1
            }
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
function realize_tilemap () {
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
        scene.setTileAt(t, 13)
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
        scene.setTileAt(t, 13)
    }
    scene.setTile(3, img`
        c c c c c c c c c c c c c c c c 
        c c c c c c c c c b c c c c b c 
        c c b c c c c c c c c c c c c c 
        c c c c c c c c c c c c c c c c 
        c c c c b b c c c c b b c c c c 
        c c c c b b b b b b b b c c c c 
        c c c c c b c c c c b c c b c c 
        c b c c c b c c c c b c c c c c 
        c c c c c b c c c c b c c c c c 
        c c c c c b c c c c b c c c c c 
        c c c c b b b b b b b b c c c c 
        c c c c b b c c c c b b c c c c 
        c c c c c c c c c c c c c c c c 
        c c b c c c c c c c c c c b c c 
        c c c c c c c b c c c c c c c c 
        c c c c c c c c c c c c c c c c 
        `, false)
    scene.setTile(13, img`
        c c c c c c c c c c c c c c c c 
        c c c c c c c c c b c c c c b c 
        c c b c c c c c c c c c c c c c 
        c c c c c c c c c c c c c c c c 
        c c c c c c c c c c c c c c c c 
        c c c c c c b c c c c b c c c c 
        c c c c c c c c c c c c c c c c 
        c b c c c c c c c c c c c c c c 
        c c c c c c c c c c c c c c c c 
        c c c c c b c c c c c b c c c c 
        c c c c c c c c c c c c c c c c 
        c c c c c c c c c c c c c c c c 
        c c c c c c c c c c c c c c c c 
        c c b c c c c c c c c c c b c c 
        c c c c c c c b c c c c c c c c 
        c c c c c c c c c c c c c c c c 
        `, false)
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
let ban: Sprite = null
let box: Sprite = null
let undo_box: number[] = []
let undo_ban: number[] = []
let pressed_B = 0
let pressed_A = 0
let pressed_right = 0
let pressed_left = 0
let pressed_down = 0
let pressed_up = 0
let level = 0
let button_lag = 0
button_lag = 10
level = 0
next_level()
/**
 * Check win condition and manage buttons in a continuous loop.
 * 
 * A win is when all boxes stand on a target tile (pink).
 * 
 * Direction buttons can be pressed repeatedly without delay. They can be pressed continuously, in which case Meowban continues to move, but not too fast.
 * 
 * Button B must be blocked during menu, otherwise a B press during menu will be handled as undo action when the menu returns.
 */
forever(function () {
    if (all_boxes_fit()) {
        next_level()
    }
    if (controller.up.isPressed() && !(pressed_up)) {
        walk(0, -1)
        pressed_up = button_lag
    }
    if (controller.down.isPressed() && !(pressed_down)) {
        walk(0, 1)
        pressed_down = button_lag
    }
    if (controller.left.isPressed() && !(pressed_left)) {
        walk(-1, 0)
        pressed_left = button_lag
    }
    if (controller.right.isPressed() && !(pressed_right)) {
        walk(1, 0)
        pressed_right = button_lag
    }
    if (controller.A.isPressed() && !(pressed_A)) {
        show_menu()
        reset_buttons()
    }
    if (controller.B.isPressed() && !(pressed_B)) {
        undo_move()
        pressed_B = button_lag
    }
    if (pressed_up) {
        pressed_up += -1
    }
    if (pressed_down) {
        pressed_down += -1
    }
    if (pressed_left) {
        pressed_left += -1
    }
    if (pressed_right) {
        pressed_right += -1
    }
    if (pressed_A) {
        pressed_A += -1
    }
    if (pressed_B) {
        pressed_B += -1
    }
})
