// 現在時刻の表示
function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  document.getElementById('clock').textContent = h + ':' + m + ':' + s;
}

setInterval(updateClock, 1000);
updateClock();

// アラーム管理
let alarmTime = null;
let alarmAudio = null;
let ringing = false;

const alarmInput = document.getElementById('alarm-time');
const setBtn = document.getElementById('set-btn');
const clearBtn = document.getElementById('clear-btn');
const status = document.getElementById('status');

// アラーム音を生成（Web Audio API）
function createBeep() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(880, ctx.currentTime);
  gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.8);
}

function startRinging() {
  ringing = true;
  status.textContent = '🔔 アラーム！タップして止める';
  status.className = 'status ringing';

  let count = 0;
  alarmAudio = setInterval(() => {
    createBeep();
    count++;
    if (count >= 10) stopRinging();
  }, 900);
}

function stopRinging() {
  ringing = false;
  clearInterval(alarmAudio);
  alarmAudio = null;
  alarmTime = null;
  alarmInput.value = '';
  status.textContent = 'アラームが設定されていません';
  status.className = 'status';
}

// アラームのセット
setBtn.addEventListener('click', () => {
  const val = alarmInput.value;
  if (!val) {
    status.textContent = '時刻を選択してください';
    return;
  }
  alarmTime = val;
  status.textContent = alarmTime + ' にアラームをセットしました';
  status.className = 'status active';
});

// アラームのクリア
clearBtn.addEventListener('click', () => {
  if (ringing) stopRinging();
  alarmTime = null;
  alarmInput.value = '';
  status.textContent = 'アラームが設定されていません';
  status.className = 'status';
});

// アラームのクリック（鳴っているとき）
status.addEventListener('click', () => {
  if (ringing) stopRinging();
});

// アラームチェック（毎秒）
setInterval(() => {
  if (!alarmTime || ringing) return;
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const current = h + ':' + m;
  if (current === alarmTime && now.getSeconds() === 0) {
    startRinging();
  }
}, 1000);
