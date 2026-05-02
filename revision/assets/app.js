document.getElementById('year').textContent = new Date().getFullYear();

/* ===== XP ===== */
let XP = parseInt(localStorage.getItem('rev-xp') || '0', 10);
const XP_BAR = document.getElementById('xpBar');
const XP_VAL = document.getElementById('xpVal');
const XP_LEVEL = document.getElementById('xpLevel');
function syncXP() {
  XP_VAL.textContent = XP;
  const level = Math.floor(XP / 100) + 1;
  XP_LEVEL.textContent = (document.documentElement.lang === 'en' ? `Level ${level}` : `المستوى ${level}`);
  XP_BAR.style.width = ((XP % 100)) + '%';
  localStorage.setItem('rev-xp', XP);
}
function addXP(n, msg) {
  XP += n;
  syncXP();
  if (msg) toast(msg, 'success');
  if (XP > 0 && XP % 100 === 0) confetti();
}
syncXP();

/* ===== Toast ===== */
const TOAST = document.getElementById('toast');
let toastTimer = null;
function toast(msg, kind = '') {
  TOAST.textContent = msg;
  TOAST.className = 'toast show ' + kind;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => TOAST.className = 'toast ' + kind, 1800);
}

/* ===== Confetti ===== */
function confetti() {
  const colors = ['#0ea5e9','#6366f1','#8b5cf6','#10b981','#f59e0b','#ef4444'];
  for (let i = 0; i < 60; i++) {
    const c = document.createElement('span');
    c.className = 'confetti';
    c.style.left = (Math.random()*100) + 'vw';
    c.style.background = colors[i % colors.length];
    c.style.animationDelay = (Math.random()*0.6) + 's';
    c.style.animationDuration = (1.5 + Math.random()*1) + 's';
    c.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 3000);
  }
}

/* ===== Mobile nav ===== */
const navToggle = document.getElementById('navToggle');
const mainNav = document.querySelector('.main-nav');
navToggle.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);
});
document.querySelectorAll('#navMenu a').forEach(a => {
  a.addEventListener('click', () => mainNav.classList.remove('open'));
});

/* ===== Language ===== */
const langBtns = document.querySelectorAll('.lang-btn');
function applyLang(lang) {
  const dict = I18N[lang] || I18N.ar;
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
  localStorage.setItem('rev-lang', lang);
  syncXP();
}
langBtns.forEach(b => b.addEventListener('click', () => applyLang(b.dataset.lang)));
applyLang(localStorage.getItem('rev-lang') || 'ar');

/* ===== TTS helper ===== */
function speak(text, rate = 0.9) {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US';
  u.rate = rate;
  speechSynthesis.speak(u);
}
document.querySelectorAll('[data-speak]').forEach(b => b.addEventListener('click', () => speak(b.dataset.speak)));

/* ===== Section 1: Letters ===== */
const VOWELS = ['A','E','I','O','U'];
const CONS_WORD = "BCDFGHJKLMNPQRSTVWXYZ".split('');
const cRow = document.getElementById('consonants');
CONS_WORD.forEach(c => {
  const b = document.createElement('button');
  b.className = 'letter';
  b.textContent = `${c} ${c.toLowerCase()}`;
  b.dataset.letter = c;
  cRow.appendChild(b);
});
document.querySelectorAll('.letter').forEach(b => {
  b.addEventListener('click', () => speak(b.dataset.letter, 0.7));
});

/* Sort game */
(function() {
  const bank = document.getElementById('lSortBank');
  if (!bank) return;
  let dragged = null;
  function bind(el) {
    el.addEventListener('dragstart', e => { dragged = el; el.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; });
    el.addEventListener('dragend', () => el.classList.remove('dragging'));
  }
  bank.querySelectorAll('.sort-w').forEach(bind);
  document.querySelectorAll('.sort-drop').forEach(drop => {
    drop.addEventListener('dragover', e => { e.preventDefault(); drop.classList.add('drop-hover'); });
    drop.addEventListener('dragleave', () => drop.classList.remove('drop-hover'));
    drop.addEventListener('drop', e => {
      e.preventDefault(); drop.classList.remove('drop-hover');
      if (dragged) drop.appendChild(dragged);
    });
  });
  bank.addEventListener('dragover', e => e.preventDefault());
  bank.addEventListener('drop', e => { e.preventDefault(); if (dragged) bank.appendChild(dragged); });

  document.getElementById('checkSort').addEventListener('click', () => {
    let ok = 0, total = 0;
    document.querySelectorAll('.sort-drop').forEach(drop => {
      drop.querySelectorAll('.sort-w').forEach(w => {
        total++;
        if (w.dataset.cat === drop.dataset.cat) { ok++; w.style.background = '#d1fae5'; w.style.borderColor = '#10b981'; }
        else { w.style.background = '#fee2e2'; w.style.borderColor = '#ef4444'; }
      });
    });
    bank.querySelectorAll('.sort-w').forEach(() => total++);
    const out = document.querySelector('.sort-result');
    out.textContent = `${ok} / ${total} صحيحة`;
    out.className = 'sort-result ' + (ok === total ? 'ok' : 'bad');
    if (ok === total && total > 0) { addXP(10, '+10 XP — أحسنت!'); confetti(); markProgress('s1'); }
  });
})();

/* Count vowels game */
(function() {
  const wrap = document.getElementById('countGame');
  if (!wrap) return;
  COUNT_WORDS.forEach((w, i) => {
    const div = document.createElement('div');
    div.className = 'count-item';
    div.innerHTML = `<div class="count-word">${w.word}</div>
      <input type="number" min="0" max="10" placeholder="?" data-correct="${w.vowels}">
      <div><span class="reveal" style="display:none">${w.vowels} متحرك</span></div>`;
    wrap.appendChild(div);
    const inp = div.querySelector('input');
    const rev = div.querySelector('.reveal');
    inp.addEventListener('change', () => {
      inp.classList.remove('ok','bad');
      const v = parseInt(inp.value, 10);
      if (v === w.vowels) { inp.classList.add('ok'); rev.style.display = 'inline-block'; addXP(2); }
      else inp.classList.add('bad');
    });
  });
})();

/* ===== Quizzes ===== */
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
          q.querySelector(`input[value="${ans}"]`)?.closest('label').classList.add('correct');
        }
      } else {
        q.querySelector(`input[value="${ans}"]`)?.closest('label').classList.add('correct');
      }
    });
    const out = quiz.querySelector('.quiz-result');
    out.textContent = `${correct} / ${total} صحيحة`;
    out.className = 'quiz-result ' + (correct === total ? 'ok' : 'bad');
    if (correct === total) { addXP(15, '+15 XP — ممتاز!'); confetti(); markProgress(quiz.closest('.lesson').id); }
    else if (correct > 0) addXP(correct * 2);
  });
});

/* ===== Pronoun drag game ===== */
(function() {
  const bank = document.getElementById('proBank');
  if (!bank) return;
  let dragged = null;
  function bind(el) {
    el.addEventListener('dragstart', e => { dragged = el; el.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; });
    el.addEventListener('dragend', () => el.classList.remove('dragging'));
  }
  bank.querySelectorAll('.rfx-chip').forEach(bind);

  document.querySelectorAll('#s2 .rfx-slot').forEach(slot => {
    slot.addEventListener('dragover', e => { e.preventDefault(); slot.classList.add('drop-hover'); });
    slot.addEventListener('dragleave', () => slot.classList.remove('drop-hover'));
    slot.addEventListener('drop', e => {
      e.preventDefault(); slot.classList.remove('drop-hover');
      if (!dragged) return;
      const existing = slot.querySelector('.rfx-chip');
      if (existing) bank.appendChild(existing);
      slot.appendChild(dragged);
      slot.classList.add('has-chip');
    });
  });
  bank.addEventListener('dragover', e => e.preventDefault());
  bank.addEventListener('drop', e => { e.preventDefault(); if (dragged) bank.appendChild(dragged); });

  document.getElementById('checkPro').addEventListener('click', () => {
    let ok = 0, total = 0;
    document.querySelectorAll('#s2 .rfx-slot').forEach(slot => {
      total++;
      slot.classList.remove('correct','wrong');
      const chip = slot.querySelector('.rfx-chip');
      if (chip && chip.dataset.w === slot.dataset.need) { slot.classList.add('correct'); ok++; }
      else slot.classList.add('wrong');
    });
    const out = document.querySelector('.pro-result');
    out.textContent = `${ok} / ${total} صحيحة`;
    out.className = 'pro-result ' + (ok === total ? 'ok' : 'bad');
    if (ok === total) { addXP(15, '+15 XP — رائع!'); confetti(); markProgress('s2'); }
  });
})();

/* ===== Vocab grid (Section 3) ===== */
const grid = document.getElementById('vocabGrid');
function renderVocab(filter = 'all', q = '') {
  if (!grid) return;
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
          <div class="vocab-card-def">${v.def || ''}</div>
          <span class="vocab-card-type">${v.type}</span>
        </div>
        <div class="vocab-card-back">
          <div class="vocab-card-ar">${v.ar}</div>
          <span class="vocab-card-type">${v.type}</span>
        </div>
      </div>`;
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
      speak(v.en, 0.85);
    });
    grid.appendChild(card);
  });
}
renderVocab();
document.getElementById('vocabSearch')?.addEventListener('input', e => {
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

/* ===== Memory match ===== */
(function() {
  const memGrid = document.getElementById('memGrid');
  const score = document.getElementById('memScore');
  if (!memGrid) return;
  let firstTile = null, locked = false, matched = 0, total = 8;

  function newGame() {
    matched = 0; firstTile = null;
    memGrid.innerHTML = '';
    const pick = [...VOCAB].filter(v => v.def).sort(() => Math.random() - 0.5).slice(0, 8);
    const tiles = [];
    pick.forEach(v => {
      tiles.push({ pair: v.en, side: 'en', text: v.en });
      tiles.push({ pair: v.en, side: 'ar', text: v.ar });
    });
    tiles.sort(() => Math.random() - 0.5);
    tiles.forEach(t => {
      const btn = document.createElement('button');
      btn.className = 'mem-tile';
      btn.dataset.pair = t.pair;
      btn.innerHTML = `<div class="mem-tile-inner">
        <div class="mem-tile-front">?</div>
        <div class="mem-tile-back ${t.side}">${t.text}</div>
      </div>`;
      btn.addEventListener('click', () => onTile(btn));
      memGrid.appendChild(btn);
    });
    score.textContent = `الأزواج: 0 / ${total}`;
  }
  function onTile(t) {
    if (locked || t.classList.contains('flipped') || t.classList.contains('matched')) return;
    t.classList.add('flipped');
    if (!firstTile) { firstTile = t; return; }
    if (firstTile.dataset.pair === t.dataset.pair) {
      firstTile.classList.add('matched');
      t.classList.add('matched');
      firstTile = null;
      matched++;
      score.textContent = `الأزواج: ${matched} / ${total}`;
      addXP(3);
      if (matched === total) { confetti(); toast('🏆 أنجزت اللوحة!', 'success'); addXP(20); markProgress('s3'); }
    } else {
      locked = true;
      const f = firstTile; firstTile = null;
      setTimeout(() => {
        f.classList.remove('flipped');
        t.classList.remove('flipped');
        locked = false;
      }, 800);
    }
  }
  document.getElementById('memShuffle').addEventListener('click', newGame);
  newGame();
})();

/* ===== Tenses tabs ===== */
document.querySelectorAll('.tt-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tt-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tt-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.querySelector(`.tt-panel[data-panel="${btn.dataset.tab}"]`).classList.add('active');
  });
});

/* ===== Verb conjugator ===== */
(function() {
  const vSel = document.getElementById('conjVerb');
  const sSel = document.getElementById('conjSub');
  if (!vSel) return;
  function update() {
    const [v1, v2, ving] = vSel.value.split('|');
    const sub = sSel.value;
    const isHe = ['He','She','It'].includes(sub);
    const ams = sub === 'I' ? 'am' : isHe ? 'is' : 'are';
    const wasW = sub === 'I' || isHe ? 'was' : 'were';
    const v1s = isHe ? (v1.endsWith('y') && !'aeiou'.includes(v1.slice(-2,-1)) ? v1.slice(0,-1)+'ies' :
                       /(s|sh|ch|x|o)$/.test(v1) ? v1+'es' : v1+'s') : v1;
    const aregt = sub === 'I' ? 'am going to' : isHe ? 'is going to' : 'are going to';
    document.getElementById('conjPres').textContent = `${sub} ${v1s}.`;
    document.getElementById('conjPresC').textContent = `${sub} ${ams} ${ving}.`;
    document.getElementById('conjPast').textContent = `${sub} ${v2}.`;
    document.getElementById('conjPastC').textContent = `${sub} ${wasW} ${ving}.`;
    document.getElementById('conjFut').textContent = `${sub} will ${v1}.`;
    document.getElementById('conjFutG').textContent = `${sub} ${aregt} ${v1}.`;
    document.getElementById('conjImp').textContent = `${v1.charAt(0).toUpperCase() + v1.slice(1)}!`;
  }
  vSel.addEventListener('change', update);
  sSel.addEventListener('change', update);
  update();
})();

/* ===== Tense identification game ===== */
(function() {
  const wrap = document.getElementById('tenseGame');
  if (!wrap) return;
  let answered = 0;
  TENSE_QS.forEach((q) => {
    const div = document.createElement('div');
    div.className = 'tg-q';
    div.innerHTML = `<p class="tg-sentence">${q.sentence}</p><div class="tg-options">` +
      q.options.map(o => `<button class="tg-opt" data-v="${o}">${TENSE_LABELS[o]}</button>`).join('') + '</div>';
    wrap.appendChild(div);
    const opts = div.querySelectorAll('.tg-opt');
    opts.forEach(b => b.addEventListener('click', () => {
      opts.forEach(o => o.classList.remove('correct','wrong'));
      const ok = b.dataset.v === q.correct;
      b.classList.add(ok ? 'correct' : 'wrong');
      if (ok) {
        if (!div.dataset.done) { answered++; div.dataset.done = '1'; addXP(3); }
      } else {
        div.querySelector(`[data-v="${q.correct}"]`).classList.add('correct');
      }
      const out = document.querySelector('.tense-result');
      out.textContent = `${answered} / ${TENSE_QS.length} صحيحة`;
      out.className = 'tense-result ' + (answered === TENSE_QS.length ? 'ok' : '');
      if (answered === TENSE_QS.length) { confetti(); toast('🎉 خبير في الأزمنة!', 'success'); markProgress('s4'); }
    }));
  });
})();

/* ===== Fill ===== */
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
      if (accepted.some(a => val === a || (a && val.includes(a)))) { inp.classList.add('ok'); ok++; }
      else inp.classList.add('bad');
    });
    const out = fill.querySelector('.fill-result');
    out.textContent = `${ok} / ${total} صحيحة`;
    out.className = 'fill-result ' + (ok === total ? 'ok' : 'bad');
    if (ok === total) { addXP(12, '+12 XP — ممتاز!'); confetti(); }
    else if (ok > 0) addXP(ok * 2);
  });
});

/* ===== Bubble pairs ===== */
document.querySelectorAll('.bubble-pair').forEach(pair => {
  pair.querySelector('.direct').addEventListener('click', () => {
    pair.querySelector('.reported').classList.toggle('hidden');
    addXP(1);
  });
});

/* ===== Reorder ===== */
document.querySelectorAll('.check-reorder').forEach(btn => {
  btn.addEventListener('click', () => {
    let ok = 0, total = 0;
    const sec = btn.closest('.lesson');
    sec.querySelectorAll('.reorder-q').forEach(q => {
      total++;
      const accepted = q.dataset.correct.split('|').map(normalize);
      const inp = q.querySelector('input');
      const val = normalize(inp.value);
      inp.classList.remove('ok','bad');
      if (accepted.includes(val)) { inp.classList.add('ok'); ok++; }
      else inp.classList.add('bad');
    });
    const out = sec.querySelector('.reorder-result');
    out.textContent = `${ok} / ${total} صحيحة`;
    out.className = 'reorder-result ' + (ok === total ? 'ok' : 'bad');
    if (ok === total) { addXP(15, '+15 XP — تحويل احترافي!'); confetti(); markProgress('s5'); }
  });
});

/* ===== Final test ===== */
(function() {
  const wrap = document.getElementById('finalTest');
  const startBtn = document.getElementById('startTest');
  const submitBtn = document.getElementById('submitTest');
  const retakeBtn = document.getElementById('retakeTest');
  const timerEl = document.getElementById('testTimer');
  const progEl = document.getElementById('testProgress');
  const scoreEl = document.getElementById('testScore');
  const resultEl = document.getElementById('testResult');
  if (!wrap) return;
  let timerId = null, started = 0;

  function fmtTime(s) {
    const m = Math.floor(s/60), ss = s%60;
    return `${String(m).padStart(2,'0')}:${String(ss).padStart(2,'0')}`;
  }
  function tick() {
    timerEl.textContent = fmtTime(Math.floor((Date.now() - started) / 1000));
  }
  function build() {
    wrap.innerHTML = '';
    FINAL_TEST.forEach((q, i) => {
      const div = document.createElement('div');
      div.className = 'q mcq';
      div.dataset.correct = q.correct;
      div.innerHTML = `<p class="q-text">${i+1}. ${q.q}</p>` +
        q.options.map(o => `<label><input type="radio" name="ftq${i}" value="${o.v}"><span>${o.v}. ${o.t}</span></label>`).join('');
      wrap.appendChild(div);
    });
    progEl.textContent = `0 / ${FINAL_TEST.length}`;
    scoreEl.textContent = '0';
    resultEl.hidden = true;
    submitBtn.disabled = true;
    wrap.addEventListener('change', updateProgress);
  }
  function updateProgress() {
    let answered = 0;
    wrap.querySelectorAll('.q.mcq').forEach(q => {
      if (q.querySelector('input[type="radio"]:checked')) answered++;
    });
    progEl.textContent = `${answered} / ${FINAL_TEST.length}`;
    submitBtn.disabled = answered < FINAL_TEST.length;
  }
  startBtn.addEventListener('click', () => {
    build();
    started = Date.now();
    clearInterval(timerId);
    timerId = setInterval(tick, 1000);
    tick();
    startBtn.disabled = true;
  });
  submitBtn.addEventListener('click', () => {
    let correct = 0;
    wrap.querySelectorAll('.q.mcq').forEach(q => {
      const ans = q.dataset.correct;
      const sel = q.querySelector('input[type="radio"]:checked');
      q.querySelectorAll('label').forEach(l => l.classList.remove('correct','wrong'));
      if (sel) {
        const lbl = sel.closest('label');
        if (sel.value === ans) { lbl.classList.add('correct'); correct++; }
        else {
          lbl.classList.add('wrong');
          q.querySelector(`input[value="${ans}"]`)?.closest('label').classList.add('correct');
        }
      }
    });
    scoreEl.textContent = correct;
    clearInterval(timerId);
    const pct = Math.round((correct / FINAL_TEST.length) * 100);
    document.getElementById('bigScore').textContent = pct + '%';
    let grade = '', summary = '';
    if (pct >= 90) { grade = '🌟 ممتاز · Excellent'; summary = 'تستحق التقدير الكامل!'; addXP(50, '+50 XP — Test passed!'); confetti(); }
    else if (pct >= 75) { grade = '✨ جيد جدًا · Very Good'; summary = 'أداء قوي جدًا!'; addXP(30); confetti(); }
    else if (pct >= 60) { grade = '👍 جيد · Good'; summary = 'تحتاج لمراجعة بعض الأقسام.'; addXP(15); }
    else { grade = '📚 يحتاج لتحسين'; summary = 'راجع الأقسام مرة أخرى وأعد المحاولة.'; }
    document.getElementById('testGrade').textContent = grade;
    document.getElementById('testSummary').textContent = summary + ` (${correct}/${FINAL_TEST.length})`;
    resultEl.hidden = false;
    submitBtn.disabled = true;
    markProgress('test');
  });
  retakeBtn?.addEventListener('click', () => {
    startBtn.disabled = false;
    build();
  });
  build();
})();

/* ===== Progress meter ===== */
function markProgress(id) {
  const done = JSON.parse(localStorage.getItem('rev-progress') || '{}');
  done[id] = true;
  localStorage.setItem('rev-progress', JSON.stringify(done));
  syncProgress();
}
function syncProgress() {
  const done = JSON.parse(localStorage.getItem('rev-progress') || '{}');
  const sections = ['s1','s2','s3','s4','s5','test'];
  const completed = sections.filter(s => done[s]).length;
  const pct = Math.round(completed / sections.length * 100);
  document.getElementById('progressMeter').style.width = pct + '%';
  document.getElementById('progressText').textContent = pct + '%';
}
syncProgress();

/* ===== To Top ===== */
const toTop = document.getElementById('toTop');
window.addEventListener('scroll', () => {
  toTop.classList.toggle('show', window.scrollY > 600);
});
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
