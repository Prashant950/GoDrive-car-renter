import { useState } from "react";
import toast from "react-hot-toast";
import { FiLayers, FiPlus, FiTrash2, FiLoader, FiCheck } from "react-icons/fi";
import Modal from "./Modal.jsx";
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
} from "../services/categoryApi.js";

export default function CategoryModal({ open, onClose, onCategoryCreated }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { data: categories = [], isLoading: isLoadingCategories } = useGetCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Please enter a category name");

    try {
      const res = await createCategory({
        name: name.trim(),
        description: description.trim(),
      }).unwrap();
      toast.success(`Category "${res.name}" added successfully! 🎉`);
      setName("");
      setDescription("");
      onCategoryCreated?.(res.name);
      onClose?.();
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "Failed to create category");
    }
  };

  const handleDelete = async (cat) => {
    if (!window.confirm(`Delete category "${cat.name}"?`)) return;
    try {
      await deleteCategory(cat._id).unwrap();
      toast.success(`Category "${cat.name}" deleted`);
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "Failed to delete category");
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Manage Vehicle Categories" maxWidth="max-w-lg">
      <div className="p-6 space-y-6">
        {/* Form to Add New Category */}
        <form onSubmit={handleCreate} className="space-y-4 rounded-2xl bg-slate-50 p-4 border border-slate-200">
          <div className="flex items-center gap-2 text-sm font-bold text-primary-900">
            <FiPlus className="text-gold-500" /> Add New Vehicle Category / Model
          </div>
          <div>
            <label className="label">Category Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Compact SUV, Convertible, Electric EV, Luxury 4x4"
              className="input"
              required
            />
          </div>
          <div>
            <label className="label">Description (Optional)</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this vehicle segment"
              className="input"
            />
          </div>
          <button
            type="submit"
            disabled={isCreating}
            className="btn-primary w-full !py-2.5 flex items-center justify-center gap-2 font-bold"
          >
            {isCreating ? (
              <>
                <FiLoader className="animate-spin" /> Adding Category…
              </>
            ) : (
              <>
                <FiCheck /> Add Category to System
              </>
            )}
          </button>
        </form>

        {/* Existing Categories List */}
        <div>
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
            Existing Categories ({categories.length})
          </h4>
          {isLoadingCategories ? (
            <div className="py-4 text-center text-xs text-slate-400">Loading categories…</div>
          ) : categories.length === 0 ? (
            <div className="py-4 text-center text-xs text-slate-400">No categories found.</div>
          ) : (
            <div className="grid gap-2 max-h-56 overflow-y-auto pr-1">
              {categories.map((cat) => (
                <div
                  key={cat._id || cat.name}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-white p-3 shadow-xs hover:border-primary-200 transition"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-sm text-primary-900 truncate">{cat.name}</p>
                    {cat.description && (
                      <p className="text-xs text-slate-500 truncate">{cat.description}</p>
                    )}
                  </div>
                  {cat._id && (
                    <button
                      type="button"
                      onClick={() => handleDelete(cat)}
                      disabled={isDeleting}
                      className="text-slate-300 hover:text-red-500 p-1 rounded-lg hover:bg-red-50 transition"
                      title="Delete category"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
