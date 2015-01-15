

/*
utils
 */

//
// native TTS
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
	window.speechSynthesis.speak(msg);		
}

//
// generator main func
//
function run(sources, config){
  // build corpus from all the preprocessed sources
  corpus = compileSources(sources, config);
  // generate the markov chains
  chains = getMarkov(corpus, config);
  // post process / filter / format the results
  output = postProc(chains, config);
  return renderOutput(output);
} 


//
// compile and preprocess all the sources
//		
function compileSources(sources, config){
  corpus = ""
  for (var i = 0; i < sources.length; i++) {
	corpus = corpus + ' ' + prepareSource(sources[i].text);
  }
  console.log(corpus);
  return corpus;
}


//
// ghetto regex preprocessing
//
function prepareSource(text){
	// blessed are the regexps
	
	// lowercase
	//text = text.toLowerCase();
	
	// Capitalize
	//text = text.replace(/^[a-z]/, function(m){ return m.toUpperCase() });
	
	// Newline > '.'
	text = text.replace(/\n/g,'.');
	text = text.replace(/\r/g,'.');
	
	// merge sentence terminators (!?.), otherwise they fux with sentence segmentation
	text = text.replace(/[\.\!\?]+/g,'.');
	
	// merge whitespace, because that fuxes with word segmentation
	text = text.replace(/\s+/g,' ');
	
	// filter charset
	text = text.replace(/[^a-zA-Z\s0-9,\.\?\!]/g, '');
	
	// check line breaks vs terminators
	
	// trim
	test = text.trim();
	
	// others...

	return text;
}


//
// generator post-proc (filtering / haiku etc)
//
function postProc(chains, config){

  //haiku
  if (config.haiku353 || config.haiku575) {
	haiku = [];
	if (config.haiku353) {
		syls = [3,5,3];
		} else if (config.haiku575){
		syls = [5,7,5];
	}
	
	// for each of the syllable patterns we need to find
	for (var s = 0; s < syls.length; s++) {
		find = syls[s];
		console.log('finding', find);
		// loop through the chains
		for (var i = 0; i < chains.length; i++) {
			this_chain = chains[i];
			console.log('this_chain:', this_chain);
			words = this_chain.split(' ');
			console.log(words);
			// and count syllables in each chain
			found = 0;
			for (var w = 0; w < words.length; w++) {
				found = found + count_syllables(words[w])[0];
			}
			// if the count matches (and we don't already have it), push it
			if ((found == find) && (this_chain != haiku[0])) {
				haiku.push(this_chain);
				break;
			}
			
		}
		
	}
	
	console.log('collected haiku:', haiku);
	if (haiku.length == 3) {
		return haiku;
	}
  }
  // maxchains
  console.log(chains.length, 'chains found');
  if (chains.length > config.maxchains) {
	console.log(chains.length, 'before slice');
	chains = chains.splice(0,config.maxchains);
	console.log(chains.length, 'after slice');
  }
  
  return chains;
}


//
// render / display
//
function renderOutput(output, config){
  // do selection & templating here
  return output
}

