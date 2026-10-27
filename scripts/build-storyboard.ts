// Storyboard "video" generator — renders a story into a self-contained, auto-playing
// HTML page that walks EVERY branch, sped up, for content review. See docs/WORKFLOW.md.
//
//   npm run storyboard -- --story cat [--audio] [--speed 1.35] [--out path.html]
//
// Images are downscaled to web JPEGs (sips); with --audio, narration is compressed to
// low-bitrate mp3 (ffmpeg). Everything is inlined as data URIs so the output is one
// portable file (publishable as an Artifact).

import { execFileSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { getStory } from '../src/stories';
import type { Scene, EndAction } from '../src/stories/types';

const ROOT = path.resolve(__dirname, '..');
const ILL_DIR = path.join(ROOT, 'assets', 'illustrations');
const AUD_DIR = path.join(ROOT, 'assets', 'audio');
const CACHE = path.join(ROOT, '.storyboard-cache');

// ---- args -----------------------------------------------------------------
const args = process.argv.slice(2);
const getFlag = (name: string, def?: string) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : def;
};
const storyId = getFlag('story');
const withAudio = args.includes('--audio');
const speed = parseFloat(getFlag('speed', '1.35')!);
if (!storyId) {
  console.error('Usage: npm run storyboard -- --story <id> [--audio] [--speed 1.35]');
  process.exit(1);
}
const story = getStory(storyId);
if (!story) {
  console.error(`Story "${storyId}" not found.`);
  process.exit(1);
}

fs.mkdirSync(CACHE, { recursive: true });

// ---- asset embedding ------------------------------------------------------
const imgCache = new Map<string, string>();
function embedImage(key: string): string | null {
  if (imgCache.has(key)) return imgCache.get(key)!;
  const dot = key.indexOf('.');
  const group = key.slice(0, dot);
  const name = key.slice(dot + 1);
  const src = path.join(ILL_DIR, group, `${name}.png`);
  if (!fs.existsSync(src)) {
    console.warn(`  ! missing illustration: ${key} (${src})`);
    imgCache.set(key, '');
    return null;
  }
  const out = path.join(CACHE, `${group}.${name}.jpg`);
  execFileSync('sips', ['-Z', '820', '-s', 'format', 'jpeg', '-s', 'formatOptions', '64', src, '--out', out], { stdio: 'ignore' });
  const uri = `data:image/jpeg;base64,${fs.readFileSync(out).toString('base64')}`;
  imgCache.set(key, uri);
  return uri;
}

const audCache = new Map<string, string | null>();
function embedAudio(key: string): string | null {
  if (!withAudio) return null;
  if (audCache.has(key)) return audCache.get(key)!;
  const src = path.join(AUD_DIR, `${key}.wav`);
  if (!fs.existsSync(src)) {
    audCache.set(key, null);
    return null;
  }
  const out = path.join(CACHE, `${key}.mp3`);
  execFileSync('ffmpeg', ['-y', '-i', src, '-ac', '1', '-b:a', '40k', out], { stdio: 'ignore' });
  const uri = `data:audio/mpeg;base64,${fs.readFileSync(out).toString('base64')}`;
  audCache.set(key, uri);
  return uri;
}

// ---- graph walk: every branch, each scene once ----------------------------
const nextOf = (e: EndAction): string | null => {
  if (e.type === 'continue' || e.type === 'spellInteractive' || e.type === 'spellOut') return e.next;
  return null; // choice handled explicitly; end → null
};

// Linear path of scene ids from a start, following non-choice links, stopping at
// end or when a choice scene is reached (that scene included as the join marker).
function forwardPath(startId: string): string[] {
  const out: string[] = [];
  let id: string | null = startId;
  const seen = new Set<string>();
  while (id && !seen.has(id)) {
    seen.add(id);
    out.push(id);
    const sc = story!.scenes[id];
    if (!sc || sc.end.type === 'choice' || sc.end.type === 'end') break;
    id = nextOf(sc.end);
  }
  return out;
}

type Card =
  | { kind: 'scene'; scene: Scene; branch?: string }
  | { kind: 'choice'; scene: Scene }
  | { kind: 'spell'; scene: Scene; branch?: string };

const cards: Card[] = [];
const emitted = new Set<string>();

function emitScene(scene: Scene, branch?: string) {
  // A scene may carry both narration AND a spell/choice end. Emit a scene card for
  // the illustration + lines, then a dedicated card for a spell end.
  if (scene.end.type === 'choice') {
    cards.push({ kind: 'scene', scene, branch });
    cards.push({ kind: 'choice', scene });
  } else if (scene.end.type === 'spellInteractive' || scene.end.type === 'spellOut') {
    cards.push({ kind: 'scene', scene, branch });
    cards.push({ kind: 'spell', scene, branch });
  } else {
    cards.push({ kind: 'scene', scene, branch });
  }
}

// Annotated throughout: without explicit types the recursive walk/emitScene pair
// made TypeScript fall back to `any` (TS7022) for every local declared here.
function walk(startId: string): void {
  let id: string | null = startId;
  while (id && !emitted.has(id)) {
    const scene: Scene | undefined = story!.scenes[id];
    if (!scene) return;
    emitted.add(id);
    emitScene(scene);
    if (scene.end.type === 'choice') {
      const optPaths: string[][] = scene.end.options.map((o) => forwardPath(o.next));
      // Reconvergence = first scene shared by ALL option paths.
      const shared: string[] = optPaths.reduce(
        (acc: string[], p: string[]) => acc.filter((x: string) => p.includes(x))
      );
      const joinId: string | null = shared[0] ?? null;
      for (let i = 0; i < scene.end.options.length; i++) {
        const opt = scene.end.options[i]!;
        for (const sid of optPaths[i]!) {
          if (sid === joinId) break;
          if (emitted.has(sid)) continue;
          emitted.add(sid);
          emitScene(story!.scenes[sid], opt.word);
        }
      }
      id = joinId;
    } else {
      id = nextOf(scene.end);
    }
  }
}

console.log(`Building storyboard for "${story.id}" (${story.title})...`);
walk(story.startSceneId);

// ---- serialize cards to a plain data model for the page -------------------
function renderText(text: string, highlights: { start: number; end: number }[]): string {
  if (!highlights.length) return escapeHtml(text);
  const sorted = [...highlights].sort((a, b) => a.start - b.start);
  let out = '';
  let cursor = 0;
  for (const h of sorted) {
    out += escapeHtml(text.slice(cursor, h.start));
    out += `<b class="hl">${escapeHtml(text.slice(h.start, h.end))}</b>`;
    cursor = h.end;
  }
  out += escapeHtml(text.slice(cursor));
  return out;
}
const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const data = cards.map((card) => {
  const scene = card.scene;
  const img = embedImage(
    card.kind === 'spell' && (scene.end.type === 'spellInteractive' || scene.end.type === 'spellOut')
      ? (scene.end as any).expressionIllustration ?? scene.illustration
      : scene.illustration
  );
  if (card.kind === 'scene') {
    return {
      kind: 'scene',
      branch: card.branch ?? null,
      img,
      lines: scene.lines.map((l) => ({
        html: renderText(l.text, l.highlights),
        tone: l.tone ?? null,
        audio: embedAudio(l.audioKey),
      })),
    };
  }
  if (card.kind === 'choice' && scene.end.type === 'choice') {
    return {
      kind: 'choice',
      img,
      prompt: scene.end.promptText,
      audio: embedAudio(scene.end.promptAudioKey),
      options: scene.end.options.map((o) => ({ word: o.word, img: embedImage(o.illustration) })),
    };
  }
  if (card.kind === 'spell' && (scene.end.type === 'spellInteractive' || scene.end.type === 'spellOut')) {
    const e = scene.end as any;
    const word: string = e.word;
    const letters = word.toUpperCase().replace(/[^A-Z]/g, '').split('');
    const sounds: (string | null)[] = e.sounds ?? [];
    return {
      kind: 'spell',
      branch: card.branch ?? null,
      img,
      word,
      hero: !!e.isHeroMoment,
      prompt: e.promptText ?? `Spell ${word}!`,
      audio: embedAudio(e.promptAudioKey ?? e.heroAudioKey ?? ''),
      letters: letters.map((ch, i) => ({ ch, sound: sounds[i] ?? null })),
    };
  }
  return { kind: 'scene', img, lines: [] };
});

// ---- HTML -----------------------------------------------------------------
const fragment = args.includes('--fragment');
const html = pageHtml(story.title, story.id, data, speed, withAudio, fragment);
const outPath = getFlag('out', path.join(CACHE, `${story.id}.storyboard.html`))!;
fs.writeFileSync(outPath, html);
const sizeMB = (fs.statSync(outPath).size / 1e6).toFixed(1);
console.log(`  ${cards.length} cards, ${imgCache.size} images${withAudio ? `, audio embedded` : ''}`);
console.log(`  → ${outPath} (${sizeMB} MB)`);

function pageHtml(title: string, id: string, cards: any[], speed: number, audio: boolean, fragment: boolean): string {
  const head = fragment
    ? ''
    : `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(title)} — storyboard</title>`;
  const openBody = fragment ? '' : '</head><body>';
  const closeBody = fragment ? '' : '</body></html>';
  return `${head}<style>
*{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#1a1712;--panel:#241f18;--ink:#f4ece0;--dim:#a99b86;--accent:#e8a04b;--hl:#ffd27a}
body{background:var(--bg);color:var(--ink);font-family:'Nunito',system-ui,sans-serif;min-height:100vh;display:flex;flex-direction:column;align-items:center}
.stage{position:relative;width:100%;max-width:560px;aspect-ratio:3/4;margin:0 auto;background:var(--panel);overflow:hidden;border-radius:0 0 18px 18px}
.stage img.bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity .5s}
.stage img.bg.on{opacity:1}
.scrim{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.78) 0%,rgba(0,0,0,.15) 45%,rgba(0,0,0,.05) 100%)}
.caption{position:absolute;left:0;right:0;bottom:0;padding:20px 22px 26px;font-size:22px;line-height:1.35;font-weight:700;text-shadow:0 2px 8px rgba(0,0,0,.6)}
.caption .hl{color:var(--hl)}
.badge{position:absolute;top:14px;left:14px;background:var(--accent);color:#231a0e;font-weight:800;font-size:13px;padding:5px 11px;border-radius:99px;letter-spacing:.02em}
.tone{position:absolute;top:14px;right:14px;background:rgba(0,0,0,.5);color:var(--dim);font-size:12px;padding:4px 10px;border-radius:99px;font-style:italic}
.center{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:26px;text-align:center;gap:18px}
.prompt{font-size:24px;font-weight:800;text-shadow:0 2px 8px rgba(0,0,0,.7)}
.chips{display:flex;gap:14px;flex-wrap:wrap;justify-content:center}
.chip{background:rgba(255,255,255,.95);color:#2a2118;border-radius:16px;padding:10px;display:flex;flex-direction:column;align-items:center;gap:6px;width:104px;box-shadow:0 6px 18px rgba(0,0,0,.4)}
.chip img{width:80px;height:80px;object-fit:contain}
.chip span{font-weight:800;font-size:16px}
.word{display:flex;gap:8px}
.tile{background:#fff;color:#2a2118;width:52px;height:64px;border-radius:12px;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:30px;font-weight:800;box-shadow:0 6px 16px rgba(0,0,0,.4)}
.tile small{font-size:10px;font-weight:700;color:#b06a1e;margin-top:2px}
.hero-tag{background:var(--hl);color:#3a2a08;font-weight:800;font-size:13px;padding:5px 12px;border-radius:99px}
.bar{width:100%;max-width:560px;display:flex;align-items:center;gap:12px;padding:12px 16px}
.bar button{background:var(--panel);color:var(--ink);border:1px solid #3a3126;border-radius:10px;padding:8px 14px;font-weight:700;cursor:pointer;font-size:15px}
.bar button:hover{border-color:var(--accent)}
.prog{flex:1;height:6px;background:#33291d;border-radius:99px;overflow:hidden}
.prog i{display:block;height:100%;width:0;background:var(--accent);transition:width .2s}
.meta{max-width:560px;width:100%;padding:8px 18px 40px;color:var(--dim);font-size:13px;text-align:center}
.head{max-width:560px;width:100%;padding:16px 18px 10px;text-align:center}
.head h1{font-size:20px;font-weight:800}.head p{color:var(--dim);font-size:13px;margin-top:3px}
</style>${openBody}
<div class="head"><h1>${escapeHtml(title)}</h1><p>storyboard review · walks every branch · ${cards.length} cards${audio ? ' · voiced' : ''}</p></div>
<div class="stage" id="stage"></div>
<div class="bar">
  <button id="pp">⏸ Pause</button><button id="prev">◀</button><button id="next">▶</button>
  <div class="prog"><i id="pi"></i></div>
  <button id="spd">${speed}×</button>
</div>
<div class="meta" id="meta"></div>
<audio id="au"></audio>
<script>
const CARDS=${JSON.stringify(cards)};
let SPEED=${speed};
const stage=document.getElementById('stage'),au=document.getElementById('au'),pi=document.getElementById('pi'),meta=document.getElementById('meta');
let idx=0,playing=true,timer=null,lineTimer=null;
function esc(s){return s;}
function clearTimers(){clearTimeout(timer);clearTimeout(lineTimer);timer=lineTimer=null;au.pause();}
function dur(text){return Math.max(1200,(text.replace(/<[^>]+>/g,'').length*55))/SPEED;}
function render(){
  clearTimers();
  const c=CARDS[idx];if(!c)return;
  pi.style.width=((idx+1)/CARDS.length*100)+'%';
  let h='';
  const badge=c.branch?'<div class="badge">Path: '+esc(c.branch)+'</div>':'';
  if(c.kind==='scene'){
    h='<img class="bg" src="'+(c.img||'')+'">'+'<div class="scrim"></div>'+badge;
    const first=c.lines[0];
    h+='<div class="caption" id="cap"></div>';
    if(first&&first.tone)h+='<div class="tone">'+esc(first.tone)+'</div>';
    stage.innerHTML=h;
    requestAnimationFrame(()=>stage.querySelector('.bg').classList.add('on'));
    playLines(c.lines,0);
    return;
  }
  if(c.kind==='choice'){
    h='<img class="bg on" src="'+(c.img||'')+'">'+'<div class="scrim"></div>';
    h+='<div class="center"><div class="prompt">'+esc(c.prompt)+'</div><div class="chips">';
    for(const o of c.options)h+='<div class="chip"><img src="'+(o.img||'')+'"><span>'+esc(o.word)+'</span></div>';
    h+='</div><div style="color:var(--dim);font-size:13px">all '+c.options.length+' choices shown</div></div>';
    stage.innerHTML=h;meta.textContent='Choice — the child picks one; the storyboard walks each path.';
    playAudio(c.audio,dur(c.prompt)*1.4);
    return;
  }
  if(c.kind==='spell'){
    h='<img class="bg on" src="'+(c.img||'')+'">'+'<div class="scrim"></div>'+badge;
    h+='<div class="center">';
    if(c.hero)h+='<div class="hero-tag">⭐ hero word</div>';
    h+='<div class="prompt">'+esc(c.prompt)+'</div><div class="word">';
    for(const t of c.letters)h+='<div class="tile">'+t.ch+(t.sound?'<small>'+t.sound+'</small>':'')+'</div>';
    h+='</div><div style="color:var(--dim);font-size:13px">drag-to-spell exercise</div></div>';
    stage.innerHTML=h;meta.textContent='Spell "'+c.word+'"'+(c.hero?' · hero moment':'');
    playAudio(c.audio,1600/SPEED);
    return;
  }
}
function playLines(lines,i){
  if(i>=lines.length){meta.textContent='';scheduleNext(300/SPEED);return;}
  const cap=document.getElementById('cap');if(cap)cap.innerHTML=lines[i].html;
  const tEl=stage.querySelector('.tone');if(tEl&&lines[i].tone)tEl.textContent=lines[i].tone;
  const after=()=>{lineTimer=setTimeout(()=>playLines(lines,i+1),200/SPEED);};
  if(lines[i].audio){au.src=lines[i].audio;au.playbackRate=Math.min(SPEED,3);au.onended=after;
    if(playing)au.play().catch(()=>{lineTimer=setTimeout(after,dur(lines[i].html));});}
  else{lineTimer=setTimeout(after,dur(lines[i].html));}
}
function playAudio(src,fallback){
  if(src){au.src=src;au.playbackRate=Math.min(SPEED,3);au.onended=()=>scheduleNext(400/SPEED);
    if(playing)au.play().catch(()=>scheduleNext(fallback));}
  else scheduleNext(fallback);
}
function scheduleNext(ms){if(playing)timer=setTimeout(()=>{idx++;if(idx<CARDS.length)render();else finish();},ms);}
function finish(){playing=false;document.getElementById('pp').textContent='↻ Replay';}
document.getElementById('next').onclick=()=>{if(idx<CARDS.length-1){idx++;render();}};
document.getElementById('prev').onclick=()=>{if(idx>0){idx--;render();}};
document.getElementById('pp').onclick=function(){
  if(idx>=CARDS.length-1&&!playing){idx=0;playing=true;this.textContent='⏸ Pause';render();return;}
  playing=!playing;this.textContent=playing?'⏸ Pause':'▶ Play';
  if(playing)render();else clearTimers();
};
document.getElementById('spd').onclick=function(){SPEED=SPEED>=2?1:SPEED+.35;SPEED=Math.round(SPEED*100)/100;this.textContent=SPEED+'×';};
document.addEventListener('keydown',e=>{if(e.key==='ArrowRight')document.getElementById('next').click();if(e.key==='ArrowLeft')document.getElementById('prev').click();if(e.key===' '){e.preventDefault();document.getElementById('pp').click();}});
render();
</script>${closeBody}`;
}
