
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  email: string;
  reminderTime: string;
  medicines: string[];
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, reminderTime, medicines }: EmailRequest = await req.json();
    console.log('Sending reminder email to:', email);

    // For now, we'll log the reminder. In production, you'd integrate with an email service like Resend
    const emailContent = {
      to: email,
      subject: '💊 Medicine Reminder - MedMate',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">💊 Medicine Reminder</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Time to take your medicine!</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #333; margin-top: 0;">⏰ Reminder Time: ${reminderTime}</h2>
            <h3 style="color: #555; margin-bottom: 15px;">Your Medicines:</h3>
            <ul style="list-style: none; padding: 0;">
              ${medicines.map(medicine => `
                <li style="background: white; padding: 10px; margin: 5px 0; border-radius: 5px; border-left: 4px solid #667eea;">
                  <strong>${medicine}</strong>
                </li>
              `).join('')}
            </ul>
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

    console.log('Email content prepared:', emailContent);

    // In a real implementation, you would send the email here using a service like Resend
    // For now, we'll return success to simulate the email being sent
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Reminder email scheduled successfully',
        emailPreview: emailContent 
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
      JSON.stringify({ error: 'Failed to send reminder email' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);
