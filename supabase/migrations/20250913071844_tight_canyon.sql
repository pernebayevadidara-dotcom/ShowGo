/*
  # Populate events table with initial data

  1. Data Migration
    - Insert sample events from the frontend mock data
    - Map all properties to corresponding database columns
    - Include proper timestamps and default values

  2. Data Mapping
    - name -> title
    - description -> description  
    - location -> venue location info
    - venue -> venue
    - date -> date
    - time -> time
    - category -> category
    - image -> image
    - organizer -> organizer (default)
    - phone -> phone (default)
    - email -> email (default)
*/

-- Insert sample events data
INSERT INTO events (title, date, venue, time, description, organizer, category, phone, email, image) VALUES
(
  'Rock Concert',
  'August 25',
  'Madison Square Garden',
  '8:00 PM',
  'An electrifying night of rock music with epic performances from local and touring bands.',
  'ShowGo Events',
  'Rock',
  '(123) 456-7890',
  'info@showgo.com',
  'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=400'
),
(
  'Jazz Night',
  'September 10',
  'The Jazz Lounge',
  '7:30 PM',
  'Join us for a smooth and soulful evening of jazz tunes featuring renowned artists.',
  'ShowGo Events',
  'Jazz',
  '(123) 456-7890',
  'info@showgo.com',
  'https://images.pexels.com/photos/1144275/pexels-photo-1144275.jpeg?auto=compress&cs=tinysrgb&w=400'
),
(
  'Electronic Party',
  'September 18',
  'Warehouse 21',
  '10:00 PM',
  'Get ready to dance to the hottest electronic beats in town with world-class DJs.',
  'ShowGo Events',
  'Electronic',
  '(123) 456-7890',
  'info@showgo.com',
  'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=400'
),
(
  'Indie Showcase',
  'September 22',
  'The Independent',
  '8:30 PM',
  'Experience the best indie bands and emerging artists live in an intimate setting.',
  'ShowGo Events',
  'Indie',
  '(123) 456-7890',
  'info@showgo.com',
  'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400'
),
(
  'Hip-Hop Night',
  'October 5',
  'State Farm Arena',
  '9:00 PM',
  'The ultimate hip-hop experience with top artists and underground talent.',
  'ShowGo Events',
  'Hip-Hop',
  '(123) 456-7890',
  'info@showgo.com',
  'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=400'
),
(
  'Acoustic Sessions',
  'October 12',
  'The Bluebird Cafe',
  '7:00 PM',
  'Intimate acoustic performances in a cozy venue perfect for music lovers.',
  'ShowGo Events',
  'Acoustic',
  '(123) 456-7890',
  'info@showgo.com',
  'https://images.pexels.com/photos/1144275/pexels-photo-1144275.jpeg?auto=compress&cs=tinysrgb&w=400'
);