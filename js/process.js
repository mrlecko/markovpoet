//
// native TTS (only works on Win Chrome!?)
//
function speakit(text){
	var msg = new SpeechSynthesisUtterance();
	var voices = window.speechSynthesis.getVoices();
	msg.voice = voices[10]; // Note: some voices don't support altering params
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
// __main__ for generating results
//
function run(sources, config){
	corpus = compileSources(sources, config);   	// build corpus
	chains = getMarkov(corpus, config);				// generate chains
	output = postProc(chains, config);				// post-process
	return renderOutput(output);					// display
} 


//
// compile and NLP pre-process all the sources
//		
function compileSources(sources, config){
	corpus = "";
	for (var i = 0; i < sources.length; i++) {
		// pre process the text
		t = NLPPreProcess(sources[i].text);
		// validate and add to the corpus
		if (t.length > 0){
			corpus += t;
		}
	}
	//console.log(corpus);
	return corpus;
}


//
// NLP PreProcessor
//	
function NLPPreProcess(text){
	/* 
	 * whole text
	 * 		normalize
	 * 			toLowercase()
	 * 
	 * single char filtering / mapping
	 * 		single character translations						
	 * 
	 * punctuation
	 * 		merge duplicated whitespace	(    !)
	 * 		merge duplicated punctuation (!!!)
	 * 		normalize grouped sentence terminators (!!??!)
	 * 
	 * multi-character regexp replacements
	 * 		contraction expansions
	 * 		general regexp replacements
	 * 
	 * segmentation
	 * 		sentence splitting
	 */
	
	// normalize 
	text = text.toLowerCase();
	text = text.replace(/[^a-zA-Z\s0-9,\.\?\!]/g, ''); // character filter
	
	// single char fixes
	text = text.replace(/\n/g,'.');				// \n > .
	text = text.replace(/\r/g,'.');				// \r > .
	
	// punctuation fixes
	text = text.replace(/[\.\!\?]+/g,'.');		// merge terminaters
	
	// multi-char fixes
	text = text.replace(/\s+/g,' ');			// merge whitespace
	
	// segmentation fixes
	
	// any additional rules
	text = text.trim(); 						// trim it
	if (text.charAt(text.length-1) != '.') {	// add a . to the end
		text += '.';
	}	
	
	return text
}

//
// Count syllables in a sequence of text
//
function countSyllables(text){
	words = text.split(/[\.\!\?, ]+/g);
	sylcount = 0;
	for (var w = 0; w < words.length; w++) {
		sylcount += (count_syllables(words[w])[0]); //0=min syls, 1=max syls
	}
	return sylcount;
}


//
// Pick random chains matching a syllable sequence
//
function selectChainsBySyllables(syls, chains, syllable_map){
	console.log('selecting chains by', syls);
	console.log('syllable_map:', syllable_map);
	result = [];
	for (var i = 0; i < syls.length; i++) {
		tmp = [];
		this_syl = syls[i];
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
// generator post-proc (filtering / haiku etc)
//
function postProc(chains, config){
	console.log(config.syllables);
	//
	// return by syllable pattern
	if (config.syllables != '') {
		syls = config.syllables.split(',');
		for (var i = 0; i < syls.length; i++) {
			syls[i] = parseInt(syls[i]);
		}
		console.log('looking for syllable pattern:', syls);
		// loop over the chains and build syllable map
		syllable_map = []
		for (var i = 0; i < chains.length; i++) {
			this_chain = chains[i];
			syllable_map.push(countSyllables(this_chain));
		}
		// perform chain sellection
		haiku = selectChainsBySyllables(syls, chains, syllable_map);
		console.log('syllable generated chains:', haiku);
		if (haiku.length == syls.length) {
			return haiku;
		}
	}
	
	if (chains.length > config.maxchains) {
		chains = chains.splice(0,config.maxchains);
	}
	
	// done.
	return chains;
}


//
// render / display
//
function renderOutput(output, config){
  // do selection & templating here
  return output
}
