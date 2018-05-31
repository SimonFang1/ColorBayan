import { MIDIParser } from "./midiparser";
import { Player } from "./player";

namespace dropevent {
    // get the Data from MIDI file
    let fileData: any;

    export let init = () => {
        let drag: any = document.getElementById("main");
        drag.addEventListener('drop', dropHandler, false);
        drag.addEventListener('dragover', dragOverHandler, false);
    }

    let dropHandler = (e: any) => {
        e.stopPropagation();
        e.preventDefault();

        readAsArrayBuffer(e.dataTransfer.files[0]);
    }

    let dragOverHandler = (e: any) => {
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dragEffect = 'copy';
    }

    let readAsArrayBuffer = (file: any) => { 
        var reader = new FileReader();    
        reader.onload = (e) => {
            fileData = reader.result.split('').map((v: any) => {
                return ('0'+ v.charCodeAt(0).toString(16)).slice(-2);
            });
            fileData = fileData.join('');
            let mparser = new MIDIParser();
            let noteaction =  mparser.createKeyEvents(fileData);
            let player = Player.getInstance();
            player.finishPlay();
            player.loadSequence(noteaction);
        }
        reader.readAsBinaryString(file);
    }
}

export { dropevent }
