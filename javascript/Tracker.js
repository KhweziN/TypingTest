export function Tracker(seconds){
    this.isTracking = false;
    this.seconds = seconds;
    this.loggedKeys = [];
}

Tracker.prototype.startTracking = function(seconds = this.seconds){
    //Clear all prior data
    this.loggedKeys = [];
    this.seconds = seconds;

    this.isTracking = true;
    let secondsRemaining =  this.seconds;

    return new Promise(resolve => {
        var interval = setInterval(() => {
            console.log(`${secondsRemaining} seconds remaining`);
            secondsRemaining -= 1;

            if(secondsRemaining < 0) {
                this.isTracking = false;
                clearInterval(interval);
                resolve(this.evaluate());
            };
        }, 1000);
    });
}

Tracker.prototype.logKey = function(typedKey, correct){
    if(!this.isTracking) return;

    //if backspace, pop the stack
    if(typedKey === "Backspace"){
        this.loggedKeys.pop();
        return;
    }
    this.loggedKeys.push({key: typedKey, isCorrect: correct});
}

Tracker.prototype.evaluate = function(){
    const AVG_WORD_LEN = 5;
    let _numMinutes = this.seconds/60;
    let _numCorrectKeys = 0, _numTotalKeys = this.loggedKeys.length;
    let _rawWPM, _netWPM, _accuracy;

    for(let letter of this.loggedKeys){
        if(letter.isCorrect) {
            _numCorrectKeys++;
        }
    }

    _rawWPM = Math.floor((_numTotalKeys / AVG_WORD_LEN) / _numMinutes);
    _accuracy = _numCorrectKeys/_numTotalKeys;
    _netWPM = Math.floor(_rawWPM * _accuracy) ;

    return {
        numCorrectKeys: _numCorrectKeys, 
        numIncorrectKeys: _numTotalKeys - _numCorrectKeys,
        numTotalKeys: _numTotalKeys,
        percentAccuracy: _accuracy * 100,
        rawWPM: _rawWPM,
        netWPM: _netWPM
    };
}