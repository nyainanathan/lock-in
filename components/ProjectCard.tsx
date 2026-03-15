'use client';

import { useState } from 'react';

type Project = {
  id: number;
  name: string;
  created_at: string;
};

type Props = {
  project: Project;
  onUpdate: () => void;
};

export default function ProjectCard({ project, onUpdate }: Props) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(project.name);

  async function handleRename() {
    if (!name.trim() || name === project.name) {
      setEditing(false);
      return;
    }

    await fetch(`/api/projects/${project.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim() }),
    });

    setEditing(false);
    onUpdate();
  }

  async function handleDelete() {
    if (!confirm(`Delete "${project.name}"?`)) return;

    await fetch(`/api/projects/${project.id}`, { method: 'DELETE' });
    onUpdate();
  }

  return (
    <div className="flex items-center justify-between gap-3 p-4 bg-white rounded-xl shadow-sm">
      {editing ? (
        <input
          autoFocus
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') handleRename();
            if (e.key === 'Escape') setEditing(false);
          }}
          onBlur={handleRename}
          className="flex-1 border border-gray-200 rounded-lg px-3 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
        />
      ) : (
        <span className="flex-1 text-gray-800 font-medium">{project.name}</span>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => setEditing(true)}
          className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition"
        >
          Rename
        </button>
        <button
          onClick={handleDelete}
          className="px-3 py-1 text-sm bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
}