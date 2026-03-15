'use client';

import { useEffect, useState } from 'react';
import ProjectCard from '@/components/ProjectCard';

type Project = {
  id: number;
  name: string;
  created_at: string;
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(true);

  async function fetchProjects() {
    const res = await fetch('/api/projects');
    const data: Project[] = await res.json();
    setProjects(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  async function createProject() {
    if (!newName.trim()) return;

    await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName.trim() }),
    });

    setNewName('');
    fetchProjects();
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-400">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-xl mx-auto flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-gray-800">Projects</h1>

        {/* Create project */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="New project name..."
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && createProject()}
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
          <button
            onClick={createProject}
            className="px-5 py-2 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-xl transition"
          >
            Add
          </button>
        </div>

        {/* Project list */}
        {projects.length === 0 ? (
          <p className="text-gray-400 text-center mt-8">No projects yet. Create one above!</p>
        ) : (
          <div className="flex flex-col gap-3">
            {projects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                onUpdate={fetchProjects}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}