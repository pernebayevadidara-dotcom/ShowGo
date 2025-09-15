import { supabase } from './supabase';
import { EventAttendee, AttendEventData } from '../types/EventAttendee';

export const attendEvent = async (attendeeData: AttendEventData): Promise<EventAttendee> => {
  try {
    const { data, error } = await supabase
      .from('event_attendees')
      .insert({
        event_id: attendeeData.event_id,
        user_id: attendeeData.user_id,
        user_email: attendeeData.user_email
      })
      .select()
      .single();

    if (error) {
      // Handle duplicate attendee error
      if (error.code === '23505') {
        throw new Error('You are already registered to attend this event');
      }
      throw new Error(`Failed to register for event: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error attending event:', error);
    throw error;
  }
};

export const unattendEvent = async (eventId: number, userId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('event_attendees')
      .delete()
      .eq('event_id', eventId)
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Failed to unregister from event: ${error.message}`);
    }
  } catch (error) {
    console.error('Error unattending event:', error);
    throw error;
  }
};

export const getEventAttendees = async (eventId: number): Promise<EventAttendee[]> => {
  try {
    const { data, error } = await supabase
      .from('event_attendees')
      .select('*')
      .eq('event_id', eventId)
      .order('attended_at', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch attendees: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching event attendees:', error);
    throw error;
  }
};

export const getUserAttendingEvents = async (userId: string): Promise<EventAttendee[]> => {
  try {
    const { data, error } = await supabase
      .from('event_attendees')
      .select('*')
      .eq('user_id', userId)
      .order('attended_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch attending events: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching user attending events:', error);
    throw error;
  }
};

export const checkUserAttendance = async (eventId: number, userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('event_attendees')
      .select('id')
      .eq('event_id', eventId)
      .eq('user_id', userId)
      .limit(1);

    if (error) {
      throw new Error(`Failed to check attendance: ${error.message}`);
    }

    return data && data.length > 0;
  } catch (error) {
    console.error('Error checking user attendance:', error);
    return false;
  }
};