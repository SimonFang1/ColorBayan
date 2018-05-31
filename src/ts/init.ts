import { utility } from "./utility";
import { Piano, PianoRoll } from "./piano";
import { BayanKey, Bayan } from "./bayan";
import { keyboardevent } from "./keyboardevent";
import { dropevent } from "./dropevent";
import { Player } from "./player";

window.onload = function(){
    Piano.getInstance().init();
    PianoRoll.getInstance().init();
    Bayan.getInstance().init();
    dropevent.init();
    Player.getInstance().init();
}

window.onresize = function() {
    PianoRoll.getInstance().resize();
    let piano = document.getElementById("Piano");
    let mainbox = document.getElementById("main");
    let pbox = document.getElementById("piano-box");
    let canvas = document.getElementById("piano-roll");
    canvas.style.display = 'none';
    let displaycopy = piano.style.display;
    piano.style.display = "none";
    let height = mainbox.offsetHeight;
    piano.style.display = "flex";
    let width = pbox.offsetWidth;
    height -= pbox.offsetHeight+15;
    piano.style.display = displaycopy;
    canvas.setAttribute("width", width.toString());
    canvas.setAttribute("height", height.toString());
    canvas.style.display = '';
    
}

window.addEventListener('keydown', keyboardevent.keyDown, false);
window.addEventListener('keyup', keyboardevent.keyUp, false);
