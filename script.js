let currentQ = 0, timeLeft = 1800, timer, answers = [], marked = [], startTime = Date.now();

const questions = [ /* same 50 questions jo pehle diye the — main yahan short kar raha hoon space ke liye, tum pura wala paste kar dena jo maine pehle diya tha */ 
  {q:"1. What is the primary function of an Operating System?",a:["To manage hardware resources","To compile programs","To design databases","To create graphics"],correct:0,exp:"OS manages hardware & software resources."},
  // ... baaki 49 questions bhi yahin paste kar dena jo maine pehle diya tha
]; // ← pura array paste kar dena

function loadQuestion(){
  const q = questions[currentQ];
  document.getElementById("question-number").innerHTML = `Question ${currentQ+1} of 50`;
  document.getElementById("question-text").innerHTML = q.q;
  const opts = document.getElementById("options");
  opts.innerHTML = "";
  q.a.forEach((opt,i)=>{
    const label = document.createElement("label");
    label.innerHTML = `<input type="radio" name="q" value="${i}" ${answers[currentQ]===i?"checked":""}> ${opt}`;
    opts.appendChild(label);
  });
  updatePalette();
}
function nextQuestion(){ if(currentQ<49) currentQ++; loadQuestion(); }
function prevQuestion(){ if(currentQ>0) currentQ--; loadQuestion(); }
function markForReview(){ marked[currentQ]=true; updatePalette(); nextQuestion(); }
function clearResponse(){ answers[currentQ]=undefined; loadQuestion(); }

document.querySelectorAll('input[name="q"]').forEach(r=>r.addEventListener('change',()=>answers[currentQ]=parseInt(r.value)) );

function updatePalette(){
  const palette = document.getElementById("palette-buttons");
  palette.innerHTML = "";
  questions.forEach((q,i)=>{
    const btn = document.createElement("button");
    btn.textContent = i+1;
    btn.className = answers[i]!==undefined ? "answered" : marked[i] ? "marked" : "not-visited";
    btn.onclick = ()=>{ currentQ=i; loadQuestion(); };
    palette.appendChild(btn);
  });
}

function submitExam(){
  clearInterval(timer);
  let correct=0, wrong=0, unattempted=0, totalTime = Math.round((Date.now()-startTime)/1000);
  questions.forEach((q,i)=>{
    if(answers[i]===undefined) unattempted++;
    else if(answers[i]===q.correct) correct++;
    else wrong++;
  });
  const score = correct;
  const accuracy = ((correct/50)*100).toFixed(1);
  const percentile = score>=45?"99.9+":score>=40?"99":score>=35?"97":score>=30?"94":score>=25?"89":"80";
  const air = score>=45?"Top 50":score>=40?"Top 200":score>=35?"Top 800":score>=30?"Top 2000":"Top 5000+";

  document.getElementById("final-score").textContent = score;
  document.getElementById("accuracy").textContent = accuracy;
  document.getElementById("percentile").textContent = percentile+"th";
  document.getElementById("top-percent").textContent = (100-parseFloat(percentile)).toFixed(1);
  document.getElementById("air").textContent = air;
  document.getElementById("correct").textContent = correct;
  document.getElementById("wrong").textContent = wrong;
  document.getElementById("unattempted").textContent = unattempted;
  document.getElementById("avg-time").textContent = Math.round(totalTime/50);

  document.getElementById("result-modal").classList.remove("hidden");
}

timer = setInterval(()=>{
  timeLeft--;
  const m = String(Math.floor(timeLeft/60)).padStart(2,'0');
  const s = String(timeLeft%60).padStart(2,'0');
  document.querySelector("#timer span").textContent = m+":"+s;
  if(timeLeft<=0) submitExam();
},1000);

window.onload = ()=>{ loadQuestion(); updatePalette(); };
