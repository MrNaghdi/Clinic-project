export function AuroraBackground() {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        
        <div
          className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-brand-400/30 blur-[120px] animate-blob"
          style={{ animationDelay: "0s" }}
        />
       
        <div
          className="absolute top-1/3 -left-40 w-[500px] h-[500px] rounded-full bg-accent-400/25 blur-[120px] animate-blob"
          style={{ animationDelay: "2s" }}
        />
       
        <div
          className="absolute -bottom-40 left-1/3 w-[600px] h-[600px] rounded-full bg-purple-400/20 blur-[120px] animate-blob"
          style={{ animationDelay: "4s" }}
        />

        <div
          className="absolute top-1/2 right-1/4 w-[400px] h-[400px] rounded-full bg-pink-400/15 blur-[100px] animate-blob"
          style={{ animationDelay: "6s" }}
        />
      </div>
    );
  }