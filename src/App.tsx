import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Dashboard } from "@/components/Dashboard";
import { DailyGoals } from "@/pages/DailyGoals";
import { Tasks } from "@/pages/Tasks";
import { Analytics } from "@/pages/Analytics";
import NotFound from "@/pages/NotFound";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { QuickLogModal } from "@/components/QuickLogModal";
import { db, ActivityCategory, ActivityLog } from "@/lib/database";
import { useToast } from "@/hooks/use-toast";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState<ActivityCategory[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const loadInitialData = async () => {
      await db.init();
      const cats = await db.getCategories();
      setCategories(cats);
    };
    loadInitialData();
  }, []);

  const handleActivityLogged = async (activity: ActivityLog) => {
    try {
      await db.addActivity(activity);
      toast({
        title: "Activity Logged",
        description: `Successfully logged ${activity.name}.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log activity.",
        variant: "destructive"
      });
    }
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Router>
          <SidebarProvider>
            <div className="min-h-screen flex w-full">
              <AppSidebar />
              <div className="flex-1 flex flex-col">
                <header className="h-12 flex items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
                  <SidebarTrigger className="ml-4" />
                </header>
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/goals" element={<DailyGoals />} />
                    <Route path="/tasks" element={<Tasks />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </div>
            </div>
          </SidebarProvider>
          <Toaster />

          {/* [FIXED] FAB moved outside the main scrolling container and position changed to 'fixed' */}
          <div className="fixed bottom-8 right-8 z-50">
            <Button
              onClick={() => setIsModalOpen(true)}
              className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg hover:scale-110 transition-transform"
            >
              <Plus className="h-8 w-8" />
            </Button>
          </div>
        </Router>
      </TooltipProvider>

      <QuickLogModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        categories={categories}
        onActivityLogged={handleActivityLogged}
      />
    </ThemeProvider>
  );
}

export default App;
