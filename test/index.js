const assert = require("assert");
const { JSDOM } = require("jsdom");
global.document = (new JSDOM()).window.document;
console.log(document);
const TypingString = require("../javascript/index");

// describe('TypingString', function(){
//     var ts;
//     var initialString = "Lorem ipsum dolor sit amet, consectetur adipiscing elit."; 
//     var typingArea = doc.createElement("div");

//     typingArea.id = "typing-area";

//     describe('#TypingString()', function(){
//         it('initializes the TypingString object', function(){
//             ts = new TypingString(initialString, typingArea);
//             assert.equal(ts.wordBuffer.item(0).children.item(0), initialString.charAt(0));
//         });
//     })

// });