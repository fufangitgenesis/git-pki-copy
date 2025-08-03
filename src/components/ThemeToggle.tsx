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
  // [FIXED] Use 'resolvedTheme' to get the actual current theme ("light" or "dark")
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Render a placeholder to prevent layout shift before the component is mounted
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className={cn(
        "w-full justify-center",
        !collapsed && "sm:justify-start"
      )}>
        <div className="w-4 h-4" />
      </Button>
    );
  }

  const toggleTheme = () => {
    setTheme(resolvedTheme === "light" ? "dark" : "light");
  };

  // [FIXED] All display logic now uses 'resolvedTheme'
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
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="w-full">
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
