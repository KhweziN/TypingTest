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


    this.cursorElement = document.createElement("div");
    this.cursorElement.classList.add("cursor");

    this.stringToElement(string);
    this.wordBuffer.item(0).children.item(0).appendChild(this.cursorElement);
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
    let currLetterElement = this.wordBuffer.item(this.currentWordIndex).children.item(this.currentLetterIndex);

    if(ignoredKeys.includes(key)){ //ignore keys
        return;
    }

    if(key === "Backspace"){
        this.decrementIndices();//handle error
        let newCurrLetterElement = this.wordBuffer.item(this.currentWordIndex).children.item(this.currentLetterIndex);
        
        this.cursorElement.remove();
        newCurrLetterElement.classList.remove("incorrect-typed-letter", "correct-typed-letter");
        newCurrLetterElement.appendChild(this.cursorElement);
        console.log(key);
        return;
    }

    //if key !== current character (including space - nbsp)
    if(key !== currLetterElement.innerText && !(key === " " && currLetterElement.innerText == String.fromCharCode(160))){
        console.log(`${key} is not equal to ${currLetterElement.innerText}`);
        this.incrementIndices();
        let newCurrLetterElement = this.wordBuffer.item(this.currentWordIndex).children.item(this.currentLetterIndex);
        
        this.cursorElement.remove();
        currLetterElement.classList.add("incorrect-typed-letter");
        newCurrLetterElement.appendChild(this.cursorElement);
    }
    else{
        console.log(key);
        this.incrementIndices();
        let newCurrLetterElement = this.wordBuffer.item(this.currentWordIndex).children.item(this.currentLetterIndex);

        this.cursorElement.remove();
        currLetterElement.classList.add("correct-typed-letter");
        newCurrLetterElement.appendChild(this.cursorElement);
    }
}


//=============TypingString class==============

//=============ContentGenerator class==============
function ContentGenerator(){
    
}

ContentGenerator.prototype.getWords =  
function (numWords, contains = /[A-Za-z]/g, minWordLength = 1){
    if(numWords <= 0) throw new RangeError("invalid number of words - must be greater than 0");
    if(minWordLength <= 0) throw new RangeError("invalid word length - must be greater than 0");

    let wordArray = [];
    let req = new XMLHttpRequest();
    let url = "https://random-word-api.herokuapp.com/word?number=" + numWords * 1000;
    let maxRequests = 10;

    req.onreadystatechange = function (response){
        if(this.readyState == 4 && this.status == 200){ //success
            let responseArray = JSON.parse(req.responseText);

            responseArray.every(function(element){
                if(contains.test(element)){ //add word to list if it contains letters needed 
                    wordArray.push(element);
                }
                return wordArray.length !== numWords; //if true, continue (get more words)
            });
        }
    }

    let counter = 0;
    while(wordArray.length !== numWords && counter < maxRequests){
        req.open("GET", url, false);
        req.send();
        counter++;
    }

    console.log(wordArray);
    return wordArray;
}

ContentGenerator.prototype.getSentences = function(numSentences, options){
    throw new Error("Not implemented");
}

ContentGenerator.prototype.getStory = function(){
    throw new Error("Not implemented");
}
//=============ContentGenerator class==============

///////////////////Testing code///////////////////////
var typingArea = document.getElementById("typing-area");
var t = new TypingString("Hello world", typingArea);
// for(let i=0; i<10; i++){
//     console.log(`Word (${t.currentWordIndex}), Letter (${t.currentLetterIndex}) : 
//         ${t.typingArea.children.item(t.currentWordIndex).children.item(t.currentLetterIndex).innerHTML}`);
//     t.incrementIndices();
// }

document.addEventListener("keydown", (event) => t.processNextKey(event.key));

var contentGen = new ContentGenerator();

export {TypingString};

document.addEventListener("keypress", function(event){
    contentGen.getWords(5, /[\w]*ysm[\w]*/g);
});