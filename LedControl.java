import jpigpio.Pigpio;

public class LedControl {
    private final int OP_DIGIT0      = 1;
    private final int OP_DIGIT1      = 2;
    private final int OP_DIGIT2      = 3;
    private final int OP_DIGIT3      = 4;
    private final int OP_DIGIT4      = 5;
    private final int OP_DIGIT5      = 6;
    private final int OP_DIGIT6      = 7;
    private final int OP_DIGIT7      = 8;
    private final int OP_DECODEMODE  = 9;
    private final int OP_INTENSITY   = 10;
    private final int OP_SCANLIMIT   = 11;
    private final int OP_SHUTDOWN    = 12;
    private final int OP_DISPLAYTEST = 15;
    private final int OP_NOOP        = 0;

    private int SPI_MOSI;
    private int SPI_CLK;
    private int SPI_CS;
    private int maxDevices;
    private int[] status = new int[128];



    public LedControl(int dataPin, int clkPin, int csPin, int numDevices) {
        SPI_MOSI=dataPin;
        SPI_CLK=clkPin;
        SPI_CS=csPin;
        if(numDevices<=0 || numDevices>8 )
            numDevices=8;
        maxDevices=numDevices;
        gpioSetMode(SPI_MOSI,PI_OUTPUT);
        gpioSetMode(SPI_CLK,OUTPUT);
        gpioSetMode(SPI_CS,OUTPUT);
        digitalWrite(SPI_CS,HIGH);
        SPI_MOSI=dataPin;
        for(int i=0;i<64;i++) 
            status[i]=0x00;
        for(int i=0;i<maxDevices;i++) {
            spiTransfer(i,OP_DISPLAYTEST,0);
            //scanlimit is set to max on startup
            setScanLimit(i,7);
            //decode is done in source
            spiTransfer(i,OP_DECODEMODE,0);
            clearDisplay(i);
            //we go into shutdown-mode on startup
            shutdown(i,true);
        }
    }

    public int getDeviceCount() {
        return maxDevices;
    }

    public void shutdown(int addr, bool b) {
        if(addr<0 || addr>=maxDevices)
            return;
        if(b)
            spiTransfer(addr, OP_SHUTDOWN,0);
        else
            spiTransfer(addr, OP_SHUTDOWN,1);
    }
    
    public void setScanLimit(int addr, int limit) {
        if(addr<0 || addr>=maxDevices)
            return;
        if(limit>=0 && limit<8)
            spiTransfer(addr, OP_SCANLIMIT,limit);
    }
    
    public void setIntensity(int addr, int intensity) {
        if(addr<0 || addr>=maxDevices)
            return;
        if(intensity>=0 && intensity<16)	
            spiTransfer(addr, OP_INTENSITY,intensity);
    }
    
    public void clearDisplay(int addr) {
        int offset;
    
        if(addr<0 || addr>=maxDevices)
            return;
        offset=addr*8;
        for(int i=0;i<8;i++) {
            status[offset+i]=0;
            spiTransfer(addr, i+1,status[offset+i]);
        }
    }
    
    public void setLed(int addr, int row, int column, boolean state) {
        int offset;
        byte val=0x00;
    
        if(addr<0 || addr>=maxDevices)
            return;
        if(row<0 || row>7 || column<0 || column>7)
            return;
        offset=addr*8;
        val=B10000000 >> column;
        if(state)
            status[offset+row]=status[offset+row]|val;
        else {
            val=~val;
            status[offset+row]=status[offset+row]&val;
        }
        spiTransfer(addr, row+1,status[offset+row]);
    }
    
    public void setRow(int addr, int row, byte value) {
        int offset;
        if(addr<0 || addr>=maxDevices)
            return;
        if(row<0 || row>7)
            return;
        offset=addr*8;
        status[offset+row]=value;
        spiTransfer(addr, row+1,status[offset+row]);
    }
    
    public void setColumn(int addr, int col, byte value) {
        byte val;
    
        if(addr<0 || addr>=maxDevices)
            return;
        if(col<0 || col>7) 
            return;
        for(int row=0;row<8;row++) {
            val=value >> (7-row);
            val=val & 0x01;
            setLed(addr,row,col,val);
        }
    }
    
    public void setDigit(int addr, int digit, byte value, boolean dp) {
        int offset;
        byte v;
    
        if(addr<0 || addr>=maxDevices)
            return;
        if(digit<0 || digit>7 || value>15)
            return;
        offset=addr*8;
        v=pgm_read_byte_near(charTable + value); 
        if(dp)
            v|=B10000000;
        status[offset+digit]=v;
        spiTransfer(addr, digit+1,v);
    }
    
    public void setChar(int addr, int digit, char value, boolean dp) {
        int offset;
        byte index,v;
    
        if(addr<0 || addr>=maxDevices)
            return;
        if(digit<0 || digit>7)
            return;
        offset=addr*8;
        index=(byte)value;
        if(index >127) {
            //no defined beyond index 127, so we use the space char
            index=32;
        }
        v=pgm_read_byte_near(charTable + index); 
        if(dp)
            v|=B10000000;
        status[offset+digit]=v;
        spiTransfer(addr, digit+1,v);
    }
    
    public void spiTransfer(int addr, volatile byte opcode, volatile byte data) {
        //Create an array with the data to shift out
        int offset=addr*2;
        int maxbytes=maxDevices*2;
    
        for(int i=0;i<maxbytes;i++)
            spidata[i]=(byte)0;
        //put our device data into the array
        spidata[offset+1]=opcode;
        spidata[offset]=data;
        //enable the line 
        digitalWrite(SPI_CS,LOW);
        //Now shift out the data 
        for(int i=maxbytes;i>0;i--)
            shiftOut(SPI_MOSI,SPI_CLK,MSBFIRST,spidata[i-1]);
        //latch the data onto the display
        digitalWrite(SPI_CS,HIGH);
    }    

}