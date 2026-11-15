export const GITHUB_URL = 'https://github.com/ent-xjtlu/ShowProof'

export function ExVisMark() {
  return (
    <svg viewBox="0 0 64 64" focusable="false">
      <path
        d="M18 5 H40 M59 18 V44 Q59 59 44 59 H20 Q5 59 5 44 V20 Q5 5 20 5"
        fill="none"
        stroke="#b5492a"
        strokeWidth="5"
        strokeLinecap="butt"
        strokeLinejoin="round"
      />
      <path d="M16 25 L45 14.5 L45 18.5 L16 29 Z" fill="#e6b28c" />
      <path d="M20 34 L33.5 28.5 L33.5 50 L20 55.5 Z" fill="#8a2c0f" />
      <path d="M37 27.5 L50 22 L50 43.5 L37 49 Z" fill="#e6b28c" />
      <path d="M53.5 31 L60 28 L60 42 L53.5 45 Z" fill="#c05a30" />
    </svg>
  )
}

export function Brand({ homeLabel }: { homeLabel: string }) {
  return (
    <a className="landing-brand" href="#top" aria-label={homeLabel}>
      <span className="landing-brand__mark" aria-hidden="true">
        <ExVisMark />
      </span>
      <span className="landing-brand__text">
        <strong>
          ExVis<span className="landing-brand__zh">展视</span>
        </strong>
        <small>MARKET INTELLIGENCE, VERIFIED.</small>
      </span>
    </a>
  )
}
