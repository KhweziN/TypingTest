import { TypingString } from "./TypingString.js";
import { ContentGenerator } from "./ContentGenerator.js";

///////////////////Testing code///////////////////////
var typingArea = document.getElementById("typing-area");
var t = new TypingString("Hello world", typingArea);
// for(let i=0; i<10; i++){
//     console.log(`Word (${t.currentWordIndex}), Letter (${t.currentLetterIndex}) : 
//         ${t.typingArea.children.item(t.currentWordIndex).children.item(t.currentLetterIndex).innerHTML}`);
//     t.incrementIndices();
// }

document.addEventListener("keydown", (event) => t.processNextKey(event.key));
console.log(typingArea.children);

var contentGen = new ContentGenerator();

// document.addEventListener("keypress", function(){
//     contentGen.getStory().then((result) => console.log(result));
// });

// document.addEventListener("keypress", function(){
//     contentGen.getWords(5, /x[\w]*i/g);
// });