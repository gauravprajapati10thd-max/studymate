const subjects=[
  {name:"C Programming",icon:"💻",detail:"Basics, loops and arrays"},
  {name:"C++",icon:"⚙️",detail:"OOP and data structures"},
  {name:"Mathematics",icon:"📐",detail:"Practice and concepts"},
  {name:"Computer Networks",icon:"🌐",detail:"Networking fundamentals"},
  {name:"English",icon:"📚",detail:"Grammar and communication"}
];
const questions=[
 {q:"Which language is commonly used to teach structured programming?",o:["C","HTML","CSS","SQL"],a:0,why:"C is a general-purpose procedural language often used to teach structured programming."},
 {q:"Which data structure follows FIFO?",o:["Stack","Queue","Tree","Graph"],a:1,why:"A queue follows First In, First Out (FIFO)."},
 {q:"What does CPU stand for?",o:["Central Processing Unit","Computer Personal Unit","Core Program Utility","Central Print Unit"],a:0,why:"CPU stands for Central Processing Unit."}
];
const $=id=>document.getElementById(id);
let qIndex=0,score=0,answered=false;
function renderSubjects(){ $("subjectGrid").innerHTML=subjects.map(s=>`<article class="subject"><div class="emoji">${s.icon}</div><h3>${s.name}</h3><p>${s.detail}</p></article>`).join(""); }
function renderQuestion(){
 const q=questions[qIndex];answered=false;$("quizSubject").textContent="Computer Fundamentals";$("questionCount").textContent=`Question ${qIndex+1} of ${questions.length}`;$("questionText").textContent=q.q;$("feedback").textContent="";$("nextBtn").disabled=true;$("nextBtn").textContent=qIndex===questions.length-1?"Finish quiz":"Next question";
 $("options").innerHTML=q.o.map((v,i)=>`<button class="option" data-i="${i}">${String.fromCharCode(65+i)}. ${v}</button>`).join("");
 document.querySelectorAll(".option").forEach(b=>b.addEventListener("click",()=>choose(Number(b.dataset.i))));
}
function choose(i){if(answered)return;answered=true;const q=questions[qIndex];document.querySelectorAll(".option").forEach((b,n)=>{b.disabled=true;if(n===q.a)b.classList.add("correct");if(n===i&&i!==q.a)b.classList.add("wrong")});if(i===q.a){score++;$("feedback").textContent="Correct! "+q.why;$("feedback").style.color="#18834e"}else{$("feedback").textContent="Not quite. "+q.why;$("feedback").style.color="#b34a4a"}$("nextBtn").disabled=false;}
function finish(){let old=JSON.parse(localStorage.getItem("studymateProgress")||'{"tests":0,"best":0}');old.tests++;old.best=Math.max(old.best,Math.round(score/questions.length*100));localStorage.setItem("studymateProgress",JSON.stringify(old));updateProgress();alert(`Quiz completed! Your score: ${score}/${questions.length} (${Math.round(score/questions.length*100)}%).`);qIndex=0;score=0;renderQuestion();}
$("nextBtn").addEventListener("click",()=>{if(!answered)return;if(qIndex<questions.length-1){qIndex++;renderQuestion()}else finish()});
function updateProgress(){const p=JSON.parse(localStorage.getItem("studymateProgress")||'{"tests":0,"best":0}');$("testsTaken").textContent=p.tests;$("bestScore").textContent=p.best+"%";$("progressTests").textContent=p.tests;$("progressBest").textContent=p.best+"%";}
$("resetProgress").addEventListener("click",()=>{if(confirm("Clear progress saved in this browser?")){localStorage.removeItem("studymateProgress");updateProgress()}});
let hindi=false;$("langBtn").addEventListener("click",()=>{hindi=!hindi;$("langBtn").textContent=hindi?"English":"हिंदी";$("heroTitle").innerHTML=hindi?"बेहतर सीखें।<br><span>आगे बढ़ें।</span>":"Learn better.<br><span>Achieve more.</span>";$("heroText").textContent=hindi?"विषयवार नोट्स पढ़ें, MCQ का अभ्यास करें और अपनी प्रगति देखें।":"Explore subject-wise notes, practise MCQs and track your learning progress.";});
renderSubjects();renderQuestion();updateProgress();
