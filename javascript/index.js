var ignoredKeys = ["Shift", "Control", "Alt", "CapsLock", "Fn", "NumLock", "Meta"];
//=============TypingString class==============
//Note: 'this' references the object that WILL be created when the constructor is instantiated.
//https://blog.kevinchisholm.com/javascript/the-javascript-this-keyword-deep-dive-constructor-functions/

//constructor
function TypingString(string, typingArea){
    this.currentWordIndex = 0;
    this.currentLetterIndex = 0;
    this.typingArea = typingArea;
    this.wordBuffer = typingArea.children; //HTMLCollection of typingArea children (words)
    this.stringToElement(string);
    //add cursor to first element
}

TypingString.prototype.stringToElement = function(s){
    let wordArray = s.split(" ");

    for(let i=0; i<wordArray.length; i++){
        let typingWordElement = document.createElement("div");

        for(let j=0; j<wordArray[i].length; j++){
        //create typing-letter element
        let typingLetter = document.createElement("div");
        typingLetter.innerText = wordArray[i].charAt(j);

        //add class(es) to letter
        typingLetter.classList.add("typing-letter");

        //add letter to word
        typingWordElement.appendChild(typingLetter);
      }

        //append space to word
        typingWordElement.innerHTML += "<div class='typing-letter'>&nbsp;</div>";

        //add class to word
        typingWordElement.classList.add("typing-word");

        //add typing word to tying area
        this.typingArea.appendChild(typingWordElement);
    }
}

TypingString.prototype.decrementIndices = function (){
    if(this.currentWordIndex == 0 && this.currentLetterIndex == 0){ //cannot delete any more words
        throw new RangeError("No prior words exist in buffer");
        return;
    }

    if(this.currentLetterIndex == 0){ //go to prior word
        this.currentWordIndex--;
        this.currentLetterIndex = this.wordBuffer.item(this.currentWordIndex).children.length -1;
    }
    else{
        this.currentLetterIndex--;
    }
}

TypingString.prototype.incrementIndices = function (){

    if(this.currentWordIndex == this.wordBuffer.length-1 && 
        this.currentLetterIndex == this.wordBuffer.item(this.currentWordIndex).children.length-1){ //no more words (or letters) words
        throw new RangeError("No more words available");
    }

    if( this.currentLetterIndex == this.wordBuffer.item(this.currentWordIndex).children.length-1){ //no more letters in current word
        this.currentWordIndex++;
        this.currentLetterIndex = 0;
    }
    else{
        this.currentLetterIndex++;
    }
}

TypingString.prototype.processNextKey = function (key){
    //handle inputs that are not letters, numbers or specific symbols (e.g. full stops, commas etc.)
     
    let currLetterElement = this.wordBuffer.item(this.currentWordIndex).children.item(this.currentLetterIndex);

    if(ignoredKeys.includes(key)){ //ignored keys
        return;
    }

    if(key === "Backspace"){
        this.decrementIndices();//handle error
        let newCurrLetterElement = this.wordBuffer.item(this.currentWordIndex).children.item(this.currentLetterIndex);
        //change css
        console.log(key);
        return;
    }

    //if key !== current letter
    if(key !== currLetterElement.innerText && key !== " "){
        console.log(`${key} is not equal to ${currLetterElement.innerText}`);
        this.incrementIndices();
        let newCurrLetterElement = this.wordBuffer.item(this.currentWordIndex).children.item(this.currentLetterIndex);
        //change css
    }
    else{
        console.log(key);
        this.incrementIndices();
        let newCurrLetterElement = this.wordBuffer.item(this.currentWordIndex).children.item(this.currentLetterIndex);
        //change css
    }
}


//=============TypingString class==============

///////////////////Testing code///////////////////////
var typingArea = document.getElementById("typing-area");
var t = new TypingString("Hello world", typingArea);
// for(let i=0; i<10; i++){
//     console.log(`Word (${t.currentWordIndex}), Letter (${t.currentLetterIndex}) : 
//         ${t.typingArea.children.item(t.currentWordIndex).children.item(t.currentLetterIndex).innerHTML}`);
//     t.incrementIndices();
// }

document.addEventListener("keydown", (event) => t.processNextKey(event.key));

