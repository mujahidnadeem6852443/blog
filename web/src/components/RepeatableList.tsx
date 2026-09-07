"use client";

export function RepeatableList<T>({
  items,
  onChange,
  renderItem,
  newItem,
  addLabel,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  renderItem: (item: T, update: (patch: Partial<T>) => void) => React.ReactNode;
  newItem: T;
  addLabel: string;
}) {
  function updateItem(index: number, patch: Partial<T>) {
    const next = items.slice();
    next[index] = { ...next[index], ...patch };
    onChange(next);
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  return (
    <div className="stack">
      {items.map((item, i) => (
        <div key={i} className="card stack">
          {renderItem(item, (patch) => updateItem(i, patch))}
          <button type="button" className="btn btn-secondary" onClick={() => removeItem(i)}>
            Remove
          </button>
        </div>
      ))}
      <button type="button" className="btn btn-secondary" onClick={() => onChange([...items, newItem])}>
        {addLabel}
      </button>
    </div>
  );
}
