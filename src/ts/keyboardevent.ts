/*
    This is a namespace about keybdEvent
*/

import { Sound } from "./sound";
import { BayanKey, Bayan } from "./bayan";
import { PianoRoll } from "./piano";

namespace keyboardevent {
    let bpressed = new Array();
    // The event when the key of keyboard is Up
    export let keyUp = function(event: any): void {
        let keyval = getkeyValue(event.keyCode);
        let bayan = Bayan.getInstance();
        switch(keyval) {
            case "up":
                if (bayan.lowpitch + 12 <= bayan.keybdMap.maxlow) {
                    bayan.lowpitch += 12;
                    bayan.update();
                }
                break;
            case "down":
                if(bayan.lowpitch - 12 >= 0) {
                    bayan.lowpitch -= 12;
                    bayan.update();
                }
                break;
            case "right":
                if (bayan.lowpitch + 1 <= bayan.keybdMap.maxlow) {
                    bayan.lowpitch ++;
                    bayan.update();
                }
                break;
            case "left":
                if (bayan.lowpitch - 1 >= 0) {
                    bayan.lowpitch --;
                    bayan.update();
                }
                break;
            case "enter":
                PianoRoll.getInstance().play();
                break;
            case "esc":
                PianoRoll.getInstance().stop();
                break;
            case "space":
                document.getElementById("realButton").click();
                break;
        }
        let bayankey: BayanKey = getDiv(keyval);
        if (bayankey !== undefined) {
            bayankey.release();
            Sound.getInstance().stopSound(bayankey.getPitch());
        }
        bpressed[keyval] = false;
    }

    // The event when the key of keyboard is Down
    export let keyDown = function(event: any): void {
        let ifIE: boolean = navigator.appName == "Microsoft Internet Explorer";
        let keyval = (ifIE) ? getkeyValue(event.keyCode) : getkeyValue(event.which);
        if (bpressed[keyval]) return;
        bpressed[keyval] = true;
        let bayankey: BayanKey = getDiv(keyval);
        if (bayankey !== undefined) {
            bayankey.press();
            Sound.getInstance().playSound(bayankey.getPitch());
        }
    }

    // Get the real value about the key which we pressed down
    let getkeyValue = function(keycode: number): string {
        let keyval: string;
        switch(keycode) {
            case 13: keyval = "enter"; break;
            // case 16: keyval = "shift"; break;
            case 27: keyval = "esc"; break;
            case 37: keyval = "left"; break;
            case 38: keyval = "up"; break;
            case 39: keyval = "right"; break;
            case 40: keyval = "down"; break;
            case 32: keyval = "space"; break;
            case 186: keyval = ";"; break;
            case 187: keyval = "="; break;
            case 188: keyval = ","; break;
            case 189: keyval = "-"; break;
            case 190: keyval = "."; break;
            case 191: keyval = "/"; break;
            case 219: keyval = "["; break;
            // case 220: keyval = "\\" break;
            case 221: keyval = "]"; break;
            case 222: keyval = "'"; break;
            default: keyval = String.fromCharCode(keycode);
        }
        return keyval;
    }

    // Get the div DOM by key value
    let getDiv = function(keyval: string): BayanKey {
        return Bayan.getInstance().getkey(keyval);
    }
}

export { keyboardevent };
