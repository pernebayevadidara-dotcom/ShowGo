import { useState, useEffect } from 'react';
import { getUserAttendingEvents } from '../lib/attendeeService';
import { supabase } from '../lib/supabase';
import { Event } from '../types/Event';
import { EventAttendee } from '../types/EventAttendee';

interface AttendingEvent extends Event {
  attended_at: string;
}

export const useUserAttendingEvents = (userId: string | undefined) => {
  const [attendingEvents, setAttendingEvents] = useState<AttendingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchAttendingEvents = async () => {
    if (!userId) {
      setAttendingEvents([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get user's attendance records
      const attendeeRecords = await getUserAttendingEvents(userId);

      if (attendeeRecords.length === 0) {
        setAttendingEvents([]);
        setLoading(false);
        return;
      }

      // Get event IDs
      const eventIds = attendeeRecords.map(record => record.event_id);

      // Fetch full event details
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .in('id', eventIds)
        .order('date', { ascending: true });

      if (eventsError) {
        throw eventsError;
      }

      // Combine event data with attendance info
      const eventsWithAttendance: AttendingEvent[] = (events || []).map(event => {
        const attendeeRecord = attendeeRecords.find(record => record.event_id === event.id);
        return {
          ...event,
          attended_at: attendeeRecord?.attended_at || ''
        };
      });

      setAttendingEvents(eventsWithAttendance);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching attending events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendingEvents();
  }, [userId, refreshTrigger]);

  const refresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };
  return {
    attendingEvents,
    loading,
    error,
    refetch: fetchAttendingEvents,
    refresh
  };
};