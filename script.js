let exercises = [];
        let currentExerciseIndex = 0;
        let timeLeft = 0;
        let timerInterval;

        function addExercise() {
            const name = document.getElementById('exerciseName').value;
            const duration = parseInt(document.getElementById('exerciseDuration').value);
            if (name && duration) {
                exercises.push({ name, duration });
                updateExerciseList();
                document.getElementById('exerciseName').value = '';
                document.getElementById('exerciseDuration').value = '';
            }
        }

        function updateExerciseList() {
            const list = document.getElementById('exerciseList');
            list.innerHTML = '';
            exercises.forEach(exercise => {
                const item = document.createElement('div');
                item.className = 'exercise-item';
                item.textContent = `${exercise.name} - ${formatTime(exercise.duration)};`
                list.appendChild(item);
            });
        }

        function startWorkout() {
            if (exercises.length > 0) {
                currentExerciseIndex = 0;
                startExercise();
            }
        }

        function startExercise() {
            const exercise = exercises[currentExerciseIndex];
            document.getElementById('currentExercise').textContent = exercise.name;
            timeLeft = exercise.duration;
            updateTimerDisplay();
            timerInterval = setInterval(updateTimer, 1000);
            document.getElementById('startButton').textContent = 'Pause';
            document.getElementById('startButton').onclick = pauseResume;
        }

        function updateTimer() {
            timeLeft--;
            updateTimerDisplay();
            if (timeLeft === 0) {
                clearInterval(timerInterval);
                currentExerciseIndex++;
                if (currentExerciseIndex < exercises.length) {
                    startExercise();
                } else {
                    endWorkout();
                }
            }
        }

        function updateTimerDisplay() {
            document.getElementById('timer').textContent = formatTime(timeLeft);
        }

        function formatTime(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')};`
        }

        function pauseResume() {
            if (timerInterval) {
                clearInterval(timerInterval);
                timerInterval = null;
                document.getElementById('startButton').textContent = 'Resume';
            } else {
                timerInterval = setInterval(updateTimer, 1000);
                document.getElementById('startButton').textContent = 'Pause';
            }
        }

        function endWorkout() {
            document.getElementById('currentExercise').textContent = 'Workout Complete!';
            document.getElementById('timer').textContent = '';
            document.getElementById('startButton').textContent = 'Begin Workout';
            document.getElementById('startButton').onclick = startWorkout;
        }