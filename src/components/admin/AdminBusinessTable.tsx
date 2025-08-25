import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { MoreHorizontal, Edit, User, Trash2, ExternalLink } from "lucide-react";
import { Business } from "./AdminBusinessManagement";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ListingsGridSkeleton } from "@/components/ui/loading-skeleton";
import { normalizeCategory } from "@/lib/utils";

interface AdminBusinessTableProps {
  businesses: Business[];
  totalCount: number;
  currentPage: number;
  itemsPerPage: number;
  isLoading: boolean;
  selectedBusinesses: string[];
  onSelectAll: (checked: boolean) => void;
  onSelectBusiness: (businessId: string, checked: boolean) => void;
  onPageChange: (page: number) => void;
  onEdit: (business: Business) => void;
  onAssignOwner: (business: Business) => void;
  onRefetch: () => void;
}

export const AdminBusinessTable = ({
  businesses,
  totalCount,
  currentPage,
  itemsPerPage,
  isLoading,
  selectedBusinesses,
  onSelectAll,
  onSelectBusiness,
  onPageChange,
  onEdit,
  onAssignOwner,
  onRefetch
}: AdminBusinessTableProps) => {
  const [deleteDialog, setDeleteDialog] = useState<Business | null>(null);
  const { toast } = useToast();

  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const allSelected = businesses.length > 0 && selectedBusinesses.length === businesses.length;
  const someSelected = selectedBusinesses.length > 0;

  const handleDelete = async (business: Business) => {
    const { error } = await supabase
      .from('businesses')
      .delete()
      .eq('id', business.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete business",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Business deleted successfully",
    });

    setDeleteDialog(null);
    onRefetch();
  };

  const getStatusBadge = (status: string | null) => {
    if (!status) return <Badge variant="secondary">Unknown</Badge>;
    
    const statusColors = {
      'Open': 'bg-green-100 text-green-800',
      'Closed': 'bg-red-100 text-red-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
    };
    
    return (
      <Badge 
        variant="secondary" 
        className={statusColors[status as keyof typeof statusColors] || ''}
      >
        {status}
      </Badge>
    );
  };

  if (isLoading) {
    return <ListingsGridSkeleton count={6} />;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={onSelectAll}
                  aria-label="Select all businesses"
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {businesses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No businesses found
                </TableCell>
              </TableRow>
            ) : (
              businesses.map((business) => (
                <TableRow key={business.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedBusinesses.includes(business.id)}
                      onCheckedChange={(checked) => 
                        onSelectBusiness(business.id, checked as boolean)
                      }
                      aria-label={`Select ${business.name}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="max-w-48 truncate">
                      {business.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{normalizeCategory(business.category)}</Badge>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(business.business_status)}
                  </TableCell>
                  <TableCell>
                    {business.profiles ? (
                      <div className="text-sm">
                        <div className="font-medium">
                          {business.profiles.full_name || 'Unnamed'}
                        </div>
                        <div className="text-muted-foreground">
                          {business.profiles.email}
                        </div>
                      </div>
                    ) : (
                      <Badge variant="secondary">No Owner</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="max-w-48 truncate text-sm text-muted-foreground">
                      {business.full_address || 'No address'}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(business.created_at), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(business)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onAssignOwner(business)}>
                          <User className="mr-2 h-4 w-4" />
                          {business.owner_id ? 'Change Owner' : 'Assign Owner'}
                        </DropdownMenuItem>
                        {business.site && (
                          <DropdownMenuItem asChild>
                            <a 
                              href={business.site} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="cursor-pointer"
                            >
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Visit Website
                            </a>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          onClick={() => setDeleteDialog(business)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} businesses
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Business</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteDialog?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteDialog && handleDelete(deleteDialog)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};