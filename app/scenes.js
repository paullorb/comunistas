// The ten timeline panels, drawn in one language: flat ink shapes on warm paper tones, a halftone
// screen for atmosphere, one red accent, and the red diagonal that runs through the whole series.
// Each scene is a 400×300 SVG; class names starting with "sc-" are animation hooks (see motion.js).

const INK = "#272723";
const INK2 = "#3c3a36";
const RED = "#bf2727";
const PAPER = "#ece8dc";
const G2 = "#b4ada0";
const G3 = "#8d897f";
const MONO = "DM Mono, monospace";
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

const Person = ({ x, y, fill, cls = "" }) => (
  <g transform={`translate(${x} ${y})`}>
    <g className={cls} fill={fill}>
      <circle cx="0" cy="-9" r="3.6" />
      <path d="M-5 5V-3Q-5-5.5 0-5.5T5-3V5Z" />
    </g>
  </g>
);

const scenes = {
  // Santiago, 11 September 1973: the palace, smoke, and aircraft on the approach.
  coup: () => (
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
    </>
  ),

  // Heathrow, 22 September 1998: an aircraft on the glide path over London.
  arrival: () => (
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
      <g transform="translate(262 40) rotate(18) scale(1.15)">
        <g className="sc-plane" fill={INK}>
          <path d="M0 14c0-6 6-10 16-10h60c10 0 18 3 22 10-4 7-12 10-22 10H16C6 24 0 20 0 14Z" />
          <path d="M44 12L22-16h12L70 12Z M44 16L22 44h12L70 16Z" fill={G3} />
          <path d="M4 10L-6-14h12L18 8Z" fill={RED} />
        </g>
      </g>
      <RedLine d="M-10 288L410 262" />
    </>
  ),

  // The London Clinic, 16 October 1998: a lit window and a provisional warrant.
  arrest: ({ ui }) => (
    <>
      <defs>
        <Halftone id="ht-arrest" size={6} r={1} opacity=".3" />
        <radialGradient id="glow-arrest"><stop offset="0" stopColor="#f4efe4" stopOpacity=".9" /><stop offset="1" stopColor="#f4efe4" stopOpacity="0" /></radialGradient>
      </defs>
      <rect width="400" height="300" fill="#c6c1b7" />
      <rect width="400" height="300" fill="url(#ht-arrest)" />
      <g>
        <rect x="24" y="30" width="214" height="270" fill={INK} />
        <rect x="24" y="30" width="214" height="14" fill="#4a4944" />
        {Array.from({ length: 5 }, (_, r) => Array.from({ length: 4 }, (_, c) => <rect key={`${r}-${c}`} x={44 + c * 50} y={62 + r * 46} width="26" height="30" fill={G2} opacity=".78" />))}
      </g>
      <circle className="sc-glow" cx="144" cy="108" r="46" fill="url(#glow-arrest)" />
      <rect className="sc-lit" x="131" y="108" width="26" height="30" fill={PAPER} />
      <g transform="rotate(-7 280 160)"><g className="sc-paper">
        <rect x="204" y="56" width="152" height="204" fill="#00000026" transform="translate(7 9)" />
        <rect x="204" y="56" width="152" height="204" fill={PAPER} />
        <rect x="220" y="76" width="70" height="3" fill={G3} />
        <rect x="220" y="92" width="112" height="2.5" fill={G2} />
        <rect x="220" y="104" width="96" height="2.5" fill={G2} />
        <rect x="220" y="116" width="106" height="2.5" fill={G2} />
        <rect x="220" y="140" width="110" height="9" fill={INK} opacity=".85" />
        <rect x="220" y="158" width="64" height="2.5" fill={G2} />
        <rect x="220" y="170" width="100" height="2.5" fill={G2} />
      </g></g>
      <g transform="rotate(-13 290 200)"><g className="sc-stamp">
        <rect x="236" y="178" width="118" height="38" fill="none" stroke={RED} strokeWidth="3.5" />
        <text x="295" y="204" textAnchor="middle" fontFamily={MONO} fontSize="16" fontWeight="500" letterSpacing="2" fill={RED}>{ui.scenes.arrested}</text>
      </g></g>
      <RedLine d="M-10 286L410 252" />
    </>
  ),

  // House of Lords, 25 November 1998: five lords, a 3–2 vote.
  court: () => (
    <>
      <defs><Halftone id="ht-court" color="#e9e5db" opacity=".12" size={6} /></defs>
      <rect width="400" height="300" fill="#39332e" />
      <rect width="400" height="300" fill="url(#ht-court)" />
      <g fill="none" stroke="#5c5046" strokeWidth="3">
        {[40, 160, 280].map((x) => <path key={x} d={`M${x} 190V90Q${x} 40 ${x + 40} 40T${x + 80} 90V190`} />)}
      </g>
      <text className="sc-vote" x="200" y="86" textAnchor="middle" fontFamily={SERIF} fontWeight="600" fontSize="58" fill="#eee5d5">3 : 2</text>
      {[[70, true], [135, true], [200, false], [265, true], [330, false]].map(([x, yes], i) => (
        <g key={i} transform={`translate(${x} 150)`}>
          <g className="sc-lord">
            <circle cx="0" cy="0" r="12" fill="#e9e5db" />
            <path d="M-20 62Q-22 22 0 16Q22 22 20 62Z" fill={yes ? RED : G3} />
            <path d="M-6 16L0 30L6 16Z" fill="#f4efe4" />
          </g>
        </g>
      ))}
      <rect y="206" width="400" height="94" fill="#712e28" />
      <rect y="206" width="400" height="94" fill="url(#ht-court)" />
      <rect y="202" width="400" height="9" fill="#9c7a58" />
      <path d="M0 250H400M0 276H400" stroke="#00000033" strokeWidth="2" />
      <RedLine d="M-10 292L410 266" />
    </>
  ),

  // 24 March 1999: the judgment, narrowed to what came after 29 September 1988.
  ruling: ({ ui }) => (
    <>
      <defs><Halftone id="ht-ruling" size={6} opacity=".18" angle={45} /></defs>
      <rect width="400" height="300" fill="#d7d1c5" />
      <rect width="400" height="300" fill="url(#ht-ruling)" />
      <g transform="rotate(3 200 150)"><g className="sc-sheet">
        <rect x="110" y="26" width="190" height="252" fill="#00000026" transform="translate(8 10)" />
        <rect x="110" y="26" width="190" height="252" fill={PAPER} />
        <text x="128" y="52" fontFamily={MONO} fontSize="11" letterSpacing="1.2" fill="#55524c">REGINA v. BARTLE</text>
        <text x="128" y="86" fontFamily={SERIF} fontWeight="600" fontSize="25" fill={RED}>{ui.scenes.ruling[0]}</text>
        <text x="128" y="112" fontFamily={SERIF} fontWeight="600" fontSize="25" fill={RED}>{ui.scenes.ruling[1]}</text>
        {[134, 150, 166].map((y, i) => <g key={y}><rect className="sc-line" x="128" y={y} width={[148, 118, 136][i]} height="5" fill={G2} /><rect className="sc-strike" x="124" y={y + 1} width={[156, 126, 144][i]} height="3" fill={INK} opacity=".7" /></g>)}
        <path className="sc-cut" d="M118 184H292" stroke={RED} strokeWidth="2" strokeDasharray="5 4" />
        <text x="292" y="180" textAnchor="end" fontFamily={MONO} fontSize="11" fill={RED}>29.IX.1988</text>
        {[198, 214, 230].map((y, i) => <rect key={y} className="sc-line" x="128" y={y} width={[150, 120, 100][i]} height="5" fill={INK} opacity=".78" />)}
        <g transform="translate(262 246)"><g className="sc-seal">
          <circle r="20" fill={RED} />
          <circle r="15" fill="none" stroke={PAPER} strokeWidth="1.5" />
          <path d="M0-9L2.6-2.8H9.2L3.8 1.4L5.8 8L0 4L-5.8 8L-3.8 1.4L-9.2-2.8H-2.6Z" fill={PAPER} />
        </g></g>
      </g></g>
      <RedLine d="M-10 286L410 260" />
    </>
  ),

  // Bow Street, October 1999: the court door opens onto the next decision.
  commit: () => (
    <>
      <defs><Halftone id="ht-commit" size={6} opacity=".22" /></defs>
      <rect width="400" height="300" fill="#bbb5ab" />
      <rect width="400" height="300" fill="url(#ht-commit)" />
      <rect x="50" y="30" width="300" height="214" fill="#4a443b" />
      <rect x="50" y="30" width="300" height="214" fill="url(#ht-commit)" />
      <rect x="40" y="22" width="320" height="14" fill="#2a2724" />
      {[70, 110, 270, 310].map((x) => <g key={x}><rect x={x} y="64" width="22" height="46" fill={G2} opacity=".7" /><rect x={x} y="132" width="22" height="46" fill={G2} opacity=".7" /></g>)}
      <path d="M160 244V122Q160 84 200 84T240 122V244Z" fill="#1b1b19" />
      <rect className="sc-light" x="164" y="120" width="72" height="124" fill={PAPER} opacity=".9" />
      <g fill="#2a2724">
        <rect className="sc-leaf-l" x="164" y="108" width="36" height="136" />
        <rect className="sc-leaf-r" x="200" y="108" width="36" height="136" />
      </g>
      {[0, 1, 2].map((i) => <rect key={i} x={140 - i * 12} y={244 + i * 10} width={120 + i * 24} height="10" fill={i === 0 ? "#6b645a" : "#5a544b"} />)}
      <path className="sc-arrow" d="M30 280Q110 268 190 248" pathLength="1" strokeDasharray="1" strokeDashoffset="0" fill="none" stroke={RED} strokeWidth="5" strokeLinecap="round" />
      <path className="sc-arrow-head" d="M176 238L204 246L180 264Z" fill={RED} />
    </>
  ),

  // RAF Waddington, 2 March 2000 (Hansard: take-off at about 1.10 pm): a departure board and an aircraft leaving.
  end: ({ ui }) => (
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
      <path className="sc-climb" d="M110 286Q240 276 330 128" pathLength="1" strokeDasharray="1" strokeDashoffset="0" fill="none" stroke={RED} strokeWidth="4" strokeLinecap="round" />
      <g transform="translate(300 118) rotate(-52) scale(1)">
        <g className="sc-plane2" fill={INK}>
          <path d="M0 14c0-6 6-10 16-10h60c10 0 18 3 22 10-4 7-12 10-22 10H16C6 24 0 20 0 14Z" />
          <path d="M44 12L22-16h12L70 12Z M44 16L22 44h12L70 16Z" fill={G3} />
          <path d="M4 10L-6-14h12L18 8Z" fill={RED} />
        </g>
      </g>
      <path d="M0 262H400V300H0Z" fill={INK2} />
      <path d="M0 280H400" stroke={G2} strokeWidth="2" strokeDasharray="18 14" />
    </>
  ),

  // Santiago, 3 March 2000: the wheelchair stands empty.
  return: () => (
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
      <rect y="214" width="400" height="86" fill={INK2} />
      <path d="M0 262H400" stroke={G2} strokeWidth="2" strokeDasharray="20 14" />
      <g fill={G3}>{[300, 318, 336, 354, 372].map((x, i) => <g key={x} transform={`translate(${x} ${208 + (i % 2) * 3})`}><circle cy="-10" r="4" /><rect x="-4" y="-5" width="8" height="14" rx="3" /></g>)}</g>
      <g className="sc-chair" fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round">
        <circle cx="168" cy="236" r="22" />
        <path d="M154 190v34h42M154 190l-8-20" />
      </g>
      <g className="sc-figure" fill={INK} stroke={INK} strokeWidth="5" strokeLinecap="round">
        <circle cx="236" cy="150" r="10" stroke="none" />
        <path d="M236 164v46M236 174l-18 24M236 174l22 14M236 210l-11 34M236 210l11 34" fill="none" />
        <path d="M258 188l10 56" strokeWidth="3" fill="none" />
      </g>
      <RedLine d="M-10 200L410 168" />
    </>
  ),

  // Santiago, 8 August 2000: immunity cracked, 14 votes against 6.
  immunity: () => (
    <>
      <defs><Halftone id="ht-imm" size={6} opacity=".18" angle={45} /></defs>
      <rect width="400" height="300" fill="#d7d1c5" />
      <rect width="400" height="300" fill="url(#ht-imm)" />
      <g transform="translate(112 12) scale(.58)">
        <path className="sc-shield" d="M200 34l92 30v82c0 56-48 88-92 106-44-18-92-50-92-106V64z" fill={PAPER} stroke={INK} strokeWidth="4" />
        <path className="sc-crack" d="M200 34l-12 62 28 40-20 52 10 64" pathLength="1" strokeDasharray="1" strokeDashoffset="0" fill="none" stroke={RED} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <text x="26" y="222" fontFamily={SERIF} fontWeight="600" fontSize="34" fill={RED}>14</text>
      <text x="26" y="262" fontFamily={SERIF} fontWeight="600" fontSize="34" fill={G3}>6</text>
      {Array.from({ length: 14 }, (_, i) => <Person key={`y${i}`} cls="sc-person" x={80 + i * 22} y={222} fill={RED} />)}
      {Array.from({ length: 6 }, (_, i) => <Person key={`n${i}`} cls="sc-person" x={80 + i * 22} y={262} fill={G3} />)}
      <RedLine d="M-10 290L410 274" />
    </>
  ),

  // Santiago, 10 December 2006: an empty dock under the light, a line that never closes.
  verdict: ({ ui }) => (
    <>
      <defs>
        <Halftone id="ht-ver" color="#e9e5db" opacity=".14" size={6} />
        <linearGradient id="beam-ver" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f4efe4" stopOpacity=".34" /><stop offset="1" stopColor="#f4efe4" stopOpacity="0" /></linearGradient>
      </defs>
      <rect width="400" height="300" fill="#39332e" />
      <rect width="400" height="300" fill="url(#ht-ver)" />
      <path className="sc-beam" d="M150 0H250L330 262H70Z" fill="url(#beam-ver)" />
      <g className="sc-dock">
        <rect x="116" y="148" width="168" height="94" fill="#715640" />
        <rect x="116" y="140" width="168" height="12" fill="#9c7a58" />
        {[132, 168, 204, 240].map((x) => <rect key={x} x={x} y="152" width="3" height="86" fill="#00000033" />)}
        <g fill="none" stroke="#e9e5db" strokeWidth="3.5" strokeLinecap="round" opacity=".85">
          <path d="M176 140V108h40v32M184 108V92" />
        </g>
      </g>
      <path className="sc-open" d="M52 252H348" pathLength="1" strokeDasharray="1" strokeDashoffset="0" fill="none" stroke={RED} strokeWidth="6" strokeLinecap="round" />
      <text className="sc-verdict" x="200" y="50" textAnchor="middle" fontFamily={MONO} fontSize="15" letterSpacing="4" fill="#eee5d5">{ui.scenes.noVerdict}</text>
    </>
  ),
};

// Scenes whose information sits near the edges (rows of people, labels): never crop them.
const fullBounds = new Set(["immunity"]);

export default function Scene({ type, ui }) {
  const draw = scenes[type];
  if (!draw) return null;
  return (
    <svg className="sv" viewBox="0 0 400 300" preserveAspectRatio={`xMidYMid ${fullBounds.has(type) ? "meet" : "slice"}`} aria-hidden="true" focusable="false">
      {draw({ ui })}
    </svg>
  );
}
