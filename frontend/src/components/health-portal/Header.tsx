import { Bell, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border-strong">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center glow-primary">
              <div className="w-6 h-6 bg-background rounded opacity-80" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gradient-primary">
                Health Nexus AI
              </h1>
              <p className="text-xs text-foreground-secondary">
                Diagnostic Portal
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">3</span>
              </span>
            </Button>
          </div>

          <div className="flex items-center gap-3 px-3 py-2 rounded-lg glass">
            <div className="w-8 h-8 rounded-full bg-gradient-secondary glow-secondary flex items-center justify-center">
              <User className="h-4 w-4 text-background" />
            </div>
            <div className="text-sm">
              <div className="font-medium">Dr. Sarah Johnson</div>
              <div className="text-foreground-secondary text-xs">Radiologist</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};