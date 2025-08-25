import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Business } from "./AdminBusinessManagement";
import { categoryGroups } from "@/data/categoryGroups";

const businessSchema = z.object({
  name: z.string().min(1, "Business name is required"),
  category: z.string().optional(),
  business_status: z.string().optional(),
  full_address: z.string().optional(),
  phone: z.string().optional(),
  site: z.string().optional(),
  description: z.string().optional(),
  wheelchair_accessible: z.boolean().optional(),
  rating: z.number().min(0).max(5).optional().nullable(),
});

type BusinessFormData = z.infer<typeof businessSchema>;

interface BusinessEditModalProps {
  business: Business;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const BusinessEditModal = ({
  business,
  isOpen,
  onClose,
  onSuccess
}: BusinessEditModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<BusinessFormData>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      name: business.name,
      category: business.category || '',
      business_status: business.business_status || '',
      full_address: business.full_address || '',
      phone: business.phone || '',
      site: business.site || '',
      description: business.description || '',
      wheelchair_accessible: business.wheelchair_accessible || false,
      rating: business.rating,
    },
  });

  const onSubmit = async (data: BusinessFormData) => {
    setIsLoading(true);
    
    const { error } = await supabase
      .from('businesses')
      .update({
        name: data.name,
        category: data.category || null,
        business_status: data.business_status || null,
        full_address: data.full_address || null,
        phone: data.phone || null,
        site: data.site || null,
        description: data.description || null,
        wheelchair_accessible: data.wheelchair_accessible,
        rating: data.rating,
      })
      .eq('id', business.id);

    setIsLoading(false);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update business",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Business updated successfully",
    });

    onSuccess();
  };

  // Get all unique categories from categoryGroups
  const allCategories = categoryGroups.flatMap(group => group.categories);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Business: {business.name}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Name *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="no-category">No category</SelectItem>
                        {allCategories.map((category, index) => (
                          <SelectItem key={index} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="business_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="no-status">No status</SelectItem>
                        <SelectItem value="Open">Open</SelectItem>
                        <SelectItem value="Closed">Closed</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="site"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating (0-5)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        min="0" 
                        max="5" 
                        step="0.1"
                        onChange={e => field.onChange(parseFloat(e.target.value) || null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="full_address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={4} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="wheelchair_accessible"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Wheelchair Accessible</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};