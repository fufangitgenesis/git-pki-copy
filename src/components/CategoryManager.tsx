import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityCategory, db } from "@/lib/database";
import { Plus, Settings, Edit2, Trash2, Palette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface CategoryManagerProps {
  categories: ActivityCategory[];
  onCategoriesUpdated: () => void;
  trigger?: React.ReactNode;
}

const PRESET_COLORS = [
  "#3b82f6", // blue
  "#ef4444", // red  
  "#10b981", // green
  "#f59e0b", // yellow
  "#8b5cf6", // purple
  "#f97316", // orange
  "#06b6d4", // cyan
  "#84cc16", // lime
  "#ec4899", // pink
  "#6366f1", // indigo
];

export function CategoryManager({ categories, onCategoriesUpdated, trigger }: CategoryManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [points, setPoints] = useState<number>(0);
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [editingCategory, setEditingCategory] = useState<ActivityCategory | null>(null);
  const { toast } = useToast();

  const resetForm = () => {
    setName("");
    setPoints(0);
    setColor(PRESET_COLORS[0]);
    setEditingCategory(null);
  };

  const startEdit = (category: ActivityCategory) => {
    setEditingCategory(category);
    setName(category.name);
    setPoints(category.points);
    setColor(category.color);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Validation Error",
        description: "Category name is required.",
        variant: "destructive"
      });
      return;
    }

    // Check for duplicate names (excluding current editing category)
    const existingCategory = categories.find(cat => 
      cat.name.toLowerCase() === name.toLowerCase() && 
      cat.id !== editingCategory?.id
    );
    
    if (existingCategory) {
      toast({
        title: "Validation Error",
        description: "A category with this name already exists.",
        variant: "destructive"
      });
      return;
    }

    const categoryData: ActivityCategory = {
      id: editingCategory?.id || crypto.randomUUID(),
      name: name.trim(),
      points,
      color,
      description: `Custom category: ${name.trim()}`
    };

    try {
      if (editingCategory) {
        await db.updateCategory(categoryData);
        toast({
          title: "Category Updated",
          description: `Successfully updated ${name}.`
        });
      } else {
        await db.addCategory(categoryData);
        toast({
          title: "Category Created",
          description: `Successfully created ${name}.`
        });
      }
      
      resetForm();
      onCategoriesUpdated();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${editingCategory ? 'update' : 'create'} category. Please try again.`,
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (categoryId: string) => {
    try {
      // Check if category is being used in any activities
      const activities = await db.getActivities();
      const isUsed = activities.some(activity => activity.categoryId === categoryId);
      
      if (isUsed) {
        toast({
          title: "Cannot Delete Category",
          description: "This category is being used by existing activities. Please remove or reassign those activities first.",
          variant: "destructive"
        });
        return;
      }

      await db.deleteCategory(categoryId);
      toast({
        title: "Category Deleted",
        description: "Category has been successfully deleted."
      });
      onCategoriesUpdated();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete category. Please try again.",
        variant: "destructive"
      });
    }
  };

  const defaultTrigger = (
    <Button variant="ghost" size="sm">
      <Settings className="h-4 w-4" />
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Manage Activity Categories
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Create/Edit Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="categoryName">Category Name</Label>
                  <Input
                    id="categoryName"
                    placeholder="e.g., Deep Work, Meeting, Learning"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="points">Points per Hour</Label>
                  <Input
                    id="points"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 10 for productive, -5 for distracting"
                    value={points}
                    onChange={(e) => setPoints(parseFloat(e.target.value) || 0)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Positive values for productive activities, negative for distracting ones
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Color</Label>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_COLORS.map((presetColor) => (
                      <button
                        key={presetColor}
                        type="button"
                        className={`w-8 h-8 rounded-full border-2 ${
                          color === presetColor ? 'border-foreground' : 'border-border'
                        }`}
                        style={{ backgroundColor: presetColor }}
                        onClick={() => setColor(presetColor)}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Palette className="h-4 w-4" />
                    <Input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-20 h-8"
                    />
                    <span className="text-sm text-muted-foreground">Custom color</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    <Plus className="h-4 w-4 mr-2" />
                    {editingCategory ? 'Update Category' : 'Create Category'}
                  </Button>
                  {editingCategory && (
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Existing Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Existing Categories</CardTitle>
            </CardHeader>
            <CardContent>
              {categories.length > 0 ? (
                <div className="space-y-3">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between p-3 rounded-lg border bg-muted/20"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <div>
                          <p className="font-medium">{category.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {category.points > 0 ? '+' : ''}{category.points} points/hour
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEdit(category)}
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Category</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{category.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(category.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No custom categories created yet</p>
                  <p className="text-sm text-muted-foreground">Create your first category above</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
