import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { User } from "./UserManagement";

interface ChangeRoleModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onRoleChange: (newRole: 'visitor' | 'business_owner' | 'admin') => void;
  isLoading: boolean;
}

export const ChangeRoleModal = ({
  user,
  isOpen,
  onClose,
  onRoleChange,
  isLoading
}: ChangeRoleModalProps) => {
  const currentRole = user.user_roles[0]?.role || 'visitor';
  const [selectedRole, setSelectedRole] = useState<'visitor' | 'business_owner' | 'admin'>(currentRole as 'visitor' | 'business_owner' | 'admin');

  const handleRoleChange = () => {
    if (selectedRole !== currentRole) {
      onRoleChange(selectedRole);
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Full system access - can manage all users and businesses';
      case 'business_owner':
        return 'Can manage their own businesses and view analytics';
      case 'visitor':
        return 'Basic access - can browse listings and create an account';
      default:
        return 'Unknown role';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change User Role</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 border rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium">{user.full_name || 'Unnamed User'}</span>
              <Badge variant="outline">{user.email}</Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              Current role: <Badge variant="secondary">{currentRole.replace('_', ' ')}</Badge>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Select New Role:</label>
            <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as 'visitor' | 'business_owner' | 'admin')}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a role..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="visitor">
                  <div className="flex flex-col">
                    <span>Visitor</span>
                    <span className="text-xs text-muted-foreground">Basic user access</span>
                  </div>
                </SelectItem>
                <SelectItem value="business_owner">
                  <div className="flex flex-col">
                    <span>Business Owner</span>
                    <span className="text-xs text-muted-foreground">Can manage businesses</span>
                  </div>
                </SelectItem>
                <SelectItem value="admin">
                  <div className="flex flex-col">
                    <span>Admin</span>
                    <span className="text-xs text-muted-foreground">Full system access</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            
            <div className="p-3 bg-muted/50 rounded-md">
              <p className="text-sm text-muted-foreground">
                {getRoleDescription(selectedRole)}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleRoleChange}
            disabled={selectedRole === currentRole || isLoading}
          >
            {isLoading ? "Updating..." : "Update Role"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};