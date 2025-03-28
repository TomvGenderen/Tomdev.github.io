import { SmtpClient } from "npm:smtp-client@0.4.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, message } = await req.json();

    const smtp = new SmtpClient();
    
    await smtp.connect({
      hostname: "smtp.gmail.com",
      port: 587,
      username: "Tom.vangenderen@gmail.com",
      password: Deno.env.get("EMAIL_PASSWORD") || "",
    });

    const emailContent = `
Name: ${name}
Email: ${email}
Message: ${message}
    `;

    await smtp.send({
      from: "Tom.vangenderen@gmail.com",
      to: "Tom.vangenderen@gmail.com",
      subject: `Portfolio Contact Form: Message from ${name}`,
      content: emailContent,
    });

    await smtp.close();

    return new Response(
      JSON.stringify({ message: "Email sent successfully" }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to send email" }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});