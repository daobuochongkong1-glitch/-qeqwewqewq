const MAZII_AUDIO = '/tts/mazii.mp3?q=';   // same-origin proxy co cache (qua Cloudflare)
const player = document.getElementById('player');
let currentCell = null;

function renderGrid(items, isYouon = false) {
  const grid = document.createElement('div');
  grid.className = 'kana-grid' + (isYouon ? ' youon' : '');
  for (const item of items) {
    const cell = document.createElement('div');
    if (item === null) {
      cell.className = 'kana-cell empty';
    } else {
      const [char, romaji] = item;
      cell.className = 'kana-cell';
      cell.dataset.char = char;
      cell.innerHTML = `<div class="kana-char">${char}</div><div class="kana-romaji">${romaji}</div>`;
      cell.addEventListener('click', () => playKana(char, cell));
    }
    grid.appendChild(cell);
  }
  return grid;
}

function renderPanel(panelId, data) {
  const panel = document.getElementById(panelId);
  panel.innerHTML = '';
  const order = ['gojuon', 'dakuon', 'handakuon', 'youon'];
  for (const key of order) {
    if (!data[key]) continue;
    const section = document.createElement('div');
    section.className = 'kana-section';
    const h2 = document.createElement('h2');
    h2.textContent = SECTION_TITLES[key];
    section.appendChild(h2);
    section.appendChild(renderGrid(data[key], key === 'youon'));
    panel.appendChild(section);
  }
}

function playKana(char, cell) {
  if (currentCell) currentCell.classList.remove('playing');
  cell.classList.add('playing');
  currentCell = cell;

  player.src = MAZII_AUDIO + encodeURIComponent(char);
  player.play().catch(err => {
    console.error('Lỗi phát audio:', err);
    cell.classList.remove('playing');
  });
}

player.addEventListener('ended', () => {
  if (currentCell) {
    currentCell.classList.remove('playing');
    currentCell = null;
  }
});
player.addEventListener('error', () => {
  if (currentCell) {
    currentCell.classList.remove('playing');
    currentCell = null;
  }
});

function setupTabs() {
  const buttons = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-panel');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      buttons.forEach(b => b.classList.toggle('active', b === btn));
      panels.forEach(p => p.classList.toggle('active', p.id === tab));
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === '1') document.querySelector('[data-tab="hiragana"]').click();
    if (e.key === '2') document.querySelector('[data-tab="katakana"]').click();
  });
}

renderPanel('hiragana', KANA_DATA.hiragana);
renderPanel('katakana', KANA_DATA.katakana);
setupTabs();
