"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ApiResponse } from "@/lib/types/auth";
import type { MenuItem, MenuItemRequest, MenuCategory } from "@/lib/types/menu";

const CATEGORY_OPTIONS: MenuCategory[] = [
  "BREAKFAST",
  "LUNCH",
  "DINNER",
  "SNACKS",
  "OTHER",
];

// Mirrors backend MenuItemRequest validation exactly:
// name @NotBlank @Size(max 150), description @Size(max 500) optional,
// price @NotNull @DecimalMin(0, exclusive) @Digits(8,2), category @NotNull,
// isVeg @NotNull.
// price kept as a string here (not z.coerce.number()) — coercion breaks
// zodResolver's generic inference the same way it did on the provider
// registration form; converted to a real number manually in onSubmit instead.
const menuItemSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(150, "Name must not exceed 150 characters"),
  description: z
    .string()
    .max(500, "Description must not exceed 500 characters")
    .optional(),
  price: z.string().min(1, "Price is required"),
  category: z.enum(CATEGORY_OPTIONS, {
    error: () => "Please select a category",
  }),
  isVeg: z.boolean(),
});

type MenuItemFormValues = z.infer<typeof menuItemSchema>;

async function fetchMyMenu(): Promise<MenuItem[]> {
  const res = await fetch("/api/menu/my");
  const payload: ApiResponse<MenuItem[]> = await res.json();

  if (!res.ok || !payload.success) {
    throw new Error(payload.message || "Failed to fetch menu");
  }

  return payload.data ?? [];
}

async function createMenuItem(request: MenuItemRequest): Promise<MenuItem> {
  const res = await fetch("/api/menu", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  const payload: ApiResponse<MenuItem> = await res.json();

  if (!res.ok || !payload.success || !payload.data) {
    throw new Error(payload.message || "Failed to create menu item");
  }

  return payload.data;
}

async function updateMenuItem(id: string, request: MenuItemRequest): Promise<MenuItem> {
  const res = await fetch(`/api/menu/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  const payload: ApiResponse<MenuItem> = await res.json();

  if (!res.ok || !payload.success || !payload.data) {
    throw new Error(payload.message || "Failed to update menu item");
  }

  return payload.data;
}

async function toggleMenuItem(id: string): Promise<MenuItem> {
  const res = await fetch(`/api/menu/${id}/toggle`, { method: "PATCH" });
  const payload: ApiResponse<MenuItem> = await res.json();

  if (!res.ok || !payload.success || !payload.data) {
    throw new Error(payload.message || "Failed to toggle availability");
  }

  return payload.data;
}

async function deleteMenuItem(id: string): Promise<void> {
  const res = await fetch(`/api/menu/${id}`, { method: "DELETE" });
  const payload: ApiResponse<null> = await res.json();

  if (!res.ok || !payload.success) {
    throw new Error(payload.message || "Failed to delete menu item");
  }
}

export default function ProviderMenuPage() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toggleErrorId, setToggleErrorId] = useState<string | null>(null);
  const [deleteErrorId, setDeleteErrorId] = useState<string | null>(null);

  const {
    data: items,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["menu", "my"],
    queryFn: fetchMyMenu,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MenuItemFormValues>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: { isVeg: true },
  });

  const saveMutation = useMutation<
    MenuItem,
    Error,
    { id: string | null; request: MenuItemRequest }
  >({
    mutationFn: ({ id, request }) =>
      id ? updateMenuItem(id, request) : createMenuItem(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu", "my"] });
      setEditingId(null);
      reset({ name: "", description: "", price: "", category: "OTHER", isVeg: true });
    },
  });

  const toggleMutation = useMutation<MenuItem, Error, string>({
    mutationFn: toggleMenuItem,
    onMutate: (id) => {
      setToggleErrorId(null);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu", "my"] });
    },
    onError: (err, id) => {
      setToggleErrorId(id);
      console.error("Toggle failed", err);
    },
  });

  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: deleteMenuItem,
    onMutate: () => {
      setDeleteErrorId(null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu", "my"] });
    },
    onError: (err, id) => {
      setDeleteErrorId(id);
      console.error("Delete failed", err);
    },
  });

  const startEdit = (item: MenuItem) => {
    setEditingId(item.id);
    reset({
      name: item.name,
      description: item.description ?? "",
      price: String(item.price),
      category: item.category,
      isVeg: item.veg,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    reset({ name: "", description: "", price: "", category: "OTHER", isVeg: true });
  };

  const onSubmit = (values: MenuItemFormValues) => {
    const request: MenuItemRequest = {
      name: values.name,
      description: values.description || undefined,
      price: Number(values.price),
      category: values.category,
      isVeg: values.isVeg,
    };

    saveMutation.mutate({ id: editingId, request });
  };

  const handleDelete = (id: string) => {
    const confirmed = window.confirm("Delete this menu item? This can't be undone.");
    if (!confirmed) return;
    deleteMutation.mutate(id);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Manage Menu</h1>

      {/* Add / Edit form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="border border-gray-200 rounded-lg p-4 mb-8 space-y-4"
      >
        <h2 className="font-medium">{editingId ? "Edit item" : "Add new item"}</h2>

        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Name
          </label>
          <input
            id="name"
            type="text"
            {...register("name")}
            className="w-full border rounded px-3 py-2"
          />
          {errors.name && (
            <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Description <span className="text-gray-400">(optional)</span>
          </label>
          <textarea
            id="description"
            {...register("description")}
            className="w-full border rounded px-3 py-2"
            rows={2}
          />
          {errors.description && (
            <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="price" className="block text-sm font-medium mb-1">
              Price (₹)
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              {...register("price")}
              className="w-full border rounded px-3 py-2"
            />
            {errors.price && (
              <p className="text-red-600 text-sm mt-1">{errors.price.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-1">
              Category
            </label>
            <select
              id="category"
              {...register("category")}
              className="w-full border rounded px-3 py-2"
            >
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0) + cat.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-600 text-sm mt-1">{errors.category.message}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            id="isVeg"
            type="checkbox"
            {...register("isVeg")}
            className="w-4 h-4"
          />
          <label htmlFor="isVeg" className="text-sm font-medium">
            Vegetarian
          </label>
        </div>

        {saveMutation.isError && (
          <p className="text-red-600 text-sm">{saveMutation.error.message}</p>
        )}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="bg-black text-white text-sm px-4 py-2 rounded disabled:opacity-50"
          >
            {saveMutation.isPending
              ? "Saving..."
              : editingId
              ? "Save changes"
              : "Add item"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="border text-sm px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Item list */}
      {isLoading && <p className="text-gray-500">Loading menu...</p>}

      {isError && (
        <p className="text-red-600">
          {error instanceof Error ? error.message : "Something went wrong"}
        </p>
      )}

      {items && items.length === 0 && (
        <p className="text-gray-500">No menu items yet — add your first one above.</p>
      )}

      {items && items.length > 0 && (
        <ul className="space-y-3">
          {items.map((item) => {
            const isTogglePending =
              toggleMutation.isPending && toggleMutation.variables === item.id;
            const isDeletePending =
              deleteMutation.isPending && deleteMutation.variables === item.id;

            return (
              <li key={item.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-block w-3 h-3 rounded-sm border ${
                          item.veg
                            ? "border-green-600 bg-green-600"
                            : "border-red-600 bg-red-600"
                        }`}
                      />
                      <h3 className="font-medium">{item.name}</h3>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                    )}
                    <p className="text-sm font-medium mt-1">₹{item.price}</p>
                  </div>

                  <span
                    className={`text-xs px-2 py-1 rounded font-medium ${
                      item.available
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {item.available ? "Available" : "Unavailable"}
                  </span>
                </div>

                {toggleErrorId === item.id && toggleMutation.isError && (
                  <p className="text-red-600 text-sm mt-2">
                    {toggleMutation.error.message}
                  </p>
                )}
                {deleteErrorId === item.id && deleteMutation.isError && (
                  <p className="text-red-600 text-sm mt-2">
                    {deleteMutation.error.message}
                  </p>
                )}

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => startEdit(item)}
                    className="border text-sm px-3 py-1.5 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => toggleMutation.mutate(item.id)}
                    disabled={isTogglePending}
                    className="border text-sm px-3 py-1.5 rounded disabled:opacity-50"
                  >
                    {isTogglePending
                      ? "Updating..."
                      : item.available
                      ? "Mark unavailable"
                      : "Mark available"}
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={isDeletePending}
                    className="text-red-600 border border-red-200 text-sm px-3 py-1.5 rounded hover:bg-red-50 disabled:opacity-50"
                  >
                    {isDeletePending ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}