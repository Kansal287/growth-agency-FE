import { useState, useEffect, useCallback } from "react";
import apiClient from "@/lib/api-client";
import { toast } from "react-toastify";

export function useResources<TForm, TTable = any>(
  modelName: string,
  initialState: TForm,
  customPath?: string
) {
  const basePath = customPath || `/admin/${modelName}`;

  // --- 1. STATES ---
  const [formData, setFormData] = useState<TForm>(initialState);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ page: 0, rowsPerPage: 10 });
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [tableData, setTableData] = useState<TTable[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // --- 2. FETCHING ---
  const fetchRecords = useCallback(async () => {
    setIsLoading(true);
    try {
      // Build query parameters for server-side pagination & filters
      const params: Record<string, any> = {
        page: pagination.page + 1, // backend is 1-indexed for pages
        limit: pagination.rowsPerPage,
        ...filters,
      };

      const response = await apiClient.get(basePath, { params });
      const result = response.data;

      if (Array.isArray(result)) {
        setTableData(result);
        setTotalItems(result.length);
      } else if (result && typeof result === "object") {
        const list = result.data || result.records || result.items || [];
        setTableData(Array.isArray(list) ? list : []);
        setTotalItems(result.total || result.totalItems || list.length || 0);
      } else {
        setTableData([]);
        setTotalItems(0);
      }
    } catch (err: any) {
      console.error(`[useResources] Failed to fetch data for model: ${modelName}`, err);
      setTableData([]);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  }, [basePath, modelName, pagination.page, pagination.rowsPerPage, filters]);

  // Fetch data on filters or pagination change
  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  // --- 3. CRUD ACTIONS ---
  const handleSubmit = async (customPayload?: any) => {
    setIsSaving(true);
    try {
      const finalPayload = customPayload || formData;
      const { id, ...cleanData } = finalPayload as any;

      if (isEditing) {
        // Update record
        const response = await apiClient.patch(`${basePath}/${isEditing}`, cleanData);
        if (response.status === 200 || response.data?.success) {
          toast.success("Updated Successfully!");
          setIsEditing(null); // Clear edit status
          fetchRecords();
        } else {
          toast.error(response.data?.message || "Update failed");
        }
      } else {
        // Create record
        const response = await apiClient.post(basePath, cleanData);
        if (response.status === 200 || response.status === 201 || response.data?.success) {
          toast.success("Forged Successfully!");
          handleClear(); // Clear inputs on new creations only
          fetchRecords();
        } else {
          toast.error(response.data?.message || "Creation failed");
        }
      }
    } catch (err: any) {
      console.error(`[useResources] Submit failed for model: ${modelName}`, err);
      toast.error(err.response?.data?.message || "Action failed");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemove = async (id: string) => {
    setIsDeleting(true);
    try {
      const response = await apiClient.delete(`${basePath}/${id}`);
      if (response.status === 200 || response.data?.success) {
        toast.success("Record Removed!");
        fetchRecords();
      } else {
        toast.error(response.data?.message || "Delete failed");
      }
    } catch (err: any) {
      console.error(`[useResources] Delete failed for model: ${modelName}`, err);
      toast.error(err.response?.data?.message || "Delete failed");
    } finally {
      setIsDeleting(false);
    }
  };

  // --- 4. HANDLERS ---
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (file: File, name = "thumbnail") => {
    setFormData((prev) => ({ ...prev, [name]: file }));
  };

  const handleDateChange = (range: [string, string], name = "dateRange") => {
    setFormData((prev) => ({ ...prev, [name]: range }));
  };

  const handleClear = () => {
    setFormData(initialState);
    setIsEditing(null);
    const fileInputs = document.querySelectorAll('input[type="file"]') as NodeListOf<HTMLInputElement>;
    fileInputs.forEach((input) => (input.value = ""));
  };

  const handleEdit = (record: TTable & { id: string }) => {
    setIsEditing(record.id);
    setFormData(record as unknown as TForm);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = (newFilters: Record<string, any>) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 0 }));
  };

  return {
    formData,
    setFormData,
    isEditing,
    setIsEditing,
    isLoading,
    isSaving,
    isDeleting,
    tableData,
    handleInputChange,
    handleFileChange,
    handleDateChange,
    handleClear,
    handleEdit,
    handleRemove,
    handleSubmit,
    handleSearch,
    pagination: {
      page: pagination.page,
      rowsPerPage: pagination.rowsPerPage,
      totalItems,
    },
    handleChangePage: (_: any, p: number) => setPagination((prev) => ({ ...prev, page: p })),
    handleChangeRowsPerPage: (e: any) =>
      setPagination({ page: 0, rowsPerPage: parseInt(e.target.value, 10) }),
    refresh: fetchRecords,
  };
}
