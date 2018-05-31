namespace utility {
    export let keyChar = [
        "1234567890-=",
        "QWERTYUIOP[]",
        "ASDFGHJKL;'",
        "ZXCVBNM,./"
    ];

    // use 3 rows
    // key '1' = pitch B2 = 26th(abs) pitch = 0th(rel) pitch
    // key ']' = pitch A5 = 60th(abs) pitch = 34th(rel) ptch
    // now low = 26, valid low is among [0, 53]
    export let keyMap3: any =  {
        "1" : 0,  "Q" : 1,  "A" : 2,  "Z" : 3,
        "2" : 3,  "W" : 4,  "S" : 5,  "X" : 6,
        "3" : 6,  "E" : 7,  "D" : 8,  "C" : 9,
        "4" : 9,  "R" : 10, "F" : 11, "V" : 12,
        "5" : 12, "T" : 13, "G" : 14, "B" : 15,
        "6" : 15, "Y" : 16, "H" : 17, "N" : 18,
        "7" : 18, "U" : 19, "J" : 20, "M" : 21,
        "8" : 21, "I" : 22, "K" : 23, "," : 24,
        "9" : 24, "O" : 25, "L" : 26, "." : 27,
        "0" : 27, "P" : 28, ";" : 29, "/" : 30,
        "-" : 30, "[" : 31, "'" : 32,
        "=" : 33, "]" : 34,
        low: 26, high: 60, maxlow: 53
    };

    export let keyRmap3 = [
        "1" , "Q", "A", "2Z", "W", "S", "3X", "E", "D",
        "4C", "R", "F", "5V", "T", "G", "6B", "Y", "H",
        "7N", "U", "J", "8M", "I", "K", "9,", "O", "L",
        "0.", "P", ";", "-/", "[", "'", "=",  "]"
    ];

    export let pitch2name = function(pitch: number): string {
        // console.assert(pitch >= 0 && pitch <= 87);
        pitch += 9;
        let name = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
        return name[pitch % 12] + Math.floor(pitch / 12);
    }

    export let name2pitch = function(fullname: string): number {
        let re = /[A-G](b?)/;
        let name = re.exec(fullname)[0];
        let gstr = fullname.substring(name.length, fullname.length);
        let group = parseInt(gstr);
        
        let namedict = {"C":0, "Db":1, "D":2, "Eb":3,
                      "E":4, "F":5, "Gb":6, "G":7,
                      "Ab":8, "A":9, "Bb":10, "B":11};
        return group * 12 + namedict[name] - 9;
    }
    
    let blackkey = [
        false, true, false, true, false, false,
        true, false, true, false, true, false
    ];
    export let isBlackKey = function(pitch: number) {
        return blackkey[(pitch + 9) % 12];
    }
    export let isWhiteKey = function(pitch: number) {
        return !blackkey[(pitch + 9) % 12];
    }

}


export { utility };
