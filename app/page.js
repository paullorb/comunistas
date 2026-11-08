import Reveal from "./reveal";

const chapters = [
  {
    date: ["11 SEP", "1973", "CHILE"],
    eyebrow: "01 / THE BACKGROUND",
    title: "A coup, then years of rule.",
    body: "On 11 September 1973, Chile’s armed forces overthrew President Salvador Allende. General Augusto Pinochet became head of the military government. Human-rights abuses committed under that regime later became central to the extradition requests.",
    note: "The London hearings concerned legal questions about specific allegations—not a trial of the full history of the dictatorship.",
    visual: "coup",
    label: "SANTIAGO / 1973",
    caption: "A military coup ends Chile’s elected government.",
  },
  {
    date: ["22 SEP", "1998", "LONDON"],
    eyebrow: "02 / THE VISIT",
    title: "London was supposed to be a stopover.",
    body: "Pinochet arrived in the United Kingdom on 22 September 1998 for a private visit. He was in London receiving medical treatment when Spanish judicial authorities sought his provisional arrest.",
    note: "The request came from Spain. The arrest warrant was issued by a British magistrate.",
    visual: "arrival",
    label: "PRIVATE VISIT / MEDICAL TREATMENT",
    caption: "A private visit puts Pinochet within reach of the courts.",
  },
  {
    date: ["16—17 OCT", "1998", "LONDON"],
    eyebrow: "03 / THE ARREST",
    title: "The warrant reaches the hospital.",
    body: "A Spanish judge’s request was relayed through Interpol. On 16 October a magistrate issued a provisional warrant; Pinochet was arrested in London that night or the following day, depending on the date used in the contemporaneous court records.",
    note: "The House of Lords’ later judgment dates the arrest to 17 October. Hansard records it as 16 October. The difference is preserved here rather than hidden.",
    visual: "arrest",
    label: "BOW STREET / PROVISIONAL WARRANT",
    caption: "An international request becomes a local legal act.",
  },
  {
    date: ["25 NOV", "1998", "HOUSE OF LORDS"],
    eyebrow: "04 / THE FIRST RULING",
    title: "Immunity is no longer automatic.",
    body: "By a 3–2 majority, the House of Lords restored the second arrest warrant. The decision allowed extradition proceedings to continue, but it was later set aside after a question arose about one law lord’s connection to an organisation involved in the case.",
    note: "The process restarted. The legal question did not disappear.",
    visual: "court",
    label: "APPELLATE COMMITTEE / 3—2",
    caption: "The first ruling rejects immunity, by a narrow majority.",
  },
  {
    date: ["24 MAR", "1999", "HOUSE OF LORDS"],
    eyebrow: "05 / THE REHEARING",
    title: "A narrower path to extradition.",
    body: "After a fresh hearing, a majority ruled that Pinochet could not claim immunity for certain torture allegations. The ruling was limited: only conduct that qualified as an extradition crime under British law could count, and the relevant charges were restricted to alleged torture after 29 September 1988.",
    note: "This was a ruling about immunity and extradition law—not a finding that Pinochet was guilty.",
    visual: "ruling",
    label: "REHEARING / TORTURE CONVENTION",
    caption: "A second ruling narrows the offences that can proceed.",
  },
  {
    date: ["OCT", "1999", "BOW STREET"],
    eyebrow: "06 / THE NEXT STEP",
    title: "The courts let the process continue.",
    body: "In October 1999, a magistrate ruled that Pinochet was liable to extradition and committed him to await the Home Secretary’s decision. The judicial process had cleared another hurdle; the final decision was now political and medical as well as legal.",
    visual: "commit",
    label: "EXTRADITION HEARING",
    caption: "A magistrate commits the case for the next decision.",
  },
  {
    date: ["02 MAR", "2000", "THE END IN LONDON"],
    eyebrow: "07 / THE LIMIT",
    title: "A landmark ruling. No trial.",
    body: "On 2 March 2000, Home Secretary Jack Straw ended the extradition proceedings after considering medical evidence. Pinochet returned to Chile. The London case reshaped the argument about immunity for torture, but it did not bring him to trial in Spain.",
    note: "The outcome was both a precedent and an unfinished promise of justice.",
    visual: "end",
    label: "HEATHROW / DEPARTURE",
    caption: "The extradition case ends without a trial in Spain.",
  },
];

const sources = [
  {
    title: "House of Lords judgment, 24 March 1999",
    detail: "Arrest chronology, extradition questions and immunity ruling.",
    href: "https://publications.parliament.uk/pa/ld199899/ldjudgmt/jd990324/pino1.htm",
  },
  {
    title: "House of Lords judgment, 15 January 1999",
    detail: "Why the 25 November 1998 judgment was set aside.",
    href: "https://publications.parliament.uk/pa/ld199899/ldjudgmt/jd990115/pino01.htm",
  },
  {
    title: "House of Commons Hansard, 2 March 2000",
    detail: "Official account of the decision to end the extradition proceedings.",
    href: "https://api.parliament.uk/historic-hansard/commons/2000/mar/02/senator-pinochet",
  },
  {
    title: "House of Commons Hansard, 12 January 2000",
    detail: "Statement on the second authority to proceed.",
    href: "https://api.parliament.uk/historic-hansard/commons/2000/jan/12/senator-pinochet",
  },
  {
    title: "House of Lords Appeal Committee report",
    detail: "Review of the first decision and the recusal question.",
    href: "https://publications.parliament.uk/pa/ld199899/ldselect/ldappeal/15/15.pdf",
  },
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
      <span className="visual-caption">{caption}</span>
    </div>
  );
}

function Chapter({ item, index }) {
  const reverse = index % 2 === 1;
  return (
    <Reveal id={index === 0 ? "chapter-one" : undefined} className={`${reverse ? "reverse" : ""} ${index === 6 ? "ending" : ""}`}>
      <div className="chapter-date">
        {item.date[0]}<br /><b>{item.date[1]}</b><span>{item.date[2]}</span>
      </div>
      <StoryVisual type={item.visual} label={item.label} caption={item.caption} />
      <div className="chapter-copy">
        <p className="chapter-no">{item.eyebrow}</p>
        <h2>{item.title}</h2>
        <p>{item.body}</p>
        {item.note && <p className="fact-note">{item.note}</p>}
      </div>
    </Reveal>
  );
}

export default function Home() {
  return (
    <main id="top">
      <header className="topbar">
        <a className="wordmark" href="#top" aria-label="Comunistas home"><span className="mark">C.</span> comunistas</a>
        <span className="edition">A HISTORY IN SEVEN MOMENTS <i /> 1973—2000</span>
        <a className="top-link" href="#sources">Sources <span aria-hidden="true">↗</span></a>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow"><span>01</span> London, 1998</p>
          <h1>When a former<br />dictator was<br /><em>stopped at the door.</em></h1>
          <p className="intro">In October 1998, Augusto Pinochet came to London for medical treatment. A Spanish arrest warrant changed the visit into a test of whether a former head of state could be held to account abroad.</p>
          <a className="scroll-link" href="#chapter-one"><span className="scroll-line" /> Follow the case <span aria-hidden="true">↓</span></a>
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

      <section className="context band">
        <p className="eyebrow">The question</p>
        <p className="context-statement">Could a former head of state claim immunity from an international arrest warrant for <span>torture?</span></p>
        <p className="context-note">This is the story of the legal route opened in London—and why it ended before a trial.</p>
      </section>

      <section className="timeline" aria-label="The Pinochet case timeline">
        <div className="timeline-head"><p className="eyebrow">The case, in seven moments</p><p>Scroll to move through the record <span aria-hidden="true">↓</span></p></div>
        {chapters.map((item, index) => <Chapter key={item.eyebrow} item={item} index={index} />)}
      </section>

      <section className="closing">
        <p className="eyebrow">The record is still open</p>
        <h2>What changed<br />when the warrant<br /><em>crossed a border?</em></h2>
        <p>Pinochet’s arrest showed that former leaders could face legal proceedings beyond their own country. It also showed how narrow the road to accountability could be.</p>
        <a href="#sources">Read the primary sources <span aria-hidden="true">↗</span></a>
      </section>

      <section className="sources" id="sources">
        <div><p className="eyebrow">Read the record</p><h2>Sources &amp; notes</h2><p>This short account follows the official court and parliamentary records. It distinguishes allegations, legal rulings and the final outcome.</p></div>
        <ol>{sources.map((source) => <li key={source.href}><a href={source.href} target="_blank" rel="noreferrer">{source.title}</a><span>{source.detail}</span></li>)}</ol>
        <p className="editorial-note">Editorial note: “brought to justice” is often used to describe the case’s historical significance. Pinochet was not extradited and did not stand trial in Spain.</p>
      </section>
      <footer><a className="wordmark" href="#top"><span className="mark">C.</span> comunistas</a><span>A story about law, memory and the distance between them.</span><a href="#top">Back to top ↑</a></footer>
    </main>
  );
}
