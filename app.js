// ===============================
// STUDYMATE SUBJECTS
// ===============================

const subjects = [
  {name:"C Programming",icon:"💻",detail:"Basics, loops and arrays"},
  {name:"C++",icon:"⚙️",detail:"OOP and data structures"},
  {name:"Mathematics",icon:"📐",detail:"Practice and concepts"},
  {name:"Computer Networks",icon:"🌐",detail:"Networking fundamentals"},
  {name:"English",icon:"📚",detail:"Grammar and communication"}
];

// ===============================
// MCQ QUESTIONS
// ===============================

const questions = [
 {
  q:"Which language is commonly used to teach structured programming?",
  o:["C","HTML","CSS","SQL"],
  a:0,
  why:"C is a general-purpose procedural language."
 },
 {
  q:"Which data structure follows FIFO?",
  o:["Stack","Queue","Tree","Graph"],
  a:1,
  why:"A queue follows First In, First Out."
 },
 {
  q:"What does CPU stand for?",
  o:[
    "Central Processing Unit",
    "Computer Personal Unit",
    "Core Program Utility",
    "Central Print Unit"
  ],
  a:0,
  why:"CPU stands for Central Processing Unit."
 }
];

const $ = id => document.getElementById(id);

let qIndex = 0;
let score = 0;
let answered = false;

// ===============================
// SUBJECTS
// ===============================

function renderSubjects() {
  $("subjectGrid").innerHTML = subjects.map(s => `
    <article class="subject">
      <div class="emoji">${s.icon}</div>
      <h3>${s.name}</h3>
      <p>${s.detail}</p>
    </article>
  `).join("");
}

// ===============================
// MCQ TEST
// ===============================

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

  $("options").innerHTML = q.o.map((v,i) => `
    <button class="option" data-i="${i}">
      ${String.fromCharCode(65+i)}. ${v}
    </button>
  `).join("");

  document.querySelectorAll(".option").forEach(b => {
    b.addEventListener("click", () =>
      choose(Number(b.dataset.i))
    );
  });
}

function choose(i) {

  if (answered) return;

  answered = true;

  const q = questions[qIndex];

  document.querySelectorAll(".option").forEach((b,n) => {

    b.disabled = true;

    if (n === q.a) b.classList.add("correct");

    if (n === i && i !== q.a) {
      b.classList.add("wrong");
    }

  });

  if (i === q.a) {

    score++;

    $("feedback").textContent = "Correct! " + q.why;

    $("feedback").style.color = "#18834e";

  } else {

    $("feedback").textContent = "Not quite. " + q.why;

    $("feedback").style.color = "#b34a4a";

  }

  $("nextBtn").disabled = false;
}

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
    `Quiz completed! Your score: ${score}/${questions.length}`
  );

  qIndex = 0;
  score = 0;

  renderQuestion();
}

$("nextBtn").addEventListener("click", () => {

  if (!answered) return;

  if (qIndex < questions.length - 1) {

    qIndex++;

    renderQuestion();

  } else {

    finish();

  }

});

// ===============================
// PROGRESS TRACKING
// ===============================

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

$("resetProgress").addEventListener("click", () => {

  if (confirm("Clear progress saved in this browser?")) {

    localStorage.removeItem("studymateProgress");

    updateProgress();

  }

});

// ===============================
// LANGUAGE SWITCH
// ===============================

let hindi = false;

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

// =================================================
// STUDYMATE GOOGLE SHEETS BACKEND
// =================================================

const NOTES_API_URL =
"https://script.google.com/macros/s/AKfycbzqM5ucgZUddKAUw1p7cks8l6j5UPFMsenvyriV_ZJ3-8idBpfKXlqnmHHMx3jZLEpQdg/exec";

let allNotes = [];

// ===============================
// NOTES TOOLBAR
// ===============================

function createNotesToolbar() {

  const list = $("notesList");

  if (!list) return;

  const toolbar = document.createElement("div");

  toolbar.style.cssText = `
    display:flex;
    gap:10px;
    flex-wrap:wrap;
    margin:18px 0;
  `;

  const filter = document.createElement("select");

  filter.id = "notesFilter";

  filter.style.cssText = `
    padding:12px;
    border:1px solid #1769d2;
    border-radius:8px;
    font-size:14px;
    flex:1;
    min-width:150px;
  `;

  filter.innerHTML = `
    <option value="All">All Subjects</option>
    ${subjects.map(s =>
      `<option value="${s.name}">${s.name}</option>`
    ).join("")}
  `;

  filter.addEventListener("change", renderNotes);

  const refresh = document.createElement("button");

  refresh.id = "refreshNotes";

  refresh.textContent = "↻ Refresh Notes";

  refresh.style.cssText = `
    background:#1769d2;
    color:white;
    border:none;
    border-radius:8px;
    padding:12px 18px;
    cursor:pointer;
  `;

  refresh.addEventListener("click", loadNotes);

  toolbar.append(filter, refresh);

  list.parentNode.insertBefore(toolbar, list);

}

// ===============================
// GOOGLE DRIVE PDF LINKS
// ===============================

function getPDFLinks(link) {

  const match = link.match(
    /\/file\/d\/([^/?]+)|[?&]id=([^&]+)/
  );

  if (match) {

    const id = match[1] || match[2];

    return {
      view: `https://drive.google.com/file/d/${id}/preview`,
      download: `https://drive.google.com/uc?export=download&id=${id}`
    };

  }

  return {
    view: link,
    download: link
  };

}

// ===============================
// DISPLAY NOTES
// ===============================

function renderNotes() {

  const list = $("notesList");

  const filter = $("notesFilter");

  if (!list) return;

  const selected = filter ? filter.value : "All";

  const filtered = allNotes.filter(note => {

    return selected === "All" ||
      String(note.Subject || "").trim().toLowerCase() ===
      selected.toLowerCase();

  });

  list.replaceChildren();

  if (filtered.length === 0) {

    const empty = document.createElement("div");

    empty.className = "empty";

    empty.textContent = allNotes.length === 0
      ? "No published notes available yet."
      : "No notes found for this subject.";

    list.appendChild(empty);

    return;

  }

  filtered.forEach(note => {

    const card = document.createElement("article");

    card.className = "note-card";

    card.style.cssText = `
      background:white;
      border:1px solid #dce5f0;
      border-radius:14px;
      padding:18px;
      margin-bottom:14px;
      box-shadow:0 3px 12px rgba(0,0,0,0.04);
    `;

    const title = document.createElement("h3");

    title.textContent = note.Title || "Study Notes";

    const subject = document.createElement("p");

    subject.textContent = "📚 " + (note.Subject || "General");

    subject.style.color = "#1769d2";

    const description = document.createElement("p");

    description.textContent =
      note.Description || "Study material";

    const date = document.createElement("small");

    date.textContent =
      "Uploaded: " + (note.Upload_Date || "Recently");

    const links = getPDFLinks(
      String(note.PDF_Link || "").trim()
    );

    const buttons = document.createElement("div");

    buttons.style.cssText = `
      display:flex;
      gap:10px;
      flex-wrap:wrap;
      margin-top:14px;
    `;

    if (links.view && links.view.startsWith("https://")) {

      const view = document.createElement("a");

      view.href = links.view;

      view.target = "_blank";

      view.rel = "noopener noreferrer";

      view.textContent = "📖 View PDF";

      view.style.cssText = `
        background:#1769d2;
        color:white;
        padding:10px 16px;
        border-radius:7px;
        text-decoration:none;
      `;

      buttons.appendChild(view);

      const download = document.createElement("a");

      download.href = links.download;

      download.target = "_blank";

      download.rel = "noopener noreferrer";

      download.textContent = "⬇ Download PDF";

      download.style.cssText = `
        background:#eaf2ff;
        color:#1769d2;
        padding:10px 16px;
        border-radius:7px;
        text-decoration:none;
      `;

      buttons.appendChild(download);

    } else {

      const warning = document.createElement("p");

      warning.textContent = "PDF link is unavailable.";

      buttons.appendChild(warning);

    }

    card.append(
      title,
      subject,
      description,
      date,
      buttons
    );

    list.appendChild(card);

  });

}

// ===============================
// LOAD NOTES FROM GOOGLE SHEETS
// ===============================

function loadNotes() {

  const list = $("notesList");

  const refresh = $("refreshNotes");

  if (!list) return;

  if (refresh) {

    refresh.disabled = true;

    refresh.textContent = "Loading...";

  }

  list.innerHTML =
    '<div class="empty">Loading StudyMate notes...</div>';

  const oldScript = document.getElementById("notesApiScript");

  if (oldScript) oldScript.remove();

  const callbackName = "StudyMateNotesCallback";

  let completed = false;

  function cleanup() {

    const script = document.getElementById("notesApiScript");

    if (script) script.remove();

    delete window[callbackName];

    if (refresh) {

      refresh.disabled = false;

      refresh.textContent = "↻ Refresh Notes";

    }

  }

  function showError(message) {

    list.innerHTML = "";

    const error = document.createElement("div");

    error.className = "empty";

    error.textContent = message;

    list.appendChild(error);

  }

  window[callbackName] = function(data) {

    if (completed) return;

    completed = true;

    cleanup();

    if (!data || data.success !== true) {

      showError("Unable to load notes. Please try again.");

      return;

    }

    allNotes = Array.isArray(data.notes)
      ? data.notes
      : [];

    renderNotes();

  };

  const script = document.createElement("script");

  script.id = "notesApiScript";

  script.src =
    NOTES_API_URL +
    "?callback=" + callbackName +
    "&_=" + Date.now();

  script.onerror = function() {

    if (completed) return;

    completed = true;

    cleanup();

    showError(
      "Connection error. Please check your internet and refresh notes."
    );

  };

  document.body.appendChild(script);

  setTimeout(() => {

    if (completed) return;

    completed = true;

    cleanup();

    showError(
      "Notes are taking too long to load. Please try again."
    );

  }, 20000);

}

// ===============================
// START STUDYMATE
// ===============================

renderSubjects();

renderQuestion();

updateProgress();

createNotesToolbar();

loadNotes();
