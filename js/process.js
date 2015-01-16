//
// __main__ for generating results
//
function run(sources, config){
    var corpus = compileSources(sources, config);   // build corpus
    var chains = getMarkov(corpus, config);         // generate chains
    var output = postProc(chains, config);          // post-process
    return renderOutput(output);                    // display
} 


//
// compile and NLP pre-process all the sources
//      
function compileSources(sources, config){
    var corpus = "";
    for (var i = 0; i < sources.length; i++) {
        // pre process the text
        var t = nlpPreProcess(sources[i].text);
        // validate and add to the corpus
        if (t.length > 0){
            corpus += t;
        }
    }
    //console.log(corpus);
    return corpus;
}


//
// native TTS (only works on Win Chrome!?)
//
function speakit(text){
    var msg = new SpeechSynthesisUtterance();
    var voices = window.speechSynthesis.getVoices();
    msg.voice = voices[0]; // Note: some voices don't support altering params
    msg.voiceURI = 'native';
    msg.volume = 1; // 0 to 1
    msg.rate = 1; // 0.1 to 10
    msg.pitch = 0.5; //0 to 2
    msg.text = text;
    msg.lang = 'en-GB';
    try {
        window.speechSynthesis.speak(msg);
    } catch (err) {
        console.log('speech synthesis failed:', err);
    }
}


//
// NLP PreProcessor
//  
function nlpPreProcess(text){
    /* 
     * whole text
     *      normalize
     *          toLowercase()
     * 
     * single char filtering / mapping
     *      single character translations                       
     * 
     * punctuation
     *      merge duplicated whitespace (    !)
     *      merge duplicated punctuation (!!!)
     *      normalize grouped sentence terminators (!!??!)
     * 
     * multi-character regexp replacements
     *      contraction expansions
     *      general regexp replacements
     * 
     * segmentation
     *      sentence splitting
     */
    
    // normalize 
    text = text.toLowerCase();
    text = text.replace(/[^a-zA-Z\s0-9,\.\?\!]/g, ''); // character filter
    
    // single char fixes
    text = text.replace(/\n/g,'.');             // \n > .
    text = text.replace(/\r/g,'.');             // \r > .
    
    // punctuation fixes
    text = text.replace(/[\.\!\?]+/g,'.');      // merge terminaters
    
    // multi-char fixes
    text = text.replace(/\s+/g,' ');            // merge whitespace
    
    // segmentation fixes
    
    // any additional rules
    text = text.trim();                         // trim it
    if (text.charAt(text.length-1) != '.') {    // add a . to the end
        text += '.';
    }   
    
    // split and recombine
    text = text.split(/[, ]+/g).join(' ').trim();
    
    return text
}


//
// Count syllables in a sequence of text
//
function countSyllables(text){
    var words = text.split(/[\.\!\?, ]+/g);
    var sylcount = 0;
    for (var w = 0; w < words.length; w++) {
        var word = words[w].trim()
        // pass on a zero length token
        if (word.length == 0){
            continue;
        // add 1 if it's a 1-3 character word 
        } else if (word.length > 0 && word.length <= 3) {
            sylcount += 1;
        // else use the calculator
        } else {
            sylcount += (count_syllables(word)[0]); //0=min syls, 1=max syls
        }
    }
    console.log('syllable count', sylcount, 'for text:', text);
    return sylcount;
}


//
// Pick random chains matching a syllable sequence
//
function selectChainsBySyllables(syls, chains, syllable_map){
    console.log('selecting chains by', syls);
    console.log('syllable_map:', syllable_map);
    var result = [];
    for (var i = 0; i < syls.length; i++) {
        var tmp = [];
        var this_syl = syls[i];
        // get candidate chains that match syllable count
        for (var j = 0; j < syllable_map.length; j++) {
            //console.log('current syllable_map item:', syllable_map[j]);
            if (syllable_map[j] == this_syl) {
                tmp.push(chains[j]);
            }
        }
        console.log('found', tmp.length, 'candidate chains for syllable count:', this_syl);
        // select a random chain from the candidates
        if (tmp.length > 0) {
            result.push(tmp[Math.floor(Math.random()*tmp.length)]);
        }
    }
    return result //tmp
}


//
// Syllable / Haiku filter
//
function filterBySyllables(syls, chains, max) {
    var syls = syls.split(',');
    for (var i = 0; i < syls.length; i++) {
        syls[i] = parseInt(syls[i]);
    }
    console.log('looking for syllable pattern:', syls);
    // loop over the chains and build syllable map
    var syllable_map = []
    for (var i = 0; i < chains.length; i++) {
        var this_chain = chains[i];
        syllable_map.push(countSyllables(this_chain));
    }
    // perform chain sellection
    var haiku = selectChainsBySyllables(syls, chains, syllable_map);
    console.log('syllable generated chains:', haiku);
    if (haiku.length == syls.length) {
        return haiku;
    }   
    return -1; //["(╯°□°）╯︵ ┻━┻ <br/> (You didn't roll anything matching the set template)"]
}


function limit(i, max){
    if (i.length > max) {return i.splice(0, max);}
}


//
// generator post-proc (filtering / haiku etc)
//
function postProc(chains, config){
    console.log(config.syllables);
    //
    // return by syllable pattern
    if (config.syllables != '') {
        var result = -1;
        var loops = 0;
        while (result == -1 && loops < 10) {
            console.log(result);
            loops+=1
            result = filterBySyllables(config.syllables, chains, config.maxchains);
        }
        if (result == -1) { return ['failed to generate a haiku','roll again!']}
        return result;
    }
    
    // done.
    return limit(chains, config.maxchains);
}


//
// render / display
//
function renderOutput(output, config){
  // do selection & templating here
  return output
}
