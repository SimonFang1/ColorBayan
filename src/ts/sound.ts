import { utility } from "./utility";
import { soundfont } from "./soundfont";

class Pitch {
    public name: string;
    public index: number;
    public audio: any;
};

class Sound {
    private static instance_: Sound = null;
    private pitches = new Array<Pitch>();

    public static getInstance(): Sound {
        if (Sound.instance_ === null)
            Sound.instance_ = new Sound();
        return Sound.instance_;
    }

    private constructor() {
        let sfdata = soundfont.acoustic_grand_piano;
        for (let i = 0; i < 88; i++) {
            this.pitches[i] = new Pitch();
            let p = this.pitches[i];
            p.index = i;
            p.name = utility.pitch2name(i);
            p.audio = new Audio(sfdata[p.name]);
        }
    }

    public playSound(index:number) {
        let p = this.pitches[index];
        p.audio.currentTime = 0;
        p.audio.play();
    }

    public stopSound(index:number) {
        let p = this.pitches[index];
        p.audio.pause();
    }

    public stopAll() {
        this.pitches.forEach(element => {
            element.audio.pause();
            element.audio.currentTime = 0;
        });
    }
};

export { Sound };
