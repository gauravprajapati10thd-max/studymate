
/* =========================================
   STUDYMATE - COMPLETE APP.JS
   ========================================= */

// 1. GOOGLE APPS SCRIPT BACKEND URL

const STUDYMATE_API =
"https://script.google.com/macros/s/AKfycbzqM5ucgZUddKAUw1p7cks8l6j5UPFMsenvyriV_ZJ3-8idBpfKXlqnmHHMx3jZLEpQdg/exec";

// 2. SUBJECTS

const subjects = [
  {
    name: "C Programming",
    icon: "💻",
    detail: "Basics, loops and arrays"
  },
  {
    name: "C++",
    icon: "⚙️",
    detail: "OOP and data structures"
  },
  {
    name: "Mathematics",
    icon: "📐",
    detail: "Practice and concepts"
  },
  {
    name: "Computer Networks",
    icon: "🌐",
    detail: "Networking fundamentals"
  },
  {
    name: "English",
    icon: "📚",
    detail: "Grammar and communication"
  }
];

// 3. MCQ QUESTIONS

const questions = [
  {
    q: "Which language is commonly used to teach structured programming?",
    o: ["C", "HTML", "CSS", "SQL"],
    a: 0,
    why: "C is a general-purpose procedural programming language."
  },
  {
    q: "Which data structure follows FIFO?",
    o: ["Stack", "Queue", "Tree", "Graph"],
    a: 1,
    why: "Queue follows First In, First Out."
  },
  {
    q: "What does CPU stand for?",
    o: [
      "Central Processing Unit",
      "Computer Personal Unit",
      "Core Program Utility",
      "Central Print Unit"
    ],
    a: 0,
    why: "CPU stands for Central Processing Unit."
  }
];

// 4. GLOBAL VARIABLES

const $ = id => document.getElementById(id);

let qIndex = 0;
let score = 0;
let answered = false;
let hindi = false;

// =========================================
// 5. DISPLAY SUBJECTS
// =========================================

function renderSubjects() {

  const grid = $("subjectGrid");

  if (!grid) return;

  grid.innerHTML = subjects.map(s => `
    <article class="subject">
      <div class="emoji">${s.icon}</div>
      <h3>${s.name}</h3>
      <p>${s.detail}</p>
    </article>
  `).join("");

  if ($("subjectsCount")) {
    $("subjectsCount").textContent = subjects.length;
  }
}

// =========================================
// 6. DISPLAY MCQ QUESTION
// =========================================

function renderQuestion() {

  const q = questions[qIndex];

  answered = false;

  $("quizSubject").textContent = "Computer Fundamentals";

  $("questionCount").textContent =
    `Question ${qIndex + 1} of ${questions.length}`;

  $("questionText").textContent = q.q;

  $("feedback").textContent = "";

  $("nextBtn").disabled = true;

  $("nextBtn").textContent =
    qIndex === questions.length - 1
      ? "Finish quiz"
      : "Next question";

  $("options").innerHTML = q.o.map((v, i) => `
    <button class="option" data-i="${i}">
      ${String.fromCharCode(65 + i)}. ${v}
    </button>
  `).join("");

  document.querySelectorAll(".option").forEach(button => {

    button.addEventListener("click", () => {
      choose(Number(button.dataset.i));
    });

  });
}

// =========================================
// 7. CHECK ANSWER
// =========================================

function choose(i) {

  if (answered) return;

  answered = true;

  const q = questions[qIndex];

  document.querySelectorAll(".option").forEach((button, n) => {

    button.disabled = true;

    if (n === q.a) {
      button.classList.add("correct");
    }

    if (n === i && i !== q.a) {
      button.classList.add("wrong");
    }

  });

  if (i === q.a) {

    score++;

    $("feedback").textContent =
      "Correct! " + q.why;

    $("feedback").style.color = "#18834e";

  } else {

    $("feedback").textContent =
      "Not quite. " + q.why;

    $("feedback").style.color = "#b34a4a";

  }

  $("nextBtn").disabled = false;
}

// =========================================
// 8. FINISH QUIZ
// =========================================

function finish() {

  let old = JSON.parse(
    localStorage.getItem("studymateProgress") ||
    '{"tests":0,"best":0}'
  );

  old.tests++;

  old.best = Math.max(
    old.best,
    Math.round(score / questions.length * 100)
  );

  localStorage.setItem(
    "studymateProgress",
    JSON.stringify(old)
  );

  updateProgress();

  alert(
    `Quiz completed! Your score: ${score}/${questions.length} (${Math.round(score / questions.length * 100)}%).`
  );

  qIndex = 0;
  score = 0;

  renderQuestion();
}

// =========================================
// 9. NEXT QUESTION
// =========================================

$("nextBtn").addEventListener("click", () => {

  if (!answered) return;

  if (qIndex < questions.length - 1) {

    qIndex++;

    renderQuestion();

  } else {

    finish();

  }

});

// =========================================
// 10. UPDATE PROGRESS
// =========================================

function updateProgress() {

  const p = JSON.parse(
    localStorage.getItem("studymateProgress") ||
    '{"tests":0,"best":0}'
  );

  $("testsTaken").textContent = p.tests;

  $("bestScore").textContent = p.best + "%";

  $("progressTests").textContent = p.tests;

  $("progressBest").textContent = p.best + "%";
}

// =========================================
// 11. RESET PROGRESS
// =========================================

$("resetProgress").addEventListener("click", () => {

  if (confirm("Clear progress saved in this browser?")) {

    localStorage.removeItem("studymateProgress");

    updateProgress();

  }

});

// =========================================
// 12. LANGUAGE SWITCH
// =========================================

$("langBtn").addEventListener("click", () => {

  hindi = !hindi;

  $("langBtn").textContent =
    hindi ? "English" : "हिंदी";

  $("heroTitle").innerHTML = hindi
    ? "बेहतर सीखें।<br><span>आगे बढ़ें।</span>"
    : "Learn better.<br><span>Achieve more.</span>";

  $("heroText").textContent = hindi
    ? "विषयवार नोट्स पढ़ें, MCQ का अभ्यास करें और अपनी प्रगति देखें।"
    : "Explore subject-wise notes, practise MCQs and track your learning progress.";

});

// =========================================
// 13. LOAD PUBLISHED NOTES FROM GOOGLE SHEETS
// =========================================

function loadStudyMateNotes() {

  const list = $("notesList");

  if (!list) return;

  list.textContent = "Loading published notes...";

  const callback =
    "studyMateCallback_" + Date.now();

  const script = document.createElement("script");

  let completed = false;

  const timeout = setTimeout(() => {

    if (completed) return;

    completed = true;

    delete window[callback];

    script.remove();

    list.textContent =
      "Server response timed out. Please refresh.";

  }, 15000);

  window[callback] = function(data) {

    if (completed) return;

    completed = true;

    clearTimeout(timeout);

    script.remove();

    delete window[callback];

    if (!data || data.success !== true) {

      list.textContent = "Unable to load notes.";

      return;
    }

    const notes = Array.isArray(data.notes)
      ? data.notes
      : [];

    list.innerHTML = "";

    if (notes.length === 0) {

      list.textContent =
        "No published notes available yet.";

      return;
    }

    notes.forEach(note => {

      const card = document.createElement("article");

      card.className = "note-card";

      const title = document.createElement("h3");

      title.textContent =
        note.Title || "Untitled Notes";

      const subject = document.createElement("p");

      subject.textContent =
        "Subject: " + (note.Subject || "General");

      const description = document.createElement("p");

      description.textContent =
        note.Description || "Study material";

      const date = document.createElement("p");

      date.textContent =
        note.Upload_Date || "";

      const link = document.createElement("a");

      const pdfURL = String(note.PDF_Link || "").trim();

      link.textContent = "📄 View PDF";

      link.className = "primary linkbtn";

      link.target = "_blank";

      link.rel = "noopener noreferrer";

      if (
        /^https:\/\/(drive|docs)\.google\.com\//i.test(pdfURL)
      ) {

        link.href = pdfURL;

      } else {

        link.textContent = "PDF unavailable";

      }

      card.appendChild(title);
      card.appendChild(subject);
      card.appendChild(description);
      card.appendChild(date);
      card.appendChild(link);

      list.appendChild(card);

    });

  };

  script.onerror = function() {

    if (completed) return;

    completed = true;

    clearTimeout(timeout);

    delete window[callback];

    script.remove();

    list.textContent =
      "Connection error. Please refresh the page.";

  };

  script.src =
    STUDYMATE_API +
    "?callback=" + encodeURIComponent(callback) +
    "&t=" + Date.now();

  document.body.appendChild(script);

}

// =========================================
// 14. START STUDYMATE
// =========================================

renderSubjects();

renderQuestion();

updateProgress();

loadStudyMateNotes();

console.log("StudyMate loaded successfully!");
