// tests go here; this will not be compiled when this package is used as a library

//display.changePins(DigitalPin.P3, DigitalPin.P4, DigitalPin.P5, DigitalPin.P8)
display.setBacklight(1)
display.printBufferPointer()
display.updateDisplay()
display.printBufferPointer()
let x = 0
for (let x = 0; x < 84; x++) {
    for (let y = 0; y < 48; y++) {
        display.plotPixel(x, y)
        
        //basic.pause(10)
    }
    
}
display.printBufferPointer()
display.unplotPixel(0, 0)
display.unplotPixel(1, 1)
display.plotPixel(2, 2)
display.plotPixel(3, 3)
display.printBufferPointer()
display.updateDisplay()
display.printBufferPointer()
/*
for (let x = 0; x < 83; x++) {
    for (let y = 0; y < 47; y++) {
        serial.writeLine(display.getPixel(x, y).toString())
        
        //serial.writeString("ploted\n")
        //basic.pause(10)
    }
}
*/



serial.writeLine("Finito!!!")
