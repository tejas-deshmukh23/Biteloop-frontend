"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Fraunces, Work_Sans } from "next/font/google";
import type { ApiResponse } from "@/lib/types/auth";
import type { MenuItem, MenuItemRequest, MenuCategory } from "@/lib/types/menu";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-fraunces",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-work-sans",
});

const CATEGORY_OPTIONS: MenuCategory[] = [
  "BREAKFAST",
  "LUNCH",
  "DINNER",
  "SNACKS",
  "OTHER",
];

const CATEGORY_ACCENTS: Record<MenuCategory, string> = {
  BREAKFAST: "#D89B2C",
  LUNCH: "#B23A2E",
  DINNER: "#55713C",
  SNACKS: "#D89B2C",
  OTHER: "#2B2013",
};

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

function SkeletonRow({ index }: { index: number }) {
  return (
    <div
      className="skeleton-pulse rounded-2xl border border-[#2B2013]/10 bg-white/60 p-4 h-[96px]"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="h-4 bg-[#2B2013]/10 rounded w-1/3 mb-2" />
      <div className="h-3 bg-[#2B2013]/10 rounded w-1/2 mb-3" />
      <div className="flex gap-2">
        <div className="h-7 w-16 bg-[#2B2013]/10 rounded-full" />
        <div className="h-7 w-24 bg-[#2B2013]/10 rounded-full" />
      </div>
    </div>
  );
}

export default function ProviderMenuPage() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toggleErrorId, setToggleErrorId] = useState<string | null>(null);
  const [deleteErrorId, setDeleteErrorId] = useState<string | null>(null);
  const [justSaved, setJustSaved] = useState(false);

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
    control,
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
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 1600);
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
    <div className={`${workSans.className} max-w-3xl mx-auto px-6 py-8`}>
      <style jsx global>{`
        @media (prefers-reduced-motion: no-preference) {
          .row-enter { animation: rowEnter 0.45s ease-out both; }
          .skeleton-pulse { animation: skeletonPulse 1.4s ease-in-out infinite; }
          .saved-flash { animation: savedFlash 1.6s ease-out both; }
          .form-editing-glow { animation: editingGlow 2s ease-in-out infinite; }
        }

        @keyframes rowEnter {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes skeletonPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        @keyframes savedFlash {
          0% { opacity: 0; transform: translateY(-4px); }
          15% { opacity: 1; transform: translateY(0); }
          85% { opacity: 1; }
          100% { opacity: 0; }
        }

        @keyframes editingGlow {
          0%, 100% { box-shadow: 0 0 0 3px rgba(216,155,44,0.15); }
          50% { box-shadow: 0 0 0 5px rgba(216,155,44,0.25); }
        }

        .btn-3d { position: relative; transform: translateY(0); }
        .btn-3d:active { transform: translateY(2px); }
        .btn-3d-dark { box-shadow: 0 4px 0 #17110b; }
        .btn-3d-dark:active { box-shadow: 0 1px 0 #17110b; }
        .btn-3d-dark:disabled { box-shadow: 0 4px 0 #17110b; transform: translateY(0); opacity: 0.6; }

        .toggle-switch {
          position: relative;
          width: 46px;
          height: 26px;
          border-radius: 999px;
          transition: background-color 0.25s ease;
        }
        .toggle-knob {
          position: absolute;
          top: 3px;
          left: 3px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>

      <div className="flex items-center justify-between mb-6">
        <h1 className={`${fraunces.className} text-3xl font-semibold`}>Manage Menu</h1>
        {justSaved && (
          <span className="saved-flash text-sm font-medium text-[#55713C] bg-[#55713C]/10 px-3 py-1.5 rounded-full">
            Saved ✓
          </span>
        )}
      </div>

      {/* Add / Edit form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`rounded-2xl border border-[#2B2013]/10 bg-white/70 backdrop-blur-sm p-5 mb-8 space-y-4 transition-shadow ${
          editingId ? "form-editing-glow" : ""
        }`}
      >
        <div className="flex items-center justify-between">
          <h2 className={`${fraunces.className} font-semibold text-lg`}>
            {editingId ? "Edit item" : "Add new item"}
          </h2>
          {editingId && (
            <span className="text-xs text-[#D89B2C] font-medium bg-[#D89B2C]/12 px-2.5 py-1 rounded-full">
              Editing
            </span>
          )}
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Name
          </label>
          <input
            id="name"
            type="text"
            {...register("name")}
            className="w-full border border-[#2B2013]/15 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#D89B2C]/40 focus:border-[#D89B2C] transition-shadow"
          />
          {errors.name && (
            <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Description <span className="text-[#2B2013]/40">(optional)</span>
          </label>
          <textarea
            id="description"
            {...register("description")}
            className="w-full border border-[#2B2013]/15 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#D89B2C]/40 focus:border-[#D89B2C] transition-shadow"
            rows={2}
          />
          {errors.description && (
            <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium mb-1">
            Price (₹)
          </label>
          <input
            id="price"
            type="number"
            step="0.01"
            {...register("price")}
            className="w-full border border-[#2B2013]/15 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#D89B2C]/40 focus:border-[#D89B2C] transition-shadow"
          />
          {errors.price && (
            <p className="text-red-600 text-sm mt-1">{errors.price.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <div className="flex flex-wrap gap-2">
                {CATEGORY_OPTIONS.map((cat) => {
                  const active = field.value === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => field.onChange(cat)}
                      style={
                        active
                          ? { backgroundColor: CATEGORY_ACCENTS[cat], borderColor: CATEGORY_ACCENTS[cat] }
                          : undefined
                      }
                      className={`text-sm font-medium px-4 py-2 rounded-full border transition-all ${
                        active
                          ? "text-white shadow-[0_6px_14px_-6px_rgba(43,32,19,0.4)]"
                          : "bg-white text-[#2B2013]/65 border-[#2B2013]/15 hover:border-[#2B2013]/30"
                      }`}
                    >
                      {cat.charAt(0) + cat.slice(1).toLowerCase()}
                    </button>
                  );
                })}
              </div>
            )}
          />
          {errors.category && (
            <p className="text-red-600 text-sm mt-1">{errors.category.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Type</label>
          <Controller
            name="isVeg"
            control={control}
            render={({ field }) => (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => field.onChange(true)}
                  className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full border transition-all ${
                    field.value
                      ? "bg-[#55713C] text-white border-[#55713C] shadow-[0_6px_14px_-6px_rgba(85,113,60,0.4)]"
                      : "bg-white text-[#2B2013]/65 border-[#2B2013]/15 hover:border-[#2B2013]/30"
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#55713C] border border-[#55713C]" />
                  Veg
                </button>
                <button
                  type="button"
                  onClick={() => field.onChange(false)}
                  className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full border transition-all ${
                    !field.value
                      ? "bg-[#B23A2E] text-white border-[#B23A2E] shadow-[0_6px_14px_-6px_rgba(178,58,46,0.4)]"
                      : "bg-white text-[#2B2013]/65 border-[#2B2013]/15 hover:border-[#2B2013]/30"
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#B23A2E] border border-[#B23A2E]" />
                  Non-Veg
                </button>
              </div>
            )}
          />
        </div>

        {saveMutation.isError && (
          <p className="text-red-600 text-sm">{saveMutation.error.message}</p>
        )}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="btn-3d btn-3d-dark bg-[#2B2013] text-white text-sm font-medium px-5 py-2.5 rounded-full transition-transform disabled:cursor-not-allowed"
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
              className="text-sm font-medium px-5 py-2.5 rounded-full border border-[#2B2013]/15 hover:border-[#2B2013]/30 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Item list */}
      {isError && (
        <p className="text-red-600 mb-4">
          {error instanceof Error ? error.message : "Something went wrong"}
        </p>
      )}

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonRow key={i} index={i} />
          ))}
        </div>
      )}

      {!isLoading && items && items.length === 0 && (
        <p className="text-[#2B2013]/55">No menu items yet — add your first one above.</p>
      )}

      {!isLoading && items && items.length > 0 && (
        <div className="space-y-3">
          {items.map((item, index) => {
            const isTogglePending =
              toggleMutation.isPending && toggleMutation.variables === item.id;
            const isDeletePending =
              deleteMutation.isPending && deleteMutation.variables === item.id;

            return (
              <div
                key={item.id}
                className="row-enter rounded-2xl border border-[#2B2013]/10 bg-white/70 backdrop-blur-sm p-4"
                style={{ animationDelay: `${Math.min(index * 60, 300)}ms` }}
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`inline-block w-3 h-3 rounded-sm border shrink-0 ${
                          item.veg
                            ? "border-[#55713C] bg-[#55713C]"
                            : "border-[#B23A2E] bg-[#B23A2E]"
                        }`}
                      />
                      <h3 className="font-semibold">{item.name}</h3>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium text-white"
                        style={{ backgroundColor: CATEGORY_ACCENTS[item.category] }}
                      >
                        {item.category}
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-sm text-[#2B2013]/55 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                    <p className="text-sm font-semibold mt-1.5">₹{item.price}</p>
                  </div>

                  <button
                    onClick={() => toggleMutation.mutate(item.id)}
                    disabled={isTogglePending}
                    aria-label={item.available ? "Mark unavailable" : "Mark available"}
                    className="toggle-switch shrink-0 disabled:opacity-50"
                    style={{ backgroundColor: item.available ? "#55713C" : "#2B2013" }}
                    title={item.available ? "Available" : "Unavailable"}
                  >
                    <span
                      className="toggle-knob"
                      style={{ transform: item.available ? "translateX(20px)" : "translateX(0)" }}
                    />
                  </button>
                </div>

                {toggleErrorId === item.id && toggleMutation.isError && (
                  <p className="text-red-600 text-sm mt-2">{toggleMutation.error.message}</p>
                )}
                {deleteErrorId === item.id && deleteMutation.isError && (
                  <p className="text-red-600 text-sm mt-2">{deleteMutation.error.message}</p>
                )}

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => startEdit(item)}
                    className="text-sm font-medium px-3.5 py-1.5 rounded-full border border-[#2B2013]/15 hover:border-[#2B2013]/30 transition-colors"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={isDeletePending}
                    className="text-sm font-medium px-3.5 py-1.5 rounded-full text-[#B23A2E] border border-[#B23A2E]/25 hover:bg-[#B23A2E]/5 transition-colors disabled:opacity-50"
                  >
                    {isDeletePending ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
