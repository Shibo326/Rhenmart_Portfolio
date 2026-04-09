# EmailJS Template Setup Guide

## Quick Setup Steps

1. Go to [EmailJS Dashboard](https://dashboard.emailjs.com/admin)
2. Click **Email Templates** → **Create New Template**
3. Copy the template below and paste it into the EmailJS editor
4. Save and copy your Template ID

---

## Template Configuration

### Template Name
```
Portfolio Contact Form
```

### Template Variables (Auto-detected)
- `{{from_name}}` - Sender's name
- `{{from_email}}` - Sender's email
- `{{subject}}` - Message subject
- `{{message}}` - Message content

---

## Basic Template (Plain Text)

Use this if you want a simple, clean email:

### Subject Line:
```
New Contact: {{subject}}
```

### Email Body:
```
You have a new message from your portfolio website!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FROM: {{from_name}}
EMAIL: {{from_email}}
SUBJECT: {{subject}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MESSAGE:

{{message}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Reply directly to this email to respond to {{from_name}}.
```

---

## Professional HTML Template (Recommended)

Use this for a polished, branded look:

### Subject Line:
```
🚀 New Portfolio Contact: {{subject}}
```

### Email Body (HTML):
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Message</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0a; color: #ffffff;">
  
  <!-- Main Container -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
    <tr>
      <td align="center">
        
        <!-- Email Card -->
        <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%); border: 1px solid rgba(255, 0, 0, 0.2); border-radius: 16px; overflow: hidden; box-shadow: 0 8px 32px rgba(255, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #FF0000 0%, #cc0000 100%); padding: 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">
                ✨ New Contact Message
              </h1>
              <p style="margin: 8px 0 0 0; font-size: 14px; color: rgba(255, 255, 255, 0.9);">
                From your portfolio website
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              
              <!-- Sender Info Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-bottom: 12px;">
                          <span style="display: inline-block; font-size: 11px; font-weight: 600; color: rgba(255, 255, 255, 0.5); text-transform: uppercase; letter-spacing: 1px;">From</span>
                          <p style="margin: 4px 0 0 0; font-size: 18px; font-weight: 600; color: #ffffff;">
                            {{from_name}}
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 12px;">
                          <span style="display: inline-block; font-size: 11px; font-weight: 600; color: rgba(255, 255, 255, 0.5); text-transform: uppercase; letter-spacing: 1px;">Email</span>
                          <p style="margin: 4px 0 0 0; font-size: 16px; color: #FF0000;">
                            <a href="mailto:{{from_email}}" style="color: #FF0000; text-decoration: none;">{{from_email}}</a>
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <span style="display: inline-block; font-size: 11px; font-weight: 600; color: rgba(255, 255, 255, 0.5); text-transform: uppercase; letter-spacing: 1px;">Subject</span>
                          <p style="margin: 4px 0 0 0; font-size: 16px; color: rgba(255, 255, 255, 0.9);">
                            {{subject}}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- Message Content -->
              <div style="margin-bottom: 24px;">
                <span style="display: inline-block; font-size: 11px; font-weight: 600; color: rgba(255, 255, 255, 0.5); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">Message</span>
                <div style="background-color: rgba(255, 255, 255, 0.03); border-left: 3px solid #FF0000; border-radius: 8px; padding: 20px; margin-top: 12px;">
                  <p style="margin: 0; font-size: 15px; line-height: 1.7; color: rgba(255, 255, 255, 0.85); white-space: pre-wrap;">{{message}}</p>
                </div>
              </div>
              
              <!-- Action Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-top: 12px;">
                    <a href="mailto:{{from_email}}" style="display: inline-block; background: linear-gradient(135deg, #FF0000 0%, #cc0000 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 50px; font-size: 15px; font-weight: 600; box-shadow: 0 4px 16px rgba(255, 0, 0, 0.3);">
                      Reply to {{from_name}}
                    </a>
                  </td>
                </tr>
              </table>
              
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: rgba(255, 255, 255, 0.02); padding: 24px 30px; text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.05);">
              <p style="margin: 0; font-size: 13px; color: rgba(255, 255, 255, 0.4);">
                Sent from your portfolio contact form
              </p>
              <p style="margin: 8px 0 0 0; font-size: 12px; color: rgba(255, 255, 255, 0.3);">
                Powered by EmailJS
              </p>
            </td>
          </tr>
          
        </table>
        
      </td>
    </tr>
  </table>
  
</body>
</html>
```

---

## Auto-Reply Template (Optional)

Create a second template to automatically thank people who contact you:

### Template Name:
```
Portfolio Contact - Auto Reply
```

### Subject Line:
```
Thanks for reaching out! 🚀
```

### Email Body:
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0a0a0a;">
  
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
    <tr>
      <td align="center">
        
        <table width="600" cellpadding="0" cellspacing="0" style="background: #1a1a1a; border: 1px solid rgba(255, 0, 0, 0.2); border-radius: 16px; overflow: hidden;">
          
          <tr>
            <td style="background: linear-gradient(135deg, #FF0000 0%, #cc0000 100%); padding: 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; color: #ffffff;">
                Thanks for reaching out! 👋
              </h1>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 16px 0; font-size: 16px; color: rgba(255, 255, 255, 0.9); line-height: 1.6;">
                Hi <strong>{{from_name}}</strong>,
              </p>
              <p style="margin: 0 0 16px 0; font-size: 16px; color: rgba(255, 255, 255, 0.9); line-height: 1.6;">
                Thanks for contacting me through my portfolio! I've received your message about <strong>"{{subject}}"</strong> and I'll get back to you as soon as possible.
              </p>
              <p style="margin: 0 0 16px 0; font-size: 16px; color: rgba(255, 255, 255, 0.9); line-height: 1.6;">
                I typically respond within 24-48 hours. In the meantime, feel free to check out my other projects or connect with me on social media.
              </p>
              <p style="margin: 24px 0 0 0; font-size: 16px; color: rgba(255, 255, 255, 0.9);">
                Best regards,<br>
                <strong style="color: #FF0000;">Rhenmart</strong>
              </p>
            </td>
          </tr>
          
          <tr>
            <td style="background-color: rgba(255, 255, 255, 0.02); padding: 20px; text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.05);">
              <p style="margin: 0; font-size: 12px; color: rgba(255, 255, 255, 0.4);">
                This is an automated response. Please do not reply to this email.
              </p>
            </td>
          </tr>
          
        </table>
        
      </td>
    </tr>
  </table>
  
</body>
</html>
```

---

## Setup Instructions

### For Main Template (You receive):
1. Go to EmailJS → Email Templates → Create New Template
2. Name it "Portfolio Contact Form"
3. Paste the HTML template above
4. Set "To Email" to: `Rhenmart978@gmail.com`
5. Save and copy the Template ID

### For Auto-Reply (Sender receives):
1. Create another template
2. Name it "Portfolio Contact - Auto Reply"
3. Paste the auto-reply HTML
4. Set "To Email" to: `{{from_email}}`
5. Save the Template ID

### Update Contact.tsx
Replace the template ID in your code with the one you just created.

---

## Testing

After setup, test by:
1. Submitting your contact form
2. Check your Gmail inbox for the styled email
3. The sender should receive the auto-reply (if configured)

---

## Customization Tips

- Change `#FF0000` to match your brand color
- Update "Rhenmart" in the auto-reply to your name
- Add your social media links in the footer
- Modify the greeting message to fit your style

---

Need help? The template variables must match your form field names:
- `from_name` → matches `name="from_name"` in Contact.tsx
- `from_email` → matches `name="from_email"` in Contact.tsx
- `subject` → matches `name="subject"` in Contact.tsx
- `message` → matches `name="message"` in Contact.tsx
