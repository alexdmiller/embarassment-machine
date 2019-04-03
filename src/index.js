import corpusPath from './bigcorpus.txt'

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById('msg').innerHTML = 'Loading.................'

  fetch(corpusPath).then((res) => res.text()).then(data => {
    document.getElementById('msg').innerHTML = 'Searching............................'

    const needle = 'love';
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
  });
});