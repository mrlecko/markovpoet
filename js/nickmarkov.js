/* 
    Nickys markov generator
                            */

// Take a block of text and produce a object
// containing the possible transition states
// for the words in the text.
function parse_text(text) {
  var result = {};
  
  // Cut the text into individual words...
  var stripped = text.split(" ");
  
  // Then split at the full stops. We will
  // use full stops to determine when to 
  // end a setence.
  for (i=0; i < stripped.length; i++) {
    stripped[i].split(".");
  }
  
  result[stripped[0]] = [stripped[1]];
  
  // For each word, build up a set of possible words
  // that can be transitioned to based on the text.
  for (i=1, lens = stripped.length; i < lens; i++) 
  {
    if (stripped[i] in result) {
      result[stripped[i]].push(stripped[i+1]);
    }
    else {
      result[stripped[i]] = [stripped[i+1]];
    }
  };
  
  // Return the transition states and the
  // starting word.
  return [result, stripped[0]];
};

// Take a parsed tree of probability states and 
// a starting word, and build a list of randomly
// generated sentences.
function generate_text(parsed_tree, start) {
  var output = "";
  var word = start;
  
  // Build a new sentence every time we hit the
  // end of the text or a full stop.
  while (word !== undefined && word !== ".") {
    output += word + " ";
    word = rand_array_pick(parsed_tree[word]);
  }
  
  // Cut the sentences up into an array.
  output = output.split(".");
  return output;
}

// Pick a random element value from an array.
function rand_array_pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
  
function getMarkov(input) {
  parsed = parse_text(input);
  output = generate_text(parsed[0], parsed[1]);
  console.log(output);
  return output;
}




