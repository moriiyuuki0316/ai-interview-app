let questionsData = {};
fetch('questions.json')
  .then(res => res.json())
  .then(data => { questionsData = data });

document.getElementById("ask-btn").addEventListener("click", () => {
  const category = document.getElementById("category").value;
  const questions = questionsData[category];
  const question = questions[Math.floor(Math.random() * questions.length)];

  document.getElementById("question-box").innerText = `💬 質問: ${question}`;
  document.getElementById("feedback").innerText = "";
  document.getElementById("result").innerText = "";

  // 質問を読み上げる
  const utter = new SpeechSynthesisUtterance(question);
  utter.lang = 'ja-JP';
  speechSynthesis.speak(utter);

  // 音声認識
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'ja-JP';
  recognition.continuous = false;
  recognition.interimResults = false;

  utter.onend = () => {
    recognition.start();
  };

  recognition.onresult = async (event) => {
    const transcript = event.results[0][0].transcript;
    document.getElementById("result").innerText = transcript;

    // OpenAI GPTフィードバックを取得（ここを後で有効化）
    const feedback = await getGPTFeedback(question, transcript);
    document.getElementById("feedback").innerText = feedback;
  };

  recognition.onerror = (e) => {
    alert("音声認識エラー: " + e.error);
  };
});

// GPTフィードバック（OpenAI API使用）
async function getGPTFeedback(question, answer) {
  const apiKey = 'YOUR_OPENAI_API_KEY'; // ← セキュアに管理すること
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        { role: "system", content: "あなたは就活面接官です。学生の回答に対して丁寧にフィードバックを返します。" },
        { role: "user", content: `質問: ${question}\n回答: ${answer}\nフィードバックをお願いします。` }
      ]
    })
  });

  const data = await response.json();
  return data.choices[0].message.content;
}
