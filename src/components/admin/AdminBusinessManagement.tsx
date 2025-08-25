import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminBusinessTable } from "./AdminBusinessTable";
import { AdminBusinessFilters } from "./AdminBusinessFilters";
import { AdminBusinessStats } from "./AdminBusinessStats";
import { BusinessEditModal } from "./BusinessEditModal";
import { AssignOwnerModal } from "./AssignOwnerModal";
import { BulkActionsToolbar } from "./BulkActionsToolbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export interface Business {
  id: string;
  name: string;
  category: string | null;
  business_status: string | null;
  owner_id: string | null;
  full_address: string | null;
  phone: string | null;
  site: string | null;
  description: string | null;
  wheelchair_accessible: boolean | null;
  rating: number | null;
  created_at: string;
  latitude: number | null;
  longitude: number | null;
  working_hours: any;
  profiles?: {
    full_name: string | null;
    email: string;
  } | null;
}

export const AdminBusinessManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBusinesses, setSelectedBusinesses] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const [assigningOwner, setAssigningOwner] = useState<Business | null>(null);
  const { toast } = useToast();

  const itemsPerPage = 20;

  const { data: businessesData, isLoading, refetch } = useQuery({
    queryKey: ['admin-businesses', searchTerm, categoryFilter, statusFilter, currentPage],
    queryFn: async () => {
      let query = supabase
        .from('businesses')
        .select(`
          id,
          name,
          category,
          business_status,
          owner_id,
          full_address,
          phone,
          site,
          description,
          wheelchair_accessible,
          rating,
          created_at,
          latitude,
          longitude,
          working_hours,
          profiles:owner_id (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`);
      }

      if (categoryFilter && categoryFilter !== 'all') {
        query = query.eq('category', categoryFilter);
      }

      if (statusFilter && statusFilter !== 'all') {
        query = query.eq('business_status', statusFilter);
      }

      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;
      if (error) throw error;

      // Transform the data to match our Business type
      const businesses: Business[] = (data || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        business_status: item.business_status,
        owner_id: item.owner_id,
        full_address: item.full_address,
        phone: item.phone,
        site: item.site,
        description: item.description,
        wheelchair_accessible: item.wheelchair_accessible,
        rating: item.rating,
        created_at: item.created_at,
        latitude: item.latitude,
        longitude: item.longitude,
        working_hours: item.working_hours,
        profiles: item.profiles || null
      }));

      return {
        businesses,
        totalCount: count || 0
      };
    },
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedBusinesses(businessesData?.businesses.map(b => b.id) || []);
    } else {
      setSelectedBusinesses([]);
    }
  };

  const handleSelectBusiness = (businessId: string, checked: boolean) => {
    if (checked) {
      setSelectedBusinesses(prev => [...prev, businessId]);
    } else {
      setSelectedBusinesses(prev => prev.filter(id => id !== businessId));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedBusinesses.length === 0) return;

    const { error } = await supabase
      .from('businesses')
      .delete()
      .in('id', selectedBusinesses);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete businesses",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: `Deleted ${selectedBusinesses.length} businesses`,
    });

    setSelectedBusinesses([]);
    refetch();
  };

  const handleBulkStatusChange = async (status: string) => {
    if (selectedBusinesses.length === 0) return;

    const { error } = await supabase
      .from('businesses')
      .update({ business_status: status })
      .in('id', selectedBusinesses);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update business status",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: `Updated status for ${selectedBusinesses.length} businesses`,
    });

    setSelectedBusinesses([]);
    refetch();
  };

  return (
    <div className="space-y-6">
      <AdminBusinessStats />
      
      <Card>
        <CardHeader>
          <CardTitle>Business Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <AdminBusinessFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
          />

          {selectedBusinesses.length > 0 && (
            <BulkActionsToolbar
              selectedCount={selectedBusinesses.length}
              onBulkDelete={handleBulkDelete}
              onBulkStatusChange={handleBulkStatusChange}
              onClearSelection={() => setSelectedBusinesses([])}
            />
          )}

          <AdminBusinessTable
            businesses={businessesData?.businesses || []}
            totalCount={businessesData?.totalCount || 0}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            isLoading={isLoading}
            selectedBusinesses={selectedBusinesses}
            onSelectAll={handleSelectAll}
            onSelectBusiness={handleSelectBusiness}
            onPageChange={setCurrentPage}
            onEdit={setEditingBusiness}
            onAssignOwner={setAssigningOwner}
            onRefetch={refetch}
          />
        </CardContent>
      </Card>

      {editingBusiness && (
        <BusinessEditModal
          business={editingBusiness}
          isOpen={!!editingBusiness}
          onClose={() => setEditingBusiness(null)}
          onSuccess={() => {
            refetch();
            setEditingBusiness(null);
          }}
        />
      )}

      {assigningOwner && (
        <AssignOwnerModal
          business={assigningOwner}
          isOpen={!!assigningOwner}
          onClose={() => setAssigningOwner(null)}
          onSuccess={() => {
            refetch();
            setAssigningOwner(null);
          }}
        />
      )}
    </div>
  );
};