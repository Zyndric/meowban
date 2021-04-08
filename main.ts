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
    scroll_level = 0
    undo_ban = []
    undo_box = []
    tiles.destroySpritesOfKind(SpriteKind.Player)
    tiles.destroySpritesOfKind(SpriteKind.Crate)
    tiles.destroySpritesOfKind(SpriteKind.Text)
    scene.centerCameraAt(80, 60)
    info.setScore(0)
}
controller.A.onEvent(ControllerButtonEvent.Released, function () {
    pressed_A = 0
})
function set_up_selection () {
    reset_states()
    state_selection = 1
    state_level = 0
    button_lag = 8
    text_title = textsprite.create(" ", 0, 7)
    text_title.setMaxFontHeight(8)
    text_title.setPosition(24, 15)
    text_title.setBorder(1, 0, 2)
    text_title.setText("Menu")
    text_levelset = textsprite.create(" ", 0, 6)
    text_levelset.setMaxFontHeight(8)
    text_levelset.setPosition(24, 35)
    text_levelset.setIcon(assets.image`icon arrows leftright`)
    text_levelset.setBorder(1, 0, 2)
    text_level = textsprite.create(" ", 0, 9)
    text_level.setMaxFontHeight(8)
    text_level.setPosition(24, 50)
    text_level.setIcon(assets.image`icon arrows leftright`)
    text_level.setBorder(1, 9, 2)
    text_help = textsprite.create(" ", 0, 6)
    text_help.setMaxFontHeight(8)
    text_help.setPosition(24, 65)
    text_help.setBorder(1, 0, 2)
    text_help.setText("Help")
    text_credits = textsprite.create(" ", 0, 6)
    text_credits.setMaxFontHeight(8)
    text_credits.setPosition(24, 80)
    text_credits.setBorder(1, 0, 2)
    text_credits.setText("Credits")
    text_footer = textsprite.create("=Choose  A=OK  B=Back", 0, 13)
    text_footer.setMaxFontHeight(8)
    text_footer.setIcon(assets.image`icon arrows updown`)
    text_footer.setPosition(80, 110)
    mySprite = sprites.create(scale_thumbnail(assets.image`level microban 01`), SpriteKind.Player)
    mySprite.setPosition(122, 69)
    scene.setTileMap(assets.image`level selection`)
}
function set_up_level () {
    reset_states()
    state_selection = 0
    state_level = 1
    button_lag = 10
    scene.setTileMap(get_level_asset())
    realize_tilemap()
    scene.centerCameraAt(screen_center_x(), screen_center_y())
    if (scroll_level) {
        scene.cameraFollowSprite(ban)
    }
    introduce_level()
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
/**
 * Soko-Chan/Meowban
 * 
 * TODO
 * 
 * - infinite undo
 * 
 * - rename to sokochan
 * 
 * - help
 * 
 * - credits
 * 
 * - title screen
 * 
 * - more levels (from sets "Yoshio Murase", "Sokogen-990602", Microban, Microcosmos, Nabokosmos, "Classic Thinking Rabbit", Boxxle)
 * 
 * - better in-game menu
 * 
 * - nicer level selection menu with minimap
 * 
 * - sort MakeCode blocks
 * 
 * - 
 * 
 * Included Features
 * 
 * - one step undo
 * 
 * - reset level
 * 
 * - level selection
 * 
 * - push/move counter
 * 
 * - different sprites when on target tile
 * 
 * - different level sets (names with up to 8 characters)
 * 
 * - levels of up to 11x9 tiles show without scrolling (up to 10x7 tiles of walkable area)
 * 
 * - continuous movement when button is being held down
 * 
 * Nice to Have
 * 
 * - different tile sets for different level sets
 * 
 * - a way to handle large levels without scrolling, maybe through smaller 8x8 sprite tilemaps
 */
function sprite_cache () {
    box = sprites.create(assets.image`crate wood`, SpriteKind.Crate)
    box = sprites.create(assets.image`crate wood on target`, SpriteKind.Crate)
    box = sprites.create(assets.image`crate wood2`, SpriteKind.Crate)
    box = sprites.create(assets.image`crate wood2 on target`, SpriteKind.Crate)
    box = sprites.create(assets.image`create chest`, SpriteKind.Crate)
    box = sprites.create(assets.image`crate chest on target`, SpriteKind.Crate)
    box = sprites.create(assets.image`crate drawer`, SpriteKind.Crate)
    box = sprites.create(assets.image`crate drawer on target`, SpriteKind.Crate)
    box = sprites.create(assets.image`crate marble`, SpriteKind.Crate)
    box = sprites.create(assets.image`crate marble on target`, SpriteKind.Crate)
    box = sprites.create(assets.image`crate car`, SpriteKind.Crate)
    box = sprites.create(assets.image`crate car on target`, SpriteKind.Crate)
    box = sprites.create(assets.image`crate clam`, SpriteKind.Crate)
    box = sprites.create(assets.image`crate clam on target`, SpriteKind.Crate)
    box = sprites.create(assets.image`crate shrub`, SpriteKind.Crate)
    box = sprites.create(assets.image`crate shrub on target`, SpriteKind.Crate)
    scene.setTile(3, assets.image`target switch`, false)
    scene.setTile(3, assets.image`target tan`, false)
    scene.setTile(3, assets.image`target dark purple`, false)
    scene.setTile(3, assets.image`target patch`, false)
    scene.setTile(3, assets.image`target tiled`, false)
    scene.setTile(3, assets.image`target tan dotted`, false)
    scene.setTile(13, assets.image`floor tan dotted`, false)
    scene.setTile(13, assets.image`floor tan`, false)
    scene.setTile(13, assets.image`floor tiled`, false)
    scene.setTile(13, assets.image`floor dark purple`, false)
    scene.setTile(14, assets.image`wall brown bricks`, true)
    scene.setTile(14, assets.image`wall purple bricks`, true)
    scene.setTile(14, assets.image`wall dark purple bricks`, true)
    scene.setTile(14, assets.image`wall dark brown bricks`, true)
    scene.setTile(14, assets.image`wall steel`, true)
    scene.setTile(14, assets.image`wall red bricks`, true)
    scene.setTile(14, assets.image`wall yellow bricks`, true)
    scene.setTile(14, assets.image`wall teal bricks`, true)
    scene.setTile(14, assets.image`wall overgrown bricks`, true)
    scene.setTile(14, assets.image`wall plant`, true)
    scene.setTile(14, assets.image`wall sand`, true)
    scene.setTile(14, assets.image`wall reef`, true)
    scene.setTile(14, assets.image`wall colored`, true)
    scene.setTile(14, assets.image`wall old teal bricks`, true)
    scene.setTile(14, assets.image`wall large teal bricks`, true)
}
function scale_thumbnail (src: Image) {
    thumbnail = image.create(45, 36)
    for (let x = 0; x <= 15; x++) {
        for (let y = 0; y <= 12; y++) {
            thumbnail.fillRect(x * 3, y * 3, 3, 3, src.getPixel(x, y))
        }
    }
    thumbnail.drawLine(0, 0, 44, 0, 6)
    thumbnail.drawLine(0, 35, 44, 35, 6)
    thumbnail.drawLine(0, 0, 0, 35, 6)
    thumbnail.drawLine(44, 0, 44, 35, 6)
    return thumbnail
}
function show_menu () {
    game.splash("A - Menu", "B - Undo")
    if (game.ask("Menu", "Reset this level?")) {
        set_up_level()
    } else {
        if (game.ask("Menu", "Go to level selection?")) {
            set_up_selection()
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
            music.footstep.play()
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
function get_level_asset_easy (lv: number) {
    if (lv == 1) {
        return assets.image`level easy 01`
    } else if (lv == 2) {
        return assets.image`level easy 02`
    } else if (lv == 3) {
        return assets.image`level easy 03`
    } else if (lv == 4) {
        return assets.image`level easy 04`
    } else if (lv == 5) {
        return assets.image`level easy 05`
    } else if (lv == 6) {
        return assets.image`level easy 06`
    } else if (lv == 7) {
        return assets.image`level easy 07`
    } else if (lv == 8) {
        return assets.image`level easy 08`
    } else if (lv == 9) {
        return assets.image`level easy 09`
    } else if (lv == 10) {
        return assets.image`level easy 10`
    }
    return assets.image`level easy 01`
}
function undo_move () {
    if (undo_ban.length == 2) {
        move_ban(undo_ban[0], undo_ban[1])
        info.changeScoreBy(1)
        music.footstep.play()
    }
    if (undo_box.length == 4) {
        move_box(undo_box[2], undo_box[3], undo_box[0], undo_box[1])
    }
    undo_ban = []
    undo_box = []
}
function control_level () {
    if (all_boxes_fit()) {
        pause(500)
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
}
function introduce_level () {
    text_frame = textsprite.create("       ", 13, 13)
    text_introduction = textsprite.create("" + list_levelsets[levelset] + " " + convertToText(level), 0, 12)
    text_introduction.setMaxFontHeight(16)
    text_frame.setMaxFontHeight(20)
    text_frame.setBorder(1, 12)
    if (scroll_level) {
        text_introduction.setPosition(scene.cameraProperty(CameraProperty.X), scene.cameraProperty(CameraProperty.Y))
        text_frame.setPosition(scene.cameraProperty(CameraProperty.X), scene.cameraProperty(CameraProperty.Y))
    } else {
        text_introduction.setPosition(screen_center_x(), screen_center_y())
        console.logValue("xmid calulated", screen_center_x())
        console.logValue("xmid reported", scene.cameraProperty(CameraProperty.X))
        text_frame.setPosition(screen_center_x(), screen_center_y())
    }
    music.bigCrash.play()
    pause(1000)
    text_introduction.destroy()
    text_frame.destroy()
}
controller.B.onEvent(ControllerButtonEvent.Released, function () {
    pressed_B = 0
})
function move_ban (to_tx: number, to_ty: number) {
    undo_ban = [tiles.locationXY(tiles.locationOfSprite(ban), tiles.XY.column), tiles.locationXY(tiles.locationOfSprite(ban), tiles.XY.row)]
    tiles.placeOnTile(ban, tiles.getTileLocation(to_tx, to_ty))
    if (target_tile(tiles.locationXY(tiles.getTileLocation(to_tx, to_ty), tiles.XY.x), tiles.locationXY(tiles.getTileLocation(to_tx, to_ty), tiles.XY.y))) {
        ban.setImage(assets.image`sokochan on target`)
    } else {
        ban.setImage(assets.image`sokochan`)
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
function screen_center_x () {
    return tiles.tilemapColumns() * tiles.tileWidth() / 2
}
function get_level_asset_microban (lv: number) {
    if (lv == 1) {
        return assets.image`level microban 01`
    } else if (lv == 2) {
        return assets.image`level microban 02`
    } else if (lv == 3) {
        return assets.image`level microban 03`
    } else if (lv == 4) {
        return assets.image`level microban 04`
    } else if (lv == 5) {
        return assets.image`level microban 05`
    } else if (lv == 6) {
        return assets.image`level microban 06`
    } else if (lv == 7) {
        return assets.image`level microban 07`
    } else if (lv == 8) {
        scroll_level = 1
        return assets.image`level microban 08`
    } else if (lv == 9) {
        return assets.image`level microban 09`
    } else if (lv == 10) {
        return assets.image`level microban 10`
    }
    return assets.image`level microban 01`
}
controller.right.onEvent(ControllerButtonEvent.Released, function () {
    pressed_right = 0
})
function get_level_asset () {
    if (levelset == 1) {
        return get_level_asset_microban(level)
    } else if (levelset == 2) {
        return get_level_asset_murase(level)
    } else {
        return get_level_asset_easy(level)
    }
}
function move_box (from_tx: number, from_ty: number, to_tx: number, to_ty: number) {
    for (let c of sprites.allOfKind(SpriteKind.Crate)) {
        if (c.x == tiles.locationXY(tiles.getTileLocation(from_tx, from_ty), tiles.XY.x) && c.y == tiles.locationXY(tiles.getTileLocation(from_tx, from_ty), tiles.XY.y)) {
            undo_box = [from_tx, from_ty, to_tx, to_ty]
            tiles.placeOnTile(c, tiles.getTileLocation(to_tx, to_ty))
            if (target_tile(tiles.locationXY(tiles.getTileLocation(to_tx, to_ty), tiles.XY.x), tiles.locationXY(tiles.getTileLocation(to_tx, to_ty), tiles.XY.y))) {
                music.knock.play()
                c.setImage(assets.image`crate drawer on target`)
            } else {
                music.thump.play()
                c.setImage(assets.image`crate drawer`)
            }
            return
        }
    }
}
function screen_center_y () {
    return tiles.tilemapRows() * tiles.tileWidth() / 2
}
function control_selection () {
    if (controller.up.isPressed() && !(pressed_up)) {
        levelset += -1
        pressed_up = button_lag
    }
    if (controller.down.isPressed() && !(pressed_down)) {
        levelset += 1
        pressed_down = button_lag
    }
    levelset = (levelset + list_levelsets.length) % list_levelsets.length
    text_levelset.setText("Group: " + list_levelsets[levelset])
    if (controller.left.isPressed() && !(pressed_left)) {
        level += -1
        pressed_left = button_lag
    }
    if (controller.right.isPressed() && !(pressed_right)) {
        level += 1
        pressed_right = button_lag
    }
    level = (level - 1 + 10) % 10 + 1
    text_level.setText("Level: " + convertToText(level))
    if (controller.A.isPressed() && !(pressed_A)) {
        set_up_level()
    }
}
function decay_button_lag () {
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
}
function get_level_asset_murase (lv: number) {
    if (lv == 1) {
        return assets.image`level murase 01`
    } else if (lv == 2) {
        return assets.image`level murase 02`
    } else if (lv == 3) {
        return assets.image`level murase 03`
    } else if (lv == 4) {
        return assets.image`level murase 04`
    } else if (lv == 5) {
        return assets.image`level murase 05`
    } else if (lv == 6) {
        return assets.image`level murase 06`
    } else if (lv == 7) {
        return assets.image`level murase 07`
    } else if (lv == 8) {
        return assets.image`level murase 08`
    } else if (lv == 9) {
        return assets.image`level murase 09`
    } else if (lv == 10) {
        return assets.image`level murase 10`
    }
    return assets.image`level murase 01`
}
function realize_tilemap () {
    for (let t of scene.getTilesByType(2)) {
        box = sprites.create(assets.image`crate drawer on target`, SpriteKind.Crate)
        scene.place(t, box)
        scene.setTileAt(t, 3)
    }
    for (let t of scene.getTilesByType(4)) {
        box = sprites.create(assets.image`crate drawer`, SpriteKind.Crate)
        scene.place(t, box)
        scene.setTileAt(t, 13)
    }
    for (let t of scene.getTilesByType(6)) {
        ban = sprites.create(assets.image`sokochan on target`, SpriteKind.Player)
        scene.place(t, ban)
        scene.setTileAt(t, 3)
    }
    for (let t of scene.getTilesByType(7)) {
        ban = sprites.create(assets.image`sokochan`, SpriteKind.Player)
        scene.place(t, ban)
        scene.setTileAt(t, 13)
    }
    scene.setTile(3, assets.image`target tan dotted`, false)
    scene.setTile(13, assets.image`floor tan dotted`, false)
    scene.setTile(14, assets.image`wall steel`, true)
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
let text_introduction: TextSprite = null
let text_frame: TextSprite = null
let thumbnail: Image = null
let box: Sprite = null
let ban: Sprite = null
let mySprite: Sprite = null
let text_footer: TextSprite = null
let text_credits: TextSprite = null
let text_help: TextSprite = null
let text_level: TextSprite = null
let text_levelset: TextSprite = null
let text_title: TextSprite = null
let button_lag = 0
let state_level = 0
let state_selection = 0
let undo_box: number[] = []
let undo_ban: number[] = []
let scroll_level = 0
let pressed_B = 0
let pressed_A = 0
let pressed_right = 0
let pressed_left = 0
let pressed_down = 0
let pressed_up = 0
let level = 0
let levelset = 0
let list_levelsets: string[] = []
list_levelsets = ["Easy", "Microban", "Y. Murase"]
levelset = 0
level = 1
set_up_selection()
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
    if (state_selection) {
        control_selection()
    }
    if (state_level) {
        control_level()
    }
    decay_button_lag()
})
