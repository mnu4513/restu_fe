import { useEffect, useState } from "react";

export default function AddressForm({
  form,
  setForm,
  editingId,
  onSave,
  onCancel,
}) {
  return (
    <div className="border p-4 rounded mb-6 bg-white dark:bg-gray-900 shadow">
      <h3 className="text-lg font-semibold mb-3">
        {editingId ? "Update Address" : "Add Address"}
      </h3>

      <input
        className="border w-full mb-2 p-2 rounded"
        placeholder="Label (Home, Work)"
        value={form.label}
        onChange={(e) => setForm({ ...form, label: e.target.value })}
      />

      <input
        className="border w-full mb-2 p-2 rounded"
        placeholder="Address Line"
        value={form.addressLine}
        onChange={(e) => setForm({ ...form, addressLine: e.target.value })}
      />

      <input
        className="border w-full mb-2 p-2 rounded"
        placeholder="City"
        value={form.city}
        onChange={(e) => setForm({ ...form, city: e.target.value })}
      />

      <input
        className="border w-full mb-2 p-2 rounded"
        placeholder="State"
        value={form.state}
        onChange={(e) => setForm({ ...form, state: e.target.value })}
      />

      <input
        className="border w-full mb-3 p-2 rounded"
        placeholder="Pincode"
        value={form.pincode}
        onChange={(e) => setForm({ ...form, pincode: e.target.value })}
      />

      <div className="flex gap-2">
        <button
          onClick={onSave}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {editingId ? "Update Address" : "Save Address"}
        </button>

        {editingId && (
          <button
            onClick={onCancel}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
