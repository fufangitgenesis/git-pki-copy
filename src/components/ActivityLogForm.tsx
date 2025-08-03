import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ActivityCategory, ActivityLog, Task, db } from "@/lib/database";
import { getDateString } from "@/lib/calculations";
import { Plus, Edit2, Trash2, Link } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { CategoryManager } from "./CategoryManager"; // [NEW] Import CategoryManager

interface ActivityLogFormProps {
  categories: ActivityCategory[];
  activities: ActivityLog[];
  onActivityLogged: (activity: ActivityLog) => void;
  onActivityUpdated: (activity: ActivityLog) => void;
  onActivityDeleted: (activityId: string) => void;
  onCategoriesUpdated: () => void; // [NEW] Add callback for category updates
  selectedDate: Date;
  isModal?: boolean;
}

export function ActivityLogForm({ 
  categories, 
  activities, 
  onActivityLogged, 
  onActivityUpdated, 
  onActivityDeleted, 
  onCategoriesUpdated,
  selectedDate,
  isModal = false 
}: ActivityLogFormProps) {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [energyLevel, setEnergyLevel] = useState<"High" | "Medium" | "Low">("Medium");
  const [editingActivity, setEditingActivity] = useState<ActivityLog | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // ... (rest of the submit logic remains the same)
  };

  return (
    <div className="space-y-6">
      <Card className={isModal ? "border-none shadow-none" : ""}>
        <CardHeader className={isModal ? "pt-0" : ""}>
          {!isModal && (
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-accent" />
              {editingActivity ? 'Edit Activity' : 'Log Activity'}
            </CardTitle>
          )}
        </CardHeader>
        <CardContent className={isModal ? "p-0" : ""}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Activity Name</Label>
              <Input id="name" placeholder="e.g., Writing report, Code review" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        />
                        <span>{category.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                  {/* [NEW] "Create more categories" option */}
                  <div className="border-t pt-2 mt-2">
                    <CategoryManager 
                      categories={categories} 
                      onCategoriesUpdated={onCategoriesUpdated}
                      trigger={
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full justify-start text-primary hover:text-primary hover:bg-primary/10"
                          // Use onMouseDown to prevent the select from closing
                          onMouseDown={(e) => e.preventDefault()}
                        >
                          <Plus className="h-3 w-3 mr-2" />
                          Create or manage categories
                        </Button>
                      }
                    />
                  </div>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input id="startTime" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input id="endTime" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="energyLevel">Energy Level</Label>
              <Select value={energyLevel} onValueChange={(value: "High" | "Medium" | "Low") => setEnergyLevel(value)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High Energy</SelectItem>
                  <SelectItem value="Medium">Medium Energy</SelectItem>
                  <SelectItem value="Low">Low Energy</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                <Plus className="h-4 w-4 mr-2" />
                {editingActivity ? 'Update Activity' : 'Log Activity'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {!isModal && activities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Today's Activities</CardTitle>
          </Header>
          <CardContent>
            {/* List rendering logic */}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
