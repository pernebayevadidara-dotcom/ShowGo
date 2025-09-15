export interface EventAttendee {
  id: string;
  event_id: number;
  user_id: string;
  user_email: string;
  attended_at: string;
  created_at: string;
}

export interface AttendEventData {
  event_id: number;
  user_id: string;
  user_email: string;
}