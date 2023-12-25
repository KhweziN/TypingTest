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

    if(key === "Backspace"){
        this.decrementIndices();//HANDLE ERROR
        let precedingLetterElement = this.wordBuffer.item(this.currentWordIndex).children.item(this.currentLetterIndex);
        
        //preceding letter becomes current letter
        this.cursorElement.remove();
        precedingLetterElement.classList.remove("incorrect-typed-letter", "correct-typed-letter");
        precedingLetterElement.appendChild(this.cursorElement);
        console.log(key);

        // if(oldWordElement.getBoundingClientRect().top != newWordElement.getBoundingClientRect().top){
        //     console.log("CHANGE");
        //     console.log(oldWordIndex);
        //     for(let i=0; i<=oldWordIndex; i++){
        //         this.wordBuffer.item(i).style.display = "none";
        //     }
        // }
        
        return;
    }

    //if key !== current character (including space - nbsp)
    if(key !== currLetterElement.innerText && !(key === " " && currLetterElement.innerText == String.fromCharCode(160))){
        console.log(`${key} is not equal to ${currLetterElement.innerText}`);
        this.incrementIndices();
        let succeedingLetterElement = this.wordBuffer.item(this.currentWordIndex).children.item(this.currentLetterIndex);
        
        //succeeding letter becomes current letter - incorrect letter typed
        this.cursorElement.remove();
        currLetterElement.classList.add("incorrect-typed-letter");
        succeedingLetterElement.appendChild(this.cursorElement);
    }
    else{
        let oldWordIndex = this.currentWordIndex;
        this.incrementIndices();

        //succeeding letter becomes current letter - correct letter typed
        let newWordElement = this.wordBuffer.item(this.currentWordIndex); // new current element
        let newLetterElement = newWordElement.children.item(this.currentLetterIndex);
        let oldLetterElement = currLetterElement;

        this.cursorElement.remove();
        oldLetterElement.classList.add("correct-typed-letter");
        newLetterElement.appendChild(this.cursorElement);
        
        let oldWordElement = this.wordBuffer.item(oldWordIndex); //old current element

        //if newCurrentElement's position != (old)currentElement's position
        // -> delete words including (old)currentElement

        if(oldLetterElement.getBoundingClientRect().top != newLetterElement.getBoundingClientRect().top){
            console.log("CHANGE");
            console.log(oldWordIndex);
            for(let i=0; i<=oldWordIndex; i++){
                this.wordBuffer.item(i).style.display = "none";
            }
        }
    }
}
//=============TypingString class==============

export {TypingString};