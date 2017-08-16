# nokia5110-graphics

A driver for showing graphics on the nokia5110 LCD display.

# Hardware
A nokia 5110 display (<https://www.sparkfun.com/products/10168>). Connect the pins in the following way:
- RST -> P10
- CE -> P11
- DC -> P12
- DIN -> P15
- CLK -> P13
- LIGHT -> P16

The SPI module also needs a pin for the MISO line (DIN is MOSI), for this use the default pin P14.

RST, CE, DC can be changed using `display.changeBusPins(DigitalPin RST, DigitalPin CE, DigitalPin DC)`. LIGHT can be changed using `display.changeLightPin(DigitalPin LIGHT)`. DIN and CLK (and MISO) cannot be changed. 

## License

MIT

## Supported targets

* for PXT/microbit
(The metadata above is needed for package search.)

