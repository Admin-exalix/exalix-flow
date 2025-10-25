import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { erpnextClient } from "@/lib/erpnext";

export const useERPNextResource = <T,>(doctype: string, filters?: Record<string, any>) => {
  return useQuery({
    queryKey: ["erpnext", doctype, filters],
    queryFn: () => erpnextClient.fetchResource<T>(doctype, filters),
    enabled: erpnextClient.isAuthenticated(),
  });
};

export const useERPNextDocument = <T,>(doctype: string, name: string) => {
  return useQuery({
    queryKey: ["erpnext", doctype, name],
    queryFn: () => erpnextClient.getDocument<T>(doctype, name),
    enabled: erpnextClient.isAuthenticated() && !!name,
  });
};

export const useCreateERPNextDocument = <T,>(doctype: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<T>) => erpnextClient.createDocument<T>(doctype, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["erpnext", doctype] });
    },
  });
};
