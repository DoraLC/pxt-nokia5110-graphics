// tests go here; this will not be compiled when this package is used as a library

//display.changePins(DigitalPin.P3, DigitalPin.P4, DigitalPin.P5, DigitalPin.P8)
display.setBacklight(1)

let x = 0
for (let x = 0; x < 84; x++) {
    for (let y = 0; y < 48; y++) {
        display.setPixel(x, y, true)
    }
    
}


display.updateDisplay()