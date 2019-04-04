import corpusPath from './bigcorpus.txt'

if(typeof(String.prototype.trim) === "undefined") {
  String.prototype.trim = function() {
    return String(this).replace(/^\s+|\s+$/g, '');
  };
}

function flickerThroughAllMessages(lines) {

}

document.addEventListener("DOMContentLoaded", function() {
  let needle = "love";
  let lines = [];

  document.getElementById('msg').innerHTML = 'Loading.................'

  document.addEventListener('click', () => {
    function myPCMSource() {  
      return    // For example, generate noise samples.
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

  fetch(corpusPath).then((res) => res.text()).then(data => {
    document.getElementById('msgDiv').innerHTML = 'Searching............................'

    const pattern = `.+${needle}.+`
    const re = new RegExp(pattern, 'g')

    lines = data.split('\n');

    const matchLineIndices = [];
    let line = ''
    lines.forEach((line, idx) => {
      line = data[idx];
      if(line.match(re)) {
        matchLineIndices.push(idx);
      }
    });


    let lineIdx = 0;
    let matchIdx = 0;
    let skipFrameCounter = 0;
    function showMessages() {
      if(skipFrameCounter % 3 == 0) {      
        let msg = '';

        if(needle == '') {
          // loop through all messages, sometimes slowing down
          msg = data[lineIdx];
          lineIdx = (lineIdx + 1 == data.length)? 0 : lineIdx + 1;
        } else {
          // show matching messages, visually aligning needle
          msg = data[matchLineIndices[matchIdx]];
          matchIdx = (matchIdx + 1 == matchLineIndices.length)? 0 : matchIdx + 1;
          msg = msg.trim();

          console.log('msg', msg);

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
          const offsetFromLeft = 700;
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
