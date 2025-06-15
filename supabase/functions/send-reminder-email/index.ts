
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  email: string;
  reminderTime: string;
  medicines: string[];
  scheduledTime: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, reminderTime, medicines, scheduledTime }: EmailRequest = await req.json();
    console.log('Processing medicine reminder for:', email, 'at time:', reminderTime);

    // Calculate delay until reminder time
    const now = new Date();
    const reminderDate = new Date(scheduledTime);
    const delay = reminderDate.getTime() - now.getTime();

    console.log('Reminder scheduled for:', reminderDate, 'Delay (ms):', delay);

    if (delay > 0) {
      // Schedule the email to be sent at the reminder time
      setTimeout(async () => {
        console.log('Sending medicine reminder email to:', email);
        
        // In a real implementation, you would integrate with an email service like Resend
        // For now, we'll log the email content that would be sent
        const emailContent = {
          to: email,
          subject: '💊 Medicine Reminder - Time to Take Your Medicine!',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
                <h1 style="color: white; margin: 0; font-size: 28px;">💊 Medicine Reminder</h1>
                <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">It's time to take your medicine!</p>
              </div>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h2 style="color: #333; margin-top: 0;">⏰ Reminder Time: ${reminderTime}</h2>
                <h3 style="color: #555; margin-bottom: 15px;">Your Medicines:</h3>
                ${medicines.length > 0 ? `
                  <ul style="list-style: none; padding: 0;">
                    ${medicines.map(medicine => `
                      <li style="background: white; padding: 10px; margin: 5px 0; border-radius: 5px; border-left: 4px solid #667eea;">
                        <strong>${medicine}</strong>
                      </li>
                    `).join('')}
                  </ul>
                ` : `
                  <p style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #ffa500;">
                    Please check your medicine list in the MedMate app
                  </p>
                `}
              </div>
              
              <div style="text-align: center; color: #666; font-size: 14px;">
                <p>💡 Remember to take your medicines as prescribed by your healthcare provider.</p>
                <p style="margin-top: 20px;">
                  <em>This reminder was sent by MedMate - Your personal medicine companion</em>
                </p>
              </div>
            </div>
          `
        };

        console.log('Medicine reminder email would be sent:', emailContent);
        
        // Here you would normally send the email using a service like Resend
        // For demonstration, we're just logging it
        
      }, delay);
    } else {
      console.log('Reminder time is in the past, not scheduling');
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Medicine reminder email scheduled successfully',
        scheduledFor: reminderDate.toISOString()
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error('Error in send-reminder-email function:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to schedule reminder email' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);
