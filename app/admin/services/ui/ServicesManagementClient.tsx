"use client";

import { useMemo, useState, useTransition } from "react";
import { deleteService, toggleVisibility, upsertService } from "@/actions/service-actions";
import { ModalDialog } from "@/app/admin/_components/ModalDialog";
import { deleteAddOn, toggleAddOnActive, upsertAddOn } from "@/actions/addon-actions";

type Service = Awaited<ReturnType<typeof import("@/actions/service-actions").getServices>>[number];
type AddOn = Awaited<ReturnType<typeof import("@/actions/addon-actions").getAddOnsAdmin>>[number];

type ServiceType = "PACKAGE" | "ADDON";

export function ServicesManagementClient({ initial, initialAddOns }: { initial: Service[]; initialAddOns: AddOn[] }) {
  const [pending, startTransition] = useTransition();
  const [items, setItems] = useState<Service[]>(initial);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [addOns, setAddOns] = useState<AddOn[]>(initialAddOns);
  const [addOnModalOpen, setAddOnModalOpen] = useState(false);
  const [editingAddOnId, setEditingAddOnId] = useState<string | null>(null);
  const [deleteAddOnId, setDeleteAddOnId] = useState<string | null>(null);

  const editing = useMemo(() => items.find((x) => x.id === editingId) ?? null, [editingId, items]);
  const editingAddOn = useMemo(() => addOns.find((x) => x.id === editingAddOnId) ?? null, [addOns, editingAddOnId]);

  const [draft, setDraft] = useState({
    id: "",
    name: "",
    category: "General Residential",
    type: "PACKAGE" as ServiceType,
    priceRange: "",
    priceSort: 0,
    isPopular: false
  });

  const [addOnDraft, setAddOnDraft] = useState({
    id: "",
    key: "",
    name: "",
    priceRange: "",
    sortOrder: 0,
    active: true
  });

  function openCreate() {
    setEditingId(null);
    setDraft({
      id: "",
      name: "",
      category: "General Residential",
      type: "PACKAGE",
      priceRange: "",
      priceSort: 0,
      isPopular: false
    });
    setModalOpen(true);
  }

  function openEdit(s: Service) {
    setEditingId(s.id);
    setDraft({
      id: s.id,
      name: s.name,
      category: s.category,
      type: (String((s as any).type ?? "PACKAGE") as ServiceType) === "ADDON" ? "ADDON" : "PACKAGE",
      priceRange: s.priceRange,
      priceSort: Number((s as any).priceSort ?? 0),
      isPopular: Boolean((s as any).isPopular ?? false)
    });
    setModalOpen(true);
  }

  function openCreateAddOn() {
    setEditingAddOnId(null);
    setAddOnDraft({ id: "", key: "", name: "", priceRange: "", sortOrder: 0, active: true });
    setAddOnModalOpen(true);
  }

  function openEditAddOn(a: AddOn) {
    setEditingAddOnId(a.id);
    setAddOnDraft({
      id: a.id,
      key: a.key,
      name: a.name,
      priceRange: a.priceRange,
      sortOrder: a.sortOrder ?? 0,
      active: a.active ?? true
    });
    setAddOnModalOpen(true);
  }

  function onSubmit() {
    startTransition(async () => {
      await upsertService({
        id: draft.id || undefined,
        name: draft.name,
        category: draft.category,
        type: draft.type,
        priceRange: draft.priceRange,
        priceSort: draft.priceSort,
        isPopular: draft.isPopular
      });
      setModalOpen(false);
    });
  }

  function onSubmitAddOn() {
    startTransition(async () => {
      const saved = await upsertAddOn({
        id: addOnDraft.id || undefined,
        key: addOnDraft.key,
        name: addOnDraft.name,
        priceRange: addOnDraft.priceRange,
        sortOrder: Number(addOnDraft.sortOrder || 0),
        active: Boolean(addOnDraft.active)
      });
      setAddOnModalOpen(false);
      setEditingAddOnId(null);
      setAddOns((prev) => {
        const idx = prev.findIndex((x) => x.id === saved.id);
        if (idx >= 0) return prev.map((x) => (x.id === saved.id ? saved : x));
        return prev.concat(saved);
      });
    });
  }

  function onToggle(id: string, current: boolean) {
    startTransition(async () => {
      await toggleVisibility(id, current);
      setItems((prev) => prev.map((x) => (x.id === id ? { ...x, isVisible: !current } : x)));
    });
  }

  function onRemove(id: string) {
    setDeleteId(id);
  }

  function confirmRemove() {
    if (!deleteId) return;
    startTransition(async () => {
      await deleteService(deleteId);
      setItems((prev) => prev.filter((x) => x.id !== deleteId));
      setDeleteId(null);
    });
  }

  function onToggleAddOn(id: string, current: boolean) {
    startTransition(async () => {
      await toggleAddOnActive(id, current);
      setAddOns((prev) => prev.map((x) => (x.id === id ? { ...x, active: !current } : x)));
    });
  }

  function onRemoveAddOn(id: string) {
    setDeleteAddOnId(id);
  }

  function confirmRemoveAddOn() {
    if (!deleteAddOnId) return;
    startTransition(async () => {
      await deleteAddOn(deleteAddOnId);
      setAddOns((prev) => prev.filter((x) => x.id !== deleteAddOnId));
      setDeleteAddOnId(null);
    });
  }

  return (
    <div className="min-h-[calc(100vh-2rem)] rounded-3xl bg-[#F9FAFB] p-6 text-slate-900 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-xs font-semibold tracking-[0.22em] text-slate-500">ADMIN</div>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">Service Management</h1>
          <p className="mt-1 text-sm text-slate-600">
            Add, edit, and toggle visibility. Changes reflect instantly on <span className="font-mono">/services</span>.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="inline-flex items-center justify-center rounded-xl bg-[#0F172A] px-4 py-3 text-sm font-semibold text-white hover:bg-[#111c33] disabled:opacity-60"
          disabled={pending}
        >
          + Add New Service
        </button>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-600">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Popular</th>
                <th className="px-4 py-3">Visibility</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {items.length === 0 ? (
                <tr>
                  <td className="px-4 py-8 text-center text-slate-600" colSpan={6}>
                    No services yet. Click “Add New Service”.
                  </td>
                </tr>
              ) : (
                items.map((s) => {
                  const type = (String((s as any).type ?? "PACKAGE") as ServiceType) === "ADDON" ? "ADDON" : "PACKAGE";
                  const isPopular = Boolean((s as any).isPopular ?? false);
                  return (
                    <tr key={s.id} className="hover:bg-slate-50/60">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900">{s.name}</div>
                        <div className="text-xs text-slate-500">{s.category}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                          {type === "PACKAGE" ? "Package" : "Add-on"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900">{s.priceRange}</div>
                        <div className="text-xs text-slate-500">Sort: {(s as any).priceSort ?? 0}</div>
                      </td>
                      <td className="px-4 py-3">
                        {isPopular ? (
                          <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                            Yes
                          </span>
                        ) : (
                          <span className="text-slate-500">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => onToggle(s.id, s.isVisible)}
                          disabled={pending}
                          className={[
                            "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold",
                            s.isVisible
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              : "border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200"
                          ].join(" ")}
                        >
                          <span
                            className={[
                              "h-2 w-2 rounded-full",
                              s.isVisible ? "bg-emerald-500" : "bg-slate-400"
                            ].join(" ")}
                          />
                          {s.isVisible ? "Live" : "Hidden"}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openEdit(s)}
                            disabled={pending}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => onRemove(s.id)}
                            disabled={pending}
                            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="border-b border-slate-200 px-5 py-4">
              <div className="text-sm font-semibold text-slate-900">
                {editing ? "Edit Service" : "Add New Service"}
              </div>
              <div className="mt-1 text-xs text-slate-500">Saved changes will revalidate `/services` and `/admin/services`.</div>
            </div>

            <div className="grid gap-4 px-5 py-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-slate-600">Title *</label>
                <input
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                  value={draft.name}
                  onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Category *</label>
                <input
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                  value={draft.category}
                  onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Type *</label>
                <select
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                  value={draft.type}
                  onChange={(e) => setDraft((d) => ({ ...d, type: e.target.value as ServiceType }))}
                >
                  <option value="PACKAGE">Package</option>
                  <option value="ADDON">Add-on</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Price (display) *</label>
                <input
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                  placeholder="$199 AUD"
                  value={draft.priceRange}
                  onChange={(e) => setDraft((d) => ({ ...d, priceRange: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Price sort (ascending)</label>
                <input
                  type="number"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                  value={draft.priceSort}
                  onChange={(e) => setDraft((d) => ({ ...d, priceSort: Number(e.target.value || 0) }))}
                />
              </div>
              <div className="md:col-span-2 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div>
                  <div className="text-sm font-semibold text-slate-900">Most Popular</div>
                  <div className="text-xs text-slate-600">Applies the highlighted “Most Popular” styling on `/services`.</div>
                </div>
                <button
                  type="button"
                  onClick={() => setDraft((d) => ({ ...d, isPopular: !d.isPopular }))}
                  className={[
                    "h-8 w-14 rounded-full border transition",
                    draft.isPopular ? "border-emerald-300 bg-emerald-100" : "border-slate-300 bg-white"
                  ].join(" ")}
                  aria-pressed={draft.isPopular}
                >
                  <span
                    className={[
                      "block h-7 w-7 rounded-full bg-white shadow-sm transition",
                      draft.isPopular ? "translate-x-6" : "translate-x-0.5"
                    ].join(" ")}
                  />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-5 py-4">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                disabled={pending}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onSubmit}
                className="rounded-xl bg-[#0F172A] px-4 py-3 text-sm font-semibold text-white hover:bg-[#111c33] disabled:opacity-60"
                disabled={pending}
              >
                {pending ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <ModalDialog
        open={Boolean(deleteId)}
        title="Delete this service?"
        description="This will remove the service from the public services list."
        confirmLabel={pending ? "Deleting…" : "Delete"}
        cancelLabel="Cancel"
        variant="danger"
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmRemove}
      />

      {/* Add-ons management */}
      <div className="mt-12 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-xs font-semibold tracking-[0.22em] text-slate-500">ADD-ONS</div>
          <h2 className="mt-1 text-2xl font-semibold text-slate-900">Optional Add-ons Pricing</h2>
          <p className="mt-1 text-sm text-slate-600">
            These appear under “Optional Add-ons” on <span className="font-mono">/services</span>.
          </p>
        </div>
        <button
          onClick={openCreateAddOn}
          className="inline-flex items-center justify-center rounded-xl bg-[#0F172A] px-4 py-3 text-sm font-semibold text-white hover:bg-[#111c33] disabled:opacity-60"
          disabled={pending}
        >
          + Add New Add-on
        </button>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-600">
              <tr>
                <th className="px-4 py-3">Key</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Active</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {addOns.length === 0 ? (
                <tr>
                  <td className="px-4 py-8 text-center text-slate-600" colSpan={5}>
                    No add-ons yet. Click “Add New Add-on”.
                  </td>
                </tr>
              ) : (
                addOns.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3 font-mono text-xs text-slate-700">{a.key}</td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">{a.name}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">{a.priceRange}</div>
                      <div className="text-xs text-slate-500">AUD</div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => onToggleAddOn(a.id, Boolean(a.active))}
                        disabled={pending}
                        className={[
                          "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold",
                          a.active
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : "border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200"
                        ].join(" ")}
                      >
                        <span className={["h-2 w-2 rounded-full", a.active ? "bg-emerald-500" : "bg-slate-400"].join(" ")} />
                        {a.active ? "Live" : "Hidden"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEditAddOn(a)}
                          disabled={pending}
                          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => onRemoveAddOn(a.id)}
                          disabled={pending}
                          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {addOnModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="border-b border-slate-200 px-5 py-4">
              <div className="text-sm font-semibold text-slate-900">
                {editingAddOn ? "Edit Add-on" : "Add New Add-on"}
              </div>
              <div className="mt-1 text-xs text-slate-500">
                Saved changes will update add-ons on <span className="font-mono">/services</span>.
              </div>
            </div>

            <div className="grid gap-4 px-5 py-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-slate-600">Key *</label>
                <input
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                  value={addOnDraft.key}
                  onChange={(e) => setAddOnDraft((d) => ({ ...d, key: e.target.value }))}
                  placeholder="window_cleaning"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-slate-600">Name *</label>
                <input
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                  value={addOnDraft.name}
                  onChange={(e) => setAddOnDraft((d) => ({ ...d, name: e.target.value }))}
                  placeholder="Window Cleaning"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Price Range *</label>
                <input
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                  value={addOnDraft.priceRange}
                  onChange={(e) => setAddOnDraft((d) => ({ ...d, priceRange: e.target.value }))}
                  placeholder="$50–$150"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Sort Order</label>
                <input
                  type="number"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                  value={addOnDraft.sortOrder}
                  onChange={(e) => setAddOnDraft((d) => ({ ...d, sortOrder: Number(e.target.value || 0) }))}
                />
              </div>
              <div className="md:col-span-2 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div>
                  <div className="text-sm font-semibold text-slate-900">Active</div>
                  <div className="text-xs text-slate-600">Visible on the public add-ons list.</div>
                </div>
                <button
                  type="button"
                  onClick={() => setAddOnDraft((d) => ({ ...d, active: !d.active }))}
                  className={[
                    "h-8 w-14 rounded-full border transition",
                    addOnDraft.active ? "border-emerald-300 bg-emerald-100" : "border-slate-300 bg-white"
                  ].join(" ")}
                  aria-pressed={addOnDraft.active}
                >
                  <span
                    className={[
                      "block h-7 w-7 rounded-full bg-white shadow-sm transition",
                      addOnDraft.active ? "translate-x-6" : "translate-x-0.5"
                    ].join(" ")}
                  />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-5 py-4">
              <button
                type="button"
                onClick={() => setAddOnModalOpen(false)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                disabled={pending}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onSubmitAddOn}
                className="rounded-xl bg-[#0F172A] px-4 py-3 text-sm font-semibold text-white hover:bg-[#111c33] disabled:opacity-60"
                disabled={pending || !addOnDraft.key.trim() || !addOnDraft.name.trim() || !addOnDraft.priceRange.trim()}
              >
                {pending ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <ModalDialog
        open={Boolean(deleteAddOnId)}
        title="Delete this add-on?"
        description="This removes the add-on from pricing."
        confirmLabel={pending ? "Deleting…" : "Delete"}
        cancelLabel="Cancel"
        variant="danger"
        onCancel={() => setDeleteAddOnId(null)}
        onConfirm={confirmRemoveAddOn}
      />
    </div>
  );
}

