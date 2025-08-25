import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserTable } from "./UserTable";
import { UserFilters } from "./UserFilters";
import { UserStatsCards } from "./UserStatsCards";
import { ChangeRoleModal } from "./ChangeRoleModal";

export interface User {
  id: string;
  full_name: string | null;
  email: string;
  created_at: string;
  user_roles: { role: string }[];
}

export const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isChangeRoleModalOpen, setIsChangeRoleModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users', searchTerm, roleFilter, currentPage],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select('id, full_name, email, created_at')
        .order('created_at', { ascending: false })
        .range((currentPage - 1) * pageSize, currentPage * pageSize - 1);

      if (searchTerm) {
        query = query.or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
      }

      const { data: profilesData, error: profilesError } = await query;
      if (profilesError) throw profilesError;

      if (!profilesData || profilesData.length === 0) {
        return [];
      }

      // Get user roles separately
      const userIds = profilesData.map(p => p.id);
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .in('user_id', userIds);

      if (rolesError) throw rolesError;

      // Filter by role if specified
      let filteredRoles = rolesData || [];
      if (roleFilter && roleFilter !== 'all') {
        filteredRoles = filteredRoles.filter(r => r.role === roleFilter);
      }

      // Combine the data
      const usersWithRoles = profilesData
        .map(profile => {
          const userRoles = (rolesData || []).filter(r => r.user_id === profile.id);
          return {
            id: profile.id,
            full_name: profile.full_name,
            email: profile.email,
            created_at: profile.created_at,
            user_roles: userRoles
          };
        })
        .filter(user => {
          // Apply role filter
          if (roleFilter && roleFilter !== 'all') {
            return user.user_roles.some(r => r.role === roleFilter);
          }
          return true;
        });

      return usersWithRoles as User[];
    },
  });

  const { data: totalUsers } = useQuery({
    queryKey: ['admin-users-count', searchTerm, roleFilter],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true });

      if (searchTerm) {
        query = query.or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
      }

      const { count: profileCount, error: profileError } = await query;
      if (profileError) throw profileError;

      // If we have a role filter, we need to check user_roles table
      if (roleFilter && roleFilter !== 'all') {
        const { count: roleCount, error: roleError } = await supabase
          .from('user_roles')
          .select('user_id', { count: 'exact', head: true })
          .eq('role', roleFilter as 'visitor' | 'business_owner' | 'admin');

        if (roleError) throw roleError;
        return roleCount || 0;
      }

      return profileCount || 0;
    },
  });

  const changeRoleMutation = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: 'visitor' | 'business_owner' | 'admin' }) => {
      const { error } = await supabase
        .from('user_roles')
        .update({ role: newRole })
        .eq('user_id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User role updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-user-stats'] });
      setIsChangeRoleModalOpen(false);
      setSelectedUser(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    },
  });

  const handleChangeRole = (user: User) => {
    setSelectedUser(user);
    setIsChangeRoleModalOpen(true);
  };

  const handleRoleChange = (newRole: 'visitor' | 'business_owner' | 'admin') => {
    if (selectedUser) {
      changeRoleMutation.mutate({ userId: selectedUser.id, newRole });
    }
  };

  const totalPages = Math.ceil((totalUsers || 0) / pageSize);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
      </div>

      <UserStatsCards />

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <UserFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              roleFilter={roleFilter}
              onRoleChange={setRoleFilter}
            />

            <UserTable
              users={users || []}
              isLoading={isLoading}
              onChangeRole={handleChangeRole}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </CardContent>
      </Card>

      {selectedUser && (
        <ChangeRoleModal
          user={selectedUser}
          isOpen={isChangeRoleModalOpen}
          onClose={() => {
            setIsChangeRoleModalOpen(false);
            setSelectedUser(null);
          }}
          onRoleChange={handleRoleChange}
          isLoading={changeRoleMutation.isPending}
        />
      )}
    </div>
  );
};