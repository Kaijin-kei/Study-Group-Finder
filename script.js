const seed=[
{id:1,name:"Bio 101 survival club",subject:"Biology",description:"Lecture notes, diagrams, and making cell biology finally click.",style:"Talk it out",time:"Afternoon",location:"Main Library · Room 204",members:4,faces:["J","M","A","L"]},
{id:2,name:"Calc, coffee & calm",subject:"Calculus",description:"Problem sets one step at a time. No question is too small.",style:"Practice problems",time:"Evening",location:"North Café · Upstairs",members:3,faces:["S","K","D"]},
{id:3,name:"Quiet pages club",subject:"Literature",description:"A cozy, low-pressure spot to read, annotate, and write.",style:"Quiet focus",time:"Morning",location:"Arts Building · Study nook",members:5,faces:["R","E","T","B"]},
{id:4,name:"Stats without the stress",subject:"Statistics",description:"Practice questions and friendly explanations before quiz day.",style:"Practice problems",time:"Afternoon",location:"Science Hall · Room 18",members:3,faces:["N","P","C"]},
{id:5,name:"Design thinking lab",subject:"Design",description:"Bring a sketch, a half-formed idea, or just your curiosity.",style:"Study & chill",time:"Weekend",location:"Creative Hub · Studio B",members:4,faces:["A","F","I","M"]},
{id:6,name:"History heads",subject:"History",description:"Connect the dates, big ideas, and stories behind them.",style:"Talk it out",time:"Evening",location:"West Library · Group table",members:3,faces:["G","H","O"]}];let groups;try{groups=JSON.parse(localStorage.getItem("orbit-study-groups"))||seed}catch{groups=seed}const joined=new Set(),list=document.querySelector("#groups-list"),search=document.querySelector("#search"),style=document.querySelector("#style-filter"),time=document.querySelector("#time-filter"),panels=[...document.querySelectorAll("[data-panel]")],tasks=document.querySelector("#task-items"),menu=document.querySelector("#start-menu"),toast=document.querySelector("#toast");let z=3,timer;const colors=["#bf8a71","#8e9d83","#7e8baa","#b59b76"];function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}function say(s){toast.textContent=s;toast.classList.add("show");clearTimeout(timer);timer=setTimeout(()=>toast.classList.remove("show"),2200)}function render(){const q=search.value.toLowerCase().trim(),st=style.value,tm=time.value,found=groups.filter(g=>`${g.name} ${g.subject} ${g.description}`.toLowerCase().includes(q)&&(st==="all"||g.style===st)&&(tm==="all"||g.time===tm));document.querySelector("#count").textContent=`Showing ${found.length} ${found.length===1?"group":"groups"}`;document.querySelector("#empty").hidden=found.length>0;list.innerHTML=found.map(g=>`<article class="study-card"><div class="study-card-top"><span class="subject-tag">${esc(g.subject.toUpperCase())}</span><span class="member-count">${g.members} ${g.members===1?"member":"members"}</span></div><h3 title="${esc(g.name)}">${esc(g.name)}</h3><p>${esc(g.description)}</p><div class="study-meta"><span>◷ ${esc(g.time)}</span><span>⌖ ${esc(g.location)}</span></div><div class="study-card-bottom"><div class="study-avatars">${(g.faces||["Y"]).slice(0,4).map((x,i)=>`<i style="background:${colors[i%colors.length]}">${esc(x)}</i>`).join("")}</div><button class="join-button" data-join="${g.id}">${joined.has(g.id)?"Joined ✓":"Join group ↗"}</button></div></article>`).join("")}
function open(id){const p=document.querySelector(`[data-panel="${id}"]`);if(!p)return;p.hidden=false;p.style.display="flex";p.dataset.minimized="false";p.style.zIndex=++z;document.querySelectorAll(".desktop-icon").forEach(x=>x.classList.toggle("selected",x.dataset.window===id));let t=tasks.querySelector(`[data-task="${id}"]`);if(!t){t=document.createElement("button");t.className="task-item";t.dataset.task=id;t.textContent=p.querySelector(".window-bar>span").textContent.trim();t.addEventListener("click",()=>toggle(id));tasks.append(t)}tasks.querySelectorAll(".task-item").forEach(x=>x.classList.toggle("active",x===t));menu.classList.remove("open");if(id==="groups")render()}function close(id){const p=document.querySelector(`[data-panel="${id}"]`);p.hidden=true;p.style.display="";tasks.querySelector(`[data-task="${id}"]`)?.remove();document.querySelector(`.desktop-icon[data-window="${id}"]`)?.classList.remove("selected")}function toggle(id){const p=document.querySelector(`[data-panel="${id}"]`);if(p.hidden||p.dataset.minimized==="true"){open(id)}else{p.dataset.minimized="true";p.hidden=true;tasks.querySelector(`[data-task="${id}"]`)?.classList.remove("active")}}
document.querySelectorAll(".desktop-icon").forEach(b=>{let last=0;b.addEventListener("click",()=>{const now=Date.now();if(now-last<420)open(b.dataset.window);else{b.classList.add("selected");setTimeout(()=>b.classList.remove("selected"),450)}last=now})});document.querySelectorAll("[data-window]:not(.desktop-icon)").forEach(b=>b.addEventListener("click",()=>open(b.dataset.window)));document.querySelectorAll("[data-close]").forEach(b=>b.addEventListener("click",()=>close(b.dataset.close)));document.querySelectorAll("[data-minimize]").forEach(b=>b.addEventListener("click",()=>toggle(b.dataset.minimize)));document.querySelector("#start-button").addEventListener("click",()=>menu.classList.toggle("open"));document.addEventListener("click",e=>{if(!menu.contains(e.target)&&!e.target.closest("#start-button")&&!e.target.closest("[data-window]"))menu.classList.remove("open")});panels.forEach(p=>p.addEventListener("pointerdown",()=>{p.style.zIndex=++z;tasks.querySelectorAll(".task-item").forEach(t=>t.classList.toggle("active",t.dataset.task===p.dataset.panel))}));for(const bar of document.querySelectorAll(".window-bar")){let drag=null;bar.addEventListener("pointerdown",e=>{if(e.target.closest("button")||innerWidth<701)return;const p=bar.closest(".window"),r=p.getBoundingClientRect();p.style.transform="none";p.style.left=r.left+"px";p.style.top=r.top+"px";p.style.zIndex=++z;drag={x:e.clientX-r.left,y:e.clientY-r.top};bar.setPointerCapture(e.pointerId)});bar.addEventListener("pointermove",e=>{if(!drag)return;const p=bar.closest(".window");p.style.left=Math.max(0,Math.min(innerWidth-p.offsetWidth,e.clientX-drag.x))+"px";p.style.top=Math.max(42,Math.min(innerHeight-55,e.clientY-drag.y))+"px"});bar.addEventListener("pointerup",()=>drag=null);bar.addEventListener("pointercancel",()=>drag=null)}
[search,style,time].forEach(x=>x.addEventListener(x===search?"input":"change",render));list.addEventListener("click",e=>{const b=e.target.closest("[data-join]");if(!b)return;const id=+b.dataset.join;if(joined.has(id)){say("You’re already in this study group!");return}joined.add(id);groups.find(g=>g.id===id).members++;render();say("You’re in! Your new study buddies are waiting.")});document.querySelector("#create-form").addEventListener("submit",e=>{e.preventDefault();const d=new FormData(e.currentTarget),g={id:Date.now(),name:d.get("name").trim(),subject:d.get("subject").trim(),style:d.get("style"),time:d.get("time"),location:d.get("location").trim(),description:d.get("description").trim(),members:1,faces:["Y"]};groups.unshift(g);try{localStorage.setItem("orbit-study-groups",JSON.stringify(groups))}catch{}e.currentTarget.reset();close("create");open("groups");say("Your group is live. Let’s find your people!")});function clock(){const s=new Intl.DateTimeFormat([],{hour:"2-digit",minute:"2-digit"}).format(new Date());document.querySelector("#clock").textContent=s;document.querySelector("#task-clock").textContent=s}clock();setInterval(clock,15000);render();

// Quiz bank and quiz flow. The JSON file is the source of truth; the JS copy
// keeps direct file:// previews functional in browsers that block local fetch.
const quizFallback = window.JOZA_QUESTION_BANK;
let quizBank = quizFallback && quizFallback.subjects ? quizFallback : null;
const gradeDifficultyMap = {
  "Grades 6–8": ["Easy", "Standard"],
  "Grades 9–10": ["Standard", "Challenging"],
  "Grades 11–12": ["Challenging", "Advanced"],
  "College": ["Advanced", "Expert"]
};
let quizQuestions = [], quizIndex = 0, quizScore = 0, quizAnswered = false;
const quizSubject = document.querySelector("#quiz-subject");
const quizGrade = document.querySelector("#quiz-grade");
const quizDifficulty = document.querySelector("#quiz-difficulty");
const quizCount = document.querySelector("#quiz-count");
const quizAvailability = document.querySelector("#quiz-availability");
const bankStatus = document.querySelector("#bank-status");
function currentPool() {
  if (!quizBank) return [];
  return (quizBank.subjects[quizSubject.value] || []).filter(q => q.gradeLevel === quizGrade.value && q.difficulty === quizDifficulty.value);
}
function usedQuestionKey() { return `joza-quiz-used-v1:${quizSubject.value}:${quizGrade.value}:${quizDifficulty.value}`; }
function remainingPool() {
  const all = currentPool();
  let used = new Set();
  try { used = new Set(JSON.parse(localStorage.getItem(usedQuestionKey())) || []); } catch {}
  let fresh = all.filter(q => !used.has(q.id));
  let cycled = false;
  if (all.length && !fresh.length) {
    used = new Set(); fresh = all; cycled = true;
    try { localStorage.removeItem(usedQuestionKey()); } catch {}
  }
  return { all, fresh, used, cycled };
}
function refreshDifficulty() {
  const choices = gradeDifficultyMap[quizGrade.value] || [];
  quizDifficulty.innerHTML = choices.map(item => `<option>${escapeQuiz(item)}</option>`).join("");
  refreshQuestionCounts();
}
function refreshQuestionCounts() {
  const { all, fresh, cycled } = remainingPool();
  const pool = fresh;
  const prior = quizCount.value;
  const values = [5, 10, 15, 20].filter(n => n <= pool.length);
  quizCount.innerHTML = values.map(n => `<option value="${n}">${n} questions</option>`).join("");
  if (pool.length) quizCount.insertAdjacentHTML("beforeend", `<option value="all">All available (${pool.length})</option>`);
  if (prior && [...quizCount.options].some(option => option.value === prior)) quizCount.value = prior;
  quizAvailability.textContent = !all.length ? "No questions available for this selection." : cycled ? `All ${all.length} questions have been used. Your question cycle has restarted.` : `${pool.length} new questions left for this subject, grade, and difficulty.`;
  document.querySelector("#start-quiz").disabled = !pool.length;
}
function escapeQuiz(value) {
  return String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}
async function loadQuizBank() {
  if (location.protocol !== "file:") {
    try {
      const response = await fetch("questions.json", { cache: "no-store" });
      if (response.ok) quizBank = await response.json();
    } catch { /* Use the bundled preview copy below. */ }
  }
  if (quizBank) {
    bankStatus.textContent = `${Object.keys(quizBank.subjects).length} SUBJECT BANKS READY`;
    refreshDifficulty();
  } else {
    bankStatus.textContent = "QUESTION BANK UNAVAILABLE";
    quizAvailability.textContent = "Could not load questions.json.";
  }
}
function shuffled(items) {
  const copy = items.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
function startQuiz() {
  const { fresh } = remainingPool();
  const pool = shuffled(fresh);
  const requested = quizCount.value === "all" ? pool.length : Number(quizCount.value);
  quizQuestions = pool.slice(0, requested);
  if (!quizQuestions.length) return;
  try {
    const key = usedQuestionKey();
    const prior = new Set(JSON.parse(localStorage.getItem(key)) || []);
    quizQuestions.forEach(question => prior.add(question.id));
    localStorage.setItem(key, JSON.stringify([...prior]));
  } catch {}
  quizIndex = 0;
  quizScore = 0;
  document.querySelector("#quiz-setup").hidden = true;
  document.querySelector("#quiz-result").hidden = true;
  document.querySelector("#quiz-run").hidden = false;
  showQuestion();
}
function showQuestion() {
  quizAnswered = false;
  const q = quizQuestions[quizIndex];
  document.querySelector("#quiz-progress-label").textContent = `QUESTION ${quizIndex + 1} / ${quizQuestions.length}`;
  document.querySelector("#quiz-score-label").textContent = `SCORE ${quizScore}`;
  document.querySelector("#quiz-progress-bar").style.width = `${(quizIndex / quizQuestions.length) * 100}%`;
  document.querySelector("#question-text").textContent = q.question;
  document.querySelector("#quiz-feedback").textContent = "";
  const options = document.querySelector("#quiz-options");
  options.innerHTML = q.options.map((option, index) => `<button class="quiz-option" type="button" data-answer="${index}">${escapeQuiz(option)}</button>`).join("");
  const next = document.querySelector("#next-question");
  next.disabled = true;
  next.textContent = "Choose an answer";
}
function answerQuiz(choice) {
  if (quizAnswered) return;
  quizAnswered = true;
  const q = quizQuestions[quizIndex];
  const correct = choice === q.correctIndex;
  if (correct) quizScore++;
  document.querySelectorAll(".quiz-option").forEach(button => {
    button.disabled = true;
    const index = Number(button.dataset.answer);
    if (index === q.correctIndex) button.classList.add("correct");
    else if (index === choice) button.classList.add("incorrect");
  });
  document.querySelector("#quiz-feedback").textContent = correct ? "That’s right!" : `Not quite. The answer is ${q.options[q.correctIndex]}.`;
  document.querySelector("#quiz-score-label").textContent = `SCORE ${quizScore}`;
  const next = document.querySelector("#next-question");
  next.disabled = false;
  next.textContent = quizIndex === quizQuestions.length - 1 ? "See my results ↗" : "Next question →";
}
function nextQuizQuestion() {
  if (!quizAnswered) return;
  if (quizIndex < quizQuestions.length - 1) {
    quizIndex++;
    showQuestion();
    return;
  }
  document.querySelector("#quiz-run").hidden = true;
  document.querySelector("#quiz-result").hidden = false;
  document.querySelector("#quiz-progress-bar").style.width = "100%";
  const percent = Math.round((quizScore / quizQuestions.length) * 100);
  document.querySelector("#result-title").textContent = percent >= 80 ? "Brilliant work!" : percent >= 50 ? "Nice work!" : "Good practice!";
  document.querySelector("#result-score").textContent = `You got ${quizScore} of ${quizQuestions.length} right (${percent}%).`;
}
document.querySelector("#quiz-grade").addEventListener("change", refreshDifficulty);
document.querySelector("#quiz-subject").addEventListener("change", refreshQuestionCounts);
document.querySelector("#quiz-difficulty").addEventListener("change", refreshQuestionCounts);
document.querySelector("#start-quiz").addEventListener("click", startQuiz);
document.querySelector("#quiz-options").addEventListener("click", event => {
  const option = event.target.closest("[data-answer]");
  if (option) answerQuiz(Number(option.dataset.answer));
});
document.querySelector("#next-question").addEventListener("click", nextQuizQuestion);
document.querySelector("#again-quiz").addEventListener("click", () => {
  document.querySelector("#quiz-result").hidden = true;
  document.querySelector("#quiz-setup").hidden = false;
  refreshQuestionCounts();
});
loadQuizBank();


document.querySelector("#contact-form")?.addEventListener("submit", event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const name = String(data.get("name")).trim();
  document.querySelector("#contact-feedback").textContent = `Thanks, ${name}! Your note is ready. Connect this form to an email service to deliver messages.`;
  event.currentTarget.reset();
});
open('home');

