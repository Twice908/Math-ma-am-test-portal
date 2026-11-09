const data = JSON.parse(document.getElementById('question-data').textContent);
const quizRoot = document.getElementById('quiz');
const questions = [];
const letters = ['A', 'B', 'C', 'D'];

data.forEach(section => {
  const divider = document.createElement('div');
  divider.className = 'section-divider';
  const title = document.createElement('h2');
  title.textContent = section.title;
  divider.appendChild(title);
  quizRoot.appendChild(divider);

  section.questions.forEach(question => {
    const card = document.createElement('section');
    card.className = 'question';
    card.id = 'q' + question.number;
    card.dataset.topic = section.title;

    const head = document.createElement('div');
    head.className = 'q-head';
    const number = document.createElement('span');
    number.className = 'q-num';
    number.textContent = 'Q' + question.number + '.';
    const prompt = document.createElement('span');
    prompt.className = 'q-text';
    prompt.textContent = question.text;
    head.append(number, prompt);
    card.appendChild(head);

    const optionsWrap = document.createElement('div');
    optionsWrap.className = 'options';
    const options = question.options.map((value, index) => {
      const label = document.createElement('label');
      label.className = 'opt';
      label.id = 'q' + question.number + '_o' + index;
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'q' + question.number;
      input.value = String(index);
      const bubble = document.createElement('span');
      bubble.className = 'bubble';
      bubble.textContent = letters[index];
      const text = document.createElement('span');
      text.className = 'opt-text';
      text.textContent = value;
      label.append(input, bubble, text);
      optionsWrap.appendChild(label);
      return {element: label, input};
    });
    card.appendChild(optionsWrap);

    const note = document.createElement('div');
    note.className = 'answer-note';
    card.appendChild(note);
    quizRoot.appendChild(card);
    questions.push({
      number: question.number,
      correct: question.correct,
      element: card,
      options,
      topic: section.title
    });
  });
});

window.initializeImoTest(questions);
