import { supabase } from './supabase';
import { Event } from '../types/Event';

export interface CreateEventData {
  title: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  organizer: string;
  category: string;
  phone: string;
  email: string;
  image: File;
}

export interface UpdateEventData {
  title: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  organizer: string;
  category: string;
  phone: string;
  email: string;
  image?: File; // Optional for updates
}
export const createEvent = async (eventData: CreateEventData): Promise<Event> => {
  try {
    // 1. Upload image to Supabase Storage
    const fileExt = eventData.image.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('event-images')
      .upload(fileName, eventData.image, {
        cacheControl: '3600',
        upsert: false,
        contentType: eventData.image.type
      });

    if (uploadError) {
      throw new Error(`Image upload failed: ${uploadError.message}`);
    }

    // 2. Get the public URL for the uploaded image
    const { data: publicUrlData } = supabase.storage
      .from('event-images')
      .getPublicUrl(fileName);

    const imageUrl = publicUrlData.publicUrl;

    // 3. Insert event data into the database
    const eventToInsert = {
      title: eventData.title,
      date: eventData.date,
      time: eventData.time,
      venue: eventData.venue,
      description: eventData.description,
      organizer: eventData.organizer,
      category: eventData.category,
      phone: eventData.phone,
      email: eventData.email,
      image: imageUrl
    };

    const { data: insertedEvent, error: insertError } = await supabase
      .from('events')
      .insert(eventToInsert)
      .select()
      .single();

    if (insertError) {
      // Clean up uploaded image if database insert fails
      await supabase.storage
        .from('event-images')
        .remove([fileName]);
      
      throw new Error(`Failed to create event: ${insertError.message}`);
    }

    return insertedEvent;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

export const deleteEvent = async (eventId: number): Promise<void> => {
  try {
    // 1. Get the event to find the image URL for cleanup
    const { data: event, error: fetchError } = await supabase
      .from('events')
      .select('image')
      .eq('id', eventId)
      .single();

    if (fetchError) {
      throw new Error(`Failed to fetch event: ${fetchError.message}`);
    }

    // 2. Delete the event from database
    const { error: deleteError } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId);

    if (deleteError) {
      throw new Error(`Failed to delete event: ${deleteError.message}`);
    }

    // 3. Clean up the image from storage if it exists
    if (event?.image) {
      try {
        const fileName = event.image.split('/').pop();
        if (fileName) {
          await supabase.storage
            .from('event-images')
            .remove([fileName]);
        }
      } catch (storageError) {
        // Log storage cleanup error but don't fail the delete operation
        console.warn('Failed to delete image from storage:', storageError);
      }
    }
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};
export const updateEvent = async (eventId: number, eventData: UpdateEventData): Promise<Event> => {
  try {
    let imageUrl: string | undefined;

    // 1. Upload new image if provided
    if (eventData.image) {
      const fileExt = eventData.image.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('event-images')
        .upload(fileName, eventData.image, {
          cacheControl: '3600',
          upsert: false,
          contentType: eventData.image.type
        });

      if (uploadError) {
        throw new Error(`Image upload failed: ${uploadError.message}`);
      }

      // Get the public URL for the uploaded image
      const { data: publicUrlData } = supabase.storage
        .from('event-images')
        .getPublicUrl(fileName);

      imageUrl = publicUrlData.publicUrl;
    }

    // 2. Prepare update data
    const updateData: any = {
      title: eventData.title,
      date: eventData.date,
      time: eventData.time,
      venue: eventData.venue,
      description: eventData.description,
      organizer: eventData.organizer,
      category: eventData.category,
      phone: eventData.phone,
      email: eventData.email,
      updated_at: new Date().toISOString()
    };

    // Only update image if a new one was uploaded
    if (imageUrl) {
      updateData.image = imageUrl;
    }

    // 3. Update event in database
    const { data: updatedEvent, error: updateError } = await supabase
      .from('events')
      .update(updateData)
      .eq('id', eventId)
      .select()
      .single();

    if (updateError) {
      // Clean up uploaded image if database update fails
      if (imageUrl) {
        const fileName = imageUrl.split('/').pop();
        if (fileName) {
          await supabase.storage
            .from('event-images')
            .remove([fileName]);
        }
      }
      
      throw new Error(`Failed to update event: ${updateError.message}`);
    }

    return updatedEvent;
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};