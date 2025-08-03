import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ActivityLogForm } from "./ActivityLogForm";
import { ActivityCategory, ActivityLog } from "@/lib/database";

interface QuickLogModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  categories: ActivityCategory[];
  onActivityLogged: (activity: ActivityLog) => void;
}

export function QuickLogModal({
  isOpen,
  onOpenChange,
  categories,
  onActivityLogged,
}: QuickLogModalProps) {
  // A wrapper for the main log function to close the modal on success
  const handleActivityLogged = (activity: ActivityLog) => {
    onActivityLogged(activity);
    onOpenChange(false); // Close modal after logging
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Quick Log Activity</DialogTitle>
          <DialogDescription>
            Quickly add a new activity for today. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {/* We pass a simplified version of the ActivityLogForm.
            It doesn't need all the props when used in this context.
          */}
          <ActivityLogForm
            categories={categories}
            activities={[]} // Not needed for adding new logs
            onActivityLogged={handleActivityLogged}
            onActivityUpdated={() => {}} // Not used here
            onActivityDeleted={() => {}} // Not used here
            onCategoriesUpdated={() => {}} // Not used here
            selectedDate={new Date()} // Always logs for today
            isModal={true} // A new prop to hide non-essential UI
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
