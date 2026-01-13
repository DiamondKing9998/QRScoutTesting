import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  fetchEventMatches,
  parseMatchSchedule,
  getCachedSchedule,
  cacheSchedule,
  cacheApiKey,
  getCachedApiKey,
  getScheduleHistory,
  deleteFromScheduleHistory,
  addToScheduleHistory,
  MatchScheduleEntry,
  ScheduleHistory,
} from '@/lib/blueAllianceApi';

export function ScheduleViewer() {
  const [apiKey, setApiKey] = useState(getCachedApiKey() || '');
  const [eventId, setEventId] = useState('');
  const [schedule, setSchedule] = useState<MatchScheduleEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cacheInfo, setCacheInfo] = useState('');
  const [history, setHistory] = useState<ScheduleHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load history on mount
  useEffect(() => {
    setHistory(getScheduleHistory());
  }, []);

  const handleApiKeySave = useCallback(() => {
    if (apiKey.trim()) {
      cacheApiKey(apiKey);
      setError('');
    }
  }, [apiKey]);

  const handleFetchSchedule = useCallback(async () => {
    if (!eventId.trim()) {
      setError('Please enter an Event ID');
      return;
    }

    if (!apiKey.trim()) {
      setError('Please enter and save a TBA API key first');
      return;
    }

    setLoading(true);
    setError('');
    setCacheInfo('');

    try {
      let parsed: MatchScheduleEntry[];
      
      // Check cache first
      const cached = getCachedSchedule(eventId);
      if (cached) {
        parsed = cached.schedule;
        const time = new Date(cached.timestamp).toLocaleString();
        setCacheInfo(`Loaded from cache (${time})`);
      } else {
        // Fetch from TBA
        const matches = await fetchEventMatches(eventId, apiKey);
        parsed = parseMatchSchedule(matches);
        cacheSchedule(eventId, parsed);
        setCacheInfo('Freshly fetched from TBA');
      }
      
      setSchedule(parsed);
      // Always add to history, regardless of source
      addToScheduleHistory(eventId, parsed);
      setHistory(getScheduleHistory());
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch schedule'
      );
      setSchedule([]);
    } finally {
      setLoading(false);
    }
  }, [eventId, apiKey]);

  const handleClearCache = useCallback(() => {
    if (eventId.trim()) {
      localStorage.removeItem(`tba_schedule_${eventId}`);
      setSchedule([]);
      setCacheInfo('Cache cleared');
    }
  }, [eventId]);

  const handleLoadFromHistory = useCallback((historyItem: ScheduleHistory) => {
    setEventId(historyItem.eventId);
    setSchedule(historyItem.schedule);
    setCacheInfo(
      `Loaded from history: ${new Date(historyItem.timestamp).toLocaleString()}`
    );
    setShowHistory(false);
  }, []);

  const handleDeleteFromHistory = useCallback((eventIdToDelete: string) => {
    deleteFromScheduleHistory(eventIdToDelete);
    setHistory(getScheduleHistory());
  }, []);

  return (
    <div className="w-full space-y-4 rounded-lg border border-border bg-card p-4 text-card-foreground">
      <h2 className="text-2xl font-bold">Match Schedule</h2>

      <div className="space-y-2">
        <label className="block text-sm font-medium">TBA API Key</label>
        <div className="flex gap-2">
          <Input
            type="password"
            placeholder="Enter TBA API key"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleApiKeySave} variant="outline">
            Save Key
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Event ID</label>
        <div className="flex gap-2">
          <Input
            placeholder="e.g., 2026mimid"
            value={eventId}
            onChange={e => setEventId(e.target.value.toLowerCase())}
            className="flex-1"
          />
          <Button
            onClick={handleFetchSchedule}
            disabled={loading}
            variant="default"
          >
            {loading ? 'Loading...' : 'Fetch Schedule'}
          </Button>
          <Button
            onClick={handleClearCache}
            variant="outline"
            disabled={!schedule.length}
          >
            Clear Cache
          </Button>
          <Button
            onClick={() => setShowHistory(!showHistory)}
            variant="outline"
            disabled={history.length === 0}
          >
            History ({history.length})
          </Button>
        </div>
      </div>

      {showHistory && history.length > 0 && (
        <div className="space-y-2 rounded border border-border bg-secondary/30 p-3">
          <h3 className="text-sm font-semibold">Previous Schedules</h3>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {history.map(item => (
              <div key={item.eventId} className="flex items-center justify-between gap-2 text-sm">
                <button
                  onClick={() => handleLoadFromHistory(item)}
                  className="flex-1 rounded bg-secondary px-2 py-1 text-left hover:bg-secondary/80 transition"
                >
                  <div className="font-medium">{item.eventId.toUpperCase()}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(item.timestamp).toLocaleString()}
                  </div>
                </button>
                <Button
                  onClick={() => handleDeleteFromHistory(item.eventId)}
                  variant="ghost"
                  size="sm"
                  className="px-2"
                >
                  ✕
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {cacheInfo && (
        <p className="text-sm text-muted-foreground">{cacheInfo}</p>
      )}

      {error && (
        <div className="rounded bg-destructive/10 p-2 text-destructive">
          {error}
        </div>
      )}

      {schedule.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-secondary">
                <th className="border border-border px-2 py-1">Match</th>
                <th className="border border-border px-2 py-1 text-red-500">
                  R1
                </th>
                <th className="border border-border px-2 py-1 text-red-500">
                  R2
                </th>
                <th className="border border-border px-2 py-1 text-red-500">
                  R3
                </th>
                <th className="border border-border px-2 py-1 text-blue-500">
                  B1
                </th>
                <th className="border border-border px-2 py-1 text-blue-500">
                  B2
                </th>
                <th className="border border-border px-2 py-1 text-blue-500">
                  B3
                </th>
              </tr>
            </thead>
            <tbody>
              {schedule.map(match => (
                <tr key={match.matchKey} className="hover:bg-secondary/50">
                  <td className="border border-border px-2 py-1 font-medium">
                    {match.matchNumber}
                  </td>
                  <td className="border border-border px-2 py-1">
                    {match.red1}
                  </td>
                  <td className="border border-border px-2 py-1">
                    {match.red2}
                  </td>
                  <td className="border border-border px-2 py-1">
                    {match.red3}
                  </td>
                  <td className="border border-border px-2 py-1">
                    {match.blue1}
                  </td>
                  <td className="border border-border px-2 py-1">
                    {match.blue2}
                  </td>
                  <td className="border border-border px-2 py-1">
                    {match.blue3}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
