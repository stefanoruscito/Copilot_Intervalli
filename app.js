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
  intervals: {
    "C": {
      "3b": "Eb",
      "5+": "G#",
      "2b": "Db"
    },
    "D": {
      "3b": "F",
      "5+": "A#",
      "2b": "E♭"
    },
    // Puoi aggiungere altre tonalità qui
  }
};

let correctCount = 0;
let incorrectCount = 0;

function updateStats() {
  document.getElementById("stats").innerHTML = `
    ✅ Corrette: ${correctCount} | ❌ Errate: ${incorrectCount}
  `;
}

function generateQuestion() {
  const questionType = Math.random() < 0.7 ? "degree" : "interval";
  if (questionType === "degree") {
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
      answer: correct
    };
  } else {
    const keys = Object.keys(quizData.intervals);
    const key = keys[Math.floor(Math.random() * keys.length)];
    const intervalTypes = Object.keys(quizData.intervals[key]);
    const interval = intervalTypes[Math.floor(Math.random() * intervalTypes.length)];
    const correct = quizData.intervals[key][interval];
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
      answer: correct
    };
  }
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
        alert(`❌ Sbagliato! La risposta corretta era ${q.answer}`);
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
