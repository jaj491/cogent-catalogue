export function FooterDecoration() {
  return (
    <div className="relative h-16 mt-auto overflow-hidden">
      {/* Gradient base */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent" />
      
      {/* Wave pattern */}
      <svg 
        className="absolute bottom-0 w-full h-12" 
        viewBox="0 0 1440 48" 
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="footer-wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
            <stop offset="50%" stopColor="hsl(var(--secondary))" stopOpacity="0.15" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <path 
          d="M0,24 C240,48 480,0 720,24 C960,48 1200,0 1440,24 L1440,48 L0,48 Z" 
          fill="url(#footer-wave-gradient)"
        />
        <path 
          d="M0,32 C360,16 720,48 1080,32 C1260,24 1380,36 1440,32 L1440,48 L0,48 Z" 
          fill="hsl(var(--primary))"
          fillOpacity="0.05"
        />
      </svg>
      
      {/* Accent orbs */}
      <div className="absolute bottom-0 left-1/4 w-48 h-8 bg-gradient-to-t from-primary/10 to-transparent rounded-t-full blur-xl" />
      <div className="absolute bottom-0 right-1/3 w-32 h-6 bg-gradient-to-t from-secondary/10 to-transparent rounded-t-full blur-lg" />
      
      {/* Bottom line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-primary/40 rounded-full animate-pulse"
            style={{
              left: `${10 + i * 12}%`,
              bottom: `${20 + (i % 3) * 15}%`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
