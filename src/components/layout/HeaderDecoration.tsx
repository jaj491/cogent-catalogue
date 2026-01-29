export function HeaderDecoration() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient mesh background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />
      
      {/* Animated gradient orbs */}
      <div className="absolute -top-4 -right-20 w-64 h-24 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full blur-2xl animate-pulse" />
      <div className="absolute -top-2 right-1/4 w-32 h-16 bg-gradient-to-br from-secondary/15 to-transparent rounded-full blur-xl" />
      
      {/* Geometric lines */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="header-line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0" />
            <stop offset="20%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
            <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
            <stop offset="80%" stopColor="hsl(var(--secondary))" stopOpacity="0.2" />
            <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line 
          x1="0" y1="100%" x2="100%" y2="100%" 
          stroke="url(#header-line-gradient)" 
          strokeWidth="1"
        />
        <path 
          d="M0,50 Q25,30 50,50 T100,50" 
          stroke="url(#header-line-gradient)" 
          strokeWidth="0.5"
          fill="none"
          className="opacity-50"
        />
      </svg>
      
      {/* Floating dots pattern */}
      <div className="absolute right-10 top-1/2 -translate-y-1/2 flex gap-1.5">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i} 
            className="w-1 h-1 rounded-full bg-primary/30"
            style={{ 
              animationDelay: `${i * 0.2}s`,
              opacity: 0.3 + (i * 0.1)
            }}
          />
        ))}
      </div>
    </div>
  );
}
