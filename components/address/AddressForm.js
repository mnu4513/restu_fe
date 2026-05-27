export default function AddressForm({
  form,
  setForm,
  editingId,
  onSave,
  onCancel,
}) {
  return (
    <div
      className="
        rounded-3xl
        border border-gray-200 dark:border-white/10
        bg-white/70 dark:bg-white/[0.03]
        backdrop-blur-xl
        p-6 md:p-8
        shadow-lg
      "
    >
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-5">
        {editingId ? "✏️ Update Address" : "➕ Add New Address"}
      </h3>

      <div className="grid md:grid-cols-2 gap-4">
        <input
          className="input"
          placeholder="Label (Home, Work)"
          value={form.label}
          onChange={(e) => setForm({ ...form, label: e.target.value })}
        />

        <input
          className="input"
          placeholder="City"
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
        />

        <input
          className="input"
          placeholder="State"
          value={form.state}
          onChange={(e) => setForm({ ...form, state: e.target.value })}
        />

        <input
          className="input"
          placeholder="Pincode"
          value={form.pincode}
          onChange={(e) => setForm({ ...form, pincode: e.target.value })}
        />
      </div>

      <textarea
        className="input mt-4"
        placeholder="Full Address Line"
        value={form.addressLine}
        onChange={(e) => setForm({ ...form, addressLine: e.target.value })}
      />

      <div className="flex gap-3 mt-5">
        <button
          onClick={onSave}
          className="
            flex-1 py-3 rounded-2xl
            bg-gradient-to-r from-orange-500 to-green-500
            text-white font-semibold
            hover:scale-[1.02] active:scale-95
            transition
          "
        >
          {editingId ? "Update Address" : "Save Address"}
        </button>

        {editingId && (
          <button
            onClick={onCancel}
            className="
              px-6 py-3 rounded-2xl
              bg-gray-200 dark:bg-white/10
              text-gray-700 dark:text-white
            "
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}

/* helper (put in global css or tailwind layer) */