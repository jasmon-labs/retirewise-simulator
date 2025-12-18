import { Shield } from 'lucide-react';

const Header = () => {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">DMC-Sim</h1>
            <p className="text-xs text-muted-foreground">Dynamic Retirement Resilience Simulator</p>
          </div>
        </div>
        <span className="text-xs px-3 py-1 rounded-full bg-accent text-accent-foreground font-medium">
          Hackathon Project
        </span>
      </div>
    </header>
  );
};

export default Header;
