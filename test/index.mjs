import assert from "assert";
import {JSDOM} from "jsdom";
global.document = (new JSDOM('<!DOCTYPE html><html><body></body></html>')).window.document;
console.log(document);
import {TypingString} from "../javascript/TypingString.js";

describe('TypingString', function(){
    var ts;
    var initialString = "Lorem ipsum dolor sit amet, consectetur adipiscing elit."; 
    
    document.addEventListener('DOMContentLoaded', function() {
        var typingArea = document.createElement("div");
        console.log(typingArea);
        document.body.appendChild(typingArea);
        typingArea.appendChild(document.createElement("div"));
        console.log(typingArea.children);
    });
      

    // typingArea.id = "typing-area";

    // describe('#TypingString()', function(){
    //     it('initializes the TypingString object', function(){
    //         //ts = new TypingString(initialString, typingArea);
    //         console.log(typingArea.children);
    //         //assert.equal(ts.wordBuffer.item(0).children.item(0).innerText, initialString.charAt(0));
    //     });
    // });

});