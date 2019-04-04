import corpusPath from './corpus.txt'

if(typeof(String.prototype.trim) === "undefined") {
  String.prototype.trim = function() {
    return String(this).replace(/^\s+|\s+$/g, '');
  };
}

function flickerThroughAllMessages(lines) {

}

document.addEventListener("DOMContentLoaded", function() {
  let needle = "";
  let lines = [];
  let matchLineIndices = [];
  let matchIdx = 0;
  // array of positions -> maps of letters -> arrays of line indices
  let letterMap = [];

  document.getElementById('msgDiv').innerHTML = 'Loading.................'

  document.addEventListener('click', () => {
    function myPCMSource() {  
      return ;   // For example, generate noise samples.
    }

    let audioContext;
    try {
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContext = new AudioContext();
    } catch(e) {
      alert('Web Audio API is not supported in this browser');
    }

    const bufferSize = 4096;
    const myPCMProcessingNode = audioContext.createScriptProcessor(bufferSize, 1, 1);

    myPCMProcessingNode.onaudioprocess = function(e) {
      const output = e.outputBuffer.getChannelData(0);
      for (var i = 0; i < bufferSize; i++) {
        // Generate and copy over PCM samples.
        output[i] = Math.random() * 2 - 1;
      }
    }

    myPCMProcessingNode.connect(audioContext.destination);
  });

  document.addEventListener('keydown', (e) => {
    if (e.keyCode == 8) {
      needle = needle.substring(0, needle.length - 1);
    } else {

    // if (
    //     (e.keycode > 47 && e.keycode < 58)   || // number keys
    //     e.keycode == 32 || e.keycode == 13   || // spacebar & return key(s) (if you want to allow carriage returns)
    //     (e.keycode > 64 && e.keycode < 91)   || // letter keys
    //     (e.keycode > 95 && e.keycode < 112)  || // numpad keys
    //     (e.keycode > 185 && e.keycode < 193) || // ;=,-./` (in order)
    //     (e.keycode > 218 && e.keycode < 223)) {
      needle += e.key;
    }

    console.log('needle before', needle);
    let needleWords = needle.split(' ');
    let candidateLineIndices = [];

    needleWords.forEach(word => {
      [...word].forEach((char, charIndex) => {
        candidateLineIndices = candidateLineIndices.concat(letterMap[charIndex][char]);
      });

      // if (candidateLineIndices.length > 0) {
      //   candidateLineIndices = candidateLineIndices.reduce((a, b) => {
      //     return a.filter(value => b.includes(value))
      //   });
      // }
    })

    candidateLineIndices = candidateLineIndices.filter((v, i, a) => a.indexOf(v) === i); 

    console.log(candidateLineIndices);

    const pattern = `.+${needle}.+`
    const re = new RegExp(pattern, 'g')

    matchLineIndices = [];
    let line = ''
    matchIdx = 0;
    candidateLineIndices.forEach(lineIndex => {
      

      line = lines[lineIndex];
      if(line.match(re)) {

        matchLineIndices.push(lineIndex);
      }
    });

    console.log("needle = ", needle);
  });

  fetch(corpusPath).then((res) => res.text()).then(data => {
    console.log('parsing.....');

    lines = data.split('\n');

    lines.forEach((line, lineIndex) => {
      let words = line.split(' ');
      words.forEach(word => {
        [...word].forEach((char, charIndex) => {
          if (typeof letterMap[charIndex] == 'undefined') {
            letterMap[charIndex] = {};
          }
          
          if (typeof letterMap[charIndex][char] == 'undefined') {
            letterMap[charIndex][char] = [];
          }


          letterMap[charIndex][char].push(lineIndex);
        });
      });
    });

    document.getElementById('msgDiv').innerHTML = 'Searching............................'

    let lineIdx = 0;
    let skipFrameCounter = 0;
    function showMessages() {
      if(skipFrameCounter % 3 == 0) {      
        let msg = '';

        if(needle == '') {
          // loop through all messages, sometimes slowing down
          msg = lines[lineIdx];
          lineIdx = (lineIdx + 1 == lines.length)? 0 : lineIdx + 1;
        } else {
          // show matching messages, visually aligning needle
          msg = lines[matchLineIndices[matchIdx]];
          matchIdx = (matchIdx + 1 == matchLineIndices.length)? 0 : matchIdx + 1;
          msg = msg.trim();

          const needleSubIndex = msg.indexOf(needle);

          // console.log('needleSubIndex', needleSubIndex);
          // FIXME
          // FIXME
          // FIXME
          // FIXME
          // FIXME
          // FIXME
          // FIXME
          // a very huge width on the body makes the div centered on that 
          // huge div................ which does not work.
          // make the div align on 0......... and the width be huge still.........
          // set the big width on the div, not the body...........????????
          const singleCharOffsetPx = 60;
          const offsetFromLeft = 600;
          document.getElementById('msgDiv').style.left = `${
            0 - (singleCharOffsetPx*needleSubIndex) + offsetFromLeft
          }px`;
        }

        document.getElementById('msgDiv').innerHTML = msg;
      }

      skipFrameCounter++;
      // TODO slow down randomly from time to time
      window.requestAnimationFrame(showMessages);
    }

    window.requestAnimationFrame(showMessages);
  });
});
