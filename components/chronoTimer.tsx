'use client';

import { useEffect, useState } from 'react';

type Chrono = {
  id: number;
  status: 'running' | 'paused' | 'stopped';
  total_focus_time: number;
  created_at: string;
  project_id: number | null;
};

type Props = {
  chrono: Chrono;
  onUpdate: () => void; // refresh parent after action
};

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
}

export default function ChronoTimer({ chrono, onUpdate }: Props) {
  const [elapsed, setElapsed] = useState(1);

  // Tick every second when running
  useEffect(() => {
  if (chrono.status !== 'running') {
    setElapsed(chrono.total_focus_time);
    return;
  }

  const sinceLastResume = Math.floor(
    (Date.now() - new Date(chrono.created_at).getTime()) / 1000
  );
  setElapsed(chrono.total_focus_time + sinceLastResume);

  const interval = setInterval(() => {
    setElapsed(prev => prev + 1);
  }, 1000);

  return () => clearInterval(interval);
}, [chrono]);

  async function handleAction(action: 'pause' | 'resume' | 'stop') {
    await fetch(`/api/chronos/${chrono.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    });
    onUpdate();
  }

  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-white rounded-2xl shadow-md">
      {/* Timer display */}
      <p className="text-6xl font-mono font-bold tracking-widest text-gray-800">
        {formatTime(elapsed)}
      </p>

      {/* Status badge */}
      <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
        chrono.status === 'running'
          ? 'bg-green-100 text-green-700'
          : 'bg-yellow-100 text-yellow-700'
      }`}>
        {chrono.status === 'running' ? '● Running' : '⏸ Paused'}
      </span>

      {/* Action buttons */}
      <div className="flex gap-3">
        {chrono.status === 'running' && (
          <button
            onClick={() => handleAction('pause')}
            className="px-5 py-2 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold rounded-xl transition"
          >
            Pause
          </button>
        )}
        {chrono.status === 'paused' && (
          <button
            onClick={() => handleAction('resume')}
            className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition"
          >
            Resume
          </button>
        )}
        <button
          onClick={() => handleAction('stop')}
          className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition"
        >
          Stop
        </button>
      </div>
    </div>
  );
}