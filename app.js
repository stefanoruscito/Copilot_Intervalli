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
    // Puoi ampliare con altre tonalità
  }
};

let correctCount = 0;
let incorrectCount = 0;

function updateStats() {
  document.getElementById("stats").innerHTML = `✅ Corrette: ${correctCount} | ❌ Errate: ${incorrectCount}`;
}

function generateDegreeQuestion() {
  const keys = Object.keys(quizData.scales);
  const key = keys[Math.floor(Math.random() * keys.length)];
  const degreeIndex = Math.floor(Math.random() * 7);
  const correct = quizData.scales[key][degreeIndex];
  const allNotes = Array.from(new Set(Object.values(quizData.scales).flat()));
  const options = [correct];
  while (options.length < 4) {
    const rand = allNotes[Math.floor(Math.random() * allNotes.length)];
    if (!options.includes(rand)) options.push(rand);
  }
  options.sort(() => Math.random() - 0.5);

  return {
    question: `Qual è il ${degreeIndex + 1}° grado della scala di ${key}?`,
    options,
    answer: correct,
    explanation: `La ${degreeIndex + 1}ª nota della scala di ${key} è ${correct}.`
  };
}

function generateIntervalQuestion() {
  const keys = Object.keys(quizData.alteredIntervals);
  const key = keys[Math.floor(Math.random() * keys.length)];
  const intervals = Object.keys(quizData.alteredIntervals[key]);
  const interval = intervals[Math.floor(Math.random() * intervals.length)];
  const correct = quizData.alteredIntervals[key][interval];
  const allNotes = Array.from(new Set(Object.values(quizData.scales).flat()));
  const options = [correct];
  while (options.length < 4) {
    const rand = allNotes[Math.floor(Math.random() * allNotes.length)];
    if (!options.includes(rand)) options.push(rand);
  }
  options.sort(() => Math.random() - 0.5);

  return {
    question: `Qual è l’intervallo ${interval} partendo da ${key}?`,
    options,
    answer: correct,
    explanation: `L’intervallo ${interval} partendo da ${key} è ${correct}.`
  };
}

function generateQuestion() {
  const useDegree = Math.random() < 0.5;
  return useDegree ? generateDegreeQuestion() : generateIntervalQuestion();
}

function renderQuiz() {
  const container = document.getElementById("quiz-container");
  container.innerHTML = "";
  updateStats();

  const q = generateQuestion();
  const qEl = document.createElement("h2");
  qEl.textContent = q.question;
  container.appendChild(qEl);

  q.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.onclick = () => {
      if (opt === q.answer) {
        correctCount++;
        renderQuiz();
      } else {
        incorrectCount++;
        alert(`❌ Sbagliato! ${q.explanation}`);
        renderQuiz();
      }
    };
    container.appendChild(btn);
  });
}

document.getElementById("next-btn").onclick = renderQuiz;

window.onload = () => {
  const statsDiv = document.createElement("div");
  statsDiv.id = "stats";
  statsDiv.style.marginBottom = "20px";
  document.getElementById("quiz-card").prepend(statsDiv);
  renderQuiz();
};
