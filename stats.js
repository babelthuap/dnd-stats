(() => {
  const memo = new Map();

  draw();
  window.addEventListener('resize', draw);
  dice.addEventListener('input', draw);
  dice.focus();

  function draw() {
    const diceValues =
        dice.value.split(/\D+/).map(x => parseInt(x)).filter(x => x);
    let start = performance.now();
    const stats = calcStats(...diceValues);
    console.log(performance.now() - start, 'ms');
    graph.innerHTML = '';
    const maxLabel = (stats.length - 1).toString().length;
    const maxValue = stats.reduce((a, b) => Math.max(a, b), stats[0]);
    const maxWidth = window.innerWidth * 5 / 6;
    const scale = maxWidth / maxValue;
    for (let i = 0; i < stats.length; i++) {
      if (stats[i] === 0) continue;
      const div = document.createElement('div');
      div.textContent = i.toString().padStart(maxLabel) + ' ';
      const bar = document.createElement('div');
      bar.textContent = stats[i];
      const len = stats[i] * scale;
      bar.style.width = `${Math.max(1, len)}px`;
      if (len < 1) {
        bar.style.opacity = len;
      }
      div.append(bar);
      graph.append(div);
    }
  }

  function calcStats(...dice) {
    if (dice.length < 1) {
      return [];
    }
    dice.sort((a, b) => a - b);
    const key = dice.join();
    if (memo.has(key)) {
      return memo.get(key);
    }
    if (dice.length === 1) {
      const out = new Array(dice[0] + 1).fill(1);
      out[0] = 0;
      return out;
    }
    const pivot = dice.length >> 1;
    const stats = mergeStats(
        calcStats(...dice.slice(0, pivot)), calcStats(...dice.slice(pivot)));
    memo.set(key, stats);
    return stats;
  }

  function mergeStats(statsA, statsB) {
    const out = new Array(statsA.length + statsB.length - 1).fill(0);
    for (let a = 0; a < statsA.length; a++) {
      for (let b = 0; b < statsB.length; b++) {
        out[a + b] += statsA[a] * statsB[b];
      }
    }
    return out;
  }
})();