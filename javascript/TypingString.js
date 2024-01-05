var ignoredKeys = ["Shift", "Control", "Alt", "CapsLock", "Fn", "NumLock", "Meta"];
//=============TypingString class==============
//Note: 'this' references the object that WILL be created when the constructor is instantiated.
//https://blog.kevinchisholm.com/javascript/the-javascript-this-keyword-deep-dive-constructor-functions/

import {Tracker} from "./Tracker.js";

//constructor
function TypingString(string, typingArea, seconds){
    this.currentWordIndex = 0;
    this.currentLetterIndex = 0;
    this.typingArea = typingArea;
    this.wordBuffer = typingArea.children; //HTMLCollection of typingArea children (words)


    this.cursorElement = document.createElement("div");
    this.cursorElement.classList.add("cursor");

    this.stringToElement(string);
    this.wordBuffer.item(0).children.item(0).appendChild(this.cursorElement); //add cursor to first element

    this.tracker = new Tracker(seconds);
    this.recordInput = false;

    //Change position of typingArea to match translated amount
    this.typingArea.addEventListener('animationend', (animationEvent) => {
        let typingAreaStyle = window.getComputedStyle(this.typingArea, null);
    
        let topValue = typingAreaStyle.getPropertyValue("top").replace("px","");

        if(animationEvent.animationName === "translate-up"){ //Upwards translation
            this.typingArea.classList.remove("translate-area-up");
            this.typingArea.style.top = (Number(topValue) - 53) + "px";
        }
        else if(animationEvent.animationName === "translate-down"){ //downwards translation
            this.typingArea.classList.remove("translate-area-down");
            this.typingArea.style.top = (Number(topValue) + 53) + "px";
        }
    
    });
    
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
        console.log(`Current word index: ${this.currentWordIndex}`);    
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

    if(!this.recordInput){
        this.recordInput = true;
        (async () => {
            console.log(await this.tracker.startTracking());
            this.recordInput = false;
            this.reset(false);
        })();
    }


    if(key === "Backspace"){
        this.decrementIndices();//HANDLE ERROR
        let precedingLetterElement = this.wordBuffer.item(this.currentWordIndex).children.item(this.currentLetterIndex);
        
        //preceding letter becomes current letter
        this.cursorElement.remove();
        precedingLetterElement.classList.remove("incorrect-typed-letter", "correct-typed-letter");
        precedingLetterElement.appendChild(this.cursorElement);
        console.log(key);

        //translate downwards to reveal previously typed words
        if(this.yPositionsDiffer(precedingLetterElement, currLetterElement)){
            this.typingArea.classList.add("translate-area-down");
        }

        //update tracker
        this.tracker.logKey(key);
        
        return;
    }

    let precedingWordIndex = this.currentWordIndex;
    let precedingLetterIndex = this.currentLetterIndex;
    this.incrementIndices();
    let succeedingWordElement = this.wordBuffer.item(this.currentWordIndex); // new current element
    let precedingLetterElement = this.wordBuffer.item(precedingWordIndex).children.item(precedingLetterIndex);
    let succeedingLetterElement = succeedingWordElement.children.item(this.currentLetterIndex);

    //if key !== current character (including space - nbsp)
    if(key !== currLetterElement.innerText && !(key === " " && currLetterElement.innerText == String.fromCharCode(160))){
        console.log(`${key} is not equal to ${currLetterElement.innerText}`);
                
        //succeeding letter becomes current letter - incorrect letter typed
        this.cursorElement.remove();
        currLetterElement.classList.add("incorrect-typed-letter");
        succeedingLetterElement.appendChild(this.cursorElement);

        //update tracker
        this.tracker.logKey(key, false);
    }
    else{
        //succeeding letter becomes current letter - correct letter typed
        this.cursorElement.remove();
        currLetterElement.classList.add("correct-typed-letter");
        succeedingLetterElement.appendChild(this.cursorElement);

        //update tracker
        this.tracker.logKey(key, true);
    }

    //if newCurrentElement's position != (old)currentElement's position
    // then translate upwards
    if(this.yPositionsDiffer(precedingLetterElement, succeedingLetterElement)){
        //if class is already present, wait for it to be removed
       // while( this.typingArea.classList.contains("translate-area-up")){}
        this.typingArea.classList.add("translate-area-up");
    }
}

TypingString.prototype.yPositionsDiffer = function(element1, element2){
    return element1.getBoundingClientRect().top != element2.getBoundingClientRect().top;
}

TypingString.prototype.reset = function(reload){
    if(!reload){
        Array.from(this.wordBuffer).every(currentWord => {
            return Array.from(currentWord.children).every(currentLetter => {
                if(currentLetter.classList.contains("incorrect-typed-letter") ||
                    currentLetter.classList.contains("correct-typed-letter")){
                        currentLetter.classList.remove("incorrect-typed-letter");
                        currentLetter.classList.remove("correct-typed-letter");
                        return true;
                }
                return false;
            });
        });
    }

    //reset indices
    this.currentWordIndex = this.currentLetterIndex = 0;
    this.typingArea.style.top = 0;

    //reset cursor position
    this.cursorElement.remove();
    this.wordBuffer.item(0).children.item(0).appendChild(this.cursorElement);
}
//=============TypingString class==============

export {TypingString};