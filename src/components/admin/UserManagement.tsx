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
        .select(`
          id,
          full_name,
          email,
          created_at,
          user_roles!inner(role)
        `)
        .order('created_at', { ascending: false })
        .range((currentPage - 1) * pageSize, currentPage * pageSize - 1);

      if (searchTerm) {
        query = query.or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
      }

      if (roleFilter && roleFilter !== 'all') {
        query = query.eq('user_roles.role', roleFilter as 'visitor' | 'business_owner' | 'admin');
      }

      const { data, error } = await query;
      if (error) throw error;

      return data.map((user: any) => ({
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        created_at: user.created_at,
        user_roles: user.user_roles || []
      })) as User[];
    },
  });

  const { data: totalUsers } = useQuery({
    queryKey: ['admin-users-count', searchTerm, roleFilter],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .not('user_roles', 'is', null);

      if (searchTerm) {
        query = query.or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
      }

      if (roleFilter && roleFilter !== 'all') {
        query = query.eq('user_roles.role', roleFilter as 'visitor' | 'business_owner' | 'admin');
      }

      const { count, error } = await query;
      if (error) throw error;
      return count || 0;
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