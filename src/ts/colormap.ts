class ColorMap {
    private static instance_: ColorMap = null;
    private bgcolortxt= new Array<string>();
    public static getInstance(): ColorMap {
        if (ColorMap.instance_ == null) {
            ColorMap.instance_ = new ColorMap();
        }
        return ColorMap.instance_;
    }
    private constructor() {
        let data = [ // HSL, D. D. Jameson (1844)
            [ 360, 96, 51 ], // red
            [ 14, 91, 51 ], // red-orange
            [ 29, 94, 52 ], // orange
            [ 49, 90, 60 ], // orange-yellow
            [ 60, 90, 60 ], // yellow
            [ 135, 76, 32 ], // green
            [ 172, 68, 34 ], // green-blue
            [ 248, 82, 28 ], // blue
            [ 273, 80, 27 ], // blue-purple
            [ 302, 88, 26 ], // purple
            [ 313, 78, 37 ], // purple-violet
            [ 325, 84, 46 ] // violet
        ];
        for (let i = 0; i < 88; i++) {
            let p = (i + 9) % 12;
            this.bgcolortxt[i] =  "hsl(" + data[p][0] + "," + data[p][1] + "%," + data[p][2]+"%)";
        }
    }
    public getColor(pitch: number): string {
        return this.bgcolortxt[pitch];
    }

}

export { ColorMap };
