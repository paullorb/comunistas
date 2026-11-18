import Reveal from "./reveal";
import Motion from "./motion";
import EnemyDefiner from "./enemy-definer";
import { chapters, afterChapters, sources } from "./data";

const rail = [
  ["#question", "The question"],
  ["#enemy", "The enemy list"],
  ["#london", "London, 1998–2000"],
  ["#after", "After London"],
  ["#sources", "Sources"],
];

function StoryVisual({ type, label, caption }) {
  return (
    <div className={`chapter-visual visual-${type}`}>
      <span className="visual-label">{label}</span>
      {type === "coup" && (
        <>
          <div className="palace"><i /><i /><i /><i /><i /></div>
          <div className="smoke" />
        </>
      )}
      {type === "arrival" && (
        <>
          <div className="plane" aria-hidden="true">✳</div>
          <div className="arrival-line" />
        </>
      )}
      {type === "arrest" && (
        <>
          <div className="paper-stack"><i /><i /><i /></div>
          <div className="stamp">ARRESTED</div>
        </>
      )}
      {type === "court" && (
        <>
          <div className="bench"><i /><i /><i /></div>
          <div className="vote">3 : 2</div>
        </>
      )}
      {type === "ruling" && (
        <div className="ruling-sheet">
          <small>REGINA v. BARTLE</small><strong>IMMUNITY<br />LIMITED</strong>
          <i /><i /><i />
        </div>
      )}
      {type === "commit" && (
        <>
          <div className="door"><span>COURT<br />ROOM</span></div>
          <div className="arrow" aria-hidden="true">→</div>
        </>
      )}
      {type === "end" && (
        <>
          <div className="departure">SANTIAGO<br /><strong>BOARDING</strong></div>
          <div className="red-line end-line" />
        </>
      )}
      {type === "return" && (
        <svg className="sv" viewBox="0 0 400 320" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <rect x="0" y="215" width="400" height="105" fill="#3c3a36" />
          <path d="M0 262H400" stroke="#d4d0c6" strokeWidth="3" strokeDasharray="22 16" />
          <g className="sv-plane"><g transform="translate(30 28) scale(.62)" fill="#191916">
            <path d="M40 120c0-9 8-14 20-14h92c14 0 26 5 34 14-8 9-20 14-34 14H60c-12 0-20-5-20-14z" />
            <path d="M92 108L70 66h22l44 42z M92 132L70 174h22l44-42z" fill="#bf2727" />
            <path d="M40 112l-14-24h14z" />
          </g></g>
          <g className="sv-chair" fill="none" stroke="#191916" strokeWidth="3.5" strokeLinecap="round">
            <circle cx="236" cy="236" r="22" />
            <path d="M222 192v30h40M222 192l-6-18" />
          </g>
          <g className="sv-figure" fill="#191916" stroke="#191916" strokeWidth="5" strokeLinecap="round">
            <circle cx="304" cy="160" r="9" stroke="none" />
            <path d="M304 172v46M304 182l-16 22M304 182l16 22M304 218l-10 34M304 218l10 34" fill="none" />
          </g>
        </svg>
      )}
      {type === "immunity" && (
        <svg className="sv" viewBox="0 0 400 320" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <g transform="translate(60 14) scale(.7)">
            <path className="sv-shield" d="M200 34l92 30v82c0 56-48 88-92 106-44-18-92-50-92-106V64z" fill="#eee9de" stroke="#191916" strokeWidth="3" />
            <path className="sv-crack" d="M200 34l-12 62 28 40-20 52 10 64" pathLength="1" strokeDasharray="1" strokeDashoffset="0" fill="none" stroke="#bf2727" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <rect className="sv-bar-yes" x="92" y="228" width="168" height="12" fill="#bf2727" />
          <rect className="sv-bar-no" x="92" y="248" width="72" height="12" fill="#9a968b" />
          <text x="270" y="238" fontFamily="DM Mono, monospace" fontSize="11" fill="#191916">14</text>
          <text x="174" y="258" fontFamily="DM Mono, monospace" fontSize="11" fill="#191916">6</text>
        </svg>
      )}
      {type === "verdict" && (
        <svg className="sv" viewBox="0 0 400 320" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <g className="sv-dock">
            <rect x="120" y="124" width="160" height="96" fill="#715640" />
            <rect x="120" y="116" width="160" height="12" fill="#9c7a58" />
            <rect x="136" y="82" width="14" height="40" rx="6" fill="#2a2724" />
            <rect x="250" y="82" width="14" height="40" rx="6" fill="#2a2724" />
          </g>
          <path className="sv-open-line" d="M52 240H348" pathLength="1" strokeDasharray="1" strokeDashoffset="0" fill="none" stroke="#bf2727" strokeWidth="6" strokeLinecap="round" />
          <text className="sv-verdict" x="200" y="62" textAnchor="middle" fontFamily="DM Mono, monospace" fontSize="14" letterSpacing="3" fill="#eee5d5">NO VERDICT</text>
        </svg>
      )}
      <span className="visual-caption">{caption}</span>
    </div>
  );
}

function Chapter({ item, index, id, ending }) {
  const reverse = index % 2 === 1;
  return (
    <Reveal id={id} className={`${reverse ? "reverse" : ""} ${ending ? "ending" : ""}`}>
      <div className="chapter-date">
        {item.date[0]}<br /><b>{item.date[1]}</b><span>{item.date[2]}</span>
      </div>
      <StoryVisual type={item.visual} label={item.label} caption={item.caption} />
      <div className="chapter-copy">
        <p className="chapter-no">{item.eyebrow}</p>
        <h2>{item.title}</h2>
        <p>{item.body}</p>
        {item.detail && <p className="chapter-detail"><b>ON THE RECORD</b> {item.detail}</p>}
        {item.note && <p className="fact-note">{item.note}</p>}
      </div>
    </Reveal>
  );
}

export default function Home() {
  return (
    <main id="top">
      <Motion />
      <div className="progress" aria-hidden="true"><i className="progress-bar" /></div>
      <nav className="rail" aria-label="Sections">
        {rail.map(([href, label]) => <a key={href} href={href} data-rail><span>{label}</span><i /></a>)}
      </nav>

      <header className="topbar">
        <a className="wordmark" href="#top" aria-label="Comunistas home"><span className="mark">C.</span> comunistas</a>
        <span className="edition">THE PINOCHET FILE <i /> 1973—2006</span>
        <a className="top-link" href="#sources">Sources <span aria-hidden="true">↗</span></a>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow"><span>01</span> London, 1998</p>
          <h1>
            <span className="ln"><span>When a former</span></span>
            <span className="ln"><span>dictator was</span></span>
            <span className="ln"><span><em>stopped at the door.</em></span></span>
          </h1>
          <p className="intro">In October 1998, Augusto Pinochet came to London for medical treatment. A Spanish arrest warrant changed the visit into a test of whether a former head of state could be held to account abroad.</p>
          <a className="scroll-link" href="#question"><span className="scroll-line" /> Follow the case <span aria-hidden="true">↓</span></a>
        </div>
        <div className="hero-art" role="img" aria-label="Illustration of a London street and a document stamped provisional warrant">
          <div className="art-sky" /><div className="art-grid" />
          <div className="city city-back"><i /><i /><i /><i /><i /></div>
          <div className="city city-front"><i /><i /><i /><i /></div>
          <div className="red-line" />
          <div className="warrant"><span>METROPOLITAN POLICE</span><strong>PROVISIONAL<br />WARRANT</strong><small>16 OCTOBER 1998<br />LONDON</small><b>HELD</b></div>
          <span className="art-caption">A visit becomes a legal turning point</span>
        </div>
        <span className="hero-index">STORY 001 / HUMAN RIGHTS</span>
      </section>

      <section className="context band" id="question">
        <p className="eyebrow">The question</p>
        <p className="context-statement">Could a former head of state claim immunity from an international arrest warrant for <span>torture?</span></p>
        <p className="context-note">This is the story of the legal route opened in London—and why it ended before a trial. To understand why the warrant mattered, we start twenty-five years earlier, with a definition.</p>
      </section>

      <EnemyDefiner />

      <section className="timeline" id="london" aria-label="The Pinochet case timeline">
        <div className="timeline-head"><p className="eyebrow"><span>03</span> The case, in seven moments</p><p>Scroll to move through the record <span aria-hidden="true">↓</span></p></div>
        {chapters.map((item, index) => <Chapter key={item.eyebrow} item={item} index={index} id={index === 0 ? "chapter-one" : undefined} ending={index === chapters.length - 1} />)}
      </section>

      <section className="timeline after" id="after" aria-label="After London">
        <div className="timeline-head"><p className="eyebrow"><span>04</span> After London</p><p>Three more moments <span aria-hidden="true">↓</span></p></div>
        {afterChapters.map((item, index) => <Chapter key={item.eyebrow} item={item} index={chapters.length + index} />)}
      </section>

      <section className="closing">
        <p className="eyebrow">The record is still open</p>
        <h2>What changed<br />when the warrant<br /><em>crossed a border?</em></h2>
        <p>Pinochet’s arrest showed that former leaders could face legal proceedings beyond their own country. It also showed how narrow the road to accountability could be — and how widely a single word had once been stretched to put people beyond the law’s protection.</p>
        <a href="#sources">Read the primary sources <span aria-hidden="true">↗</span></a>
      </section>

      <section className="sources" id="sources">
        <div><p className="eyebrow">Read the record</p><h2>Sources &amp; notes</h2><p>This account follows court, parliamentary and official records where they exist, and names press or secondary sources as such. It distinguishes allegations, legal rulings and the final outcome.</p></div>
        <ol>{sources.map((source) => <li key={source.href}><a href={source.href} target="_blank" rel="noreferrer">{source.title}</a><span>{source.detail}</span></li>)}</ol>
        <p className="editorial-note">Editorial note: “brought to justice” is often used to describe the case’s historical significance. Pinochet was not extradited and did not stand trial in Spain, and was never convicted. The enemy-list section is an editorial reading of the decrees it cites; the decrees and the victim counts are the documentary record.</p>
      </section>
      <footer><a className="wordmark" href="#top"><span className="mark">C.</span> comunistas</a><span>A story about law, memory and the distance between them.</span><a href="#top">Back to top ↑</a></footer>
    </main>
  );
}
