let userName = "", userGender = "";

function selectGender(gender) {
  userGender = gender;
  document.querySelectorAll('.gender-btn').forEach(btn => {
    btn.classList.remove('selected');
    if (btn.textContent.includes(gender)) btn.classList.add('selected');
  });
  checkInputs();
}

function checkInputs() {
  const name = document.getElementById("username").value.trim();
  document.getElementById("next-btn").disabled = !(name && userGender);
}

function goToChoice() {
  const nameInput = document.getElementById("username").value.trim();
  const errorBox = document.getElementById("inputError");

  if (!nameInput || !userGender) {
    let message = "Please enter your name and select your gender.";
    if (!nameInput && userGender) message = "Please enter your name.";
    else if (nameInput && !userGender) message = "Please select your gender.";
    errorBox.textContent = message;
    return;
  }

  // Clear error and move forward
  errorBox.textContent = "";
  userName = nameInput;
  document.getElementById("step1").classList.add("hidden");
  document.getElementById("step2").classList.remove("hidden");
  document.getElementById("greeting").textContent = `Hi, ${userName}! 👋`;
  displayDailyTip();
}

function backToName() {
  document.getElementById("step2").classList.add("hidden");
  document.getElementById("step1").classList.remove("hidden");
  document.getElementById("username").value = "";
  document.getElementById("inputError").textContent = "";
  userGender = "";
  checkInputs();
  document.querySelectorAll('.gender-btn').forEach(btn => btn.classList.remove('selected'));
}

function backToChoice() {
  ["ageScreen", "bmiScreen", "pulseScreen", "tempScreen", "sleepScreen", "waterScreen"].forEach(id => document.getElementById(id).classList.add("hidden"));
  document.getElementById("step2").classList.remove("hidden");
  ["ageResult", "bmiResult", "bmiStatus", "pulseResult", "tempResult", "sleepResult", "waterResult"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = "";
  });
}

function toggleScreen(id) {
  document.getElementById("step2").classList.add("hidden");
  document.getElementById(id).classList.remove("hidden");
}

function showAge() { toggleScreen("ageScreen"); }
function showBMI() { toggleScreen("bmiScreen"); }
function showPulse() { toggleScreen("pulseScreen"); }
function showTemperature() { toggleScreen("tempScreen"); }
function showSleep() { toggleScreen("sleepScreen"); }
function showWater() { toggleScreen("waterScreen"); }

function calculateAge() {
  const birthdate = new Date(document.getElementById("birthdate").value);
  if (!birthdate || isNaN(birthdate)) return alert("Enter valid birthdate");
  const today = new Date();
  let years = today.getFullYear() - birthdate.getFullYear();
  let months = today.getMonth() - birthdate.getMonth();
  let days = today.getDate() - birthdate.getDate();
  if (days < 0) { months--; days += new Date(today.getFullYear(), today.getMonth(), 0).getDate(); }
  if (months < 0) { years--; months += 12; }
  document.getElementById("ageResult").textContent = `${userName}, you are ${years}y ${months}m ${days}d old.`;
}

function calculateBMI() {
  const h = parseFloat(document.getElementById("height").value);
  const w = parseFloat(document.getElementById("weight").value);
  if (!h || !w || h <= 0 || w <= 0) return alert("Invalid height or weight");
  const bmi = (w / ((h / 100) ** 2)).toFixed(1);
  let status = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obese";
  document.getElementById("bmiResult").textContent = `${userName}, your BMI is ${bmi}`;
  document.getElementById("bmiStatus").textContent = status;
}

function checkPulse() {
  const bpm = parseInt(document.getElementById("pulse").value);
  if (!bpm || bpm <= 0) return alert("Enter valid BPM");
  let result = bpm < 60 ? "Bradycardia (slow)" : bpm <= 100 ? "Normal" : "Tachycardia (fast)";
  document.getElementById("pulseResult").textContent = `${userName}, your heart rate: ${bpm} bpm — ${result}`;
}

function checkTemperature() {
  const temp = parseFloat(document.getElementById("temp").value);
  if (!temp || temp <= 0) return alert("Enter valid temperature");
  let result = temp < 36 ? "Low body temp" : temp <= 37.5 ? "Normal" : "Possible fever";
  document.getElementById("tempResult").textContent = `${userName}, your temp is ${temp}°C — ${result}`;
}

function calculateSleep() {
  const time = document.getElementById("wakeTime").value;
  if (!time) return alert("Please select your wake-up time.");
  const [h, m] = time.split(":").map(Number);
  const wakeUp = new Date();
  wakeUp.setHours(h, m, 0, 0);
  let sleepCycles = [];
  for (let i = 6; i >= 3; i--) {
    let sleepTime = new Date(wakeUp.getTime() - i * 90 * 60 * 1000 - 15 * 60 * 1000);
    sleepCycles.push(`${sleepTime.getHours().toString().padStart(2, '0')}:${sleepTime.getMinutes().toString().padStart(2, '0')}`);
  }
  document.getElementById("sleepResult").textContent = `Best sleep times: ${sleepCycles.join(", ")}`;
}

function calculateWater() {
  const weight = parseFloat(document.getElementById("userWeight").value);
  if (!weight || weight <= 0) return alert("Enter valid weight");
  const water = (weight * 0.033).toFixed(2);
  document.getElementById("waterResult").textContent = `${userName}, you need approx. ${water} liters/day 💧`;
}

function showMotivation() {
  const quotes = [
    "💪 Keep pushing forward!",
    "🧘 Breathe. Relax. Recharge.",
    "🌱 One step at a time.",
    "💡 Health is wealth.",
    "🎯 You are doing great!"
  ];
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  alert(`${userName}, here's your motivation: ${quote}`);
}

function displayDailyTip() {
  const tips = [
    "🚶 Take a 10-min walk every 2 hours.",
    "🍎 Add fruits to your snacks.",
    "💧 Stay hydrated today.",
    "📵 Take screen breaks every hour.",
    "🧘 Try 2-min breathing exercise now."
  ];
  const tip = tips[new Date().getDay() % tips.length];
  document.getElementById("dailyTipBox").textContent = `🧠 Today's Tip: ${tip}`;
}
