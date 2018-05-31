import { utility } from "./utility";

class NoteAction {
    public notes: number[];
    public ons: boolean[];
    constructor() {
        this.notes = new Array();
        this.ons = new Array();
    }
    public push(pitch:number, on:boolean): void {
        this.notes.push(pitch);
        this.ons.push(on);
    }
}

class HexTextFileReader {
    private data: string;
    public fp: number;

    public constructor(data: string) {
        this.data = data;
        this.fp = 0;
    }
    
    public readByte(n: number): string {
        let rval = this.data.substr(this.fp, n * 2);
        this.fp += n * 2;
        return rval;
    }

    public readInterval(): number {
        let interval = 0;
        let byte: number;
        while ((byte = parseInt(this.readByte(1), 16)) & 0x80) {
            interval = (interval << 7) + (byte & 0x7f);
        }
        interval = (interval << 7) + byte;
        return interval;
    }
}

class MIDIParser {
    public static test(): Array<NoteAction> {
        let seq: Array<NoteAction> = new Array<NoteAction>();
        seq[10] = new NoteAction();
        seq[10].push(53, true); // D5
        seq[20] = new NoteAction();
        seq[20].push(53, false);
        seq[20].push(50, true); // B4
        seq[30] = new NoteAction();
        seq[30].push(50, false);
        seq[30].push(48, true); // A4
        seq[40] = new NoteAction();
        seq[40].push(48, false);
        seq[40].push(46, true); // G4
        seq[50] = new NoteAction();
        seq[50].push(46, false);
        return seq;
    }

    private lastEvent: string;
    private seq: Array<NoteAction>;
    private t_scale: number; // time ticks scaling

    public createKeyEvents(data: string): Array<NoteAction> {
        this.seq = new Array();
        let read: string;
        let n_byte: number;

        let fileReader = new HexTextFileReader(data);
        
        // 4 bytes, check ASCII text "MThd"
        read = fileReader.readByte(4);
        if (read.substr(0, 8) !== "4d546864") {
            console.log("not a MIDI file");
            return null;
        }

        // 4 bytes, determine to length of the rest header
        // It should be "00 00 00 06"
        read = fileReader.readByte(4);
        n_byte = parseInt(read, 16);

        read = fileReader.readByte(n_byte);
        // 6 bytes, "ff ff nn nn dd dd"
        // "ff ff": midi format
        //      "00 00": single track
        //      "00 01": multiple track, sync
        //      "00 02": multiple track, async
        if (read.substr(0, 4) === "0002") {
            console.log("emcouter async multiple track, unsupported yet.");
        }
        // "nn nn": the number of tracks
        //      n + 1, total tracks (n) plus a global track
        let n_track = parseInt(read.substr(4, 4), 16);
        // "dd dd": the ticks of a quarter note
        let n_quarter_ticks = parseInt(read.substr(8, 4), 16);
        this.t_scale = n_quarter_ticks / 13;

        // deal with tracks
        for (let i = 0; i < n_track; i++) {
            // 4 bytes, check ASCII text "MTrk"
            read = fileReader.readByte(4);
            if (read.substr(0, 8) !== "4d54726b") {
                throw "sync error";
            }
            // 4 bytes, indicating the total bytes of the track
            read = fileReader.readByte(4);
            n_byte = parseInt(read, 16);
            read = fileReader.readByte(n_byte);
            this.addTrack(read);
        }
        return this.seq;
    }

    private noteAction(time: number, note: number, on: boolean) {
        if (this.seq[time] == null) {
            this.seq[time] = new NoteAction();
        }
        this.seq[time].push(note, on);
    }

    private addTrack(trInfo: string):void {
        let fileReader = new HexTextFileReader(trInfo);
        // format:
        //  basic events format: 8b'1xxx_xxxx
        //  note 0x00-0x7F, using previous activating basic format
        let timeLine = 10;
        let n_byte: number;
        while (true) {
            let interval = fileReader.readInterval();
            timeLine += interval;
            let events = fileReader.readByte(1);
            let note: number; // 音符
            let velocity: number // 力度，useless
            let info: string;
            if (parseInt(events[0], 16) & 0x8) { // basic events
                this.lastEvent = events;
            } else {
                // set fp back
                fileReader.fp -= 2;
            }
            switch(this.lastEvent[0]) { // events[1] is channel, we ignored
                case "8": // 松开音符
                case "9": // 按下音符
                case "a": // 触后音符
                    note = parseInt(fileReader.readByte(1), 16);
                    velocity = parseInt(fileReader.readByte(1), 16);
                    let ticks = Math.floor(timeLine / this.t_scale);
                    if (this.lastEvent[1] === '9')
                        break;
                    if (this.lastEvent[0] === "8" ||
                    this.lastEvent[0] === "9" && velocity === 0 ) {
                        this.noteAction(ticks, note - 21, false);
                    } else if (this.lastEvent[0] === "9" && velocity !== 0) {
                        this.noteAction(ticks, note - 21, true);
                    }
                    break;
                case "b": // 控制器
                    // 控制器号码:0x00-0x7F
                    // 控制器参数:0x00-0x7F
                    this.lastEvent = events;
                    fileReader.readByte(2);
                    break;
                case "c": // 改变乐器
                    // 乐器号码：0x00-0x7F
                    fileReader.readByte(1);
                    break;
                case "d": // 触后通道
                    // 值:0x00-0x7F
                    fileReader.readByte(1);
                    break;
                case "e": // 滑音
                    // 音高(Pitch)低位:Pitch mod 128
                    // 音高高位:Pitch div 128
                    fileReader.readByte(2);
                    break;
                case "f": 
                    if (events[1] == "0") { // 系统码
                        n_byte = parseInt(fileReader.readByte(1), 16);
                        fileReader.readByte(n_byte);
                    } else if (events[1] == "f") { // 其他格式
                        info = fileReader.readByte(1);
                        n_byte = parseInt(fileReader.readByte(1), 16);
                        if (info == "2f") {
                            return;
                        } else {
                            fileReader.readByte(n_byte);
                        }
                    } else {
                        throw "invalid event format: " + events;
                    }
            }
        }
    }
};

export { NoteAction, MIDIParser };
