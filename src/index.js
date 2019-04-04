import corpusPath from './bigcorpus.txt'

if(typeof(String.prototype.trim) === "undefined") {
  String.prototype.trim = function() {
    return String(this).replace(/^\s+|\s+$/g, '');
  };
}

function flickerThroughAllMessages(lines) {

}

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById('msgDiv').innerHTML = 'Loading.................'

  fetch(corpusPath).then((res) => res.text()).then(data => {
    document.getElementById('msgDiv').innerHTML = 'Searching............................'

    const needle = 'yeah';

    // TODO refactor this into separate function to go through
    // lines and find needle
    const pattern = `.+${needle}.+`
    const re = new RegExp(pattern, 'g')

    data = data.split('\n');

    const matchLineIndices = [];
    let line = ''
    data.forEach((line, idx) => {
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