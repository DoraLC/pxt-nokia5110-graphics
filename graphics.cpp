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
bool bufferInitialized = false;
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
    if (!bufferInitialized) {
        clear();
        bufferInitialized = true;
    }
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
        if (!bufferInitialized) {
            clear();
            bufferInitialized = true;
        }
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
    void setPixel(uint8_t x, uint8_t y, bool color = true) {
        if (!bufferInitialized) {
            clear();
            bufferInitialized = true;
        }
        // Checking bounds
        if ( x < 84 && y < 48) {
            if (color) {
                buffer[(y/8)*84 + x] |= (1 << y % 8);
            } else {
                buffer[(y/8)*84 + x] &= ~(1 << y % 8);
            }
        }
    }

    //%
    bool getPixel(uint8_t x, uint8_t y) {
        if (!bufferInitialized) {
            clear();
            bufferInitialized = true;
        }
        if (x < 8 && y < 48) {
            return buffer[(y/8)*84 + x] & (1 << y % 8);
        } else {
            return false;
        }
    }

    // setLine draws a line from x0,y0 to x1,y1 with the set color.
    // This function was grabbed from the SparkFun ColorLCDShield
    // library.
    //%
    void setLine(int x0, int y0, int x1, int y1, bool bw)
    {
      int dy = y1 - y0; // Difference between y0 and y1
      int dx = x1 - x0; // Difference between x0 and x1
      int stepx, stepy;
    
      if (dy < 0)
      {
        dy = -dy;
        stepy = -1;
      }
      else
        stepy = 1;
  
      if (dx < 0)
      {
        dx = -dx;
        stepx = -1;
      }
      else
        stepx = 1;
  
      dy <<= 1; // dy is now 2*dy
      dx <<= 1; // dx is now 2*dx
      setPixel(x0, y0, bw); // Draw the first pixel.
  
      if (dx > dy)
      {
        int fraction = dy - (dx >> 1);
        while (x0 != x1)
        {
          if (fraction >= 0)
          {
            y0 += stepy;
            fraction -= dx;
          }
          x0 += stepx;
          fraction += dy;
          setPixel(x0, y0, bw);
        }
      }
      else
      {
        int fraction = dx - (dy >> 1);
        while (y0 != y1)
        {
          if (fraction >= 0)
          {
            x0 += stepx;
            fraction -= dy;
          }
          y0 += stepy;
          fraction += dx;
          setPixel(x0, y0, bw);
        }
      }
    }

// setRect will draw a rectangle from x0,y0 top-left corner to
// a x1,y1 bottom-right corner. Can be filled with the fill
// parameter, and colored with bw.
// This function was grabbed from the SparkFun ColorLCDShield
// library.
//%
void setRect(int x0, int y0, int x1, int y1, bool fill, bool bw)
{
  // check if the rectangle is to be filled
  if (fill == 1)
  {
    int xDiff;

    if(x0 > x1)
      xDiff = x0 - x1; //Find the difference between the x vars
    else
      xDiff = x1 - x0;

    while(xDiff > 0)
    {
      setLine(x0, y0, x0, y1, bw);

      if(x0 > x1)
        x0--;
      else
        x0++;

      xDiff--;
    }
  }
  else
  {
    // best way to draw an unfilled rectangle is to draw four lines
    setLine(x0, y0, x1, y0, bw);
    setLine(x0, y1, x1, y1, bw);
    setLine(x0, y0, x0, y1, bw);
    setLine(x1, y0, x1, y1, bw);
  }
}

// setCircle draws a circle centered around x0,y0 with a defined
// radius. The circle can be black or white. And have a line
// thickness ranging from 1 to the radius of the circle.
// This function was grabbed from the SparkFun ColorLCDShield
// library.
//%
void setCircle (int x0, int y0, int radius, bool bw, int lineThickness)
{
  for(int r = 0; r < lineThickness; r++)
  {
    int f = 1 - radius;
    int ddF_x = 0;
    int ddF_y = -2 * radius;
    int x = 0;
    int y = radius;

    setPixel(x0, y0 + radius, bw);
    setPixel(x0, y0 - radius, bw);
    setPixel(x0 + radius, y0, bw);
    setPixel(x0 - radius, y0, bw);

    while(x < y)
    {
      if(f >= 0)
      {
        y--;
        ddF_y += 2;
        f += ddF_y;
      }
      x++;
      ddF_x += 2;
      f += ddF_x + 1;

      setPixel(x0 + x, y0 + y, bw);
      setPixel(x0 - x, y0 + y, bw);
      setPixel(x0 + x, y0 - y, bw);
      setPixel(x0 - x, y0 - y, bw);
      setPixel(x0 + y, y0 + x, bw);
      setPixel(x0 - y, y0 + x, bw);
      setPixel(x0 + y, y0 - x, bw);
      setPixel(x0 - y, y0 - x, bw);
    }
    radius--;
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