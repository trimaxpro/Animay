interface ScoreCircleProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

function getScoreColor(score: number): string {
  if (score >= 8) return '#22C55E';
  if (score >= 6) return '#F59E0B';
  if (score >= 4) return '#F97316';
  return '#F43F5E';
}

function getScoreLabel(score: number): string {
  if (score >= 9) return 'Masterpiece';
  if (score >= 8) return 'Excellent';
  if (score >= 7) return 'Great';
  if (score >= 6) return 'Good';
  if (score >= 5) return 'Average';
  if (score >= 4) return 'Mediocre';
  return 'Poor';
}

export function ScoreCircle({ score, size = 100, strokeWidth = 6, className }: ScoreCircleProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 10) * circumference;
  const color = getScoreColor(score);

  return (
    <div className={`relative inline-flex items-center justify-center ${className || ''}`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
          style={{ filter: `drop-shadow(0 0 6px ${color}40)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display font-bold leading-none" style={{ fontSize: size * 0.32, color }}>
          {score.toFixed(1)}
        </span>
        <span className="font-body text-[10px] text-text-muted mt-0.5" style={{ fontSize: size * 0.1 }}>
          {getScoreLabel(score)}
        </span>
      </div>
    </div>
  );
}
