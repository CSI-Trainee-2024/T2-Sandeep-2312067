let exerciseDuration = document.getElementById('exerciseDuration');
let addExerciseBtn = document.getElementById('addExercise');
let exerciseList = document.getElementById('exerciseList');
let startExercisesBtn = document.getElementById('startExercises');
let currentExercise = document.getElementById('currentExercise');
let exerciseTitle = document.getElementById('exerciseTitle');
let timer = document.getElementById('timer');
let skipExerciseBtn = document.getElementById('skipExercise');
let endEarlyBtn = document.getElementById('endEarly');
let exercisePage = document.getElementById('exercisePage');
let summaryPage = document.getElementById('summaryPage');
let summaryList = document.getElementById('summaryList');
let btn=document.getElementById("begin");
let restartExercisesBtn = document.getElementById('restartExercises');


let exercises = JSON.parse(localStorage.getItem('exercises')) || [];
let currentExerciseIndex = 0;
let timeLeft = 0;
let isBreak = false;
let isRunning = false;
let timerInterval;
let executionTimes = [];

addExerciseBtn.addEventListener('click', addExercise);
startExercisesBtn.addEventListener('click', startExercises);
skipExerciseBtn.addEventListener('click', skipExercise);
endEarlyBtn.addEventListener('click', endEarly);
restartExercisesBtn.addEventListener('click', restartExercises);
btn.addEventListener('click',begintoWorkout);

function addExercise() {
    const name = exerciseName.value.trim();
    exerciseList.style.display = 'block';
    const duration = parseInt(exerciseDuration.value);
    if (name && duration > 0) {
        exercises.push({ name, duration });
        updateExerciseList();
        exerciseName.value = '';
        exerciseDuration.value = '';
        startExercisesBtn.disabled = false;
    }
    saveData();
}

function updateExerciseList() {
    exerciseList.innerHTML = '';
    exercises.forEach((exercise, index) => {
        const li = document.createElement('li');
        li.textContent = `${exercise.name} - ${exercise.duration}s`;
        exerciseList.appendChild(li);
    });
}

function startExercises() {
    if (exercises.length > 0) {
        currentExerciseIndex = 0;
        executionTimes = [];
        startNextExercise();
        startExercisesBtn.style.display = 'none';
        endEarlyBtn.style.display = 'inline-block';
        isRunning = true;
    }
}

function startNextExercise() {
    if (currentExerciseIndex < exercises.length) {
        const exercise = exercises[currentExerciseIndex];
        exerciseTitle.textContent = exercise.name;
        timeLeft = exercise.duration;
        currentExercise.style.display = 'block';
        skipExerciseBtn.style.display = 'inline-block';
        isBreak = false;
        updateTimer();
        startTimer();
    } else {
        navigateToSummary();
    }
}

function startBreak() {
    exerciseTitle.textContent = 'Break Time';
    timeLeft = 30;
    isBreak = true;
    skipExerciseBtn.style.display = 'none';
    updateTimer();
    startTimer();
}

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimer();
        if (timeLeft === 0) {
            clearInterval(timerInterval);
            if (isBreak) {
                currentExerciseIndex++;
                startNextExercise();
            } else {
                executionTimes.push(exercises[currentExerciseIndex].duration);
                startBreak();
            }
        }
    }, 1000);
}

function updateTimer() {
    timer.textContent = `${timeLeft}s`;
}

function skipExercise() {
    clearInterval(timerInterval);
    executionTimes.push(exercises[currentExerciseIndex].duration - timeLeft);
    currentExerciseIndex++;
    if (currentExerciseIndex < exercises.length) {
        startNextExercise();
    } else {
        navigateToSummary();
    }
    saveData();
}

function endEarly() {
    clearInterval(timerInterval);
    if (!isBreak) {
        executionTimes.push(exercises[currentExerciseIndex].duration - timeLeft);
    }
    navigateToSummary();
}
function begintoWorkout(){
    exercisePage.style.display='block';
    summaryPage.style.display = 'none';
    currentExercise.style.display = 'none';
    exerciseList.style.display = 'none';
    exerciseList.innerHTML = '';
}

function navigateToSummary() {
    isRunning = false;
    exercisePage.style.display = 'none';
    summaryPage.style.display = 'block';
    displaySummary();
}

function displaySummary() {
    summaryList.innerHTML = '';
    exercises.forEach((exercise, index) => {
        const div = document.createElement('div');
        div.className = 'summary-item';
        div.innerHTML = `
            <span>${exercise.name}</span>
            <span>Planned: ${exercise.duration}s, Actual: ${executionTimes[index] || 0}s</span>
        `;
        summaryList.appendChild(div);
    });
}

function restartExercises() {
    exercises = [];
    currentExerciseIndex = 0;
    timeLeft = 0;
    isBreak = false;
    isRunning = false;
    executionTimes = [];
    updateExerciseList();
    exercisePage.style.display = 'none';
    summaryPage.style.display = 'none';
    currentExercise.style.display = 'none';
    startExercisesBtn.style.display = 'inline-block';
    startExercisesBtn.disabled = true;
    endEarlyBtn.style.display = 'none';
    saveData();
}

function saveData() {
    localStorage.setItem('exercises', JSON.stringify(exercises));
}
window.onload = () => {
    updateExerciseList();
};
