class Buffer {
    static data = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
}

//% color=#fc4417 icon="\uf26c"
namespace display {
    /**
     * Updates the display. Must be called for changes to take effect.
     */
    //% blockId="display_g_update" block="update the display" shim=display::updateDisplay
    export function updateDisplay(): void {
        return
    }

    /**
     * Clears the display.
     */
    //% blockId="display_clear" block="clear the display" shim=display::clear
    export function clear(): void {
        for (let i = 0; i < 504; i++) {
            Buffer.data[i] = 0
        }
    }

    /**
     * Turns the backlight on (1) or off (0)
     */
    //% blockId="display_set_backlight" block="set backlight %value"
    //% value.min=0 value.max=1 shim=display::setBacklight
    export function setBacklight(value: number): void {
        return
    }

    /**
     * Set the specified pixel, using x,y coordinates, to black.
     * @param x Horizontal position, between 0 (to the left) and 83.
     * @param y Vertical position, between 0 (on top) and 47.
     * @param color true = black
     */
    //% blockId="display_g_plot" block="set pixel x %x|, y %y| to black %color" shim=display::setPixel
    //% x.min=0 x.max=83
    //% y.min=0 y.min=47
    export function setPixel(x: number, y: number, color: boolean): void {
        if (x >= 0 && x < 84 && y >= 0 && y < 48) {
            if (color) {
                Buffer.data[(y / 8) * 84 + x] |= (1 << y % 8)
            }    
        }
    }

    /**
     * Check if the specified pixel is on or off
     * @param x Horizontal position, between 0 and 83.
     * @param y Vertical position, between 0 and 47.
     * @returns Returns true if the pixel is on (black), false otherwise (including if the coordinates are out of bounds).
     */
    //% blockId="display_g_getPixel" block="get value of pixel x %x| y %y" shim=display::getPixel
    //% x.min=0 x.max=83
    //% y.min=0 y.min=47
    export function getPixel(x: number, y: number): boolean {
        if (x >= 0 && x < 84 && y >= 0 && y < 48) {
            return (Buffer.data[(y/8)*84 + x] & (1 << y % 8)) ? true : false
        } else {
            return false
        }
    }

    // This function was grabbed from the Sparkfun ColorLCDShield library.
    /**
     * Draws a line from x0,y0 to x1,y1 with the set color.
     * @param bw true = black
     */
    //% blockId="display_g_set_line" block=" set line from x %x0|, y %y0| to x %x1|, y %y1| to black %bw"
    //% x0.min=0 x0.max=83
    //% y0.min=0 y0.min=47
    //% x1.min=0 x1.max=83
    //% y1.min=0 y1.min=47
    export function setLine(x0: number, y0: number, x1: number, y1: number, bw: boolean): void {
        let dy = y1 - y0
        let dx = x1 - x0
        let stepx: number, stepy: number

        if (dy < 0) {
            dy = -dy
            stepy = -1
        } else {
            stepy = 1
        }

        if (dx < 0) {
            dx = -dx
            stepx = -1
        } else {
            stepx = 1
        }

        dy <<= 1 // dy is now 2*dy
        dx <<= 1 // dx is now 2*dx

        if (dx > dy) {
            let fraction = dy - (dx >> 1)
            while (x0 != x1) {
                if (fraction >= 0) {
                    y0 += stepy
                    fraction -= dx
                }
                x0 += stepx
                fraction += dy
                setPixel(x0, y0, bw)
            }
        } else {
            let fraction = dx - (dy >> 1)
            while (y0 != y1) {
                if (fraction >= 0) {
                    x0 += stepx
                    fraction -= dy
                } 
                y0 += stepy
                fraction += dx
                setPixel(x0, y0, bw)
            }
        }
    }

    // This function was taken from the SparkFun ColorLCDShield library
    /**
     * Draws a rectangle from x0,y0 top-left corner to a x1,y1 bottom-right corner. Can be filled with the filled parameter, and colored bw.
     */
    //% blockId="display_g_set_rect" block="draw rectangle from x %x0|, y %y0| top left to x %x1|, y %y1|, filled %filled|, with black %bw"
    //% x0.min=0 x0.max=83
    //% y0.min=0 y0.min=47
    //% x1.min=0 x1.max=83
    //% y1.min=0 y1.min=47
    export function setRectangle(x0: number, y0: number, x1: number, y1: number, filled: boolean, bw: boolean): void {
        if (filled) {
            let xDiff: number
            if (x0 > x1) {
                xDiff = x0 - x1
            } else {
                xDiff = x1 - x0
            }
            
            while (xDiff > 0) {
                setLine(x0, y0, x0, y1, bw)

                if (x0 > x1) {
                    x0--
                } else {
                    x0++
                }

                xDiff--
            }
        } else {
            setLine(x0, y0, x1, y0, bw)
            setLine(x0, y1, x1, y1, bw)
            setLine(x0, y0, x0, y1, bw)
            setLine(x1, y0, x1, y1, bw)
        }
    }

    // This funktion was taken from the SparkFun ColorLCDShield library
    /**
     * Draws a circle centered around x0,y0 with a a defined radius.
     * The circle can be black or white. And have a line thickness ranging from 1 to
     * the radius of the circle.
     */
    //% blockId="display_g_set_circle" block="draw a circle with center x %x0|, y %y0|, radius %radius|, black %bw|, thickness %lineThickness"
    //% x0.min=0 x0.max=83
    //% y0.min=0 y0.min=47
    export function setCircle(x0: number, y0: number, radius: number, bw: boolean, lineThickness: number): void {
        for (let r = 0; r < lineThickness; r++) {
            let f = 1 - radius
            let ddF_x = 0
            let ddF_y = -2 * radius
            let x = 0
            let y = radius
            setPixel(x0, y0 + radius, bw)
            setPixel(x0, y0 - radius, bw)
            setPixel(x0 + radius, y0, bw)
            setPixel(x0 - radius, y0, bw)

            while (x < y) {
                if (f >= 0) {
                    y--
                    ddF_y += 2
                    f += ddF_y
                }
                x++
                ddF_x += 2
                f += ddF_x + 1

                setPixel(x0 + x, y0 + y, bw)
                setPixel(x0 - x, y0 + y, bw)
                setPixel(x0 + x, y0 - y, bw)
                setPixel(x0 - x, y0 - y, bw)
                setPixel(x0 + y, y0 + x, bw)
                setPixel(x0 - y, y0 + x, bw)
                setPixel(x0 + y, y0 - x, bw)
                setPixel(x0 - y, y0 - x, bw)
            }
            radius--
        }
    }

    /**
     * Inverts the display (makes black white, and vice versa)
     */
    //% blockId="display_g_invert" block="invert display" shim=display::invertDisplay
    export function invertDisplay() {
        for (let i = 0; i < 504; i++) {
            Buffer.data[i] = ~Buffer.data[i] & 0xff
        }
    }

    /**
     * Change what pins that is used for RST, CE, DC and LIGHT.
     */
    //% blockId="display_change_BUS_pins" block="set pins RST %RST| CE %CE| DC %DC| LIGHT %LIGHT"
    //% advanced=true 
    export function changePins(RST: DigitalPin, CE: DigitalPin, DC: DigitalPin, LIGHT: DigitalPin): void {
        changeBusPins(RST, CE, DC)
        changeLightPin(LIGHT)
        return
    }

    //% shim=display::changeBusPins
    function changeBusPins(RST: DigitalPin, CE: DigitalPin, DC: DigitalPin): void {
        return
    }

    //% shim=display::changeLightPin
    function changeLightPin(LIGHT: DigitalPin): void {
        return
    }
}