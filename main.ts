/*
 lobotsr package
*/
//% weight=10 icon="\uf013" color=#2896ff
namespace lobotsr {
	
    const ASR_I2C_ADDR = 0x79;

    const ASR_RESULT_ADDR = 100;
    const ASR_WORDS_ERASE_ADDR = 101;
    const ASR_MODE_ADDR = 102;
    const ASR_ADD_WORDS_ADDR = 160;

    export enum ASRMode {
        //% block="1"
        mode1 = 0x01,
        //% block="2"
        mode2 = 0x02,
        //% block="3"
        mode3 = 0x03
    }
	
    function II2Cread(reg: number): Buffer {
        let val = pins.i2cReadBuffer(reg, 1);
        return val;
    }

    function WireWriteByte(addr: number, val: number): boolean {
        let buf = pins.createBuffer(1);
        buf[0] = val;
        let rvalue = pins.i2cWriteBuffer(addr, buf);
        if (rvalue != 0) {
            return false;
        }
        return true;
    }	

    function WireWriteDataArray(addr: number, reg: number, val: number): boolean {
        let buf = pins.createBuffer(3);
        buf[0] = reg;
        buf[1] = val & 0xff;
        buf[2] = (val >> 8) & 0xff;
        let rvalue = pins.i2cWriteBuffer(addr, buf);
        if (rvalue != 0) {
            return false;
        }
        return true;
    }
	
    function WireReadDataArray(addr: number, reg: number, len: number): number {
        if (!WireWriteByte(addr, reg)) {
            return -1;
        }

        let buf = II2Cread(addr);
        if (buf.length != 1) {
            return 0;
        }
        return buf[0];
    }

    //% weight=96 blockId=startbit_ASRSETMODE block="Set to |%mode mode"
    export function startbit_ASRSETMODE(mode: ASRMode) {
        WireWriteDataArray(ASR_I2C_ADDR, ASR_MODE_ADDR, mode);
    }

    //% weight=84 blockId=startbit_ASRREAD block="Read Data"
    export function startbit_ASRREAD(): number {
        let val = WireReadDataArray(ASR_I2C_ADDR, ASR_RESULT_ADDR, 1);
        return val;
    }

    /**
     * @param idNum is a number, eg: 1
     * @param words is text, eg: "ni hao"
     */
    //% weight=83 blockId=startbit_ASRAddWords block="Add idNum|%idNum words|%words"
    export function startbit_ASRAddWords(idNum: number, words: string) {
        let buf = pins.createBuffer(words.length + 2);
        buf[0] = ASR_ADD_WORDS_ADDR;
        buf[1] = idNum;
        for (let i = 0; i < words.length; i++) {
            buf[2 + i] = words.charCodeAt(i);
        }
        pins.i2cWriteBuffer(ASR_I2C_ADDR, buf);
        basic.pause(50);
    }

    //% weight=82 blockId=startbit_ASRWORDSERASE block="Erase Data"
    export function startbit_ASRWORDSERASE() {
        WireWriteDataArray(ASR_I2C_ADDR, ASR_WORDS_ERASE_ADDR, null);
	basic.pause(60);
    }
	
    const MP3_I2C_ADDR = 0x7B;
    const MP3_PLAY_NUM_ADDR = 1;
    const MP3_PLAY_ADDR = 5;
    const MP3_PAUSE_ADDR = 6;
    const MP3_PREV_ADDR = 8;
    const MP3_NEXT_ADDR = 9;
    const MP3_VOL_VALUE_ADDR = 12;
    const MP3_SINGLE_LOOP_ON_ADDR = 13;
    const MP3_SINGLE_LOOP_OFF_ADDR = 14;

    export enum startbit_mp3button {
        //% block="PLAY"
        PLAY = MP3_PLAY_ADDR,
        //% block="PAUSE"
        PAUSE = MP3_PAUSE_ADDR,
        //% block="PREV"
        PREV = MP3_PREV_ADDR,
        //% block="NEXT"
        NEXT = MP3_NEXT_ADDR
    }

    export enum startbit_mp3Loop {
        //% block="ON"
        ON = MP3_SINGLE_LOOP_ON_ADDR,
        //% block="OFF"
        OFF = MP3_SINGLE_LOOP_OFF_ADDR
    }

    //% weight=87 blockId=startbit_MP3_BUTTON block="MP3 |%button music"
    export function startbit_MP3_BUTTON(button: startbit_mp3button) {
        WireWriteDataArray(MP3_I2C_ADDR, button, null);
        basic.pause(20);
    }

    /**
     * @param value is a number, eg: 20
     */
    //% weight=88 blockId=startbit_MP3_VOL block="MP3 VOL |%value"
    export function startbit_MP3_VOL(value: number) {
        WireWriteDataArray(MP3_I2C_ADDR, MP3_VOL_VALUE_ADDR, value);
        basic.pause(20);
    }


    //% weight=85 blockId=startbit_MP3_SINGLE_LOOP blockGap=50 block="MP3 SINGLE LOOP |%state"
    export function startbit_MP3_SINGLE_LOOP(state: startbit_mp3Loop) {
        WireWriteDataArray(MP3_I2C_ADDR, state, null);
        basic.pause(20);
    }

    /**
     * @param num is a number, eg: 1
     */
    //% weight=86 blockId=startbit_MP3_PLAY_NUM block="MP3 PLAY NUM|%num"
    export function startbit_MP3_PLAY_NUM(num: number) {
        WireWriteDataArray(MP3_I2C_ADDR, MP3_PLAY_NUM_ADDR, num);
        basic.pause(20);
    }
}
