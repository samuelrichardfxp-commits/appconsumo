import { PHASES, QUESTIONS } from './data/questions.js';

const LETTERS = ['A', 'B', 'C', 'D'];

export class App {
  constructor() {
    this.questionIndex = 0;
    this.score = 0;
    this.responses = [];
    this.hasAnswered = false;
    this.cacheElements();
    this.bindEvents();
    this.renderPhases();
  }

  cacheElements() {
    this.screens = document.querySelectorAll('[data-screen]');
    this.scoreValue = document.getElementById('scoreValue');
    this.phaseLabel = document.getElementById('phaseLabel');
    this.questionCount = document.getElementById('questionCount');
    this.progressTrack = document.querySelector('[role="progressbar"]');
    this.progressFill = document.getElementById('progressFill');
    this.phaseList = document.getElementById('phaseList');
    this.questionTopic = document.getElementById('questionTopic');
    this.questionText = document.getElementById('questionText');
    this.answerOptions = document.getElementById('answerOptions');
    this.answerFeedback = document.getElementById('answerFeedback');
    this.answerNudge = document.getElementById('answerNudge');
    this.nextButton = document.getElementById('nextButton');
    this.reviewTableBody = document.getElementById('reviewTableBody');
  }

  bindEvents() {
    document.addEventListener('click', (event) => {
      const answerButton = event.target.closest('[data-answer-index]');
      if (answerButton) {
        this.submitAnswer(Number(answerButton.dataset.answerIndex));
        return;
      }

      const targetButton = event.target.closest('[data-screen-target]');
      if (targetButton) {
        event.preventDefault();
        this.showScreen(targetButton.dataset.screenTarget);
        return;
      }

      const actionButton = event.target.closest('[data-action]');
      if (actionButton) this.handleAction(actionButton.dataset.action);
    });
  }

  handleAction(action) {
    if (action === 'start' || action === 'restart') {
      this.startGame();
    } else if (action === 'next') {
      this.nextQuestion();
    } else if (action === 'review') {
      this.renderReview();
      this.showScreen('review');
    } else if (action === 'back-results') {
      this.showScreen('result');
    } else if (action === 'home') {
      this.showScreen('welcome');
    }
  }

  showScreen(screenName) {
    this.screens.forEach((screen) => {
      const isActive = screen.dataset.screen === screenName;
      screen.classList.toggle('is-active', isActive);
      screen.setAttribute('aria-hidden', String(!isActive));
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  startGame() {
    this.questionIndex = 0;
    this.score = 0;
    this.responses = [];
    this.hasAnswered = false;
    this.renderPhases();
    this.renderQuestion();
    this.showScreen('game');
  }

  renderPhases() {
    this.phaseList.innerHTML = PHASES.map((phase, index) => `
      <li class="phase-step" data-phase-step="${phase.id}">
        <span class="phase-step-number">0${index + 1}</span>
        <span class="phase-step-copy">${phase.name}</span>
        <span class="phase-step-icon" aria-hidden="true">${phase.icon}</span>
      </li>
    `).join('');
  }

  renderQuestion() {
    const question = QUESTIONS[this.questionIndex];
    const phase = PHASES.find((item) => item.id === question.phase);
    const phaseQuestionIndex = QUESTIONS.slice(0, this.questionIndex).filter((item) => item.phase === phase.id).length + 1;
    const completedCount = this.questionIndex + Number(this.hasAnswered);

    this.scoreValue.textContent = this.score;
    this.phaseLabel.textContent = `Fase 0${phase.id} · ${phase.name}`;
    this.questionCount.textContent = `Pergunta ${this.questionIndex + 1} de ${QUESTIONS.length}`;
    this.questionTopic.textContent = `${phase.icon}  ${question.topic} · ${phaseQuestionIndex}/4`;
    this.questionText.textContent = question.question;
    this.progressTrack.setAttribute('aria-valuenow', String(completedCount));
    this.progressFill.style.width = `${(completedCount / QUESTIONS.length) * 100}%`;
    this.answerFeedback.hidden = !this.hasAnswered;
    this.answerNudge.hidden = this.hasAnswered;
    this.nextButton.hidden = !this.hasAnswered;
    this.nextButton.textContent = this.questionIndex === QUESTIONS.length - 1
      ? 'Ver resultado →'
      : 'Próxima pergunta →';

    this.phaseList.querySelectorAll('[data-phase-step]').forEach((step) => {
      const stepNumber = Number(step.dataset.phaseStep);
      step.classList.toggle('is-current', stepNumber === phase.id);
      step.classList.toggle('is-complete', stepNumber < phase.id);
    });

    this.answerOptions.innerHTML = question.options.map((option, index) => {
      const response = this.responses[this.questionIndex];
      const isCorrect = this.hasAnswered && index === question.answer;
      const isWrongChoice = this.hasAnswered && response?.selectedIndex === index && !response.isCorrect;
      const stateClass = isCorrect ? 'is-correct' : isWrongChoice ? 'is-wrong' : '';
      const symbol = isCorrect ? '<span class="answer-state" aria-label="Resposta correta">✓</span>'
        : isWrongChoice ? '<span class="answer-state" aria-label="Resposta incorreta">×</span>' : '';

      return `
        <button class="answer-option ${stateClass}" type="button" data-answer-index="${index}" ${this.hasAnswered ? 'disabled' : ''}>
          <span class="option-letter">${LETTERS[index]}</span>
          <span class="option-text">${option}</span>
          ${symbol}
        </button>
      `;
    }).join('');

    if (this.hasAnswered) this.renderFeedback(question);
    else this.answerFeedback.innerHTML = '';
  }

  submitAnswer(selectedIndex) {
    if (this.hasAnswered) return;

    const question = QUESTIONS[this.questionIndex];
    const isCorrect = selectedIndex === question.answer;
    this.hasAnswered = true;
    this.responses[this.questionIndex] = { selectedIndex, isCorrect };
    if (isCorrect) this.score += 100;
    this.renderQuestion();
  }

  renderFeedback(question) {
    const response = this.responses[this.questionIndex];
    const title = response.isCorrect ? 'Resposta correta! 🌱' : 'Quase! Vamos aprender juntos. 🌿';
    const detail = response.isCorrect
      ? question.explanation
      : `A melhor resposta é ${LETTERS[question.answer]}. ${question.explanation}`;

    this.answerFeedback.innerHTML = `
      <span class="feedback-icon" aria-hidden="true">${response.isCorrect ? '✓' : '↗'}</span>
      <div><strong>${title}</strong><p>${detail}</p></div>
    `;
    this.answerFeedback.className = `answer-feedback ${response.isCorrect ? 'feedback-correct' : 'feedback-wrong'}`;
  }

  nextQuestion() {
    if (!this.hasAnswered) return;
    if (this.questionIndex === QUESTIONS.length - 1) {
      this.renderResults();
      this.showScreen('result');
      return;
    }

    this.questionIndex += 1;
    this.hasAnswered = false;
    this.renderQuestion();
  }

  renderResults() {
    const correctCount = this.responses.filter((response) => response.isCorrect).length;
    const wrongCount = QUESTIONS.length - correctCount;
    const accuracy = Math.round((correctCount / QUESTIONS.length) * 100);
    let rank;

    if (accuracy <= 40) rank = { title: 'Iniciante', icon: '🌱', note: 'Toda jornada começa com curiosidade.' };
    else if (accuracy <= 70) rank = { title: 'Aprendiz Verde', icon: '♻️', note: 'Você já está fazendo boas conexões.' };
    else if (accuracy <= 90) rank = { title: 'Guardião do Planeta', icon: '🌎', note: 'Seu conhecimento já inspira boas escolhas.' };
    else rank = { title: 'Mestre da Sustentabilidade', icon: '🏆', note: 'Você domina o desafio. Continue espalhando conhecimento!' };

    document.getElementById('finalScore').textContent = this.score;
    document.getElementById('correctCount').textContent = correctCount;
    document.getElementById('wrongCount').textContent = wrongCount;
    document.getElementById('accuracyValue').textContent = `${accuracy}%`;
    document.getElementById('playerRank').innerHTML = `
      <span aria-hidden="true">${rank.icon}</span>
      <div><strong>${rank.title}</strong><small>${rank.note}</small></div>
    `;
  }

  renderReview() {
    this.reviewTableBody.innerHTML = QUESTIONS.map((question, index) => {
      const response = this.responses[index];
      const selectedAnswer = `${LETTERS[response.selectedIndex]}) ${question.options[response.selectedIndex]}`;
      const correctAnswer = `${LETTERS[question.answer]}) ${question.options[question.answer]}`;
      const result = response.isCorrect ? '✅ Correta' : '❌ Errada';

      return `
        <tr class="${response.isCorrect ? 'review-correct' : 'review-wrong'}">
          <td data-label="#">${index + 1}</td>
          <td data-label="Pergunta">${question.question}</td>
          <td data-label="Sua resposta">${selectedAnswer}</td>
          <td data-label="Resposta correta">${correctAnswer}</td>
          <td data-label="Resultado"><strong>${result}</strong></td>
        </tr>
      `;
    }).join('');
  }
}