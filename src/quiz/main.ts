import 'maplibre-gl/dist/maplibre-gl.css';
import '../styles.css';
import './quiz.css';
import { STUDY_ERAS } from './catalog';
import { renderHome } from './home';
import { leaveQuiz, quizKey, startQuiz } from './quiz-view';
import { leaveStudy, startStudy, studyKey } from './study-view';
import { ERAS } from '../data';

// ---------------------------------------------------------------- routing: #era=conquest (quiz), #study, #study=conquest
function route() {
  const params = new URLSearchParams(location.hash.slice(1));
  leaveQuiz();
  leaveStudy();
  const quizEra = STUDY_ERAS.find((e) => e.id === params.get('era'));
  if (quizEra) return startQuiz(ERAS.indexOf(quizEra));
  if (params.has('study')) {
    const era = STUDY_ERAS.find((e) => e.id === params.get('study'));
    return startStudy(era ? [era] : STUDY_ERAS);
  }
  renderHome();
}
window.addEventListener('hashchange', route);

document.addEventListener('keydown', (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  if (quizKey(e) || studyKey(e)) e.preventDefault();
});

route();
