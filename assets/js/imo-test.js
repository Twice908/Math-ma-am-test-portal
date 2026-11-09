window.initializeImoTest = function (questions, durationSeconds = 60 * 60) {
  const timerClock = document.getElementById('timer-clock');
  const progressBar = document.getElementById('progress-bar-fill');
  const progressLabel = document.getElementById('progress-label');
  const submitButton = document.getElementById('submit-btn');
  const startedAt = new Date();
  const startedAtPerformance = performance.now();
  let submitted = false;
  let timerInterval;

  document.getElementById('total-q-count').textContent = String(questions.length);

  function updateProgress() {
    const answered = questions.filter(question =>
      question.options.some(option => option.input.checked)
    ).length;
    progressBar.style.width = (answered / questions.length * 100) + '%';
    progressLabel.textContent = answered + ' / ' + questions.length + ' answered';
  }

  document.getElementById('quiz-root').addEventListener('change', updateProgress);
  updateProgress();

  function handleSubmit(autoSubmitted) {
    if (submitted) return;
    submitted = true;
    window.clearInterval(timerInterval);

    const endedAt = new Date();
    const duration = Math.floor((endedAt - startedAt) / 1000);
    const topics = new Map();
    let score = 0;
    let unanswered = 0;

    questions.forEach(question => {
      const selectedIndex = question.options.findIndex(option => option.input.checked);
      const topic = question.topic || 'Test';
      if (!topics.has(topic)) topics.set(topic, {correct: 0, total: 0});
      const topicResult = topics.get(topic);
      topicResult.total++;

      question.options.forEach((option, index) => {
        option.input.disabled = true;
        option.element.classList.add('locked');
        option.element.classList.remove('correct-answer', 'wrong-answer');
        if (index === question.correct) option.element.classList.add('correct-answer');
      });

      const note = question.element.querySelector('.answer-note');
      if (selectedIndex === question.correct) {
        score++;
        topicResult.correct++;
        note.textContent = '✓ Correct' + (question.explanation ? '. ' + question.explanation : '');
      } else {
        if (selectedIndex !== -1) question.options[selectedIndex].element.classList.add('wrong-answer');
        else unanswered++;
        note.textContent = selectedIndex === -1
          ? '— Not answered'
          : '✗ Correct answer highlighted in green';
        if (question.explanation) note.textContent += '. ' + question.explanation;
        note.classList.add('miss');
      }
      note.classList.add('show');
    });

    const percentage = Math.round(score / questions.length * 100);
    const scoreReadout = document.getElementById('score-readout');
    const scoreLabel = document.createElement('b');
    scoreLabel.textContent = score + ' / ' + questions.length;
    scoreReadout.replaceChildren(
      document.createTextNode('Score: '),
      scoreLabel,
      document.createTextNode(' marks (' + percentage + '%)')
    );
    submitButton.disabled = true;

    const rows = [...topics.entries()].map(([topic, result]) => {
      const row = document.createElement('tr');
      [topic, result.correct + ' / ' + result.total, Math.round(result.correct / result.total * 100) + '%']
        .forEach(value => {
          const cell = document.createElement('td');
          cell.textContent = value;
          row.appendChild(cell);
        });
      return row;
    });
    const totalRow = document.createElement('tr');
    [ 'Total', score + ' / ' + questions.length, percentage + '%' ].forEach(value => {
      const cell = document.createElement('td');
      cell.textContent = value;
      totalRow.appendChild(cell);
    });

    const breakdown = document.getElementById('breakdown');
    const table = document.createElement('table');
    table.innerHTML = '<thead><tr><th>Topic</th><th>Correct</th><th>Score</th></tr></thead>';
    const body = document.createElement('tbody');
    [...rows, totalRow].forEach(row => body.appendChild(row));
    table.appendChild(body);
    breakdown.replaceChildren(Object.assign(document.createElement('h3'), {textContent: 'Topic breakdown'}), table);
    breakdown.classList.add('show');

    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    const timestamps = document.getElementById('result-timestamps');
    timestamps.textContent = 'Date: ' + startedAt.toLocaleDateString() +
      ' · Start: ' + startedAt.toLocaleTimeString() +
      ' · End: ' + endedAt.toLocaleTimeString() +
      ' · Duration: ' + minutes + 'm ' + seconds + 's';
    timestamps.classList.add('show');

    const banner = document.getElementById('result-banner');
    banner.textContent = autoSubmitted
      ? 'Time is up — test auto-submitted. ' + score + ' out of ' + questions.length + ' marks. Scroll up to review your answers.'
      : (unanswered
        ? score + ' out of ' + questions.length + ' marks. ' + unanswered + ' question(s) were unanswered.'
        : score + ' out of ' + questions.length + ' marks. Review the correct answers and topic breakdown below.');
    banner.classList.add('show');
    banner.scrollIntoView({behavior: 'smooth', block: 'center'});
  }

  submitButton.addEventListener('click', () => handleSubmit(false));

  function formatClock(totalSeconds) {
    const seconds = Math.max(0, Math.ceil(totalSeconds));
    return String(Math.floor(seconds / 60)).padStart(2, '0') + ':' +
      String(seconds % 60).padStart(2, '0');
  }

  function updateTimer() {
    const elapsed = (performance.now() - startedAtPerformance) / 1000;
    const remaining = Math.max(0, durationSeconds - elapsed);
    timerClock.textContent = formatClock(remaining);
    timerClock.classList.toggle('low', remaining <= 120);
    if (remaining <= 0) handleSubmit(true);
  }

  updateTimer();
  timerInterval = window.setInterval(updateTimer, 250);
};
