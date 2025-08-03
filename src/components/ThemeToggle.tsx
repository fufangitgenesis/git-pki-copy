import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// [UPDATED] Add 'collapsed' prop to the interface
interface ThemeToggleProps {
  collapsed?: boolean;
}

export function ThemeToggle({ collapsed = false }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Render a placeholder button until the theme is mounted to avoid hydration mismatch
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
    setTheme(theme === "light" ? "dark" : "light");
  };

  const buttonContent = (
    <>
      {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      {/* [UPDATED] Conditionally render the text based on the 'collapsed' prop */}
      {!collapsed && (
        <span className="ml-2">{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
      )}
    </>
  );

  // If collapsed, wrap the button in a tooltip for better UX
  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="w-full">
            {buttonContent}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  // If not collapsed, render the button as normal
  return (
    <Button variant="ghost" size="sm" onClick={toggleTheme} className="w-full justify-start">
      {buttonContent}
    </Button>
  );
}
