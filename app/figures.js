// The people of the story, drawn in the same language as the panels: flat ink shapes, a paper-toned
// face with no features, and one or two details that say who someone is (a cap, a helmet, a cane).
// A figure stands with its feet at (0, 0) and is about 110 units tall; `flip` turns it to face left.
// Class names passed in are animation hooks (see motion.js); those groups carry no transform attribute.

export const INK = "#272723";
export const INK2 = "#3c3a36";
export const RED = "#bf2727";
export const PAPER = "#ece8dc";
export const G2 = "#b4ada0";
export const G3 = "#8d897f";
export const SKIN = "#e6d3ba";
export const WHITE_HAIR = "#f6f2e8";
export const UNIFORM = "#6f6b61";
export const MONO = "DM Mono, monospace";

const HATS = {
  // Peaked army cap with a red band.
  cap: (c) => (
    <>
      <path d="M-10.5-104H10.5L9.5-110Q0-117.5-9.5-110Z" fill={c} />
      <rect x="-10.5" y="-106" width="21" height="2.6" fill={RED} />
      <path d="M-9-103.4H9L7-100.6H-7Z" fill={INK} />
    </>
  ),
  // The tall helmet of the Metropolitan Police.
  helmet: () => (
    <>
      <path d="M-9.5-103Q-10-118 0-121Q10-118 9.5-103Z" fill={INK} />
      <rect x="-11.5" y="-104.6" width="23" height="2.6" rx="1.3" fill={INK} />
      <circle cx="0" cy="-111" r="2.2" fill={G2} />
    </>
  ),
  // Steel helmet.
  steel: (c) => <path d="M-10.5-100.5Q-10.5-112.5 0-112.5Q10.5-112.5 10.5-100.5Z" fill={c} />,
};

export function Figure({
  x = 0, y = 0, s = 1, flip = false, cls,
  coat = INK, legs = INK2, hair = INK, skin = SKIN,
  robe = false, cape, hat, hatColor, glasses = false, moustache, tie, shirt = false, cane = false,
  armL = [-15, -62, -13, -44], armR = [15, -62, 13, -44], armLCls, armRCls,
  children,
}) {
  const arm = ([ex, ey, hx, hy], sx, c) => (
    <g className={c}>
      <path d={`M${sx} -81L${ex} ${ey}L${hx} ${hy}`} fill="none" stroke={coat} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={hx} cy={hy} r="3.6" fill={skin} />
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <g className={cls}>
        {cape && <path d="M-14-86L-21-26H21L14-86Z" fill={cape} />}
        {cane && <path d={`M${armR[2]} ${armR[3]}L${armR[2] + 3} 0`} stroke={INK} strokeWidth="2.6" strokeLinecap="round" />}
        {robe ? (
          <path d="M-13-80Q-13-88-5-89H5Q13-88 13-80L17-2H-17Z" fill={coat} />
        ) : (
          <>
            <path d="M-9-44L-8-3H-1L0-34L1-3H8L9-44Z" fill={legs} />
            <path d="M-9-4H0V0H-10ZM1-4H10V0H0Z" fill={INK} />
            <path d="M-13-80Q-13-88-5-89H5Q13-88 13-80L11-40H-11Z" fill={coat} />
          </>
        )}
        {shirt && <path d="M-4.5-89L0-77L4.5-89Z" fill={PAPER} />}
        {tie && <path d="M-1.7-88L0-71L1.7-88Z" fill={tie} />}
        <rect x="-3" y="-93" width="6" height="6" fill={skin} />
        <circle cx="0" cy="-99" r="8.6" fill={skin} />
        {hair && !hat && <path d="M-8.8-99A8.8 8.8 0 0 1 8.8-99Q7-104.5 0-105Q-7-104.5-8.8-99Z" fill={hair} />}
        {hat && HATS[hat](hatColor ?? coat)}
        {glasses && <rect x="-7.2" y="-101.2" width="14.4" height="4.2" rx="1.7" fill={INK} />}
        {moustache && <rect x="-4" y="-95.2" width="8" height="2" rx="1" fill={moustache} />}
        {arm(armL, -11, armLCls)}
        {arm(armR, 11, armRCls)}
        {children}
      </g>
    </g>
  );
}

// A small head-and-robe figure for benches and crowds; feet at (0, 5), about 18 units tall.
export const Mini = ({ x, y, fill, cls = "", skin = SKIN }) => (
  <g transform={`translate(${x} ${y})`}>
    <g className={cls}>
      <path d="M-5.5 5V-3Q-5.5-6 0-6T5.5-3V5Z" fill={fill} />
      <circle cx="0" cy="-10" r="3.8" fill={skin} />
    </g>
  </g>
);

// A seated figure in a wheelchair, facing right; the wheel touches the ground at (0, 0).
export const Wheelchair = ({ x, y, s = 1, cls, empty = false, stroke = INK }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <g className={cls}>
      {!empty && (
        <>
          <path d="M19-30H28L30-5H21Z" fill={INK2} />
          <path d="M20-5H34V-1H20Z" fill={INK} />
          <path d="M-9-37H27V-27H-9Z" fill={INK2} />
          <path d="M-12-30L-10-62Q-9-69-2-69Q6-69 7-60L9-30Z" fill={INK} />
          <rect x="-4" y="-74" width="6" height="6" fill={SKIN} />
          <circle cx="0" cy="-80" r="8.4" fill={SKIN} />
          <path d="M-8.6-80A8.6 8.6 0 0 1 8.6-80Q7-85.5 0-86Q-7-85.5-8.6-80Z" fill={WHITE_HAIR} />
          <path d="M-1-60L9-45L20-43" fill="none" stroke={INK} strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="20" cy="-43" r="3.4" fill={SKIN} />
        </>
      )}
      <g fill="none" stroke={stroke} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="0" cy="-20" r="20" />
        <circle cx="30" cy="-6" r="6" />
        <path d="M-14-66V-27H26L30-12M-14-66L-23-71" />
      </g>
      <circle cx="0" cy="-20" r="3" fill={stroke} />
    </g>
  </g>
);

// A red chip pinned to a point in a scene. Its text is a phrase from the chapter's copy; the copy
// marks the same phrase (see `cues` in app/i18n), and the two light up together.
export function Tag({ i, text, x, y, ax, ay, end = false }) {
  const w = Math.round(text.length * 6.9 + 13);
  const h = 16;
  const x0 = end ? x - w : x;
  const bx = Math.max(x0, Math.min(ax, x0 + w));
  const by = Math.max(y, Math.min(ay, y + h));
  return (
    <g className="tag" data-tag={i}>
      <g className="tag-in">
        <path d={`M${ax} ${ay}L${bx} ${by}`} stroke={RED} strokeWidth="1.6" />
        <rect className="tag-box" x={x0} y={y} width={w} height={h} fill={RED} />
        <text x={x0 + 6.5} y={y + 11.7} fontFamily={MONO} fontSize="10.4" letterSpacing=".66" fill="#fff">{text}</text>
        <circle cx={ax} cy={ay} r="3.2" fill={RED} stroke={PAPER} strokeWidth="1.3" />
      </g>
      <circle className="tag-ping" cx={ax} cy={ay} r="3.2" fill="none" stroke={RED} strokeWidth="2" />
    </g>
  );
}
