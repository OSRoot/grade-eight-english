document.getElementById('year').textContent = new Date().getFullYear();

/* ===== XP ===== */
let XP = parseInt(localStorage.getItem('u7-xp') || '0', 10);
const XP_BAR = document.getElementById('xpBar');
const XP_VAL = document.getElementById('xpVal');
const XP_LEVEL = document.getElementById('xpLevel');
function syncXP() {
  XP_VAL.textContent = XP;
  const lvl = Math.floor(XP / 100) + 1;
  XP_LEVEL.textContent = (document.documentElement.lang === 'ar' ? `المستوى ${lvl}` : `Level ${lvl}`);
  XP_BAR.style.width = (XP % 100) + '%';
  localStorage.setItem('u7-xp', XP);
}
function addXP(n, msg) {
  XP += n; syncXP();
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
  const colors = ['#0891b2','#06b6d4','#f97316','#10b981','#f59e0b','#ec4899'];
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

/* ===== Nav ===== */
const navToggle = document.getElementById('navToggle');
const mainNav = document.querySelector('.main-nav');
navToggle.addEventListener('click', () => mainNav.classList.toggle('open'));
document.querySelectorAll('#navMenu a').forEach(a => a.addEventListener('click', () => mainNav.classList.remove('open')));

/* ===== Language ===== */
const langBtns = document.querySelectorAll('.lang-btn');
function applyLang(lang) {
  const dict = I18N[lang] || I18N.en;
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.body.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const k = el.getAttribute('data-i18n');
    if (dict[k] !== undefined) el.innerHTML = dict[k];
  });
  langBtns.forEach(b => {
    const active = b.dataset.lang === lang;
    b.classList.toggle('active', active);
    b.setAttribute('aria-pressed', active);
  });
  localStorage.setItem('u7-lang', lang);
  syncXP();
}
langBtns.forEach(b => b.addEventListener('click', () => applyLang(b.dataset.lang)));
applyLang(localStorage.getItem('u7-lang') || 'en');

/* ===== TTS helper ===== */
function speak(text, rate = 0.95) {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US'; u.rate = rate;
  speechSynthesis.speak(u);
}

/* ===== Vocab tooltips ===== */
function findVocab(word) {
  const w = word.toLowerCase().trim();
  return VOCAB.find(v => v.en.toLowerCase() === w || v.en.toLowerCase().includes(w));
}
document.querySelectorAll('.hl').forEach(el => {
  const w = el.textContent.trim().replace(/[.,!?;:]$/, '');
  const v = findVocab(w);
  if (v) el.title = `${v.ar}  —  ${v.def}`;
});

/* ===== Paragraph picker game ===== */
(function() {
  const wrap = document.getElementById('paragraphs');
  if (!wrap) return;
  let solved = 0;
  L1_PARAGRAPHS.forEach(p => {
    const card = document.createElement('div');
    card.className = 'par-card';
    card.innerHTML = `<p class="par-text"><b>Paragraph ${p.p}:</b> ${p.snippet}</p>
      <div class="par-options">
        ${p.options.map(o => `<button class="par-opt" data-v="${o}">${HEADING_LABELS[o]}</button>`).join('')}
      </div>`;
    wrap.appendChild(card);
    card.querySelectorAll('.par-opt').forEach(b => b.addEventListener('click', () => {
      card.querySelectorAll('.par-opt').forEach(o => o.classList.remove('correct','wrong'));
      const ok = b.dataset.v === p.correct;
      b.classList.add(ok ? 'correct' : 'wrong');
      if (ok && !card.dataset.done) {
        card.dataset.done = '1';
        solved++;
        addXP(4);
        const out = document.querySelector('.paragraphs-result');
        out.textContent = `${solved} / ${L1_PARAGRAPHS.length} correct`;
        out.className = 'paragraphs-result ' + (solved === L1_PARAGRAPHS.length ? 'ok' : '');
        if (solved === L1_PARAGRAPHS.length) { confetti(); toast('🎉 All headings matched!', 'success'); }
      }
    }));
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
    out.textContent = `${correct} / ${total} correct`;
    out.className = 'quiz-result ' + (correct === total ? 'ok' : 'bad');
    if (correct === total) { addXP(10, '+10 XP — Perfect!'); confetti(); }
    else if (correct > 0) addXP(correct * 2);
  });
});

/* ===== Travel card builder ===== */
(function() {
  const map = {
    tcCountry: 'tcvCountry', tcFlag: 'tcvFlag', tcWhy: 'tcvWhy',
    tcLearn: 'tcvLearn', tcAct: 'tcvAct', tcCuisine: 'tcvCuisine'
  };
  Object.keys(map).forEach(src => {
    const i = document.getElementById(src);
    const o = document.getElementById(map[src]);
    if (!i || !o) return;
    i.addEventListener('input', () => { o.textContent = i.value || (src === 'tcFlag' ? '🌍' : '—'); });
  });
})();

/* ===== Linker bridge game ===== */
(function() {
  const wrap = document.getElementById('linkerBridge');
  if (!wrap) return;
  let solved = 0;
  LINKER_BRIDGE.forEach((row, idx) => {
    const r = document.createElement('div');
    r.className = 'lb-row';
    const sentenceHtml = row.sentence.map(part => part === '<slot>' ? `<span class="lb-slot" data-row="${idx}"></span>` : part).join(' ');
    r.innerHTML = `<div class="lb-sentence">${sentenceHtml}</div>
      <div class="lb-options">
        ${row.options.map(o => `<button class="lb-opt" data-v="${o}" data-row="${idx}">${o}</button>`).join('')}
      </div>`;
    wrap.appendChild(r);
    r.querySelectorAll('.lb-opt').forEach(b => b.addEventListener('click', () => {
      const slot = r.querySelector('.lb-slot');
      slot.textContent = b.dataset.v;
      slot.classList.add('has-chip');
      slot.classList.remove('correct','wrong');
      r.querySelectorAll('.lb-opt').forEach(o => o.classList.remove('selected'));
      b.classList.add('selected');
      if (b.dataset.v === row.correct) {
        slot.classList.add('correct');
        if (!r.dataset.done) {
          r.dataset.done = '1'; solved++; addXP(4);
        }
      } else {
        slot.classList.add('wrong');
      }
      const out = document.querySelector('.bridge-result');
      out.textContent = `${solved} / ${LINKER_BRIDGE.length} correct`;
      out.className = 'bridge-result ' + (solved === LINKER_BRIDGE.length ? 'ok' : '');
      if (solved === LINKER_BRIDGE.length) { confetti(); toast('🎉 All bridges connected!', 'success'); }
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
      if (accepted.some(a => a && (val === a || val.includes(a)))) { inp.classList.add('ok'); ok++; }
      else inp.classList.add('bad');
    });
    const out = fill.querySelector('.fill-result');
    out.textContent = `${ok} / ${total} correct`;
    out.className = 'fill-result ' + (ok === total ? 'ok' : 'bad');
    if (ok === total) { addXP(10, '+10 XP — Filled it perfectly!'); confetti(); }
    else if (ok > 0) addXP(ok * 2);
  });
});

/* ===== Reorder ===== */
document.querySelectorAll('.check-reorder').forEach(btn => {
  btn.addEventListener('click', () => {
    const sec = btn.closest('.lesson');
    let ok = 0, total = 0;
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
    out.textContent = `${ok} / ${total} correct`;
    out.className = 'reorder-result ' + (ok === total ? 'ok' : 'bad');
    if (ok === total) { addXP(12, '+12 XP — Sentence wizard!'); confetti(); }
  });
});

/* ===== Trip linker counter ===== */
document.getElementById('tripCheck')?.addEventListener('click', () => {
  const t = (document.getElementById('tripStory').value || '').toLowerCase();
  const linkers = ['but','however','although','despite','in spite of'];
  let n = 0;
  const found = [];
  linkers.forEach(l => {
    const re = new RegExp(`\\b${l}\\b`, 'g');
    const matches = t.match(re);
    if (matches) { n += matches.length; found.push(`${l} (${matches.length})`); }
  });
  const out = document.getElementById('tripResult');
  if (n === 0) out.textContent = '😅 No contrast linkers yet — add some!';
  else out.textContent = `✅ Found ${n} contrast linker${n>1?'s':''}: ${found.join(', ')}`;
  if (n >= 2) { addXP(8, '+8 XP — Linker hunter!'); confetti(); }
});

/* ===== TTS for listening ===== */
(function() {
  const btn = document.getElementById('playL3');
  if (!btn || !('speechSynthesis' in window)) {
    if (btn) { btn.disabled = true; btn.title = 'TTS not available'; }
    return;
  }
  const transcript = document.getElementById('transcriptL3');
  const speedSel = document.getElementById('speedL3');
  let speaking = false;
  btn.addEventListener('click', () => {
    if (speaking) {
      speechSynthesis.cancel();
      speaking = false;
      btn.classList.remove('playing');
      btn.querySelector('.play-icon').textContent = '▶';
      return;
    }
    const u = new SpeechSynthesisUtterance(transcript.innerText);
    u.lang = 'en-US'; u.rate = parseFloat(speedSel?.value || '1');
    u.onend = () => {
      speaking = false;
      btn.classList.remove('playing');
      btn.querySelector('.play-icon').textContent = '▶';
    };
    speechSynthesis.speak(u);
    speaking = true;
    btn.classList.add('playing');
    btn.querySelector('.play-icon').textContent = '⏸';
  });
})();

/* ===== Intonation buttons ===== */
document.querySelectorAll('.int-line').forEach(line => {
  line.addEventListener('click', () => speak(line.dataset.speak, 0.95));
});

/* ===== Itinerary generator ===== */
(function() {
  const gen = document.getElementById('genItinerary');
  const dl = document.getElementById('downloadItinerary');
  const out = document.getElementById('itinerary');
  if (!gen) return;
  function readPlan() {
    const days = ['1–4','5–9','10–14','15–20'];
    return days.map((d, i) => ({
      days: d,
      dest: document.querySelector(`[data-key="dest${i+1}"]`).value || '—',
      act: document.querySelector(`[data-key="act${i+1}"]`).value || '—',
      tran: document.querySelector(`[data-key="tran${i+1}"]`).value || 'Plane',
    }));
  }
  function render() {
    const plan = readPlan();
    out.hidden = false;
    out.innerHTML = `<h3>🧳 My 20-Day World Trip</h3>` +
      plan.map(leg => `<div class="iti-leg">
        <b>Day ${leg.days}</b>
        <div><small>Destination</small><b>${leg.dest}</b></div>
        <div><small>Activity</small><b>${leg.act}</b></div>
        <div><small>Transport</small><b>${leg.tran}</b></div>
      </div>`).join('');
    addXP(8, '+8 XP — Itinerary planned!');
  }
  gen.addEventListener('click', render);
  dl.addEventListener('click', () => {
    const plan = readPlan();
    let txt = `MY 20-DAY WORLD TRIP\n${'='.repeat(40)}\n\n`;
    plan.forEach(leg => {
      txt += `Day ${leg.days}\n  Destination: ${leg.dest}\n  Activity: ${leg.act}\n  Transport: ${leg.tran}\n\n`;
    });
    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'unit7-itinerary.txt';
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
    addXP(5, '+5 XP — Itinerary saved!');
  });
})();

/* ===== Synonym match (drag) ===== */
(function() {
  const wrap = document.getElementById('synMatch');
  if (!wrap) return;
  let dragged = null;
  wrap.querySelectorAll('.match-item').forEach(el => {
    el.addEventListener('dragstart', e => { dragged = el; el.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; });
    el.addEventListener('dragend', () => el.classList.remove('dragging'));
  });
  wrap.querySelectorAll('.match-drop').forEach(drop => {
    drop.addEventListener('dragover', e => { e.preventDefault(); drop.classList.add('drop-hover'); });
    drop.addEventListener('dragleave', () => drop.classList.remove('drop-hover'));
    drop.addEventListener('drop', e => {
      e.preventDefault(); drop.classList.remove('drop-hover');
      if (!dragged) return;
      const existing = drop.querySelector('.match-item');
      if (existing) wrap.querySelector('.match-col.left').appendChild(existing);
      drop.appendChild(dragged);
      drop.classList.add('has-item');
    });
  });
  document.getElementById('checkSyn').addEventListener('click', () => {
    let ok = 0, total = 0;
    wrap.querySelectorAll('.match-drop').forEach(drop => {
      total++;
      drop.classList.remove('correct','wrong');
      const item = drop.querySelector('.match-item');
      if (item && item.dataset.id === drop.dataset.accepts) { drop.classList.add('correct'); ok++; }
      else if (item) drop.classList.add('wrong');
    });
    const out = document.querySelector('.syn-result');
    out.textContent = `${ok} / ${total} matched correctly`;
    out.className = 'syn-result ' + (ok === total ? 'ok' : 'bad');
    if (ok === total) { addXP(12, '+12 XP — Synonym pro!'); confetti(); }
  });
})();

/* ===== Future tense decision game ===== */
(function() {
  const wrap = document.getElementById('futureGame');
  if (!wrap) return;
  let answered = 0;
  FUTURE_QS.forEach(q => {
    const div = document.createElement('div');
    div.className = 'tg-q';
    div.innerHTML = `<p class="tg-sentence">${q.sentence}</p>
      <p class="muted" style="font-size:13px">💡 hint: ${q.note}</p>
      <div class="tg-options">
        ${q.options.map(o => `<button class="tg-opt" data-v="${o}">${FUTURE_LABELS[o]}</button>`).join('')}
      </div>`;
    wrap.appendChild(div);
    const opts = div.querySelectorAll('.tg-opt');
    opts.forEach(b => b.addEventListener('click', () => {
      opts.forEach(o => o.classList.remove('correct','wrong'));
      const ok = b.dataset.v === q.correct;
      b.classList.add(ok ? 'correct' : 'wrong');
      if (ok) {
        if (!div.dataset.done) { answered++; div.dataset.done = '1'; addXP(4); }
      } else {
        div.querySelector(`[data-v="${q.correct}"]`).classList.add('correct');
      }
      const out = document.querySelector('#lesson-6 .tense-result');
      out.textContent = `${answered} / ${FUTURE_QS.length} correct`;
      out.className = 'tense-result ' + (answered === FUTURE_QS.length ? 'ok' : '');
      if (answered === FUTURE_QS.length) { confetti(); toast('🎉 Future expert!', 'success'); }
    }));
  });
})();

/* ===== Download / Read report ===== */
document.getElementById('downloadReport')?.addEventListener('click', () => {
  const fields = document.querySelectorAll('#lesson-7 .outline textarea');
  const labels = ['Introduction','Paragraph 1 — How Technology Is Changing Travel','Paragraph 2 — Benefits of Travelling','Conclusion'];
  let txt = `MY EXPOSITORY REPORT — TRAVELLING (Real or Digital)\n${'='.repeat(60)}\n\n`;
  fields.forEach((t, i) => { txt += `${labels[i]}\n${'-'.repeat(labels[i].length)}\n${t.value || '(empty)'}\n\n`; });
  const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'unit7-travel-report.txt';
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
  addXP(15, '+15 XP — Report exported!');
});
document.getElementById('readReport')?.addEventListener('click', () => {
  const fields = document.querySelectorAll('#lesson-7 .outline textarea');
  const t = [...fields].map(f => f.value).filter(Boolean).join('. ');
  if (!t) { toast('Write your report first!', 'error'); return; }
  speak(t, 0.95);
  addXP(5);
});

/* ===== Vocab grid ===== */
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
    card.addEventListener('click', () => { card.classList.toggle('flipped'); speak(v.en, 0.85); });
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
  let firstTile = null, locked = false, matched = 0;
  const total = 8;
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
    score.textContent = `Pairs: 0 / ${total}`;
  }
  function onTile(t) {
    if (locked || t.classList.contains('flipped') || t.classList.contains('matched')) return;
    t.classList.add('flipped');
    if (!firstTile) { firstTile = t; return; }
    if (firstTile.dataset.pair === t.dataset.pair) {
      firstTile.classList.add('matched');
      t.classList.add('matched');
      firstTile = null; matched++;
      score.textContent = `Pairs: ${matched} / ${total}`;
      addXP(3);
      if (matched === total) { confetti(); toast('🏆 Board cleared!', 'success'); addXP(20); }
    } else {
      locked = true;
      const f = firstTile; firstTile = null;
      setTimeout(() => {
        f.classList.remove('flipped'); t.classList.remove('flipped');
        locked = false;
      }, 800);
    }
  }
  document.getElementById('memShuffle').addEventListener('click', newGame);
  newGame();
})();

/* ===== Flashcards ===== */
(function() {
  const flashCard = document.getElementById('flashCard');
  if (!flashCard) return;
  let idx = 0;
  const en = document.getElementById('flashEn');
  const ar = document.getElementById('flashAr');
  const tp = document.getElementById('flashType');
  const idxEl = document.getElementById('flashIdx');
  const totalEl = document.getElementById('flashTotal');
  totalEl.textContent = VOCAB.length;
  function render() {
    const v = VOCAB[idx];
    en.textContent = v.en; ar.textContent = v.ar; tp.textContent = v.type;
    idxEl.textContent = idx + 1;
    flashCard.classList.remove('flipped');
  }
  flashCard.addEventListener('click', () => flashCard.classList.toggle('flipped'));
  document.getElementById('flashFlip').addEventListener('click', e => { e.stopPropagation(); flashCard.classList.toggle('flipped'); });
  document.getElementById('flashNext').addEventListener('click', () => { idx = (idx+1)%VOCAB.length; render(); });
  document.getElementById('flashPrev').addEventListener('click', () => { idx = (idx-1+VOCAB.length)%VOCAB.length; render(); });
  render();
})();

/* ===== To Top ===== */
const toTop = document.getElementById('toTop');
window.addEventListener('scroll', () => toTop.classList.toggle('show', window.scrollY > 600));
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ===== Save inputs locally ===== */
document.querySelectorAll('textarea, .data-table.editable input, .data-table.editable select, .tcb-form input, .chal-row input').forEach((el, i) => {
  const key = `u7-input-${el.placeholder || el.dataset.key || ''}-${i}`;
  const saved = localStorage.getItem(key);
  if (saved && !el.value) el.value = saved;
  const ev = el.tagName === 'SELECT' ? 'change' : 'input';
  el.addEventListener(ev, () => localStorage.setItem(key, el.value));
});
