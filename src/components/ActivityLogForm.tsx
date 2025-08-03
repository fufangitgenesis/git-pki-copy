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

interface ActivityLogFormProps {
  categories: ActivityCategory[];
  activities: ActivityLog[];
  onActivityLogged: (activity: ActivityLog) => void;
  onActivityUpdated: (activity: ActivityLog) => void;
  onActivityDeleted: (activityId: string) => void;
  selectedDate: Date;
  isModal?: boolean; // [NEW] Prop to control UI in modal mode
}

export function ActivityLogForm({ 
  categories, 
  activities, 
  onActivityLogged, 
  onActivityUpdated, 
  onActivityDeleted, 
  selectedDate,
  isModal = false // [NEW] Default to false
}: ActivityLogFormProps) {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [energyLevel, setEnergyLevel] = useState<"High" | "Medium" | "Low">("Medium");
  const [linkedTaskId, setLinkedTaskId] = useState<string>("");
  const [editingActivity, setEditingActivity] = useState<ActivityLog | null>(null);
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadTodayTasks();
  }, [selectedDate]);

  const loadTodayTasks = async () => {
    // This logic remains the same
  };

  const resetForm = () => {
    // This logic remains the same
  };

  const startEdit = (activity: ActivityLog) => {
    // This logic remains the same
  };

  const handleSubmit = async (e: React.FormEvent) => {
    // This logic remains the same
  };

  const handleDelete = async (activityId: string) => {
    // This logic remains the same
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
            {/* The entire form structure remains the same */}
            <div className="space-y-2">
              <Label htmlFor="name">Activity Name</Label>
              <Input id="name" placeholder="e.g., Writing report, Code review" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId} required>
                <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                <SelectContent>{/* Options */}</SelectContent>
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

      {/* [UPDATED] Conditionally render the activities list only if not in modal mode */}
      {!isModal && activities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Today's Activities</CardTitle>
          </CardHeader>
          <CardContent>
            {/* The list rendering logic remains the same */}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
