const quizData = {
  scales: {
    "C": ["C", "D", "E", "F", "G", "A", "B"],
    "G": ["G", "A", "B", "C", "D", "E", "F#"],
    "D": ["D", "E", "F#", "G", "A", "B", "C#"],
    "A": ["A", "B", "C#", "D", "E", "F#", "G#"],
    "E": ["E", "F#", "G#", "A", "B", "C#", "D#"],
    "B": ["B", "C#", "D#", "E", "F#", "G#", "A#"],
    "F#": ["F#", "G#", "A#", "B", "C#", "D#", "E#"],
    "F": ["F", "G", "A", "Bb", "C", "D", "E"],
    "Bb": ["Bb", "C", "D", "Eb", "F", "G", "A"],
    "Eb": ["Eb", "F", "G", "Ab", "Bb", "C", "D"],
    "Ab": ["Ab", "Bb", "C", "Db", "Eb", "F", "G"]
  },
  alteredIntervals: {
    "C": { "2b": "Db", "3b": "Eb", "4+": "F#", "5+": "G#", "6b": "Ab", "7b": "Bb" },
    "D": { "2b": "Eb", "3b": "F", "4+": "G#", "5+": "A#", "6b": "Bb", "7b": "C" },
    "E": { "2b": "F", "3b": "G", "4+": "A#", "5+": "C", "6b": "C#", "7b": "D" },
    "F": { "2b": "Gb", "3b": "Ab", "4+": "B", "5+": "C#", "6b": "Db", "7b": "Eb" },
    "G": { "2b": "Ab", "3b": "Bb", "4+": "C#", "5+": "D#", "6b": "Eb", "7b": "F" }
  }
};

let questionSet = [];
let currentQuestion = 0;
let correctCount = 0;
let incorrectCount = 0;

function pickRandom(arr, count, exclude = []) {
  const filtered = arr.filter(n => !exclude.includes(n));
  const result = [];
  while (result.length < count && filtered.length > 0) {
    const rand = filtered.splice(Math.floor(Math.random() * filtered.length), 1)[0];
    result.push(rand);
  }
  return result;
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function generateDegreeQuestion() {
  const keys = Object.keys(quizData.scales);
  const key = keys[Math.floor(Math.random() * keys.length)];
  const degreeIndex = Math.floor(Math.random() * 7);
  const correct = quizData.scales[key][degreeIndex];
  const allNotes = Array.from(new Set(Object.values(quizData.scales).flat()));
  const options = shuffle([correct, ...pickRandom(allNotes, 3, [correct])]);

  return {
    question: `Qual è il ${degreeIndex + 1}° grado della scala di ${key}?`,
    options,
    answer: correct,
    explanation: `Il ${degreeIndex + 1}° grado della scala di ${key} è ${correct}.`
  };
}

function generateIntervalQuestion() {
  const keys = Object.keys(quizData.alteredIntervals);
  const key = keys[Math.floor(Math.random() * keys.length)];
  const intervals = Object.keys(quizData.alteredIntervals[key]);
  const interval = intervals[Math.floor(Math.random() * intervals.length)];
  const correct = quizData.alteredIntervals[key][interval];
  const allNotes = Array.from(new Set(Object.values(quizData.scales).flat()));
  const options = shuffle([correct, ...pickRandom(allNotes, 3, [correct])]);

  return {
    question: `Qual è l’intervallo ${interval} partendo da ${key}?`,
    options,
    answer: correct,
    explanation: `L’intervallo ${interval} da ${key} è ${correct}.`
  };
}

function generateQuestionSet(n = 30) {
  const set = [];
  for (let i = 0; i < n; i++) {
    const q = Math.random() < 0.5 ? generateDegreeQuestion() : generateIntervalQuestion();
    set.push(q);
  }
  return set;
}

function startQuiz() {
  questionSet = generateQuestionSet();
  currentQuestion = 0;
  correctCount = 0;
  incorrectCount = 0;
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("quiz-card").style.display = "block";
  document.getElementById("end-screen").style.display = "none";
  renderQuiz();
}

function endQuiz() {
  document.getElementById("quiz-card").style.display = "none";
  const final = document.getElementById("end-screen");
  final.style.display = "block";
  final.innerHTML = `
    <h2>🎉 Quiz completato!</h2>
    <p>✅ Corrette: ${correctCount}</p>
    <p>❌ Errate: ${incorrectCount}</p>
    <button onclick="restartQuiz()">Ricomincia</button>
  `;
}

function restartQuiz() {
  document.getElementById("end-screen").style.display = "none";
  document.getElementById("start-screen").style.display = "block";
}

function renderQuiz() {
  if (currentQuestion >= questionSet.length) {
    endQuiz();
    return;
  }

  const container = document.getElementById("quiz-container");
  container.innerHTML = "";
  document.getElementById("stats").textContent =
    `Domanda ${currentQuestion + 1}/${questionSet.length} | ✅ ${correctCount} | ❌ ${incorrectCount}`;

  const q = questionSet[currentQuestion];
  const qEl = document.createElement("h2");
  qEl.textContent = q.question;
  container.appendChild(qEl);

  q.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.onclick = () => {
      if (opt === q.answer) {
        btn.classList.add("correct");
        correctCount++;
        setTimeout(() => {
          currentQuestion++;
          renderQuiz();
        }, 1000);
      } else {
        btn.classList.add("incorrect");
        incorrectCount++;
        alert(`❌ Sbagliato! ${q.explanation}`);
        setTimeout(() => {
          currentQuestion++;
          renderQuiz();
        }, 1000);
      }
    };
    container.appendChild(btn);
  });
}

window.onload = () => {
  const statsDiv = document.createElement("div");
  statsDiv.id = "stats";
  statsDiv.style.marginBottom = "20px";
  document.getElementById("quiz-card").prepend(statsDiv);
  document.getElementById("quiz-card").style.display = "none";
  document.getElementById("end-screen").style.display = "none";
};
