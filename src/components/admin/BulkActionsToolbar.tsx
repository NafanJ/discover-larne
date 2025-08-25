import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Trash2, X } from "lucide-react";

interface BulkActionsToolbarProps {
  selectedCount: number;
  onBulkDelete: () => void;
  onBulkStatusChange: (status: string) => void;
  onClearSelection: () => void;
}

export const BulkActionsToolbar = ({
  selectedCount,
  onBulkDelete,
  onBulkStatusChange,
  onClearSelection
}: BulkActionsToolbarProps) => {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">
            {selectedCount} business{selectedCount !== 1 ? 'es' : ''} selected
          </span>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Change status:</span>
            <Select onValueChange={onBulkStatusChange}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="destructive"
            size="sm"
            onClick={onBulkDelete}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete Selected
          </Button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          className="flex items-center gap-2"
        >
          <X className="h-4 w-4" />
          Clear Selection
        </Button>
      </div>
    </Card>
  );
};