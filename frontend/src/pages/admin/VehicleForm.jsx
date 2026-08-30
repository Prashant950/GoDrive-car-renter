import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  FiUploadCloud,
  FiArrowLeft,
  FiLoader,
  FiSave,
  FiImage,
  FiPlus,
} from "react-icons/fi";
import Loader from "../../components/Loader.jsx";
import CategoryModal from "../../components/CategoryModal.jsx";
import { useGetVehicleByIdQuery } from "../../services/user/userVehicleApi.js";
import {
  useCreateVehicleMutation,
  useUpdateVehicleMutation,
} from "../../services/admin/adminVehicleApi.js";
import { useGetCategoriesQuery } from "../../services/categoryApi.js";
import { FUEL_TYPES, TRANSMISSIONS } from "../../utils/constants.js";

const DURATION_OPTIONS = [
  "24 Hours / Per Day",
  "1 Week",
  "1 Month",
];

const emptyForm = {
  name: "",
  brand: "",
  category: "SUV",
  fuelType: "Petrol",
  transmission: "Manual",
  seats: "",
  luggage: "",
  color: "",
  year: "",
  mileage: "",
  pricePerDay: "",
  priceDuration: "24 Hours / Per Day",
  withDriverPrice: "",
  description: "",
  features: "",
  available: true,
  featured: false,
};

export default function VehicleForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();

  const { data: existingVehicle, isLoading: loadingVehicle } = useGetVehicleByIdQuery(id, {
    skip: !editing,
  });
  const { data: dbCategories = [] } = useGetCategoriesQuery();
  const [createVehicle, { isLoading: isCreating }] = useCreateVehicleMutation();
  const [updateVehicle, { isLoading: isUpdating }] = useUpdateVehicleMutation();

  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  // Merge categories from DB with fallback defaults
  const categoriesList = useMemo(() => {
    const list = dbCategories.map((c) => c.name);
    if (!list.includes("SUV")) list.unshift("SUV");
    if (!list.includes("Sedan")) list.push("Sedan");
    if (!list.includes("Hatchback")) list.push("Hatchback");
    if (!list.includes("MUV")) list.push("MUV");
    if (!list.includes("Luxury")) list.push("Luxury");
    return Array.from(new Set(list));
  }, [dbCategories]);

  const fuels = useMemo(() => FUEL_TYPES.filter((f) => f !== "All"), []);
  const trans = useMemo(() => TRANSMISSIONS.filter((t) => t !== "All"), []);

  useEffect(() => {
    if (editing && existingVehicle) {
      const v = existingVehicle;
      setForm({
        name: v.name || "",
        brand: v.brand || "",
        category: v.category || categoriesList[0] || "SUV",
        fuelType: v.fuelType || "Petrol",
        transmission: v.transmission || "Manual",
        seats: v.seats !== undefined && v.seats !== null ? v.seats : "",
        luggage: v.luggage !== undefined && v.luggage !== null ? v.luggage : "",
        color: v.color || "",
        year: v.year !== undefined && v.year !== null ? v.year : "",
        mileage: v.mileage || "",
        pricePerDay: v.pricePerDay !== undefined && v.pricePerDay !== null ? v.pricePerDay : "",
        priceDuration: v.priceDuration || "24 Hours / Per Day",
        withDriverPrice: v.withDriverPrice !== undefined && v.withDriverPrice !== null ? v.withDriverPrice : "",
        description: v.description || "",
        features: Array.isArray(v.features) ? v.features.join(", ") : (v.features || ""),
        available: v.available ?? true,
        featured: v.featured ?? false,
      });
      setExistingImage(v.image || null);
      setFile(null);
      setPreview(null);
    } else if (!editing) {
      // Completely blank state for new vehicle addition
      setForm({
        ...emptyForm,
        category: categoriesList[0] || "SUV",
      });
      setExistingImage(null);
      setFile(null);
      setPreview(null);
    }
  }, [editing, existingVehicle, id, categoriesList]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!editing && !file) return toast.error("Please upload a vehicle image");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v !== undefined && v !== null) {
          fd.append(k, v);
        }
      });
      if (file) fd.append("image", file);

      if (editing) {
        await updateVehicle({ id, formData: fd }).unwrap();
        toast.success("Vehicle updated successfully (Saved to Cloudinary & DB) ✅");
      } else {
        await createVehicle(fd).unwrap();
        toast.success("Vehicle added successfully (Saved to Cloudinary & DB) ✅");
      }
      navigate("/admin/vehicles");
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "Failed to save vehicle");
    }
  };

  const saving = isCreating || isUpdating;
  if (editing && loadingVehicle) return <Loader label="Loading vehicle…" />;

  const shownImage = preview || existingImage;

  return (
    <div className="space-y-6">
      <Link
        to="/admin/vehicles"
        className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700 hover:text-gold-600"
      >
        <FiArrowLeft /> Back to vehicles
      </Link>

      <CategoryModal
        open={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        onCategoryCreated={(newCat) => setForm((f) => ({ ...f, category: newCat }))}
      />

      <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-3">
        {/* Left: fields */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="card space-y-6 p-7 lg:col-span-2"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="font-display text-xl font-bold text-primary-900">
                {editing ? "Edit Vehicle Details" : "Add New Vehicle"}
              </h2>
              <p className="text-xs text-slate-500">
                Configure vehicle specifications, category, rate and rental duration.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCategoryModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-primary-200 bg-primary-50/50 px-3 py-1.5 text-xs font-bold text-primary-800 hover:bg-primary-100 transition"
            >
              <FiPlus className="text-gold-600" /> Add New Category
            </button>
          </div>

          {/* Form Fields Grid */}
          <div className="grid gap-5 sm:grid-cols-2">
            <Text
              label="Vehicle Name"
              name="name"
              value={form.name}
              onChange={onChange}
              required
              placeholder="e.g. Toyota Fortuner 4x4, Thar 4x4, Grand Vitara"
            />
            <Text
              label="Brand / Make"
              name="brand"
              value={form.brand}
              onChange={onChange}
              required
              placeholder="e.g. Toyota, Mahindra, Maruti Suzuki, Hyundai"
            />

            {/* Category Select with Add Button */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label !mb-0">Category / Segment</label>
                <button
                  type="button"
                  onClick={() => setCategoryModalOpen(true)}
                  className="text-[11px] font-bold text-gold-600 hover:underline"
                >
                  + Add New
                </button>
              </div>
              <select name="category" value={form.category} onChange={onChange} className="input">
                {categoriesList.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <Select label="Fuel Type" name="fuelType" value={form.fuelType} onChange={onChange} options={fuels} />
            <Select label="Transmission" name="transmission" value={form.transmission} onChange={onChange} options={trans} />
            <Text label="Exterior Colour" name="color" value={form.color} onChange={onChange} placeholder="e.g. Pearl White, Mystic Black" />
            <Text type="number" label="Seating Capacity" name="seats" value={form.seats} onChange={onChange} min={2} max={20} placeholder="e.g. 5 or 7" />
            <Text type="number" label="Luggage (Bags)" name="luggage" value={form.luggage} onChange={onChange} min={0} max={20} placeholder="e.g. 2 or 3" />
            <Text type="number" label="Model Year" name="year" value={form.year} onChange={onChange} min={2000} max={2100} placeholder="e.g. 2024" />
            <Text label="Fuel Mileage" name="mileage" value={form.mileage} onChange={onChange} placeholder="e.g. 16 km/l or 26 km/kg" />

            {/* Price & Duration Select */}
            <Text
              type="number"
              label="Rental Rate (₹)"
              name="pricePerDay"
              value={form.pricePerDay}
              onChange={onChange}
              required
              min={0}
              placeholder="e.g. 2800"
            />
            <Select
              label="Rental Duration / Period"
              name="priceDuration"
              value={form.priceDuration}
              onChange={onChange}
              options={DURATION_OPTIONS}
            />

            <div className="sm:col-span-2">
              <Text
                type="number"
                label="With-Driver Allowance / Day (₹)"
                name="withDriverPrice"
                value={form.withDriverPrice}
                onChange={onChange}
                min={0}
                placeholder="e.g. 800"
              />
            </div>
          </div>

          {/* Description & Features */}
          <div>
            <label className="label">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              rows={3}
              placeholder="A short, appealing description of the vehicle, performance and comfort…"
              className="input resize-none"
            />
          </div>

          <div>
            <label className="label">Features (comma-separated)</label>
            <input
              name="features"
              value={form.features}
              onChange={onChange}
              placeholder="e.g. Sunroof, Ventilated Seats, 6 Airbags, Rear Camera, Cruise Control"
              className="input"
            />
          </div>

          <div className="flex flex-wrap gap-6 pt-2">
            <Toggle label="Available for Booking" name="available" checked={form.available} onChange={onChange} />
            <Toggle label="Featured on Homepage" name="featured" checked={form.featured} onChange={onChange} />
          </div>
        </motion.div>

        {/* Right: image + submit */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="card h-fit space-y-4 p-7"
        >
          <h3 className="font-display text-lg font-bold text-primary-900">Vehicle Image</h3>

          <div className="grid aspect-video place-items-center overflow-hidden rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-primary-50 shadow-inner">
            {shownImage ? (
              <img src={shownImage} alt="Preview" className="h-full w-full object-contain p-3" />
            ) : (
              <div className="text-center text-slate-300">
                <FiImage size={40} className="mx-auto" />
                <p className="mt-1 text-xs">No image uploaded yet</p>
              </div>
            )}
          </div>

          <label className="btn-outline w-full cursor-pointer flex items-center justify-center gap-2">
            <FiUploadCloud /> {shownImage ? "Change Image" : "Upload Image"}
            <input type="file" accept="image/*" onChange={onFile} className="hidden" />
          </label>
          <p className="text-center text-xs text-slate-400">
            JPG, PNG, WEBP or AVIF
          </p>

          <button type="submit" disabled={saving} className="btn-gold w-full !py-3 font-bold shadow-md">
            {saving ? (
              <>
                <FiLoader className="animate-spin" /> Uploading &amp; Saving…
              </>
            ) : (
              <>
                <FiSave /> {editing ? "Update Vehicle" : "Save Vehicle to Database"}
              </>
            )}
          </button>
        </motion.div>
      </form>
    </div>
  );
}

function Text({ label, required, ...props }) {
  return (
    <div>
      <label className="label">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input {...props} className="input" />
    </div>
  );
}

function Select({ label, options, ...props }) {
  return (
    <div>
      <label className="label">{label}</label>
      <select {...props} className="input">
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

function Toggle({ label, name, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 select-none">
      <input type="checkbox" name={name} checked={checked} onChange={onChange} className="sr-only peer" />
      <div className="h-6 w-11 rounded-full bg-slate-200 peer-checked:bg-gold-500 relative transition after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-sm after:transition-all peer-checked:after:translate-x-5" />
      <span className="text-sm font-semibold text-slate-700">{label}</span>
    </label>
  );
}
