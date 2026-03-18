'use client';

import { useEffect, useState } from 'react';
import ChronoTimer from '@/components/chronoTimer';
import { redirect } from 'next/navigation';

type Chrono = {
  id: number;
  status: 'running' | 'paused' | 'stopped';
  total_focus_time: number;
  created_at: string;
  project_id: number | null;
};

type Project = {
  id: number;
  name: string;
};

export default function Dashboard() {
  const [activeChrono, setActiveChrono] = useState<Chrono | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchActiveChrono() {
    const res = await fetch('/api/chronos');
    const data: Chrono[] = await res.json();
    const active = data.find(c => c.status === 'running' || c.status === 'paused') ?? null;
    setActiveChrono(active);
    setLoading(false);
  }

  async function fetchProjects() {
    const res = await fetch('/api/projects');
    const data: Project[] = await res.json();
    setProjects(data);
  }

  useEffect(() => {
    fetchActiveChrono();
    fetchProjects();
  }, []);

  async function startChrono() {
    await fetch('/api/chronos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project_id: selectedProject }),
    });
    fetchActiveChrono();
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-400">Loading...</p>
      </main>
    );
  }

    const handleLougout = () => {
    fetch('/api/auth/logout', {
      method: 'POST'
    })

    redirect('/login');
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-evenly gap-8 bg-gray-50 p-8">
      <h1 className="text-4xl font-bold text-gray-800">🔒 Lock-in</h1>

      {activeChrono ? (
        <>
          {activeChrono.project_id && (
            <p className="text-gray-500 text-sm">
              Project: <span className="font-semibold text-gray-700">
                {projects.find(p => p.id === activeChrono.project_id)?.name ?? '—'}
              </span>
            </p>
          )}
          <ChronoTimer
            chrono={activeChrono}
            onUpdate={fetchActiveChrono}
          />
        </>
      ) : (
        <div className="flex flex-col items-center gap-4 p-8 bg-white rounded-2xl shadow-md w-full max-w-sm">
          <p className="text-gray-500">No active chrono. Start focusing!</p>

          {/* Optional project selector */}
          <select
            className="w-full border border-gray-200 rounded-xl px-4 py-2 text-gray-700"
            value={selectedProject ?? ''}
            onChange={e => setSelectedProject(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">No project</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <button
            onClick={startChrono}
            className="w-full py-3 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-xl transition"
          >
            Start Focus Session
          </button>
        </div>
      )}
          <button
          onClick={handleLougout}
          className='bg-red-300 p-4 rounded-2xl cursor-pointer'
          >
            Logout
          </button>
    </main>
  );
}