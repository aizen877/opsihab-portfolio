export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, email, subject, message, _honey } = req.body;

    // Honeypot spam check
    if (_honey) {
        return res.status(200).json({ success: true, message: 'Spam filtered.' });
    }

    if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ 
            error: 'Server configuration error: RESEND_API_KEY is missing on Vercel.' 
        });
    }

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'Portfolio Contact <hello@opsihab.tech>',
                to: 'sihabhossen13@gmail.com',
                subject: `Portfolio Contact: ${subject}`,
                html: `
                    <div style="font-family: sans-serif; padding: 24px; color: #1e293b; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #f8fafc; margin: 0 auto; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                        <h2 style="color: #2563eb; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; margin-top: 0; font-size: 20px; font-weight: 700;">New Message from Portfolio</h2>
                        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
                            <tr>
                                <td style="padding: 8px 0; font-weight: 600; width: 120px; color: #475569; font-size: 14px;">Sender Name:</td>
                                <td style="padding: 8px 0; color: #0f172a; font-size: 14px;">${name}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-weight: 600; color: #475569; font-size: 14px;">Email Address:</td>
                                <td style="padding: 8px 0; font-size: 14px;"><a href="mailto:${email}" style="color: #2563eb; text-decoration: none; font-weight: 500;">${email}</a></td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-weight: 600; color: #475569; font-size: 14px;">Subject:</td>
                                <td style="padding: 8px 0; color: #0f172a; font-size: 14px; font-weight: 500;">${subject}</td>
                            </tr>
                        </table>
                        <div style="margin-top: 24px; padding: 20px; background-color: #ffffff; border-left: 4px solid #2563eb; border-radius: 8px; box-shadow: inset 0 1px 2px rgba(0,0,0,0.02);">
                            <p style="margin: 0 0 10px 0; font-weight: 600; color: #475569; font-size: 14px;">Message Details:</p>
                            <p style="margin: 0; line-height: 1.6; color: #334155; font-size: 14px; white-space: pre-wrap;">${message}</p>
                        </div>
                        <footer style="margin-top: 32px; font-size: 12px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 16px;">
                            Sent from the custom contact engine at <a href="https://opsihab.tech" style="color: #2563eb; text-decoration: none;">opsihab.tech</a>.
                        </footer>
                    </div>
                `
            })
        });

        const data = await response.json();

        if (response.ok) {
            return res.status(200).json({ success: true, data });
        } else {
            return res.status(response.status).json({ error: data.message || 'Failed to send email via Resend.' });
        }
    } catch (err) {
        console.error('Error sending email:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
