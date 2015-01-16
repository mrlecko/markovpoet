//
// syllable counter
//  - ported from https://github.com/akkana/scripts/blob/master/countsyl

function count_syllables(word){
    vowels = ['a', 'e', 'i', 'o', 'u'];

    on_vowel = false;
    in_diphthong = false;
    minsyl = 0;
    maxsyl = 0;
    lastchar = '';

    word = word.toLowerCase();
    word = word.trim();
    
    // for each character
    for (var i = 0; i < word.length; i++){
        c = word[i];
        
        // is it a vowel?
        if ($.inArray(c, vowels) > -1){
            is_vowel = true;
        } else {
            is_vowel = false;
        }
    
        // y is a special case
        if (c == 'y') {
            is_vowel = true;
        }
        
        if (is_vowel == true) {
            //console.log(c, 'is a vowel');
            if (! on_vowel) {
                minsyl += 1;
                maxsyl += 1;
            } else if ((on_vowel == true) && (in_diphthong == false) && (c != lastchar)) {
                in_diphthong = true;
                maxsyl +=1;
            
            }
        }
        
        on_vowel = is_vowel;
        lastchar = c;
        
    };
    
    // special cases
    
    // deduct 1 from minsyl for ending in 'e'
    if (word.charAt(word.length-1) == 'e'){
        minsyl -= 1;
    }
    
    
    
    // add 1 to maxsyl for 'y'
    if ((word.charAt(word.length-1) == 'y') && (on_vowel == false)){
        maxsyl += 1
    }
    
    // if the word is less than 5 chars, set minsyl to 1
    if (word.length <= 5 && countOccurrences(word, 'ea') > 0) {
        minsyl = 1;
    }
    
    // deduct 1 from minsyl if the word contains 'ea' and it's > 5 chars
    if (word.length > 5 && countOccurrences(word, 'ea') > 0) {
        minsyl -= countOccurrences('ea');
    }
    
    if (minsyl < 0){ minsyl=1};
        
    return [minsyl, maxsyl];
}


function countOccurrences(str, value){
   var regExp = new RegExp(value, "gi");
   return str.match(regExp) ? str.match(regExp).length : 0;  
}
