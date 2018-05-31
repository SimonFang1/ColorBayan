import { utility } from "./utility"
import { ColorMap } from "./colormap";
import { Piano } from "./piano";
// import { Sound } from "./sound"

class BayanKey {
    private keydiv: any;
    private name: string;
    private pitch_: number;
    private bpressed: boolean;

    constructor(keydiv: any, name: string) {
        this.keydiv = keydiv;
        this.name = name;
    }

    public initColor(): void {
        if (this.keydiv !== undefined) {
            this.keydiv.style.cssText = "";
            if (this.isBlackKey())
                this.keydiv.setAttribute("class", "key deep-gray");
            else
                this.keydiv.setAttribute("class", "key gray");
            if (this.keydiv.getElementsByClassName("pitch")[0] !== undefined)
                this.keydiv.getElementsByClassName("pitch")[0].innerHTML = "";
        }
    }

    public getKeyChar(): string {
        return this.name;
    }
    public getKey(): any {
        return this.keydiv;
    }

    private changeColor(): void {
        let color = ColorMap.getInstance().getColor(this.getPitch());
        this.keydiv.style.backgroundColor = color;
    }

    private changeBackColor(): void {
        this.keydiv.style.cssText = "";
    }

    public press(): void {
        Piano.getInstance().press(this.pitch_);
        this.keydiv.getElementsByClassName("pitch")[0].innerHTML = utility.pitch2name(this.pitch_);
        this.changeColor();
    }

    public release(): void {
        Piano.getInstance().release(this.pitch_);
        this.keydiv.getElementsByClassName("pitch")[0].innerHTML = "";
        this.changeBackColor();
    }
    public getPitch(): number {
        return this.pitch_;
    }
    public updatePitch(): void {
        let bayan = Bayan.getInstance();
        this.pitch_ = bayan.keybdMap[this.name] + bayan.lowpitch;
    }

    private isBlackKey(): boolean {
        return utility.isBlackKey(this.pitch_);
    }
}

class Bayan {
    private static instance_: Bayan = null;
    private keys = new Array<BayanKey>();
    public keybdMap: any;
    public keybdRmap = new Array<string>();
    public keycharmap = {};
    public lowpitch:number;
    public high_low:number;
    
    public init(): void {
        let keyChar = utility.keyChar;
        let bayanDiv: any = document.getElementById("Bayan");
        for (let i: number = 0; i < 4; i++) {
            let keyrowDiv: any = document.createElement("div");
            keyrowDiv.setAttribute("id", "keyr".concat(i.toString()));
            keyrowDiv.setAttribute("class", "box");
            for (let j: number = 0; j < keyChar[i].length; j++) {
                let tempDiv: any = document.createElement("div");
                let tempSpan: any = document.createElement("span");
                let tempDisplay: any = document.createElement("span");
                let tempKey: BayanKey = new BayanKey(tempDiv, keyChar[i][j]);
                this.add(tempKey);
                tempSpan.innerHTML = keyChar[i][j];
                tempSpan.setAttribute("class", "keychar");
                tempDisplay.setAttribute("class", "pitch");
                tempKey.updatePitch();
                tempKey.initColor();
                tempDiv.appendChild(tempSpan);
                tempDiv.appendChild(tempDisplay);
                keyrowDiv.appendChild(tempDiv);
    
                tempDiv.onmousedown = () => {
                    tempKey.press();
                }
                tempDiv.onmouseup = () => {
                    tempKey.release();
                }
                tempDiv.onmouseout = tempDiv.onmouseup;
            }
            bayanDiv.appendChild(keyrowDiv);
        }
    }

    public static getInstance() : Bayan {
        if (Bayan.instance_ == null){
            Bayan.instance_ = new Bayan();
        }
        return Bayan.instance_;
    }
    private constructor() {
        this.keybdMap = utility.keyMap3;
        this.keybdRmap = utility.keyRmap3;
        this.lowpitch = this.keybdMap.low;
        this.high_low = this.keybdMap.high - this.keybdMap.low;
        let allchar = utility.keyChar.join();
        for (let i = 0; i < allchar.length; i++) {
            this.keycharmap[allchar[i]] = i;
        }
    }

    public add(key: BayanKey): void {
        let at = this.keycharmap[key.getKeyChar()];
        this.keys[at] = key;
    }

    public getkey(keyChar: string): BayanKey {
        return this.keys[this.keycharmap[keyChar]];
    }
    public update():void {
        this.keys.forEach(element => {
            element.updatePitch();
            element.initColor();
        });
        Piano.getInstance().releaseAllKey();
    }

    private getKeyCharByPitch(pitch: number): string {
        while (pitch < this.lowpitch) pitch += 12;
        while (pitch > this.lowpitch + this.high_low) pitch -= 12;
        return this.keybdRmap[pitch - this.lowpitch][0];
    }
    public press(pitch:number):void {
        let keyval = this.getKeyCharByPitch(pitch);
        this.getkey(keyval).press();
    }
    public release(pitch:number):void {
        let keyval = this.getKeyCharByPitch(pitch);
        this.getkey(keyval).release();
    }
    public releaseAll():void {
        this.keys.forEach(e => {
            e.release();
        });
    }
}

export { BayanKey, Bayan };
