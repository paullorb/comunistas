import { notFound } from "next/navigation";
import Reveal from "../reveal";
import Motion from "../motion";
import EnemyDefiner from "../enemy-definer";
import SectionSheet from "../section-sheet";
import Scene from "../scenes";
import { getContent, hasLocale, locales, localePath } from "../i18n";

const railTargets = ["#question", "#enemy", "#london", "#after", "#sources"];

function StoryVisual({ type, label, caption, ui }) {
  return (
    <div className={`chapter-visual visual-${type}`}>
      <span className="visual-label">{label}</span>
      <Scene type={type} ui={ui} />
      <span className="visual-caption">{caption}</span>
    </div>
  );
}

function Chapter({ item, index, id, ending, ui }) {
  const reverse = index % 2 === 1;
  return (
    <Reveal id={id} className={`${reverse ? "reverse" : ""} ${ending ? "ending" : ""}`}>
      <div className="chapter-date">
        {item.date[0]}<br /><b>{item.date[1]}</b><span>{item.date[2]}</span>
      </div>
      <StoryVisual type={item.visual} label={item.label} caption={item.caption} ui={ui} />
      <div className="chapter-copy">
        <p className="chapter-no">{item.eyebrow}</p>
        <h2>{item.title}</h2>
        <p>{item.body}</p>
        {item.detail && <p className="chapter-detail"><b>{ui.onRecord}</b> {item.detail}</p>}
        {item.note && <p className="fact-note">{item.note}</p>}
      </div>
    </Reveal>
  );
}

export default async function Home({ params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { ui, chapters, afterChapters, stages, sources, locale } = getContent(lang);

  return (
    <main id="main">
      <a className="skip" href="#main">{ui.skip}</a>
      <div id="top" />
      <Motion />
      <div className="progress" aria-hidden="true"><i className="progress-bar" /></div>
      <nav className="rail" aria-label={ui.sectionsLabel}>
        {railTargets.map((href, i) => <a key={href} href={href} data-rail><span>{ui.rail[i]}</span><i /></a>)}
      </nav>

      <header className="topbar">
        <a className="wordmark" href="#top" aria-label={ui.homeLabel}><span className="mark">C.</span> comunistas</a>
        <span className="edition">{ui.edition} <i /> 1973—2006</span>
        <div className="top-right">
          <a className="top-link" href="#sources">{ui.sourcesLink} <span aria-hidden="true">↗</span></a>
          <nav className="lang" aria-label={ui.langLabel}>
            {locales.map((code) => (
              <a key={code} href={localePath(code)} lang={code} hrefLang={code} aria-current={code === lang ? "true" : undefined}>{code.toUpperCase()}</a>
            ))}
          </nav>
          <SectionSheet label={ui.menu} closeLabel={ui.menuClose} title={ui.sectionsLabel} items={railTargets.map((href, i) => ({ href, label: ui.rail[i] }))} />
        </div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">{ui.heroEyebrow}</p>
          <h1>
            <span className="ln"><span>{ui.heroLines[0]}</span></span>
            <span className="ln"><span>{ui.heroLines[1]}</span></span>
            <span className="ln"><span><em>{ui.heroLines[2]}</em></span></span>
          </h1>
          <p className="intro">{ui.heroIntro}</p>
          <a className="scroll-link" href="#question"><span className="scroll-line" /> {ui.followCase} <span aria-hidden="true">↓</span></a>
        </div>
        <div className="hero-art" role="img" aria-label={ui.heroArtAria}>
          <div className="art-sky" /><div className="art-grid" />
          <div className="city city-back"><i /><i /><i /><i /><i /></div>
          <div className="city city-front"><i /><i /><i /><i /></div>
          <div className="red-line" />
          <div className="warrant"><span>{ui.warrant.org}</span><strong>{ui.warrant.title[0]}<br />{ui.warrant.title[1]}</strong><small>{ui.warrant.date[0]}<br />{ui.warrant.date[1]}</small><b>{ui.warrant.stamp}</b></div>
          <span className="art-caption">{ui.artCaption}</span>
        </div>
        <span className="hero-index">{ui.heroIndex}</span>
      </section>

      <section className="context band" id="question">
        <p className="eyebrow">{ui.questionEyebrow}</p>
        <p className="context-statement">{ui.statement[0]}<span>{ui.statement[1]}</span></p>
        <p className="context-note">{ui.contextNote}</p>
      </section>

      <EnemyDefiner stages={stages} locale={locale} t={ui.enemy} />

      <section className="timeline" id="london" aria-label={ui.timelineAria}>
        <div className="timeline-head"><p className="eyebrow"><span>{ui.parts[1]}</span> {ui.timelineHead}</p><p>{ui.scrollHint} <span aria-hidden="true">↓</span></p></div>
        {chapters.map((item, index) => <Chapter key={item.eyebrow} item={item} index={index} ui={ui} id={index === 0 ? "chapter-one" : undefined} ending={index === chapters.length - 1} />)}
      </section>

      <section className="timeline after" id="after" aria-label={ui.afterAria}>
        <div className="timeline-head"><p className="eyebrow"><span>{ui.parts[2]}</span> {ui.afterHead}</p><p>{ui.afterHint} <span aria-hidden="true">↓</span></p></div>
        {afterChapters.map((item, index) => <Chapter key={item.eyebrow} item={item} index={chapters.length + index} ui={ui} />)}
      </section>

      <section className="closing">
        <p className="eyebrow">{ui.closing.eyebrow}</p>
        <h2>{ui.closing.h2[0]}<br />{ui.closing.h2[1]}<br /><em>{ui.closing.h2[2]}</em></h2>
        <p>{ui.closing.p}</p>
        <a href="#sources">{ui.closing.link} <span aria-hidden="true">↗</span></a>
      </section>

      <section className="sources" id="sources">
        <div><p className="eyebrow">{ui.sources.eyebrow}</p><h2>{ui.sources.h2}</h2><p>{ui.sources.p}</p></div>
        <ol>{sources.map((source) => <li key={source.href}><a href={source.href} target="_blank" rel="noreferrer">{source.title}</a><span>{source.detail}</span></li>)}</ol>
        <p className="editorial-note">{ui.sources.editorial}</p>
      </section>
      <footer><a className="wordmark" href="#top"><span className="mark">C.</span> comunistas</a><span>{ui.footer.tagline}</span><a href="#top">{ui.footer.top}</a></footer>
    </main>
  );
}
