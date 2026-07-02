import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GitBranch, Zap, TrendingUp } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface GitHubContributions {
  contributions: ContributionDay[];
}

const COLORS = ['#111827', '#0c2a52', '#0e4f8a', '#0284c7', '#00d4ff'];
const CELL = 11;
const GAP = 3;
const COLS = 52;
const ROWS = 7;
const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

const groupIntoWeeks = (days: ContributionDay[]) => {
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));
  return weeks;
};

const calcStreak = (days: ContributionDay[]) => {
  const sorted = [...days].reverse();
  let current = 0, longest = 0, run = 0, found = false;
  for (const d of sorted) {
    if (d.count > 0) { run++; if (!found) current = run; longest = Math.max(longest, run); }
    else { found = true; run = 0; }
  }
  return { current, longest };
};

const StatBadge = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) => (
  <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/8 bg-white/4 backdrop-blur-sm">
    <span className="text-sky-400">{icon}</span>
    <div>
      <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest leading-none mb-0.5">{label}</p>
      <p className="text-sm font-bold text-white tabular-nums">{value}</p>
    </div>
  </div>
);

const getMonthPositions = (weeks: ContributionDay[][]) => {
  const months: { label: string; col: number }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, col) => {
    if (!week[0]) return;
    const m = new Date(week[0].date).getMonth();
    if (m !== lastMonth) {
      months.push({ label: new Date(week[0].date).toLocaleString('default', { month: 'short' }), col });
      lastMonth = m;
    }
  });
  return months;
};

const GitHubActivity = ({ username = 'saurabhmj11' }: { username?: string }) => {
  const [weeks, setWeeks] = useState<ContributionDay[][]>([]);
  const [stats, setStats] = useState({ total: 0, current: 0, longest: 0 });
  const [loading, setLoading] = useState(true);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; date: string; count: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cellsRef = useRef<(SVGRectElement | null)[]>([]);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`, { signal: ctrl.signal })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then((data: GitHubContributions) => {
        const days = data.contributions.slice(-364);
        setWeeks(groupIntoWeeks(days));
        const { current, longest } = calcStreak(data.contributions);
        setStats({ total: days.reduce((a, d) => a + d.count, 0), current, longest });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, [username]);

  useEffect(() => {
    if (!weeks.length || !containerRef.current) return;
    const cells = cellsRef.current.filter(Boolean) as SVGRectElement[];
    gsap.set(cells, { opacity: 0, scale: 0.3 });
    const ctx = gsap.context(() => {
      gsap.to(cells, {
        opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.5)',
        stagger: { amount: 1.8, from: 'start', grid: [ROWS, COLS] },
        scrollTrigger: { trigger: containerRef.current, start: 'top 80%', once: true },
      });
    }, containerRef);
    return () => ctx.revert();
  }, [weeks]);

  const monthPositions = weeks.length ? getMonthPositions(weeks) : [];
  const svgW = COLS * (CELL + GAP);
  const svgH = ROWS * (CELL + GAP) + 20;

  if (loading) return (
    <div className="mt-12 flex items-center gap-1.5 h-20">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="w-2 h-2 rounded-sm bg-sky-500/30 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
      ))}
    </div>
  );

  if (!weeks.length) return null;

  let idx = 0;
  return (
    <div ref={containerRef} className="mt-16 w-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-px h-6 bg-sky-500/50" />
        <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">GitHub Activity — @{username}</p>
      </div>

      <div className="w-full overflow-x-auto pb-2">
        <svg width={svgW} height={svgH} className="block ml-8" aria-label="GitHub contribution heatmap">
          {monthPositions.map(({ label, col }) => (
            <text key={`m-${col}`} x={col * (CELL + GAP)} y={10} fontSize={9} fill="#4b5563" fontFamily="monospace">{label}</text>
          ))}
          {DAY_LABELS.map((label, row) => label && (
            <text key={`d-${row}`} x={-28} y={22 + row * (CELL + GAP)} fontSize={9} fill="#4b5563" fontFamily="monospace">{label}</text>
          ))}
          <g transform="translate(0,14)">
            {weeks.map((week, col) =>
              week.map((day, row) => {
                const ci = idx++;
                const x = col * (CELL + GAP), y = row * (CELL + GAP);
                return (
                  <rect
                    key={`${col}-${row}`}
                    ref={el => { cellsRef.current[ci] = el; }}
                    x={x} y={y} width={CELL} height={CELL} rx={2}
                    fill={COLORS[day.level ?? 0]}
                    stroke={day.count > 0 ? 'rgba(0,212,255,0.15)' : 'transparent'}
                    strokeWidth={0.5}
                    className="cursor-pointer"
                    style={{ transformOrigin: `${x + CELL / 2}px ${y + CELL / 2}px`, transition: 'filter 0.15s' }}
                    onMouseEnter={e => {
                      const r = (e.target as SVGRectElement).getBoundingClientRect();
                      setTooltip({ x: r.left + CELL / 2, y: r.top - 36, date: day.date, count: day.count });
                    }}
                    onMouseLeave={() => setTooltip(null)}
                  />
                );
              })
            )}
          </g>
          <g transform={`translate(${svgW - 100},${svgH - 12})`}>
            <text x={0} y={9} fontSize={9} fill="#4b5563" fontFamily="monospace">Less</text>
            {COLORS.map((c, i) => <rect key={i} x={32 + i * (CELL + 2)} y={0} width={CELL} height={CELL} rx={2} fill={c} />)}
            <text x={32 + 5 * (CELL + 2) + 4} y={9} fontSize={9} fill="#4b5563" fontFamily="monospace">More</text>
          </g>
        </svg>
      </div>

      {tooltip && (
        <div className="fixed z-50 pointer-events-none px-2.5 py-1.5 rounded-lg bg-gray-900/95 border border-white/10 text-xs font-mono text-white shadow-xl"
          style={{ left: tooltip.x, top: tooltip.y, transform: 'translateX(-50%)' }}>
          <span className="text-sky-400 font-bold">{tooltip.count}</span> contributions
          <span className="text-gray-500 ml-1.5">
            {new Date(tooltip.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      )}

      <div className="flex flex-wrap gap-3 mt-5">
        <StatBadge icon={<TrendingUp size={14} />} label="Contributions (year)" value={stats.total.toLocaleString()} />
        <StatBadge icon={<Zap size={14} />} label="Current Streak" value={`${stats.current}d`} />
        <StatBadge icon={<GitBranch size={14} />} label="Longest Streak" value={`${stats.longest}d`} />
      </div>
    </div>
  );
};

export default GitHubActivity;
