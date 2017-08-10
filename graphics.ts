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
     * Turns on the specified pixel, using x,y coordinates.
     * @param x Horizontal position, between 0 and 83.
     * @param y Vertical position, between 0 and 47.
     */
    //% blockId="display_g_plot" block="plot pixel x %x|, y %y" shim=display::plotPixel
    //% x.min=0 x.max=83
    //% y.min=0 y.min=47
    export function plotPixel(x: uint8, y: uint8): void {
        if (x >= 0 && x < 84 && y >= 0 && y < 48) {
            Buffer.data[y / 8 + x] |= (1 << y % 8);
        }
    }

    /**
     * Turns off the specified pixel, using x,y coordinates
     * @param x Horizontal position, between 0 and 83.
     * @param y Vertical position, between 0 and 47.
     */
    //% blockId="display_g_unplot" block="unplot pixel x %x| y %y" shim=display::unplotPixel
    //% x.min=0 x.max=83
    //% y.min=0 y.min=47
    export function unplotPixel(x: uint8, y: uint8): void {
        if (x >= 0 && x < 84 && y >= 0 && y < 48) {
            Buffer.data[y / 8 + x] &= ~(1 << y % 8);
        }
    }

    /**
     * Check if the specified pixel is on or off
     * @param x Horizontal position, between 0 and 83.
     * @param y Vertical position, between 0 and 47.
     * @returns Returns true if the pixel is on (plotted)
     */
    //% blockId="display_g_getPixel" block="get value of pixel x %x| y %y" shim=display::getPixel
    //% x.min=0 x.max=83
    //% y.min=0 y.min=47
    export function getPixel(x: uint8, y: uint8): boolean {
        if (x >= 0 && x < 84 && y >= 0 && y < 48) {
            return (Buffer.data[y / 8 + x] & (1 << y % 8)) ? true : false
        } else {
            return false
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