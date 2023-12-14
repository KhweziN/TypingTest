

//=============TypingString class==============
//Note: 'this' references the object that WILL be created when the constructor is instantiated.
//https://blog.kevinchisholm.com/javascript/the-javascript-this-keyword-deep-dive-constructor-functions/

//constructor
function TypingString(string, typingArea){
    this.typingArea = typingArea;
    this.stringToElement(string);
    //add cursor to first element
}

TypingString.prototype.stringToElement = function(s){
    let wordArray = s.split(" ");

    for(let i=0; i<wordArray.length; i++){
        let typingWord = document.createElement("div");

        for(let j=0; j<wordArray[i].length; j++){
        //create typing-letter element
        let typingLetter = document.createElement("div");
        typingLetter.innerText = wordArray[i].charAt(j);

        //add class(es) to letter
        typingLetter.classList.add("typing-letter");

        //add letter to word
        typingWord.appendChild(typingLetter);
      }

        //append space to word
        typingWord.innerHTML += "<div class='typing-letter'>&nbsp;</div>";

        //add class to word
        typingWord.classList.add("typing-word");

        //add typing word to tying area
        this.typingArea.appendChild(typingWord);
    }
}


var typingArea = document.getElementById("typing-area");
var t = new TypingString("Hello world", typingArea);
console.log(t.typingArea);

