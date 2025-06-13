const startBtn = document.getElementById('start-btn');
const output = document.getElementById('output');

// 音声認識オブジェクトの生成
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

// 日本語設定
recognition.lang = 'ja-JP';
recognition.interimResults = false;

// ボタンクリックで音声認識開始
startBtn.onclick = () => {
  output.textContent = "🎙️ 話してください...";
  recognition.start();
};

// 音声認識の結果を取得
recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  output.textContent = `📝 認識結果: ${transcript}`;
};

// エラー処理
recognition.onerror = (event) => {
  output.textContent = `⚠️ エラー: ${event.error}`;
};
