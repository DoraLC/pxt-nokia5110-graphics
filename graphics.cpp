#include "pxt.h"
#include "MicroBit.h"
#include "mbed.h"

using namespace pxt;

enum class DigitalPin;

// function declarations used from pins-module in pxt
namespace pins {
    int spiWrite(int value);
    void spiFrequency(int frequency);
    void spiFormat(int bits, int mode);
    void spiPins(DigitalPin mosi, DigitalPin miso, DigitalPin sck);
}

MicroBitPin *getPin(int id);


enum MessageType {
    Data = 1,
    Command = 0
};

//% color=#fc4417 icon="\uf26c"
namespace display {

// Variables used to keep track of when to change line while printing.
uint8_t xPosition = 0;
uint8_t yPosition = 0;

uint8_t *buffer = (uint8_t *)malloc(504);
bool initialized = false;
bool spiPinsChanged = false;

MicroBitPin *Rst = getPin(MICROBIT_ID_IO_P10);
MicroBitPin *Ce = getPin(MICROBIT_ID_IO_P11);
MicroBitPin *Dc = getPin(MICROBIT_ID_IO_P12);
MicroBitPin *Light = getPin(MICROBIT_ID_IO_P16);

// Function declarations needed by initialize
void write(MessageType messageType, uint8_t message);
void clear();

void initialize()
{
    initialized = true;
    pins::spiFormat(8, 0);
    pins::spiFrequency(1000000);
    if (!spiPinsChanged)
    {
        pins::spiPins((DigitalPin)MICROBIT_ID_IO_P15, (DigitalPin)MICROBIT_ID_IO_P14, (DigitalPin)MICROBIT_ID_IO_P13);
        spiPinsChanged = false;
    }
    Ce->setDigitalValue(1);
    Rst->setDigitalValue(0);
    fiber_sleep(10);
    Rst->setDigitalValue(1);
    write(Command, 0x21);
    write(Command, 0xBF);
    write(Command, 0x04);
    write(Command, 0x14);
    write(Command, 0x0C);
    write(Command, 0x20);
    write(Command, 0x0C);

    clear();
    }

    void write(MessageType messageType, uint8_t message) {
        if (!initialized) {
            initialize();
        }
        Dc->setDigitalValue(messageType);
        Ce->setDigitalValue(0);
        pins::spiWrite(message);
        Ce->setDigitalValue(1);
    }

    //%
    void updateDisplay() {
        for (int i = 0; i < 504; i++) {
            write(Data, buffer[i]);
        }
    }

    //%
    void clear() {
        for (int i = 0; i < 504; i++) {
            buffer[i] = 0x00;
        }
    }

    //%
    void setBacklight(uint8_t value) {
        Light->setDigitalValue((value + 1) % 2); // The baclight is active low, so transform 1->0 and vice versa
    }

    //%
    void plotPixel(uint8_t x, uint8_t y) {
        // Checking bounds
        if ( x < 84 && y < 48) {
            buffer[(y/8)*84 + x] |= (1 << y % 8);
        }
    }

    //%
    void unplotPixel(uint8_t x, uint8_t y) {
        if (x < 84 && y < 48) {
            buffer[(y/8)*84 + x] &= ~(1 << y % 8);
        }
    }

    //%
    bool getPixel(uint8_t x, uint8_t y) {
        if (x < 8 && y < 48) {
            return buffer[(y/8)*84 + x] & (1 << y % 8);
        } else {
            return false;
        }
    }

    #if 0 // Does not work
    ///**
    //* Change the connected pins from the default values.
    //*/
    ////% blockId="display_change_SPI_pins" block="set pins DIN %DIN| CLK %CLK| LIGHT %LIGHT| Unused pin for MISO %MISO"
    ////% advanced=true
    void changeSPIPins(DigitalPin DIN, DigitalPin CLK, DigitalPin MISO) {
        initialized = false;
        spiPinsChanged = true;
        //serial.send("SPI changing\n");
        //Clk = getPin((int)CLK);
        //Din = getPin((int)DIN);
        //Miso = getPin((int)MISO);
        //serial.send("SPI pins changed\n");
        pins::spiPins(DIN, CLK, MISO);
        //serial.send("SPI changed\n");
    }
    #endif

    /**
    *
    */
    //% weight=0 advanced=true
    void changeBusPins(DigitalPin RST, DigitalPin CE, DigitalPin DC) {
        initialized = false;
        Rst = getPin((int)RST);
        Ce = getPin((int)CE);
        Dc = getPin((int)DC);

    }

    /**
    *
    */
    //% weight=0 advanced=true
    void changeLightPin(DigitalPin LIGHT) {
        Light = getPin((int)LIGHT);
    }
}