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
      needle += e.key;
    }

    const pattern = `.+${needle}.+`
    const re = new RegExp(pattern, 'g')

    matchLineIndices = [];
    let line = ''
    matchIdx = 0;
    lines.forEach((line, idx) => {
      line = lines[idx];
      if(line.match(re)) {
        matchLineIndices.push(idx);
      }
    });

    console.log(needle);
  });

  fetch(corpusPath).then((res) => res.text()).then(data => {
    document.getElementById('msgDiv').innerHTML = 'Searching............................'

    lines = data.split('\n');

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
