/**
* DFR1173 Voice Prompter
* Refer to https://github.com/DFRobotdl/DFROBOTDL/tree/main/DFR1173
*/

//% weight=9 color=#018391 icon="\uf001" block="DFR1173"
namespace dfr1173 {
    /* [$S,CMD,LenHi,LenLo,para1,para2,$0] */
    let dataArr: number[] = [0x7E, 0x00, 0x00, 0x02, 0x00, 0x00, 0xEF]
    let isConnected: boolean = false;

    export enum playType {
        //% block="Play"
        Play = 0x0D,
        //% block="Stop"
        Stop = 0x16,
        //% block="Play Next"
        PlayNext = 0x01,
        //% block="Play Previous"
        PlayPrevious = 0x02,
        //% block="Pause"
        Pause = 0x0E
    }

    export enum isRepeat {
        //% block="No"
        No = 0,
        //% block="Yes"
        Yes = 1
    }

    function sendData(): void {
        let myBuf = pins.createBuffer(7);
        for (let i = 0; i < 7; i++) {
            myBuf.setNumber(NumberFormat.UInt8BE, i, dataArr[i])
        }
        serial.writeBuffer(myBuf)
        basic.pause(100)
    }

    function innerCall(CMD: number, para1: number, para2: number): void {
        if (!isConnected) {
            connect(SerialPin.P0, SerialPin.P1)
        }
        dataArr[1] = CMD
        dataArr[4] = para1
        dataArr[5] = para2
        sendData()
    }

    /**
     * Connect DFR1173 to Serial
     * @param pinRX RX Pin, eg: SerialPin.P0
     * @param pinTX TX Pin, eg: SerialPin.P1
     */
    //% blockId="dfr_connect" block="connect to DFR1173, RX:%pinRX|TX:%pinTX"
    //% weight=100 blockGap=20
    export function connect(pinRX: SerialPin = SerialPin.P0, pinTX: SerialPin = SerialPin.P1): void {
        serial.redirect(pinRX, pinTX, BaudRate.BaudRate9600)
        isConnected = true
        basic.pause(100)
    }

    //% blockId="dfr_action" block="Action:%myPlayType"
    //% weight=99 blockGap=20
    export function press(myPlayType: playType): void {
        innerCall(myPlayType, 0x00, 0x00)
    }

    //% blockId="dfr_playFile" block="play DFR file:%fileNumber|repeat:%setRepeat"
    //% weight=98 blockGap=20 fileNumber.min=1 fileNumber.max=255
    export function playFile(fileNumber: number, setRepeat: isRepeat): void {
        innerCall(0x03, 0x00, fileNumber)
        press(0x0D)
        if (setRepeat == 1) press(0x19)
    }

    //% blockId="dfr_playFileInFolder" block="play DFR folder:%folderNumber|file:%fileNumber|repeat:%setRepeat"
    //% weight=97 blockGap=20 folderNumber.min=1 folderNumber.max=99 fileNumber.min=1 fileNumber.max=255
    export function playFileInFolder(folderNumber: number, fileNumber: number, setRepeat: isRepeat): void {
        innerCall(0x0F, folderNumber, fileNumber)
        if (setRepeat == 1) press(0x19)
    }

    //% blockId="dfr_playLoopAllFiles" block="loop play all files"
    //% weight=96 blockGap=20 
    export function playLoopAllFiles(): void {
        innerCall(0x11, 0x00, 0x01)
    }

    //% blockId="dfr_playRandom" block="random play all files"
    //% weight=95 blockGap=20
    export function playRandomAllFiles(): void {
        innerCall(0x18, 0x00, 0x01)
    }

    //% blockId="dfr_setVolume" block="set volume(0~30):%volume"
    //% weight=94 blockGap=20 volume.min=0 volume.max=30
    export function setVolume(volume: number): void {
        innerCall(0x06, 0x00, volume | 0)
    }

}