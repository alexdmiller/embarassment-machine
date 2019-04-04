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
  let letterMap = {};

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

    var oscillator = audioContext.createOscillator();
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(3000, audioContext.currentTime); // value in hertz
    oscillator.connect(audioContext.destination);
    oscillator.start();

    setInterval(() => {
      oscillator.frequency.setValueAtTime(matchLineIndices.length, audioContext.currentTime); // value in hertz
    }, 100);

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
 
    let needleWords = needle.split(' ');
    let candidateLineIndices = [];

    needleWords.forEach(word => {
      var prefix = word.substring(0, 3);
      if(typeof letterMap[prefix] !== 'undefined') {
        candidateLineIndices = candidateLineIndices.concat(letterMap[prefix]);
      }

      // if (candidateLineIndices.length > 0) {
      //   candidateLineIndices = candidateLineIndices.reduce((a, b) => {
      //     return a.filter(value => b.includes(value))
      //   });
      // }
    })

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

    // no matches? reset needle to nothing.
    if(matchLineIndices.length === 0) {
      needle = '';
    }
  });

  fetch(corpusPath).then((res) => res.text()).then(data => {
    lines = data.split('\n');

    lines.forEach((line, lineIndex) => {
      let words = line.split(' ');
      words.forEach(word => {
        for (var windowSize = 1; windowSize <= 3; windowSize++) {
          for (var i = 0; i < (word.length - (windowSize - 1)); i++) {
            const prefix = word.substring(0, i);

            if (typeof letterMap[prefix] == 'undefined') {
              letterMap[prefix] = {};
            }

            letterMap[prefix][lineIndex] = true;
          }
        }
      });
    });

    Object.keys(letterMap).forEach(prefix => {
      letterMap[prefix] = Object.keys(letterMap[prefix]).map(str => parseInt(str));
    });

    document.getElementById('msgDiv').innerHTML = 'Searching............................'

    let lineIdx = 0;
    let skipFrameCounter = 0;
    function showMessages() {
      if(skipFrameCounter % 1 == 0) {      
        let msg = '';

        if(needle == '') {
          // loop through all messages, sometimes slowing down

          msg = lines[lineIdx];
          lineIdx = (lineIdx + 1 == lines.length)? 0 : lineIdx + 1;
        } else {
          
          // show matching messages, visually aligning needle
          var lineIndex = matchLineIndices[matchIdx % matchLineIndices.length];

          msg = lines[lineIndex];
          // matchIdx = (matchIdx + 1 == matchLineIndices.length)? 0 : matchIdx + 1;
          msg = msg.trim();
          matchIdx++;

          const needleSubIndex = msg.indexOf(needle);

          const singleCharOffsetPx = 60;
          const offsetFromLeft = 600;
          document.getElementById('msgDiv').style.left = `${
            0 - (singleCharOffsetPx*needleSubIndex) + offsetFromLeft
          }px`;
        }

        document.getElementById('msgDiv').innerHTML = msg.replace(/[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}]/ug, "<span class='emoji'>$&</span>");
      }

      skipFrameCounter++;
      // TODO slow down randomly from time to time
      window.requestAnimationFrame(showMessages);
    }

    window.requestAnimationFrame(showMessages);
  });
});
