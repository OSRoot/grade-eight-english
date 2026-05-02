/* ===== Year ===== */
document.getElementById('year').textContent = new Date().getFullYear();

/* ===== XP system ===== */
let XP = parseInt(localStorage.getItem('u6-xp') || '0', 10);
const XP_BAR = document.getElementById('xpBar');
const XP_VAL = document.getElementById('xpVal');
const XP_LEVEL = document.getElementById('xpLevel');
function syncXP() {
  XP_VAL.textContent = XP;
  const level = Math.floor(XP / 100) + 1;
  XP_LEVEL.textContent = `Level ${level}`;
  XP_BAR.style.width = ((XP % 100)) + '%';
  localStorage.setItem('u6-xp', XP);
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
  const colors = ['#ec4899','#8b5cf6','#3b82f6','#10b981','#f59e0b','#ef4444'];
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
  localStorage.setItem('u6-lang', lang);
}
langBtns.forEach(b => b.addEventListener('click', () => applyLang(b.dataset.lang)));
applyLang(localStorage.getItem('u6-lang') || 'en');

/* ===== Vocab tooltips ===== */
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
  }
});

/* ===== Poll ===== */
const POLL_KEY = 'u6-poll';
const pollData = JSON.parse(localStorage.getItem(POLL_KEY) || '{}');
function renderPoll(rowId, agree, disagree, mySel) {
  const row = document.querySelector(`.poll-row[data-id="${rowId}"]`);
  if (!row) return;
  const total = agree + disagree;
  const pct = total ? (agree / total) * 100 : 0;
  const fill = row.querySelector('.poll-fill');
  fill.style.width = pct + '%';
  fill.style.background = pct >= 50 ? 'var(--green)' : 'var(--accent-2)';
  row.querySelectorAll('.poll-btn').forEach(b => b.classList.toggle('selected', b.dataset.vote === mySel));
}
document.querySelectorAll('#poll1 .poll-row').forEach(row => {
  const id = row.dataset.id;
  const data = pollData[id] || { agree: Math.floor(Math.random()*8)+2, disagree: Math.floor(Math.random()*8)+2, my: null };
  pollData[id] = data;
  if (data.my) renderPoll(id, data.agree, data.disagree, data.my);
  row.querySelectorAll('.poll-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (data.my === btn.dataset.vote) return;
      if (data.my) data[data.my]--;
      data.my = btn.dataset.vote;
      data[data.my]++;
      pollData[id] = data;
      localStorage.setItem(POLL_KEY, JSON.stringify(pollData));
      renderPoll(id, data.agree, data.disagree, data.my);
      addXP(2);
    });
  });
});

/* ===== Persuasive Hunt (drag) ===== */
(function() {
  const bank = document.getElementById('huntBank');
  if (!bank) return;
  let dragged = null;
  function bind(el) {
    el.addEventListener('dragstart', e => { dragged = el; el.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; });
    el.addEventListener('dragend', () => el.classList.remove('dragging'));
  }
  bank.querySelectorAll('.hunt-item').forEach(bind);
  document.querySelectorAll('.hunt-drop').forEach(drop => {
    drop.addEventListener('dragover', e => { e.preventDefault(); drop.classList.add('drop-hover'); });
    drop.addEventListener('dragleave', () => drop.classList.remove('drop-hover'));
    drop.addEventListener('drop', e => {
      e.preventDefault(); drop.classList.remove('drop-hover');
      if (dragged) drop.appendChild(dragged);
    });
  });
  bank.addEventListener('dragover', e => e.preventDefault());
  bank.addEventListener('drop', e => { e.preventDefault(); if (dragged) bank.appendChild(dragged); });

  document.getElementById('checkHunt').addEventListener('click', () => {
    let ok = 0, total = 0;
    document.querySelectorAll('.hunt-drop').forEach(drop => {
      drop.classList.remove('correct','wrong');
      const items = drop.querySelectorAll('.hunt-item');
      items.forEach(it => {
        total++;
        if (it.dataset.tech === drop.dataset.tech) ok++;
      });
      const right = [...items].every(it => it.dataset.tech === drop.dataset.tech) && items.length > 0;
      if (items.length) drop.classList.add(right ? 'correct' : 'wrong');
    });
    const out = document.querySelector('.hunt-result');
    if (total === 0) { out.textContent = 'Drag the items first!'; out.className = 'hunt-result bad'; return; }
    out.textContent = `${ok} / ${total} placed correctly`;
    out.className = 'hunt-result ' + (ok === total ? 'ok' : 'bad');
    if (ok === total) { addXP(15, '+15 XP — Persuasive ace!'); confetti(); }
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
    if (total === 0) return;
    out.textContent = `${correct} / ${total} correct`;
    out.className = 'quiz-result ' + (correct === total ? 'ok' : 'bad');
    if (correct === total) { addXP(10, '+10 XP — Perfect score!'); confetti(); }
    else if (correct > 0) addXP(correct * 2);
  });
});

/* ===== Type cards ===== */
document.querySelectorAll('.type-cards').forEach(group => {
  const correct = group.dataset.correct;
  group.querySelectorAll('.type-card').forEach(card => {
    card.addEventListener('click', () => {
      group.querySelectorAll('.type-card').forEach(c => c.classList.remove('correct','wrong'));
      const ok = card.dataset.type === correct;
      card.classList.add(ok ? 'correct' : 'wrong');
      const out = group.parentElement.querySelector('.type-result');
      out.textContent = ok ? '✓ Correct! Persuasive writing aims to convince the reader.' : 'Try again — what does this writing want you to do?';
      out.className = 'type-result ' + (ok ? 'ok' : 'bad');
      if (ok) addXP(8, '+8 XP — Genre identified!');
    });
  });
});

/* ===== Bubble pairs (toggle reveal) ===== */
document.querySelectorAll('.bubble-pair').forEach(pair => {
  pair.querySelector('.direct').addEventListener('click', () => {
    pair.querySelector('.reported').classList.toggle('hidden');
  });
});

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
      if (accepted.includes(val)) { inp.classList.add('ok'); ok++; }
      else inp.classList.add('bad');
    });
    const out = fill.querySelector('.fill-result');
    out.textContent = `${ok} / ${total} correct`;
    out.className = 'fill-result ' + (ok === total ? 'ok' : 'bad');
    if (ok === total) { addXP(10, '+10 XP — Filled it perfectly!'); confetti(); }
    else if (ok > 0) addXP(ok * 2);
  });
});

/* ===== Pass the message game ===== */
(function() {
  const direct = document.getElementById('passDirect');
  const input = document.getElementById('passInput');
  const out = document.querySelector('.pass-result');
  let cur = PASS_SENTENCES[0];
  function pick() {
    cur = PASS_SENTENCES[Math.floor(Math.random()*PASS_SENTENCES.length)];
    direct.textContent = `"${cur.direct}" said ${cur.subject}.`;
    input.value = '';
    out.textContent = '';
    out.className = 'pass-result';
  }
  document.getElementById('passNew')?.addEventListener('click', pick);
  document.getElementById('passCheck')?.addEventListener('click', () => {
    const v = normalize(input.value);
    const target = normalize(cur.reported);
    if (v === target) {
      out.textContent = '✓ Excellent! ' + cur.reported;
      out.className = 'pass-result ok';
      addXP(8, '+8 XP — Message passed!');
    } else {
      out.innerHTML = `Almost! Expected: <em>${cur.reported}</em>`;
      out.className = 'pass-result bad';
    }
  });
})();

/* ===== Match-list (L3) ===== */
document.getElementById('checkML3')?.addEventListener('click', () => {
  let ok = 0, total = 0;
  document.querySelectorAll('#matchL3 .ml-select').forEach(sel => {
    total++;
    sel.classList.remove('ok','bad');
    if (sel.value === sel.dataset.correct) { sel.classList.add('ok'); ok++; }
    else sel.classList.add('bad');
  });
  const out = document.querySelector('.ml-result');
  out.textContent = `${ok} / ${total} matched correctly`;
  out.className = 'ml-result ' + (ok === total ? 'ok' : 'bad');
  if (ok === total) { addXP(8, '+8 XP — Perfect match!'); }
});

/* ===== Listening TTS ===== */
function setupTTS(btnId, transcriptId, speedSelId) {
  const btn = document.getElementById(btnId);
  const transcript = document.getElementById(transcriptId);
  const speedSel = document.getElementById(speedSelId);
  if (!btn || !('speechSynthesis' in window)) {
    if (btn) { btn.disabled = true; btn.title = 'TTS not available'; }
    return;
  }
  let speaking = false;
  btn.addEventListener('click', () => {
    if (speaking) {
      speechSynthesis.cancel();
      speaking = false;
      btn.classList.remove('playing');
      btn.querySelector('.play-icon').textContent = '▶';
      return;
    }
    const text = transcript.innerText;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    u.rate = parseFloat(speedSel?.value || '1');
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
}
setupTTS('playL3', 'transcriptL3', 'speedL3');

/* Speech read-aloud */
document.getElementById('speakSpeech')?.addEventListener('click', () => {
  if (!('speechSynthesis' in window)) return;
  const text = [...document.querySelectorAll('.speech-builder input[type="text"]')].map(i => i.value).filter(Boolean).join('. ');
  if (!text) { toast('Fill in your speech first!', 'error'); return; }
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US'; u.rate = 0.95;
  speechSynthesis.speak(u);
  addXP(5, '+5 XP — Speech delivered!');
});

/* ===== Scale (For/Against drag) ===== */
(function() {
  const bank = document.getElementById('scaleBank');
  if (!bank) return;
  let dragged = null;
  function bind(el) {
    el.addEventListener('dragstart', e => { dragged = el; el.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; });
    el.addEventListener('dragend', () => el.classList.remove('dragging'));
  }
  bank.querySelectorAll('.scale-card').forEach(bind);
  document.querySelectorAll('.scale-drop').forEach(drop => {
    drop.addEventListener('dragover', e => { e.preventDefault(); drop.classList.add('drop-hover'); });
    drop.addEventListener('dragleave', () => drop.classList.remove('drop-hover'));
    drop.addEventListener('drop', e => {
      e.preventDefault(); drop.classList.remove('drop-hover');
      if (dragged) { drop.appendChild(dragged); update(); }
    });
  });
  bank.addEventListener('dragover', e => e.preventDefault());
  bank.addEventListener('drop', e => { e.preventDefault(); if (dragged) { bank.appendChild(dragged); update(); } });
  function update() {
    const f = document.querySelector('.scale-drop[data-side="for"]').children.length;
    const a = document.querySelector('.scale-drop[data-side="against"]').children.length;
    document.getElementById('scaleCounter').textContent = `For: ${f}  ·  Against: ${a}`;
  }
})();

/* ===== Antonym game ===== */
(function() {
  const wrap = document.getElementById('antGame');
  if (!wrap) return;
  ANTONYMS.forEach((a, i) => {
    const div = document.createElement('div');
    div.className = 'ant-q';
    div.innerHTML = `<div class="ant-word">${a.word}</div><div class="ant-options">` +
      a.options.map(o => `<button class="ant-opt" data-w="${o}">${o}</button>`).join('') + '</div>';
    wrap.appendChild(div);
    div.querySelectorAll('.ant-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        const ok = btn.dataset.w === a.correct;
        div.querySelectorAll('.ant-opt').forEach(b => b.classList.remove('correct','wrong'));
        btn.classList.add(ok ? 'correct' : 'wrong');
        if (ok) addXP(5);
        const out = document.querySelector('.ant-result');
        const correct = wrap.querySelectorAll('.ant-opt.correct').length;
        out.textContent = `${correct} / ${ANTONYMS.length} correct`;
        out.className = 'ant-result ' + (correct === ANTONYMS.length ? 'ok' : '');
        if (correct === ANTONYMS.length) { confetti(); toast('🎉 Antonym master!', 'success'); }
      });
    });
  });
})();

/* ===== Infographic builder ===== */
(function() {
  const map = {
    ibTitle: 'ibPvTitle', ibV1: 'ibPvV1', ibT1: 'ibPvT1',
    ibV2: 'ibPvV2', ibT2: 'ibPvT2', ibQ: 'ibPvQ'
  };
  Object.keys(map).forEach(src => {
    const i = document.getElementById(src);
    const o = document.getElementById(map[src]);
    if (!i || !o) return;
    i.addEventListener('input', () => {
      const txt = i.value || o.dataset.placeholder || o.textContent;
      if (src === 'ibQ') o.textContent = `"${i.value || 'Your quote/stat appears here.'}"`;
      else o.textContent = i.value || o.textContent;
    });
  });
  document.getElementById('ibDownload')?.addEventListener('click', () => {
    const node = document.getElementById('ibPreview');
    const w = node.offsetWidth, h = node.offsetHeight;
    const data = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
      <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml">${node.outerHTML}</div>
      </foreignObject>
    </svg>`;
    const blob = new Blob([data], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'trust-infographic.svg';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    addXP(8, '+8 XP — Infographic exported!');
  });
})();

/* ===== Reflexive drag game ===== */
(function() {
  const bank = document.getElementById('rfxBank');
  if (!bank) return;
  let dragged = null;
  function bind(el) {
    el.addEventListener('dragstart', e => { dragged = el; el.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; });
    el.addEventListener('dragend', () => el.classList.remove('dragging'));
  }
  bank.querySelectorAll('.rfx-chip').forEach(bind);

  document.querySelectorAll('.rfx-slot').forEach(slot => {
    slot.addEventListener('dragover', e => { e.preventDefault(); slot.classList.add('drop-hover'); });
    slot.addEventListener('dragleave', () => slot.classList.remove('drop-hover'));
    slot.addEventListener('drop', e => {
      e.preventDefault(); slot.classList.remove('drop-hover');
      if (!dragged) return;
      // return existing chip if any
      const existing = slot.querySelector('.rfx-chip');
      if (existing) bank.appendChild(existing);
      slot.appendChild(dragged);
      slot.classList.add('has-chip');
    });
  });
  bank.addEventListener('dragover', e => e.preventDefault());
  bank.addEventListener('drop', e => { e.preventDefault(); if (dragged) bank.appendChild(dragged); });

  document.getElementById('checkRfx').addEventListener('click', () => {
    let ok = 0, total = 0;
    document.querySelectorAll('.rfx-slot').forEach(slot => {
      total++;
      slot.classList.remove('correct','wrong');
      const chip = slot.querySelector('.rfx-chip');
      if (chip && chip.dataset.w === slot.dataset.need) { slot.classList.add('correct'); ok++; }
      else if (chip) slot.classList.add('wrong');
      else slot.classList.add('wrong');
    });
    const out = document.querySelector('.rfx-result');
    out.textContent = `${ok} / ${total} correct`;
    out.className = 'rfx-result ' + (ok === total ? 'ok' : 'bad');
    if (ok === total) { addXP(15, '+15 XP — Reflexive master!'); confetti(); }
  });
})();

/* ===== Linkers drag game ===== */
(function() {
  const game = document.getElementById('linkersGame');
  if (!game) return;
  let dragged = null;
  function bind(el) {
    el.addEventListener('dragstart', e => { dragged = el; el.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; });
    el.addEventListener('dragend', () => el.classList.remove('dragging'));
  }
  game.querySelectorAll('.lk-chip').forEach(bind);
  game.querySelectorAll('.lk-drop').forEach(drop => {
    drop.addEventListener('dragover', e => { e.preventDefault(); drop.classList.add('drop-hover'); });
    drop.addEventListener('dragleave', () => drop.classList.remove('drop-hover'));
    drop.addEventListener('drop', e => {
      e.preventDefault(); drop.classList.remove('drop-hover');
      if (dragged) drop.appendChild(dragged);
    });
  });
  const bank = game.querySelector('.lk-bank');
  bank.addEventListener('dragover', e => e.preventDefault());
  bank.addEventListener('drop', e => { e.preventDefault(); if (dragged) bank.appendChild(dragged); });

  document.getElementById('checkLinkers').addEventListener('click', () => {
    let ok = 0, total = 0;
    game.querySelectorAll('.lk-drop').forEach(drop => {
      drop.querySelectorAll('.lk-chip').forEach(chip => {
        total++;
        if (chip.dataset.cat === drop.dataset.cat) { ok++; chip.style.background = '#d1fae5'; chip.style.borderColor = '#10b981'; }
        else { chip.style.background = '#fee2e2'; chip.style.borderColor = '#ef4444'; }
      });
    });
    const remain = bank.querySelectorAll('.lk-chip').length;
    total += remain;
    const out = document.querySelector('.lk-result');
    out.textContent = `${ok} / ${total} placed correctly`;
    out.className = 'lk-result ' + (ok === total ? 'ok' : 'bad');
    if (ok === total) { addXP(15, '+15 XP — Linker champion!'); confetti(); }
  });
})();

/* ===== Reorder ===== */
document.querySelector('.check-reorder')?.addEventListener('click', () => {
  let ok = 0, total = 0;
  document.querySelectorAll('.reorder-q').forEach(q => {
    total++;
    const accepted = q.dataset.correct.split('|').map(normalize);
    const inp = q.querySelector('input');
    const val = normalize(inp.value);
    inp.classList.remove('ok','bad');
    if (accepted.includes(val)) { inp.classList.add('ok'); ok++; }
    else inp.classList.add('bad');
  });
  const out = document.querySelector('.reorder-result');
  out.textContent = `${ok} / ${total} correct`;
  out.className = 'reorder-result ' + (ok === total ? 'ok' : 'bad');
  if (ok === total) { addXP(12, '+12 XP — Sentence wizard!'); confetti(); }
});

/* ===== Vocab grid ===== */
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

/* ===== Memory match game ===== */
(function() {
  const memGrid = document.getElementById('memGrid');
  const score = document.getElementById('memScore');
  if (!memGrid) return;
  let firstTile = null, locked = false, matched = 0, total = 8;

  function newGame() {
    matched = 0;
    memGrid.innerHTML = '';
    const pick = [...VOCAB].sort(() => Math.random() - 0.5).slice(0, 8);
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
      firstTile = null;
      matched++;
      score.textContent = `Pairs: ${matched} / ${total}`;
      addXP(3);
      if (matched === total) { confetti(); toast('🏆 You cleared the board!', 'success'); addXP(20); }
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
  document.getElementById('flashNext').addEventListener('click', () => { idx = (idx+1) % VOCAB.length; render(); });
  document.getElementById('flashPrev').addEventListener('click', () => { idx = (idx-1+VOCAB.length) % VOCAB.length; render(); });
  render();
})();

/* ===== Download report ===== */
document.getElementById('downloadReport')?.addEventListener('click', () => {
  const fields = document.querySelectorAll('#lesson-7 .outline textarea');
  const labels = ['Introduction', 'Paragraph 1 — Reason 1', 'Paragraph 2 — Reason 2', 'Conclusion'];
  let out = `My Persuasive Report — Should We Believe Everything on Social Media?\n${'='.repeat(60)}\n\n`;
  fields.forEach((t, i) => { out += `${labels[i]}\n${'-'.repeat(labels[i].length)}\n${t.value || '(empty)'}\n\n`; });
  const blob = new Blob([out], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'unit6-persuasive-report.txt';
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
  addXP(15, '+15 XP — Report exported!');
});

/* ===== To Top ===== */
const toTop = document.getElementById('toTop');
window.addEventListener('scroll', () => {
  toTop.classList.toggle('show', window.scrollY > 600);
});
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ===== Save inputs locally ===== */
document.querySelectorAll('textarea, .organiser textarea, .outline textarea, .speech-builder input[type="text"], .proud-list input').forEach((el, i) => {
  const key = `u6-input-${el.placeholder || ''}-${i}`;
  const saved = localStorage.getItem(key);
  if (saved) el.value = saved;
  el.addEventListener('input', () => localStorage.setItem(key, el.value));
});
