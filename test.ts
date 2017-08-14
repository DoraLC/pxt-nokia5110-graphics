// tests go here; this will not be compiled when this package is used as a library

//display.changePins(DigitalPin.P3, DigitalPin.P4, DigitalPin.P5, DigitalPin.P8)
display.setBacklight(1)

display.updateDisplay()

display.setCircle(84 / 2, 48 / 2, 10, true, 3)
display.setRectangle(2, 2, 84-2, 48-2, false, true)

display.updateDisplay()

basic.pause(2000)

display.invertDisplay()

display.updateDisplay()