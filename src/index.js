import corpusPath from './bigcorpus.txt'

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
    document.getElementById('msg').innerHTML = 'Searching............................'

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
  });
});
