# 🌌 Stellar Portfolio Email Template

This template matches your portfolio's dark galaxy theme with red accents!

---

## Quick Setup in EmailJS

### 1. Template Settings

**Template Name:**
```
Stellar Portfolio Contact
```

**Subject:**
```
🚀 New Portfolio Contact: {{subject}}
```

**From Name:**
```
{{from_name}}
```

**From Email:**
```
{{from_email}}
```

**To Email:**
```
Rhenmart978@gmail.com
```

**Reply To:**
```
{{from_email}}
```

---

### 2. Message Content (HTML Mode)

Switch to HTML editor and paste this complete template:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    @media only screen and (max-width: 600px) {
      .main-table { width: 100% !important; }
      .content-padding { padding: 24px 16px !important; }
      .header-padding { padding: 32px 20px !important; }
      .title { font-size: 24px !important; }
      .subtitle { font-size: 13px !important; }
      .button { padding: 14px 28px !important; font-size: 13px !important; }
      .info-card { padding: 20px 16px !important; }
      .label { font-size: 9px !important; }
      .value { font-size: 16px !important; }
      .message-box { padding: 20px 16px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #050505;">
  
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #050505; padding: 20px 10px;">
    <tr>
      <td align="center">
        
        <!-- Main Card -->
        <table class="main-table" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background: linear-gradient(135deg, #0d0d0d 0%, #050505 100%); border: 1px solid rgba(255, 0, 0, 0.3); border-radius: 20px; overflow: hidden; box-shadow: 0 0 60px rgba(255, 0, 0, 0.2), 0 20px 40px rgba(0, 0, 0, 0.5);">
          
          <!-- Animated Header -->
          <tr>
            <td class="header-padding" style="background: linear-gradient(135deg, #FF0000 0%, #cc0000 100%); padding: 36px 24px; text-align: center; position: relative; overflow: hidden;">
              
              <!-- Floating particles effect (static representation) -->
              <div style="position: absolute; top: 10px; left: 20px; width: 4px; height: 4px; background: rgba(255,255,255,0.4); border-radius: 50%;"></div>
              <div style="position: absolute; top: 30px; right: 40px; width: 3px; height: 3px; background: rgba(255,255,255,0.3); border-radius: 50%;"></div>
              <div style="position: absolute; bottom: 20px; left: 60px; width: 2px; height: 2px; background: rgba(255,255,255,0.5); border-radius: 50%;"></div>
              
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <!-- Badge -->
                    <table cellpadding="0" cellspacing="0" style="margin: 0 auto 14px auto;">
                      <tr>
                        <td style="background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); border-radius: 50px; padding: 6px 14px;">
                          <table cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="padding-right: 6px;">
                                <span style="display: inline-block; width: 7px; height: 7px; background: #fff; border-radius: 50%; box-shadow: 0 0 8px rgba(255,255,255,0.8);"></span>
                              </td>
                              <td>
                                <span style="color: #fff; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px;">New Message</span>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Title -->
                    <h1 class="title" style="margin: 0; font-size: 28px; font-weight: 900; color: #ffffff; letter-spacing: -0.5px; text-shadow: 0 2px 20px rgba(0,0,0,0.3); line-height: 1.2;">
                      ✨ Portfolio Contact
                    </h1>
                    <p class="subtitle" style="margin: 10px 0 0 0; font-size: 13px; color: rgba(255, 255, 255, 0.85); font-weight: 500; line-height: 1.4;">
                      Someone wants to connect with you!
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Content Section -->
          <tr>
            <td class="content-padding" style="padding: 32px 24px; position: relative;">
              
              <!-- Sender Info Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 14px; margin-bottom: 20px; overflow: hidden;">
                <tr>
                  <td class="info-card" style="padding: 20px; position: relative;">
                    
                    <!-- Red accent line -->
                    <div style="position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: linear-gradient(180deg, #FF0000, #FF4444); border-radius: 0 2px 2px 0;"></div>
                    
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <!-- From Name -->
                      <tr>
                        <td style="padding-bottom: 14px; padding-left: 8px;">
                          <span class="label" style="display: block; font-size: 9px; font-weight: 700; color: rgba(255, 255, 255, 0.4); text-transform: uppercase; letter-spacing: 1.2px; margin-bottom: 5px;">From</span>
                          <span class="value" style="display: block; font-size: 18px; font-weight: 700; color: #ffffff; letter-spacing: -0.3px; word-break: break-word;">{{from_name}}</span>
                        </td>
                      </tr>
                      
                      <!-- Email -->
                      <tr>
                        <td style="padding-bottom: 14px; padding-left: 8px;">
                          <span class="label" style="display: block; font-size: 9px; font-weight: 700; color: rgba(255, 255, 255, 0.4); text-transform: uppercase; letter-spacing: 1.2px; margin-bottom: 5px;">Email</span>
                          <a href="mailto:{{from_email}}" style="display: inline-block; font-size: 14px; color: #FF0000; text-decoration: none; font-weight: 600; padding: 6px 12px; background: rgba(255, 0, 0, 0.1); border-radius: 6px; border: 1px solid rgba(255, 0, 0, 0.2); word-break: break-all;">
                            {{from_email}}
                          </a>
                        </td>
                      </tr>
                      
                      <!-- Subject -->
                      <tr>
                        <td style="padding-left: 8px;">
                          <span class="label" style="display: block; font-size: 9px; font-weight: 700; color: rgba(255, 255, 255, 0.4); text-transform: uppercase; letter-spacing: 1.2px; margin-bottom: 5px;">Subject</span>
                          <span class="value" style="display: block; font-size: 15px; color: rgba(255, 255, 255, 0.9); font-weight: 600; line-height: 1.4; word-break: break-word;">{{subject}}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- Message Content -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <tr>
                  <td>
                    <span class="label" style="display: block; font-size: 9px; font-weight: 700; color: rgba(255, 255, 255, 0.4); text-transform: uppercase; letter-spacing: 1.2px; margin-bottom: 10px;">Message</span>
                    
                    <table width="100%" cellpadding="0" cellspacing="0" style="background: rgba(255, 255, 255, 0.03); border-left: 3px solid #FF0000; border-radius: 10px; overflow: hidden;">
                      <tr>
                        <td class="message-box" style="padding: 20px; position: relative;">
                          <!-- Subtle glow effect -->
                          <div style="position: absolute; top: 0; left: 0; width: 100%; height: 2px; background: linear-gradient(90deg, #FF0000, transparent);"></div>
                          
                          <p style="margin: 0; font-size: 14px; line-height: 1.7; color: rgba(255, 255, 255, 0.85); white-space: pre-wrap; font-weight: 400; word-break: break-word;">{{message}}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-top: 8px;">
                    <a href="mailto:{{from_email}}" class="button" style="display: inline-block; background: linear-gradient(135deg, #FF0000 0%, #cc0000 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 50px; font-size: 14px; font-weight: 700; box-shadow: 0 4px 20px rgba(255, 0, 0, 0.4), 0 0 40px rgba(255, 0, 0, 0.2); letter-spacing: 0.3px; text-transform: uppercase;">
                      Reply to {{from_name}} →
                    </a>
                  </td>
                </tr>
              </table>
              
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background: rgba(255, 255, 255, 0.02); padding: 20px 24px; text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.05);">
              <p style="margin: 0 0 6px 0; font-size: 12px; color: rgba(255, 255, 255, 0.4); font-weight: 500; line-height: 1.4;">
                Sent from your stellar portfolio
              </p>
              <p style="margin: 0; font-size: 10px; color: rgba(255, 255, 255, 0.25); font-weight: 400; line-height: 1.4;">
                Powered by EmailJS • Rhenmart Dela Cruz
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

## Design Features

This template includes:

✨ **Dark Galaxy Theme** - Matches your #050505 background  
🔴 **Red Accent Colors** - Uses your #FF0000 brand color  
💫 **Floating Particles** - Subtle stellar effects  
🎨 **Gradient Borders** - Modern glassmorphism style  
📱 **Mobile Responsive** - Looks great on all devices  
⚡ **Professional Layout** - Clean, organized information  
🌟 **Glowing Effects** - Subtle shadows and highlights  

---

## Variables Used

Make sure these match your Contact.tsx form fields:
- `{{from_name}}` - Sender's name
- `{{from_email}}` - Sender's email
- `{{subject}}` - Message subject
- `{{message}}` - Message content

---

## Testing

After setup:
1. Submit your contact form
2. Check Rhenmart978@gmail.com inbox
3. You should see a beautiful dark-themed email!

---

## Customization

Want to tweak it? Change these values:
- `#FF0000` - Your primary red color
- `#050505` - Background color
- Font sizes and spacing as needed
- Add your logo URL in the header

---

Perfect match for your stellar portfolio design! 🚀
