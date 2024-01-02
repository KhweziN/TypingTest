//=============ContentGenerator class==============
function ContentGenerator(){
    
}

ContentGenerator.prototype.requestWords =
function(req, url, contains, numRemainingWords){
    
    return new Promise(function(resolveFunc){
        let words = [];

        req.onreadystatechange = function (response){
            if(this.readyState == 4 && this.status == 200){ //success
                let responseArray = JSON.parse(req.responseText);
    
                responseArray.every(function(element){
                    if(contains.test(element)){ //add word to list if it contains letters needed 
                        words.push(element);
                    }
                    return words.length !== numRemainingWords; //if true, continue (get more words)
                });
                resolveFunc(words);
            }
        }

        req.open("GET", url, true);
        req.send();
    });
}

ContentGenerator.prototype.getWords =  
async function (numWords, contains = /[A-Za-z]/g, minWordLength = 1){
    if(numWords <= 0) throw new RangeError("invalid number of words - must be greater than 0");
    if(minWordLength <= 0) throw new RangeError("invalid word length - must be greater than 0");

    let wordArray = [];
    let req = new XMLHttpRequest();
    let url = "https://random-word-api.herokuapp.com/word?number=" + numWords * 100;

    let counter = 0;
    let maxRequests = 10;

    const getWordsHelper = async counter => {
        if (wordArray.length == numWords || counter >= maxRequests) 
            return; 
        let words = await this.requestWords(req,url,contains, numWords - wordArray.length);
        wordArray = wordArray.concat(words);
        console.log(wordArray);
        counter++;
        await getWordsHelper(counter);
    }

    let temp = await getWordsHelper(counter);
    console.log(`Finished word array: ${wordArray}`);    
}

ContentGenerator.prototype.getSentences = function(numSentences, options){
    throw new Error("Not implemented");
}

ContentGenerator.prototype.getStory = function(){
    let req = new XMLHttpRequest();
    let url = "https://shortstories-api.onrender.com/";
    let story, response;

    return new Promise(function(resolveFunc){ //code executed within promise - executor function
        req.onreadystatechange = function(){
            if(req.readyState == 4 && req.status == 200){
                response = JSON.parse(req.responseText);
                story = response.story;
                resolveFunc(story);
            }
        }
        req.open("GET", url, true);
        req.send();
    });
}
//=============ContentGenerator class==============

export {ContentGenerator};