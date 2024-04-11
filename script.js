const length = {
  2: 7,
  3: 5,
  4: 4,
  5: 3,
  6: 3,
  7: 3,
  8: 3,
  9: 3,
  10: 2,
  11: 2,
  12: 2,
  13: 2,
  14: 2,
  15: 2,
  16: 2
};

let minutes = 0, seconds = 0;
let temp;
let sumSeconds = 0;
let startedTime;
let radix, len;

setRadix(2);
render();

$plus10m.addEventListener('click', () => {
  add(10, 0);
});

$plus1m.addEventListener('click', () => {
  add(1, 0);
});

$plus10s.addEventListener('click', () => {
  add(0, 10);
});

$reset.addEventListener('click', () => {
  minutes = seconds = 0;
  render();
});

$start.addEventListener('click', () => {
  startTimer();
});

function setRadix(r) {
  radix = r;
  len = length[r];
  $screen.classList.remove('digit2', 'digit3', 'digit4-');
  $screen.classList.add(len == 2 ? 'digit2' : len == 3 ? 'digit3' : 'digit4-');
}

function add(m, s) {
  m += minutes, s += seconds;
  seconds = s >= 60 ? 0 : s;
  minutes = m >= 100 ? 0 : m;
  render();
}

function render() {
  $minutes.innerHTML = str2char(pad(minutes, len));
  $seconds.innerHTML = str2char(pad(seconds, len));
}

function str2char(s) {
  return [...s].map(v => `<span>${v}</span>`).join('');
}

function pad(n, len) {
  return n.toString(radix).padStart(len, '0');
}

function startTimer() {
  $plus10m.disabled =
    $plus1m.disabled =
    $plus10s.disabled = true;
  $start.value = 'ストップ';
  sumSeconds = minutes * 60 + seconds;
  temp = [minutes, seconds];
  startedTime = performance.now();
  frame();
}

function frame() {
  const remaining = sumSeconds - (performance.now() - startedTime) / 1000;
  if(remaining >= 0) {
    minutes = remaining / 60 | 0;
    seconds = remaining % 60 | 0;
    render();
    requestAnimationFrame(frame);
  } else {
    minutes = seconds = 0;
    render();
    finishTimer();
  }
}

function finishTimer() {
  
}
