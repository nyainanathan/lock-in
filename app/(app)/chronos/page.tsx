'use client';

import { useEffect, useState } from 'react';
import ChronoCard from '@/components/ChronoCard';

type Chrono = {
  id: number;
  status: 'running' | 'paused' | 'stopped';
  total_focus_time: number;
  project_id: number | null;
  created_at: string;
  stopped_at: string | null;
};

type Project = {
  id: number;
  name: string;
};

export default function ChronosPage() {
  const [chronos, setChronos] = useState<Chrono[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    const [chronosRes, projectsRes] = await Promise.all([
      fetch('/api/chronos'),
      fetch('/api/projects'),
    ]);

    const [chronosData, projectsData] = await Promise.all([
      chronosRes.json(),
      projectsRes.json(),
    ]);

    setChronos(chronosData);
    setProjects(projectsData);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  const stopped = chronos.filter(c => c.status === 'stopped');
  const active = chronos.filter(c => c.status !== 'stopped');

  // Total focus time across all stopped chronos
  const totalSeconds = stopped.reduce((acc, c) => acc + c.total_focus_time, 0);
  const totalHours = (totalSeconds / 3600).toFixed(1);

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
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">History</h1>
          <span className="text-sm text-gray-500">
            Total focus: <span className="font-bold text-gray-800">{totalHours}h</span>
          </span>
        </div>

        {/* Active chronos */}
        {active.length > 0 && (
          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Active</h2>
            {active.map(chrono => (
              <ChronoCard
                key={chrono.id}
                chrono={chrono}
                projects={projects}
                onDelete={fetchData}
              />
            ))}
          </div>
        )}

        {/* Stopped chronos */}
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Completed ({stopped.length})
          </h2>
          {stopped.length === 0 ? (
            <p className="text-gray-400 text-center mt-4">No completed sessions yet.</p>
          ) : (
            stopped.map(chrono => (
              <ChronoCard
                key={chrono.id}
                chrono={chrono}
                projects={projects}
                onDelete={fetchData}
              />
            ))
          )}
        </div>
      </div>
    </main>
  );
}