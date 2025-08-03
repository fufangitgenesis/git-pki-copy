import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  collapsed?: boolean;
}

export function ThemeToggle({ collapsed = false }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className={cn(
        !collapsed && "w-full sm:justify-start"
      )}>
        <div className="w-4 h-4" />
      </Button>
    );
  }

  const toggleTheme = () => {
    setTheme(resolvedTheme === "light" ? "dark" : "light");
  };

  const buttonContent = (
    <>
      {resolvedTheme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      {!collapsed && (
        <span className="ml-2">{resolvedTheme === "light" ? "Dark Mode" : "Light Mode"}</span>
      )}
    </>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {/* [FIXED] Removed the w-full class to allow the button to be a proper icon size */}
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {buttonContent}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{resolvedTheme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Button variant="ghost" size="sm" onClick={toggleTheme} className="w-full justify-start">
      {buttonContent}
    </Button>
  );
}
