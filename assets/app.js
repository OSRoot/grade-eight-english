/* ===== Year ===== */
document.getElementById('year').textContent = new Date().getFullYear();

/* ===== Mobile nav toggle ===== */
const navToggle = document.getElementById('navToggle');
const mainNav = document.querySelector('.main-nav');
navToggle.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);
});
document.querySelectorAll('#navMenu a').forEach(a => {
  a.addEventListener('click', () => mainNav.classList.remove('open'));
});

/* ===== Language switching (EN/AR) ===== */
const langBtns = document.querySelectorAll('.lang-btn');
function applyLang(lang) {
  const dict = I18N[lang] || I18N.en;
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.body.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key] !== undefined) el.innerHTML = dict[key];
  });
  langBtns.forEach(b => {
    const active = b.dataset.lang === lang;
    b.classList.toggle('active', active);
    b.setAttribute('aria-pressed', active);
  });
  localStorage.setItem('unit5-lang', lang);
}
langBtns.forEach(b => b.addEventListener('click', () => applyLang(b.dataset.lang)));
applyLang(localStorage.getItem('unit5-lang') || 'en');

/* ===== Vocabulary tooltips (hover .hl) ===== */
function findVocab(word) {
  const w = word.toLowerCase().trim();
  return VOCAB.find(v => v.en.toLowerCase() === w
    || v.en.toLowerCase().includes(w)
    || w.includes(v.en.toLowerCase().split(' ')[0]));
}
document.querySelectorAll('.hl').forEach(el => {
  const w = el.textContent.trim().replace(/[.,!?;:]$/, '');
  const v = findVocab(w);
  if (v) {
    el.title = `${v.ar}  —  ${v.def}`;
    el.style.cursor = 'help';
  }
});

/* ===== Quizzes (multiple-choice + open) ===== */
document.querySelectorAll('.quiz').forEach(quiz => {
  const btn = quiz.querySelector('.check-quiz');
  if (!btn) return;
  btn.addEventListener('click', () => {
    let total = 0, correct = 0;
    quiz.querySelectorAll('.mcq').forEach(q => {
      total++;
      const ans = q.dataset.correct;
      const sel = q.querySelector('input[type="radio"]:checked');
      q.querySelectorAll('label').forEach(l => l.classList.remove('correct','wrong'));
      if (sel) {
        const lbl = sel.closest('label');
        if (sel.value === ans) { lbl.classList.add('correct'); correct++; }
        else {
          lbl.classList.add('wrong');
          const okLbl = q.querySelector(`input[value="${ans}"]`)?.closest('label');
          okLbl?.classList.add('correct');
        }
      } else {
        const okLbl = q.querySelector(`input[value="${ans}"]`)?.closest('label');
        okLbl?.classList.add('correct');
      }
    });
    const out = quiz.querySelector('.quiz-result');
    if (total === 0) return;
    out.textContent = `${correct} / ${total} correct`;
    out.className = 'quiz-result ' + (correct === total ? 'ok' : 'bad');
  });
});

/* ===== Match drag & drop ===== */
const matchEx = document.getElementById('matchEx');
if (matchEx) {
  let dragged = null;
  matchEx.querySelectorAll('.match-item').forEach(el => {
    el.addEventListener('dragstart', e => {
      dragged = el;
      el.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });
    el.addEventListener('dragend', () => el.classList.remove('dragging'));
  });
  matchEx.querySelectorAll('.match-drop').forEach(drop => {
    drop.addEventListener('dragover', e => { e.preventDefault(); drop.classList.add('drop-hover'); });
    drop.addEventListener('dragleave', () => drop.classList.remove('drop-hover'));
    drop.addEventListener('drop', e => {
      e.preventDefault();
      drop.classList.remove('drop-hover');
      if (!dragged) return;
      // Move existing item back to bank if any
      const existing = drop.querySelector('.match-item');
      if (existing) matchEx.querySelector('.match-col.left').appendChild(existing);
      drop.appendChild(dragged);
      drop.classList.add('has-item');
    });
  });
  document.querySelector('.check-match')?.addEventListener('click', () => {
    let ok = 0, total = 0;
    matchEx.querySelectorAll('.match-drop').forEach(drop => {
      total++;
      const item = drop.querySelector('.match-item');
      drop.classList.remove('correct','wrong');
      if (item && item.dataset.id === drop.dataset.accepts) {
        drop.classList.add('correct'); ok++;
      } else if (item) {
        drop.classList.add('wrong');
      }
    });
    const out = document.querySelector('.match-result');
    out.textContent = `${ok} / ${total} matched correctly`;
    out.className = 'match-result ' + (ok === total ? 'ok' : 'bad');
  });
}

/* ===== Fill-in-the-blanks ===== */
function normalize(s) {
  return (s || '').toLowerCase().trim().replace(/[.,!?;:]/g, '').replace(/\s+/g, ' ');
}
document.querySelectorAll('.fill').forEach(fill => {
  const btn = fill.querySelector('.check-fill');
  if (!btn) return;
  btn.addEventListener('click', () => {
    let total = 0, ok = 0;
    fill.querySelectorAll('input[data-answer]').forEach(inp => {
      total++;
      const accepted = inp.dataset.answer.split('|').map(normalize);
      const val = normalize(inp.value);
      inp.classList.remove('ok','bad');
      if (accepted.includes(val)) { inp.classList.add('ok'); ok++; }
      else inp.classList.add('bad');
    });
    const out = fill.querySelector('.fill-result');
    out.textContent = `${ok} / ${total} correct`;
    out.className = 'fill-result ' + (ok === total ? 'ok' : 'bad');
  });
});

/* ===== Reorder (sentences) ===== */
document.querySelector('.check-reorder')?.addEventListener('click', () => {
  let ok = 0, total = 0;
  document.querySelectorAll('.reorder-q').forEach(q => {
    total++;
    const expected = normalize(q.dataset.correct);
    const inp = q.querySelector('input');
    const val = normalize(inp.value);
    inp.classList.remove('ok','bad');
    if (val === expected) { inp.classList.add('ok'); ok++; }
    else inp.classList.add('bad');
  });
  const out = document.querySelector('.reorder-result');
  out.textContent = `${ok} / ${total} correct`;
  out.className = 'reorder-result ' + (ok === total ? 'ok' : 'bad');
});

/* ===== Sort: Noun/Verb/Adjective ===== */
const sortBank = document.getElementById('sortBank');
if (sortBank) {
  let dragWord = null;
  function bind(word) {
    word.addEventListener('dragstart', e => {
      dragWord = word; word.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });
    word.addEventListener('dragend', () => word.classList.remove('dragging'));
  }
  sortBank.querySelectorAll('.sort-word').forEach(bind);
  document.querySelectorAll('.sort-drop').forEach(drop => {
    drop.addEventListener('dragover', e => { e.preventDefault(); drop.classList.add('drop-hover'); });
    drop.addEventListener('dragleave', () => drop.classList.remove('drop-hover'));
    drop.addEventListener('drop', e => {
      e.preventDefault(); drop.classList.remove('drop-hover');
      if (dragWord) drop.appendChild(dragWord);
    });
  });
  // Allow returning to bank
  sortBank.addEventListener('dragover', e => e.preventDefault());
  sortBank.addEventListener('drop', e => { e.preventDefault(); if (dragWord) sortBank.appendChild(dragWord); });

  document.getElementById('checkSort').addEventListener('click', () => {
    let ok = 0, total = 0;
    document.querySelectorAll('.sort-drop').forEach(drop => {
      drop.querySelectorAll('.sort-word').forEach(w => {
        total++;
        if (w.dataset.cat === drop.dataset.cat) {
          ok++; w.style.background = '#d1fae5'; w.style.borderColor = '#10b981';
        } else {
          w.style.background = '#fee2e2'; w.style.borderColor = '#ef4444';
        }
      });
    });
    sortBank.querySelectorAll('.sort-word').forEach(w => total++);
    const out = document.querySelector('.sort-result');
    out.textContent = `${ok} / ${total} placed correctly`;
    out.className = 'sort-result ' + (ok === total && total > 0 ? 'ok' : 'bad');
  });
}

/* ===== Listening: TTS ===== */
const playBtn = document.getElementById('playL3');
if (playBtn && 'speechSynthesis' in window) {
  let speaking = false;
  const transcript = document.getElementById('transcriptL3');
  playBtn.addEventListener('click', () => {
    if (speaking) {
      speechSynthesis.cancel();
      speaking = false;
      playBtn.classList.remove('playing');
      playBtn.querySelector('.play-icon').textContent = '▶';
      return;
    }
    const text = transcript.innerText;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US'; u.rate = 0.95; u.pitch = 1;
    u.onend = () => {
      speaking = false;
      playBtn.classList.remove('playing');
      playBtn.querySelector('.play-icon').textContent = '▶';
    };
    speechSynthesis.speak(u);
    speaking = true;
    playBtn.classList.add('playing');
    playBtn.querySelector('.play-icon').textContent = '⏸';
  });
} else if (playBtn) {
  playBtn.disabled = true;
  playBtn.title = 'Text-to-speech not available';
}

/* ===== Vocabulary grid ===== */
const grid = document.getElementById('vocabGrid');
function renderVocab(filter = 'all', q = '') {
  grid.innerHTML = '';
  const search = q.toLowerCase().trim();
  VOCAB.filter(v => (filter === 'all' || v.type === filter)
    && (!search || v.en.toLowerCase().includes(search) || v.ar.includes(search))
  ).forEach(v => {
    const card = document.createElement('div');
    card.className = 'vocab-card';
    card.innerHTML = `
      <div class="vocab-card-inner">
        <div class="vocab-card-front">
          <div class="vocab-card-en">${v.en}</div>
          <div class="vocab-card-def">${v.def}</div>
          <span class="vocab-card-type">${v.type}</span>
        </div>
        <div class="vocab-card-back">
          <div class="vocab-card-ar">${v.ar}</div>
          <span class="vocab-card-type">${v.type}</span>
        </div>
      </div>`;
    card.addEventListener('click', () => card.classList.toggle('flipped'));
    grid.appendChild(card);
  });
}
renderVocab();
document.getElementById('vocabSearch').addEventListener('input', e => {
  const active = document.querySelector('.filter-btn.active').dataset.filter;
  renderVocab(active, e.target.value);
});
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderVocab(btn.dataset.filter, document.getElementById('vocabSearch').value);
  });
});

/* ===== Flashcards ===== */
let flashIdx = 0;
const flashCard = document.getElementById('flashCard');
const flashEn = document.getElementById('flashEn');
const flashAr = document.getElementById('flashAr');
const flashType = document.getElementById('flashType');
const flashIdxEl = document.getElementById('flashIdx');
const flashTotalEl = document.getElementById('flashTotal');
flashTotalEl.textContent = VOCAB.length;
function renderFlash() {
  const v = VOCAB[flashIdx];
  flashEn.textContent = v.en;
  flashAr.textContent = v.ar;
  flashType.textContent = v.type;
  flashIdxEl.textContent = flashIdx + 1;
  flashCard.classList.remove('flipped');
}
flashCard.addEventListener('click', () => flashCard.classList.toggle('flipped'));
document.getElementById('flashFlip').addEventListener('click', e => {
  e.stopPropagation();
  flashCard.classList.toggle('flipped');
});
document.getElementById('flashNext').addEventListener('click', () => {
  flashIdx = (flashIdx + 1) % VOCAB.length;
  renderFlash();
});
document.getElementById('flashPrev').addEventListener('click', () => {
  flashIdx = (flashIdx - 1 + VOCAB.length) % VOCAB.length;
  renderFlash();
});
renderFlash();

/* ===== Download report (Lesson 7) ===== */
document.getElementById('downloadReport')?.addEventListener('click', () => {
  const fields = document.querySelectorAll('.outline textarea');
  const labels = ['Introduction','Paragraph 1 — The Importance of Community Service','Paragraph 2 — The Actions We Can Do','Conclusion'];
  let out = `My Report — Making a Difference\n${'='.repeat(40)}\n\n`;
  fields.forEach((t, i) => {
    out += `${labels[i]}\n${'-'.repeat(labels[i].length)}\n${t.value || '(empty)'}\n\n`;
  });
  const blob = new Blob([out], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'unit5-report.txt';
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
});

/* ===== To Top ===== */
const toTop = document.getElementById('toTop');
window.addEventListener('scroll', () => {
  toTop.classList.toggle('show', window.scrollY > 600);
});
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ===== Save open answers locally ===== */
document.querySelectorAll('textarea, .organiser textarea, .outline textarea, .chain input, .caption-grid input, .data-table.editable input').forEach((el, i) => {
  const key = `unit5-input-${el.placeholder || ''}-${i}`;
  const saved = localStorage.getItem(key);
  if (saved) el.value = saved;
  el.addEventListener('input', () => localStorage.setItem(key, el.value));
});
