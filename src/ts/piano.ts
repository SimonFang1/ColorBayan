import { Sound } from "./sound";
import { ColorMap } from "./colormap";
import { BayanKey } from "./bayan";
import { utility } from "./utility";

class PianoKey {
    private pitch_;
    private keydiv: any;
    private isblack_;

    public constructor(keydiv: any, pitch: number) {
        this.keydiv = keydiv;
        this.pitch_ = pitch;
        this.isblack_ = utility.isBlackKey(pitch);
    }
    public getPitch() {
        return this.pitch_;
    }
    public press() {
        Sound.getInstance().playSound(this.pitch_);
        PianoRoll.getInstance().setHold(this.pitch_, true);
        this.keydiv.style.backgroundColor = ColorMap.getInstance().getColor(this.pitch_);
    }
    public release() {
        Sound.getInstance().stopSound(this.pitch_);
        PianoRoll.getInstance().setHold(this.pitch_, false);
        this.keydiv.style.cssText = "";
    }
}

class Piano {
    // private pitch2htmlid: any = {
    //     0: { white: true, id: 0 },
    //     1: { white: false, id: 0 },
    //     2: { white: true, id: 1 },
    //     3: { white: true, id: 2 },
    //     4: { white: false, id: 2 },
    //     5: { white: true, id: 3 },
    //     6: { white: false,  id: 3},
    //     7: { white: true, id: 4 },
    //     8: { white: true, id: 5 },
    //     9: { white: false, id: 5 },
    //     10: { white: true, id: 6 },
    //     11: { white: false,  id: 6}
    // }
    private white2pitch = [0, 2, 3, 5, 7, 8, 10];
    private black2pitch = [1, -1, 4, 6, -1, 9, 11];
    private pianokeys = Array<PianoKey>();
    
    public static instance_: Piano = null;

    public init() {
        let piano: any = document.getElementById("Piano");
        let box: any = document.createElement("div");
        box.setAttribute("id", "piano-box");
    
        let white_box: any = document.createElement("div");
        white_box.setAttribute("id", "white-box");
        for (let j: number = 0; j < 52; j++) {
            let temp: any = document.createElement("div");
            temp.setAttribute("class", "white-key");
            white_box.appendChild(temp);
            let pitch = this.getPitchById(j, true);
            let pkey = new PianoKey(temp, pitch);
            this.pianokeys[pitch] = pkey;
            temp.onmousedown = () => {
                pkey.press();
            }
            temp.onmouseup = () => {
                pkey.release();
            }
            temp.onmouseout = temp.onmouseup;
        }
        let black_box: any = document.createElement("div");
        black_box.setAttribute("id", "black-box");
        let hidden = [false, false, true, false, false, false, true];
        for (let j: number = 0; j < 51; j++) {
            let temp: any = document.createElement("div");
            temp.setAttribute("class", "black-key");
            if (hidden[(j + 5) % 7]) {
                temp.style.visibility = "hidden";
            } else {
                let pitch = this.getPitchById(j, false);
                let pkey = new PianoKey(temp, pitch);
                this.pianokeys[pitch] = pkey;
                temp.onmousedown = () => {
                    pkey.press();
                }
                temp.onmouseup = () => {
                    pkey.release();
                }
                temp.onmouseout = temp.onmouseup;
                }
                black_box.appendChild(temp);
        }
        
        box.appendChild(black_box);
        box.appendChild(white_box);
        piano.appendChild(box);
    }

    private constructor() {};
    public static getInstance(): Piano {
        if (Piano.instance_ === null)
            Piano.instance_ = new Piano();
        return Piano.instance_;
    }
    // public getHTMLidByKey(key: number): any {
    //     let group = Math.floor(key / 12);
    //     let maptab = this.pitch2htmlid[key % 12];
    //     let newMaptab: any = {};
    //     newMaptab.white = maptab.white;
    //     newMaptab.id = maptab.id + group * 7;
    //     return newMaptab;
    // }

    private getPitchById(id: number, whiteKey: boolean) {
        if (whiteKey) {
            return this.white2pitch[id % 7] + Math.floor(id / 7) * 12;
        } else {
            return this.black2pitch[id % 7] + Math.floor(id / 7) * 12;
        }
    }
    public releaseAllKey(): void {
        // Sound.getInstance().stopAll();
        let whiteKeys:any = document.getElementsByClassName("white-key");
        for (let i = 0; i < whiteKeys.length; i++) {
            whiteKeys[i].style.cssText = "";
        }
        let blackKeys:any = document.getElementsByClassName("black-key");
        for (let i = 0; i < blackKeys.length; i++) {
            if (blackKeys[i].style.cssText !== "visibility: hidden;") {
                blackKeys[i].style.cssText = "";
            }
        }
        for (let i = 0; i < 88; i++) {
            PianoRoll.getInstance().setHold(i, false);
        }
    }
    public press(pitch: number) {
        this.pianokeys[pitch].press();
    }
    public release(pitch: number) {
        this.pianokeys[pitch].release();
    }
};

class PianoRoll {
    public static instance_: PianoRoll = null;
    private rollBar: any;
    private speed: number;
    private timer: any;
    private enable: boolean;
    private canvas_;

    public init() {
        let piano: any = document.getElementById("Piano");
        let canvas: any = document.createElement("canvas");
        piano.style.display = "flex";
        let mainbox = document.getElementById("main");
        let pbox = document.getElementById("piano-box");
    
        let width = pbox.offsetWidth;
        let height = mainbox.offsetHeight - pbox.offsetHeight-15;
        
        canvas.setAttribute("id", "piano-roll");
        canvas.setAttribute("width", width.toString());
        canvas.setAttribute("height", height.toString());
        piano.appendChild(canvas);
        piano.style.display = "none";
        this.canvas_ = canvas;
        this.play();
    }

    public play() {
        this.enable = true;
        this.timer = setInterval(function(){
            PianoRoll.getInstance().run();
        }, 30);
    }

    public stop() {
        this.enable = false;
        clearInterval(this.timer);
    }
    
    public static getInstance(): PianoRoll {
        if (PianoRoll.instance_ === null)
            PianoRoll.instance_ = new PianoRoll();
        return PianoRoll.instance_;
    }
    private constructor() {
        this.speed = 3;
        this.rollBar = new Array();
        this.enable = false;
        for (let i = 0; i < 88; i++) {
            this.rollBar[i] = {};
            this.rollBar[i].isWhite = utility.isWhiteKey(i);
            this.rollBar[i].pitch = i;
            this.rollBar[i].box = new Array<any>();
            this.rollBar[i].hold = false;
        }
        this.resize();
    };

    public resize(): void {
        // if reize the browser window, call this function
        let wk = document.getElementsByClassName("white-key");
        let wsty = window.getComputedStyle(wk[0], null);
        let bk = document.getElementsByClassName("black-key");
        let bsty = window.getComputedStyle(bk[0], null);
        let bbsty = window.getComputedStyle(document.getElementById("black-box"), null);
        let wWidth = parseFloat(wsty.width);
        let bMinWidth = parseFloat(bsty.width); // parseFloat(bsty.minWidth);
        let bShift = parseFloat(bbsty.marginLeft);
        let bMaxWidth = bMinWidth + bShift;

        let wCount = 0;
        let bCount = 0;
        for (let i = 0; i < 88; i++) {
            if (this.rollBar[i].isWhite) {
                this.rollBar[i].width = wWidth;
                this.rollBar[i].x_axis = wWidth * wCount;
                wCount++;
            } else {
                this.rollBar[i].width = bMinWidth;
                this.rollBar[i].x_axis = bShift + wWidth * bCount;
                bCount++;
                if (bCount % 7 == 1 || bCount % 7 == 4) {
                    bCount++;
                }
            }
        }
    }

    public setHold(pitch: number, hold: boolean):void {
        if (this.rollBar[pitch].hold === hold)
            return;
        this.rollBar[pitch].hold = hold;
        if (hold) {
            let pair = { begin: 0, end: -1 };
            this.rollBar[pitch].box.push(pair);
        } else {
            let arr = this.rollBar[pitch].box;
            arr[arr.length - 1].end = 0;
        }
    }
    public run(): void {
        let canvas = this.canvas_;
        let cxt = canvas.getContext('2d');
        cxt.clearRect(0, 0, canvas.width, canvas.height);
        // first clear boxes that are outside
        // draw white keys first, then cover black keys
        this.rollBar.forEach(element => {
            while (element.box.length > 0 && element.box[0].end > canvas.height)
                element.box.splice(0, 1);
            if (element.isWhite) {
                element.box.forEach(e => {
                    e.begin += this.speed;
                    cxt.fillStyle = ColorMap.getInstance().getColor(element.pitch);
                    if (e.end === -1) {
                        cxt.fillRect(element.x_axis, e.end, element.width, e.begin); 
                    } else {
                        e.end += this.speed;
                        cxt.fillRect(element.x_axis, e.end, element.width, e.begin - e.end); 
                    }
                });
            }
        });
        this.rollBar.forEach(element => {
            if (!element.isWhite) {
                element.box.forEach(e => {
                    e.begin += this.speed;
                    cxt.fillStyle = ColorMap.getInstance().getColor(element.pitch);
                    if (e.end === -1) {
                        cxt.fillRect(element.x_axis, e.end, element.width, e.begin); 
                    } else {
                        e.end += this.speed;
                        cxt.fillRect(element.x_axis, e.end, element.width, e.begin - e.end); 
                    }
                });
            }
        });
    };
}

export { Piano, PianoRoll };
