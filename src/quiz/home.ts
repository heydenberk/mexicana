// The front page: flashcard totals, each era with its Study and Quiz buttons, and the control that forgets everything.
import { esc } from '../html';
import { STUDY_ERAS, decks, studyOrder } from './catalog';
import { $, OVERVIEW, clearMap, fit, setLayout } from './map';
import { QUIZ_LENGTH } from './quiz';
import { counts } from './srs';
import { NEW_PER_DAY_CHOICES, canSave, clearAll, newAllowed, readBest, setNewPerDay, studyData } from './store';

export function renderHome() {
  setLayout('home');
  clearMap();
  fit(OVERVIEW);
  const now = Date.now();
  const states = studyData().cards;
  const allCards = studyOrder(STUDY_ERAS);
  const all = counts(allCards, states, now, newAllowed(now, STUDY_ERAS.map((e) => e.id)));
  const best = readBest();

  const items = STUDY_ERAS.map((era, i) => {
    const cards = decks.get(era.id)!.cards;
    const c = counts(cards, states, now, 0);
    const seen = cards.filter((card) => states[card.id]).length;
    const score = best[era.id];
    const stats = [`${cards.length} cards`, seen ? `${seen} studied` : '', c.review + c.learning ? `<strong>${c.review + c.learning} due</strong>` : '']
      .filter(Boolean).join(' · ');
    return `<li class="era-card">
      <span class="era-card-num">${i + 1}</span>
      <span class="era-card-title">${esc(era.title)}</span>
      <span class="era-card-years">${era.start}–${era.end}</span>
      ${era.reading ? `<span class="era-card-reading">Gillingham ${esc(era.reading)}</span>` : ''}
      <span class="era-card-stats">${stats}</span>
      <span class="era-card-actions">
        <a class="chip" href="#study=${esc(era.id)}">Study</a>
        <a class="chip" href="#era=${esc(era.id)}">Quiz${score === undefined ? '' : ` <span class="chip-note">best ${score}/${QUIZ_LENGTH}</span>`}</a>
      </span>
    </li>`;
  }).join('');

  const due = all.review + all.learning;
  const studiedAny = Object.keys(states).length > 0;
  $('quiz').innerHTML = `
    <p class="quiz-intro">Flashcards and quizzes on every era of the atlas, from the Mexica world to the present, drawn from Gillingham's <cite>Mexico: A 500-Year History</cite>. The flashcards bring each card back just before you would forget it; each quiz draws ten of an era's cards at random.</p>
    <section class="study-box">
      <h2>Flashcards</h2>
      <p class="study-box-counts">${allCards.length.toLocaleString('en')} cards · ${due ? `<strong>${due} due</strong>` : 'none due'} · ${all.fresh} new for today</p>
      <a class="primary" href="#study">Study all eras</a>
      <label class="new-per-day">New cards a day
        <select id="new-per-day">${NEW_PER_DAY_CHOICES.map((n) => `<option${n === studyData().newPerDay ? ' selected' : ''}>${n}</option>`).join('')}</select>
      </label>
      <p class="small muted">Study all eras takes the most important cards first, a card from each era in turn; Study on one era goes through just that era, most important cards first.</p>
    </section>
    <h3 class="list-heading">Eras</h3>
    <ol class="era-cards">${items}</ol>
    <p class="small muted other-quiz">Mexico today: <a href="../places/">a map quiz on the states and cities</a>.</p>
    <p class="saved-note small muted">
      ${canSave ? 'Your progress is saved in this browser only.' : 'This browser is not letting the page save, so progress lasts only for this visit.'}
      ${studiedAny || Object.keys(readBest()).length ? '<button id="clear" class="link-button">Clear saved progress</button>' : ''}
      <span id="clear-confirm" hidden>Delete all flashcard progress and best scores?
        <button id="clear-yes" class="link-button danger">Delete</button> <button id="clear-no" class="link-button">Cancel</button></span>
    </p>`;
  $('panel-body').scrollTop = 0;

  $('new-per-day').addEventListener('change', (e) => {
    setNewPerDay(Number((e.target as HTMLSelectElement).value));
    renderHome();
  });
  document.getElementById('clear')?.addEventListener('click', () => {
    $('clear').hidden = true;
    $('clear-confirm').hidden = false;
    $('clear-no').focus();
  });
  document.getElementById('clear-no')?.addEventListener('click', () => {
    $('clear-confirm').hidden = true;
    $('clear').hidden = false;
  });
  document.getElementById('clear-yes')?.addEventListener('click', () => {
    clearAll();
    renderHome();
  });
}
