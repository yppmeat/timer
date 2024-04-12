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
let startedTime = null;
let elapsedTime = null;
let radix, len;
let round = 0;

setRadix(2);
render();

$select.innerHTML = [...Array(15)].map((_, i) => {
  return /*html*/`
    <label>
      ${i + 2}進数
      <input type="radio" name="radix" value="${i + 2}" ${i == 0 ? 'checked' : ''}>
    </label>
  `
}).join('');

$screen.addEventListener('click', () => {
  $select.classList.add('show');
});

$select.querySelectorAll('label').forEach(v => {
  v.addEventListener('click', () => {
    setRadix(+v.querySelector('input').value);
    render();
    $select.classList.remove('show');
  });
});

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
  stopTimer();
  render();
});

$start.addEventListener('click', () => {
  startTimer();
});

function setRadix(r) {
  radix = r;
  len = length[r];
  $title.innerText = document.title = r + '進数タイマー';
  $plus10m.value = (10).toString(r).toUpperCase() + '分';
  $plus10s.value = (10).toString(r).toUpperCase() + '秒';
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
  if(startedTime) {
    if(round == 1) {
      elapsedTime = (performance.now() - startedTime);
      startedTime = null;
      $start.value = 'スタート';
      round = 3;
    } else if(round == 2) {
      stopTimer();
      render();
    }
    return;
  }
  if(round == 3) {
    startedTime = performance.now() - elapsedTime;
    $start.value = 'ストップ';
    round = 1;
    frame();
    return;
  }
  $plus10m.disabled =
    $plus1m.disabled =
    $plus10s.disabled = true;
  $start.value = 'ストップ';
  sumSeconds = minutes * 60 + seconds;
  temp = [minutes, seconds];
  startedTime = performance.now();
  round = 1;
  frame();
}

function frame() {
  if(!startedTime) return;
  const remaining = sumSeconds - (performance.now() - startedTime) / 1000;
  if(remaining >= 0) {
    minutes = remaining / 60 | 0;
    seconds = remaining % 60 | 0;
    render();
    requestAnimationFrame(frame);
  } else {
    minutes = seconds = 0;
    render();
    startedTime = performance.now();
    round = 2;
    finishTimer();
  }
}

function finishTimer() {
  if(!startedTime) {
    $screen.classList.remove('hide');
    return;
  }
  const show = (performance.now() - startedTime) / 500 % 2 | 0;
  $screen.classList.toggle('hide', !show);
  requestAnimationFrame(finishTimer);
}

function stopTimer() {
  if(!startedTime && round != 3) return;
  round = 0;
  $plus10m.disabled =
    $plus1m.disabled =
    $plus10s.disabled = false;
  $start.value = 'スタート';
  [minutes, seconds] = temp;
  startedTime = null;
}
