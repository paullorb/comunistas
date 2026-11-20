// The ten timeline panels, drawn in one language: flat ink shapes on warm paper tones, a halftone
// screen for atmosphere, one red accent, and the red diagonal that runs through the whole series.
// Each panel has people in it (app/figures.js) and red tags that repeat a phrase from the chapter's
// copy next to the thing it describes (positions in `sceneTags`, app/data.js; text in app/i18n).
// Each scene is a 400×300 SVG; class names starting with "sc-" are animation hooks (see motion.js).
import { sceneTags } from "./data";
import { Figure, Mini, Wheelchair, Tag, INK, INK2, RED, PAPER, G2, G3, SKIN, WHITE_HAIR, UNIFORM, MONO } from "./figures";

const SERIF = "Playfair Display, Georgia, serif";

const Halftone = ({ id, color = INK, opacity = 0.35, size = 7, r = 1.1, angle = 30 }) => (
  <pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse" patternTransform={`rotate(${angle})`}>
    <circle cx={size / 2} cy={size / 2} r={r} fill={color} opacity={opacity} />
  </pattern>
);

const Sky = ({ id, from = "#bdb8ae", to = "#dedad1" }) => (
  <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stopColor={from} />
    <stop offset="1" stopColor={to} />
  </linearGradient>
);

const RedLine = ({ d = "M-10 276L410 244" }) => <path d={d} stroke={RED} strokeWidth="6" fill="none" className="sc-red" />;

const Jet = ({ x, y, s = 1, rot = 0, cls = "" }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <g className={cls} fill={INK}>
      <path d="M0 0L30-3L40 0L30 3Z" />
      <path d="M10 0L0-11L7-11L20-1Z" />
      <path d="M10 0L0 11L7 11L20 1Z" />
      <path d="M0 0L-6-5L-2 0L-6 5Z" />
    </g>
  </g>
);

const Airliner = ({ cls }) => (
  <g className={cls} fill={INK}>
    <path d="M0 14c0-6 6-10 16-10h60c10 0 18 3 22 10-4 7-12 10-22 10H16C6 24 0 20 0 14Z" />
    <path d="M44 12L22-16h12L70 12Z M44 16L22 44h12L70 16Z" fill={G3} />
    <path d="M4 10L-6-14h12L18 8Z" fill={RED} />
  </g>
);

// A sheet of paper held in a figure's hand (drawn in the figure's own coordinates).
const Sheet = ({ x, y, w = 20, h = 26, rot = 0 }) => (
  <g transform={`rotate(${rot} ${x + w / 2} ${y + h / 2})`}>
    <rect x={x} y={y} width={w} height={h} fill={PAPER} stroke={INK} strokeWidth=".8" />
    <path d={`M${x + 4} ${y + 7}h${w - 8}M${x + 4} ${y + 12}h${w - 8}M${x + 4} ${y + 17}h${w - 11}`} stroke={G3} strokeWidth="1.4" />
  </g>
);

// Pinochet as the story meets him after 1998: an old man in a dark suit, white hair, a cane.
const OLD = { coat: INK, legs: INK2, hair: WHITE_HAIR, moustache: WHITE_HAIR, shirt: true, tie: G3 };
const POLICE = { coat: "#22252b", legs: "#22252b", hat: "helmet", hair: null };

const scenes = {
  // Santiago, 11 September 1973: the palace, smoke, aircraft on the approach, soldiers, and the general.
  coup: ({ tags }) => (
    <>
      <defs>
        <Sky id="sky-coup" />
        <radialGradient id="smoke-coup"><stop offset="0" stopColor="#4a4944" stopOpacity=".9" /><stop offset="1" stopColor="#4a4944" stopOpacity="0" /></radialGradient>
        <Halftone id="ht-coup" />
      </defs>
      <rect width="400" height="300" fill="url(#sky-coup)" />
      <rect width="400" height="190" fill="url(#ht-coup)" opacity=".55" />
      <g className="sc-building">
        <rect x="30" y="168" width="340" height="68" fill={INK} />
        <rect x="130" y="150" width="140" height="86" fill="#34332e" />
        <path d="M122 150L200 116L278 150Z" fill={INK} />
        {Array.from({ length: 11 }, (_, i) => <rect key={i} x={46 + i * 30} y="184" width="12" height="22" fill={G2} opacity={i > 3 && i < 7 ? 0 : 0.85} />)}
        {Array.from({ length: 5 }, (_, i) => <rect key={i} x={146 + i * 25} y="168" width="9" height="40" fill={G2} opacity=".8" />)}
        <rect x="188" y="206" width="24" height="30" fill={PAPER} opacity=".9" />
      </g>
      <g className="sc-smoke">
        <ellipse cx="112" cy="140" rx="46" ry="56" fill="url(#smoke-coup)" />
        <ellipse cx="292" cy="128" rx="50" ry="62" fill="url(#smoke-coup)" />
        <ellipse cx="204" cy="86" rx="60" ry="52" fill="url(#smoke-coup)" />
      </g>
      <path className="sc-traj" d="M48 44Q120 76 196 150" pathLength="1" strokeDasharray="1" strokeDashoffset="0" fill="none" stroke={RED} strokeWidth="3" strokeLinecap="round" />
      <Jet x={46} y={42} s={1.1} rot={28} cls="sc-jet" />
      <Jet x={20} y={78} s={0.8} rot={32} cls="sc-jet" />
      <rect y="236" width="400" height="64" fill={INK2} />
      <path d="M0 268H400" stroke={G2} strokeWidth="2" strokeDasharray="18 14" />
      <RedLine />
      {[58, 92].map((x, i) => (
        <Figure key={x} cls="sc-soldier" x={x} y={264 - i * 3} s={0.62} coat={G3} legs={G3} hair={null} hat="steel" hatColor={UNIFORM} armR={[17, -66, 14, -52]}>
          <path d="M9-38L21-104" stroke={G2} strokeWidth="2.6" strokeLinecap="round" />
        </Figure>
      ))}
      <Figure cls="sc-general" x={326} y={280} s={1.15} coat={UNIFORM} legs="#5d5a52" cape="#57544c" hair={null} hat="cap" glasses armL={[-16, -63, 7, -61]} armR={[16, -63, -7, -57]} />
      {tags}
    </>
  ),

  // Heathrow, 22 September 1998: an aircraft on the glide path, a visitor with a cane, and a judge in Madrid.
  arrival: ({ tags }) => (
    <>
      <defs>
        <Sky id="sky-arr" from="#cfcbc1" to="#e4e0d6" />
        <Halftone id="ht-arr" angle={15} />
      </defs>
      <rect width="400" height="300" fill="url(#sky-arr)" />
      <rect width="400" height="176" fill="url(#ht-arr)" opacity=".4" />
      <g fill={G3}>
        {[[20, 28], [52, 44], [84, 30], [116, 52], [286, 38], [318, 56], [350, 34], [376, 46]].map(([x, h], i) => <rect key={i} x={x} y={176 - h} width="22" height={h} />)}
        <path d="M262 176L270 120L278 176Z" />
      </g>
      <path d="M0 176H400V300H0Z" fill="#c9c4b8" />
      <path d="M142 300L188 176H212L258 300Z" fill={INK2} />
      <path className="sc-center" d="M200 300V176" stroke={PAPER} strokeWidth="3.5" strokeDasharray="16 12" />
      <path d="M154 300L190 176M246 300L210 176" stroke={PAPER} strokeWidth="1.5" opacity=".6" />
      <path className="sc-approach" d="M300 64Q236 112 200 178" pathLength="1" strokeDasharray="1" strokeDashoffset="0" fill="none" stroke={RED} strokeWidth="3" strokeLinecap="round" />
      <g transform="translate(262 40) rotate(18) scale(1.15)"><Airliner cls="sc-plane" /></g>
      <RedLine d="M-10 292L410 268" />
      <Figure cls="sc-judge" x={56} y={284} s={1} robe coat={INK} shirt armR={[21, -68, 27, -82]}>
        <Sheet x={20} y={-106} rot={8} />
      </Figure>
      <path className="sc-request" d="M90 196Q200 142 312 200" pathLength="1" strokeDasharray="1" strokeDashoffset="0" fill="none" stroke={RED} strokeWidth="2.6" strokeLinecap="round" />
      <path className="sc-request-head" d="M303 187L318 203L297 204Z" fill={RED} />
      <Figure cls="sc-visitor" x={340} y={286} s={1.1} flip {...OLD} cane armR={[17, -63, 21, -46]} />
      {tags}
    </>
  ),

  // A London hospital, the night of 16 October 1998: the warrant reaches the bedside.
  arrest: ({ ui, tags }) => (
    <>
      <defs>
        <Halftone id="ht-arrest" size={6} r={1} opacity=".3" />
        <radialGradient id="glow-arrest"><stop offset="0" stopColor="#f4efe4" stopOpacity=".95" /><stop offset="1" stopColor="#f4efe4" stopOpacity="0" /></radialGradient>
      </defs>
      <rect width="400" height="300" fill="#c6c1b7" />
      <rect width="400" height="300" fill="url(#ht-arrest)" />
      <rect y="240" width="400" height="60" fill="#a49e92" />
      <rect y="238" width="400" height="4" fill="#8d897f" />
      {/* night in the window */}
      <rect x="34" y="52" width="92" height="98" fill={INK} />
      <path d="M80 52V150M34 100H126" stroke="#c6c1b7" strokeWidth="3" />
      <rect x="28" y="150" width="104" height="6" fill="#8d897f" />
      <circle className="sc-glow" cx="92" cy="182" r="62" fill="url(#glow-arrest)" />
      {/* the door to the corridor */}
      <rect x="316" y="90" width="74" height="152" fill={INK} />
      <rect className="sc-lit" x="323" y="97" width="60" height="145" fill="#f4efe4" />
      <Figure cls="sc-officer" x={353} y={242} s={0.95} flip {...POLICE} />
      {/* the bed */}
      <path d="M26 122V240M20 240H32" stroke={INK2} strokeWidth="2.6" strokeLinecap="round" />
      <rect x="19" y="120" width="14" height="22" rx="3" fill="#f4efe4" stroke={INK2} strokeWidth="1.2" />
      <path d="M26 142Q26 178 66 190" fill="none" stroke={INK2} strokeWidth="1.2" />
      <rect x="46" y="160" width="8" height="84" fill={INK} />
      <rect x="230" y="186" width="7" height="58" fill={INK} />
      <rect x="54" y="214" width="178" height="10" fill={INK2} />
      <rect x="54" y="198" width="178" height="17" fill="#f4efe4" />
      <rect x="59" y="184" width="46" height="16" rx="6" fill="#fbf8f0" />
      <circle cx="84" cy="180" r="9" fill={SKIN} />
      <path d="M75.2 180A9 9 0 0 1 84 171Q79 174 78.5 180Z" fill={WHITE_HAIR} />
      <path d="M98 199Q102 180 126 180H212Q228 182 230 199Z" fill={G3} />
      <path d="M100 199Q104 186 124 186" fill="none" stroke="#f4efe4" strokeWidth="5" strokeLinecap="round" />
      <path className="sc-madrid" d="M84 96Q172 36 240 168" pathLength="1" strokeDasharray="1" strokeDashoffset="0" fill="none" stroke={RED} strokeWidth="2.6" strokeLinecap="round" />
      <Figure cls="sc-officer" x={278} y={266} s={1.12} flip {...POLICE} armR={[24, -74, 33, -82]}>
        <Sheet x={24} y={-112} w={22} h={29} rot={-6} />
      </Figure>
      <g transform="rotate(-6 336 54)"><g className="sc-stamp">
        <rect x="284" y="37" width="104" height="34" fill="#c6c1b7" stroke={RED} strokeWidth="3.2" />
        <text x="336" y="60" textAnchor="middle" fontFamily={MONO} fontSize="14.5" fontWeight="500" letterSpacing="1.6" fill={RED}>{ui.scenes.arrested}</text>
      </g></g>
      {tags}
    </>
  ),

  // House of Lords, 25 November 1998: five law lords, three hands against immunity; the ruling later set aside.
  court: ({ tags }) => (
    <>
      <defs><Halftone id="ht-court" color="#e9e5db" opacity=".12" size={6} /></defs>
      <rect width="400" height="300" fill="#39332e" />
      <rect width="400" height="300" fill="url(#ht-court)" />
      <g fill="none" stroke="#5c5046" strokeWidth="3">
        {[40, 160, 280].map((x) => <path key={x} d={`M${x} 206V96Q${x} 46 ${x + 40} 46T${x + 80} 96V206`} />)}
      </g>
      <text className="sc-vote" x="118" y="84" textAnchor="middle" fontFamily={SERIF} fontWeight="600" fontSize="50" fill="#eee5d5">3 : 2</text>
      <path className="sc-void" d="M56 68H180" pathLength="1" strokeDasharray="1" strokeDashoffset="0" fill="none" stroke={RED} strokeWidth="5" strokeLinecap="round" />
      {[66, 133, 200, 267, 334].map((x, i) => (i < 3
        ? <Figure key={x} cls="sc-lord" x={x} y={250} coat={RED} hair="#d8d3c6" shirt tie={INK} armR={[21, -98, 19, -119]} armRCls="sc-hand" />
        : <Figure key={x} cls="sc-lord" x={x} y={250} coat={G3} hair="#d8d3c6" shirt tie={INK} />
      ))}
      <rect y="206" width="400" height="94" fill="#712e28" />
      <rect y="206" width="400" height="94" fill="url(#ht-court)" />
      <rect y="202" width="400" height="9" fill="#9c7a58" />
      <path d="M0 250H400M0 276H400" stroke="#00000033" strokeWidth="2" />
      <RedLine d="M-10 292L410 266" />
      {tags}
    </>
  ),

  // 24 March 1999: seven law lords, six to one, and a judgment narrowed to what came after 29 September 1988.
  ruling: ({ ui, tags }) => (
    <>
      <defs><Halftone id="ht-ruling" size={6} opacity=".18" angle={45} /></defs>
      <rect width="400" height="300" fill="#d7d1c5" />
      <rect width="400" height="300" fill="url(#ht-ruling)" />
      <g transform="translate(0 12) rotate(2 200 120)"><g className="sc-sheet">
        <rect x="96" y="18" width="200" height="210" fill="#00000026" transform="translate(8 10)" />
        <rect x="96" y="18" width="200" height="210" fill={PAPER} />
        <text x="114" y="42" fontFamily={MONO} fontSize="11" letterSpacing="1.2" fill="#55524c">REGINA v. BARTLE</text>
        <text x="114" y="74" fontFamily={SERIF} fontWeight="600" fontSize="24" fill={RED}>{ui.scenes.ruling[0]}</text>
        <text x="114" y="98" fontFamily={SERIF} fontWeight="600" fontSize="24" fill={RED}>{ui.scenes.ruling[1]}</text>
        {[116, 130, 144].map((y, i) => <g key={y}><rect className="sc-line" x="114" y={y} width={[148, 118, 136][i]} height="5" fill={G2} /><rect className="sc-strike" x="110" y={y + 1} width={[156, 126, 144][i]} height="3" fill={INK} opacity=".7" /></g>)}
        <path className="sc-cut" d="M104 162H288" stroke={RED} strokeWidth="2" strokeDasharray="5 4" />
        <text x="288" y="158" textAnchor="end" fontFamily={MONO} fontSize="11" fill={RED}>29.IX.1988</text>
        {[174, 188, 202].map((y, i) => <rect key={y} className="sc-line" x="114" y={y} width={[150, 120, 100][i]} height="5" fill={INK} opacity=".78" />)}
        <g transform="translate(268 44)"><g className="sc-seal">
          <circle r="16" fill={RED} />
          <circle r="12" fill="none" stroke={PAPER} strokeWidth="1.4" />
          <path d="M0-7L2 -2.2H7.2L3 1.1L4.5 6.2L0 3.1L-4.5 6.2L-3 1.1L-7.2-2.2H-2Z" fill={PAPER} />
        </g></g>
      </g></g>
      {Array.from({ length: 7 }, (_, i) => <Figure key={i} cls="sc-lord" x={92 + i * 36} y={294} s={0.46} coat={i < 6 ? RED : G3} hair="#f6f2e8" shirt />)}
      {tags}
    </>
  ),

  // Bow Street, 8 October 1999: the magistrate at the court door passes the case to the Home Secretary.
  commit: ({ tags }) => (
    <>
      <defs><Halftone id="ht-commit" size={6} opacity=".22" /></defs>
      <rect width="400" height="300" fill="#bbb5ab" />
      <rect width="400" height="300" fill="url(#ht-commit)" />
      <g transform="translate(-28 0)">
        <rect x="50" y="30" width="300" height="214" fill="#4a443b" />
        <rect x="50" y="30" width="300" height="214" fill="url(#ht-commit)" />
        <rect x="40" y="22" width="320" height="14" fill="#2a2724" />
        {[70, 110, 270, 310].map((x) => <g key={x}><rect x={x} y="64" width="22" height="46" fill={G2} opacity=".7" /><rect x={x} y="132" width="22" height="46" fill={G2} opacity=".7" /></g>)}
        <path d="M160 244V122Q160 84 200 84T240 122V244Z" fill="#1b1b19" />
        <rect className="sc-light" x="164" y="120" width="72" height="124" fill={PAPER} opacity=".9" />
        <Figure cls="sc-magistrate" x={200} y={244} s={0.84} coat={INK} legs={INK2} hair="#d8d3c6" shirt tie={INK2} armR={[20, -70, 25, -84]}>
          <Sheet x={18} y={-110} rot={8} />
        </Figure>
        <g fill="#2a2724">
          <rect className="sc-leaf-l" x="164" y="108" width="36" height="136" />
          <rect className="sc-leaf-r" x="200" y="108" width="36" height="136" />
        </g>
        {[0, 1, 2].map((i) => <rect key={i} x={140 - i * 12} y={244 + i * 10} width={120 + i * 24} height="10" fill={i === 0 ? "#6b645a" : "#5a544b"} />)}
      </g>
      <path className="sc-arrow" d="M206 226Q272 196 330 232" pathLength="1" strokeDasharray="1" strokeDashoffset="0" fill="none" stroke={RED} strokeWidth="4.5" strokeLinecap="round" />
      <path className="sc-arrow-head" d="M330 216L342 240L318 240Z" fill={RED} />
      <Figure cls="sc-minister" x={364} y={288} s={1.05} flip coat={INK} legs={INK2} hair={INK} shirt tie={RED}>
        <rect x="5" y="-43" width="17" height="12" fill={RED} />
        <path d="M10-43V-46H17V-43" fill="none" stroke={RED} strokeWidth="1.6" />
      </Figure>
      {tags}
    </>
  ),

  // RAF Waddington, 2 March 2000 (Hansard: take-off at about 1.1 pm): four doctors, a police escort, a plane leaving.
  end: ({ ui, tags }) => (
    <>
      <defs>
        <Sky id="sky-end" from="#c9c5bb" to="#e2ded4" />
        <Halftone id="ht-end" angle={20} opacity=".3" />
      </defs>
      <rect width="400" height="300" fill="url(#sky-end)" />
      <rect width="400" height="300" fill="url(#ht-end)" opacity=".5" />
      <g transform="translate(0 16)"><g className="sc-board">
        <rect x="24" y="24" width="238" height="128" fill="#1b1b19" />
        <rect x="24" y="24" width="238" height="14" fill="#2f2e2a" />
        <text x="36" y="35" fontFamily={MONO} fontSize="10" letterSpacing="2" fill="#8d897f">{ui.scenes.board}</text>
        {[["13:10 → SCL", "#e9e5db"], [ui.scenes.departure[0], "#e9e5db"], [ui.scenes.departure[1], "#e8695d"]].map(([t, c], i) => (
          <g key={i}>
            <rect x="36" y={52 + i * 32} width="214" height="24" fill="#2a2926" />
            <text x="46" y={69 + i * 32} fontFamily={MONO} fontSize="15" fontWeight="500" letterSpacing="3" fill={c}>{t}</text>
            <rect x="36" y={63 + i * 32} width="214" height="1.5" fill="#1b1b19" />
          </g>
        ))}
      </g></g>
      <path d="M-4 268V204L60 190L132 204V268Z" fill="#55524c" />
      <path d="M0 268H400V300H0Z" fill={INK2} />
      <path d="M0 284H400" stroke={G2} strokeWidth="2" strokeDasharray="18 14" />
      {[22, 48, 74, 100].map((x) => <Figure key={x} cls="sc-doctor" x={x} y={270} s={0.6} coat="#f6f2e8" legs={INK} hair={x === 48 ? WHITE_HAIR : INK} shirt={false} />)}
      <path className="sc-climb" d="M244 274Q340 262 360 134" pathLength="1" strokeDasharray="1" strokeDashoffset="0" fill="none" stroke={RED} strokeWidth="4" strokeLinecap="round" />
      <g transform="translate(318 122) rotate(-52) scale(.92)"><Airliner cls="sc-plane2" /></g>
      <g className="sc-escort">
        <Figure x={160} y={270} s={0.86} {...POLICE} armL={[-4, -62, 12, -66]} armR={[17, -64, 21, -70]} />
        <Wheelchair x={198} y={270} s={0.86} />
      </g>
      {tags}
    </>
  ),

  // Santiago, 3 March 2000: the wheelchair stands empty; press accounts describe him on his feet.
  return: ({ tags }) => (
    <>
      <defs>
        <Sky id="sky-ret" from="#cfcbc1" to="#e4e0d6" />
        <Halftone id="ht-ret" opacity=".3" />
      </defs>
      <rect width="400" height="300" fill="url(#sky-ret)" />
      <rect width="400" height="200" fill="url(#ht-ret)" opacity=".5" />
      <g fill={INK}>
        <path d="M-10 60L60 20L84 20L62 150L-10 150Z" />
        <path d="M-10 78L70 78L66 98L-10 98Z" fill={RED} />
      </g>
      <RedLine d="M-10 200L410 168" />
      <rect y="214" width="400" height="86" fill="#9a968c" />
      <path d="M0 282H400" stroke={PAPER} strokeWidth="2" strokeDasharray="20 14" opacity=".7" />
      <g>{[330, 346, 362, 378, 394].map((x, i) => <Mini key={x} x={x} y={216 + (i % 2) * 4} fill={INK2} />)}</g>
      <Wheelchair cls="sc-chair" x={104} y={270} s={0.95} empty />
      <Figure cls="sc-salute" x={304} y={270} s={1.08} flip coat={UNIFORM} legs="#57544c" hair={null} hat="cap" armR={[23, -86, 11, -104]} armRCls="sc-salute-arm" />
      <Figure cls="sc-figure" x={206} y={272} s={1.15} {...OLD} cane armR={[17, -63, 21, -46]} armL={[-19, -72, -25, -96]} />
      {tags}
    </>
  ),

  // Santiago, 8 August 2000: immunity cracked, 14 votes against 6.
  immunity: ({ tags }) => (
    <>
      <defs><Halftone id="ht-imm" size={6} opacity=".18" angle={45} /></defs>
      <rect width="400" height="300" fill="#d7d1c5" />
      <rect width="400" height="300" fill="url(#ht-imm)" />
      <g transform="translate(112 12) scale(.58)">
        <path className="sc-shield" d="M200 34l92 30v82c0 56-48 88-92 106-44-18-92-50-92-106V64z" fill={PAPER} stroke={INK} strokeWidth="4" />
        <path className="sc-crack" d="M200 34l-12 62 28 40-20 52 10 64" pathLength="1" strokeDasharray="1" strokeDashoffset="0" fill="none" stroke={RED} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <text x="26" y="228" fontFamily={SERIF} fontWeight="600" fontSize="34" fill={RED}>14</text>
      <text x="26" y="268" fontFamily={SERIF} fontWeight="600" fontSize="34" fill={G3}>6</text>
      {Array.from({ length: 14 }, (_, i) => <Mini key={`y${i}`} cls="sc-person" x={82 + i * 22} y={222} fill={RED} />)}
      {Array.from({ length: 6 }, (_, i) => <Mini key={`n${i}`} cls="sc-person" x={82 + i * 22} y={262} fill={G3} />)}
      <RedLine d="M-10 290L410 276" />
      {tags}
    </>
  ),

  // Santiago, 10 December 2006: an empty dock under the light, a line that never closes, and the people still waiting.
  verdict: ({ ui, tags }) => (
    <>
      <defs>
        <Halftone id="ht-ver" color="#e9e5db" opacity=".14" size={6} />
        <linearGradient id="beam-ver" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f4efe4" stopOpacity=".34" /><stop offset="1" stopColor="#f4efe4" stopOpacity="0" /></linearGradient>
      </defs>
      <rect width="400" height="300" fill="#39332e" />
      <rect width="400" height="300" fill="url(#ht-ver)" />
      <path className="sc-beam" d="M150 0H250L330 240H70Z" fill="url(#beam-ver)" />
      <g transform="translate(0 -24)"><g className="sc-dock">
        <rect x="116" y="148" width="168" height="94" fill="#715640" />
        <rect x="116" y="140" width="168" height="12" fill="#9c7a58" />
        {[132, 168, 204, 240].map((x) => <rect key={x} x={x} y="152" width="3" height="86" fill="#00000033" />)}
        <g fill="none" stroke="#e9e5db" strokeWidth="3.5" strokeLinecap="round" opacity=".85">
          <path d="M176 140V108h40v32M184 108V92" />
        </g>
      </g></g>
      <path className="sc-open" d="M52 232H348" pathLength="1" strokeDasharray="1" strokeDashoffset="0" fill="none" stroke={RED} strokeWidth="6" strokeLinecap="round" />
      <text className="sc-verdict" x="200" y="50" textAnchor="middle" fontFamily={MONO} fontSize="15" letterSpacing="4" fill="#eee5d5">{ui.scenes.noVerdict}</text>
      {[[34, 0], [92, 1], [150, 0], [214, 0], [282, 0], [344, 2]].map(([x, held], i) => (
        <g key={x} transform={`translate(${x} ${266 + (i % 2) * 5})`}>
          <g className="sc-witness">
            {held > 0 && (
              <g transform={`translate(${held === 2 ? 22 : -24} -46) rotate(${held === 2 ? 5 : -4})`}>
                <path d="M9 26V44" stroke="#14120f" strokeWidth="2.6" />
                <rect width="18" height="25" fill={PAPER} />
                <circle cx="9" cy="9" r="4.2" fill={INK2} />
                <path d="M2.5 22Q2.5 14.5 9 14.5T15.5 22Z" fill={INK2} />
              </g>
            )}
            <circle r="11.5" fill="#14120f" />
            <path d="M-24 40Q-24 14 0 14T24 40Z" fill="#14120f" />
          </g>
        </g>
      ))}
      {tags}
    </>
  ),
};

// Scenes whose information sits near the edges (rows of people, labels): never crop them.
const fullBounds = new Set(["immunity", "ruling"]);

export default function Scene({ type, ui, cues = [] }) {
  const draw = scenes[type];
  if (!draw) return null;
  const tags = (sceneTags[type] ?? []).map(([x, y, ax, ay, end], i) => cues[i] && <Tag key={i} i={i} text={cues[i][1]} x={x} y={y} ax={ax} ay={ay} end={end === "end"} />);
  return (
    <svg className="sv" viewBox="0 0 400 300" preserveAspectRatio={`xMidYMid ${fullBounds.has(type) ? "meet" : "slice"}`} aria-hidden="true" focusable="false">
      {draw({ ui, tags })}
    </svg>
  );
}
