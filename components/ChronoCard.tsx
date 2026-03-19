'use client';

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

type Props = {
  chrono: Chrono;
  projects: Project[];
  onDelete: () => void;
};

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString();
}

export default function ChronoCard({ chrono, projects, onDelete }: Props) {
  const project = projects.find(p => p.id === chrono.project_id);

  async function handleDelete() {
    if (!confirm('Delete this chrono?')) return;

    await fetch(`/api/chronos/${chrono.id}`, { method: 'DELETE' });
    onDelete();
  }

  return (
    <div className="flex items-center justify-between gap-4 p-4 bg-white rounded-xl shadow-sm">
      <div className="flex flex-col gap-1">

        {/* Focus time */}
        <span className="text-2xl font-mono font-bold text-gray-800">
          {formatTime(chrono.total_focus_time)}
        </span>

        {/* Project */}
        <span className="text-sm text-gray-500">
          {project ? `📁 ${project.name}` : 'No project'}
        </span>

        {/* Date */}
        <span className="text-xs text-gray-400">
          {formatDate(chrono.created_at)}
          {chrono.stopped_at && ` → ${formatDate(chrono.stopped_at)}`}
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Status badge */}
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
          chrono.status === 'running'
            ? 'bg-green-100 text-green-700'
            : chrono.status === 'paused'
            ? 'bg-yellow-100 text-yellow-700'
            : 'bg-gray-100 text-gray-500'
        }`}>
          {chrono.status === 'running' ? '● Running'
            : chrono.status === 'paused' ? '⏸ Paused'
            : '✓ Stopped'}
        </span>

        {/* Delete — only for stopped chronos */}
        {chrono.status === 'stopped' && (
          <button
            onClick={handleDelete}
            className="px-3 py-1 text-sm bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}