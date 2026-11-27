/** CivicBridge mark: an arch (bridge) over two banks. */
export default function Logo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <rect width="40" height="40" rx="10" fill="var(--ink)" />
      <path d="M7 27h26" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M9 27c0-8 5-13 11-13s11 5 11 13" fill="none" stroke="#7fd8c3" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M20 14v13M14.5 17v10M25.5 17v10" stroke="#fff" strokeOpacity=".55" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}
