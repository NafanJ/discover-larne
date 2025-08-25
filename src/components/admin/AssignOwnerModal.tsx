import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Business } from "./AdminBusinessManagement";

interface AssignOwnerModalProps {
  business: Business;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface User {
  id: string;
  full_name: string | null;
  email: string;
  role: string;
}

export const AssignOwnerModal = ({
  business,
  isOpen,
  onClose,
  onSuccess
}: AssignOwnerModalProps) => {
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const { data: users } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email');

      if (profilesError) throw profilesError;

      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .in('role', ['visitor', 'business_owner']);

      if (rolesError) throw rolesError;

      // Combine the data
      const usersWithRoles = (profilesData || [])
        .map(profile => {
          const userRole = (rolesData || []).find(r => r.user_id === profile.id);
          return {
            id: profile.id,
            full_name: profile.full_name,
            email: profile.email,
            role: userRole?.role || 'visitor'
          };
        })
        .filter(user => ['visitor', 'business_owner'].includes(user.role));

      return usersWithRoles as User[];
    },
    enabled: isOpen,
  });

  const handleAssignOwner = async () => {
    if (!selectedUserId) return;

    setIsLoading(true);

    // First, check if the selected user has business_owner role
    const selectedUser = users?.find(u => u.id === selectedUserId);
    if (selectedUser?.role === 'visitor') {
      // Promote user to business_owner
      const { error: roleError } = await supabase
        .from('user_roles')
        .update({ role: 'business_owner' })
        .eq('user_id', selectedUserId);

      if (roleError) {
        toast({
          title: "Error",
          description: "Failed to update user role",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
    }

    // Assign the business to the user
    const { error } = await supabase
      .from('businesses')
      .update({ owner_id: selectedUserId })
      .eq('id', business.id);

    setIsLoading(false);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to assign owner",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: `Business assigned to ${selectedUser?.full_name || selectedUser?.email}`,
    });

    onSuccess();
  };

  const handleRemoveOwner = async () => {
    setIsLoading(true);

    const { error } = await supabase
      .from('businesses')
      .update({ owner_id: null })
      .eq('id', business.id);

    setIsLoading(false);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to remove owner",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Owner removed from business",
    });

    onSuccess();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {business.owner_id ? 'Change Owner' : 'Assign Owner'}: {business.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {business.owner_id && business.profiles && (
            <div className="p-4 border rounded-lg bg-muted/50">
              <p className="text-sm font-medium">Current Owner:</p>
              <p className="text-sm">
                {business.profiles.full_name || 'Unnamed'} ({business.profiles.email})
              </p>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Select New Owner:</label>
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a user..." />
              </SelectTrigger>
              <SelectContent>
                {users?.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    <div className="flex flex-col">
                      <span>{user.full_name || 'Unnamed'}</span>
                      <span className="text-xs text-muted-foreground">
                        {user.email} • {user.role}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Visitors will be automatically promoted to business owners
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          
          {business.owner_id && (
            <Button 
              variant="destructive" 
              onClick={handleRemoveOwner}
              disabled={isLoading}
            >
              Remove Owner
            </Button>
          )}
          
          <Button 
            onClick={handleAssignOwner}
            disabled={!selectedUserId || isLoading}
          >
            {isLoading ? "Assigning..." : "Assign Owner"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};