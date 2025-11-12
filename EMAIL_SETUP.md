# Email Setup Instructions

To enable email functionality, you need to configure SMTP settings in your environment variables.

## 1. Create a `.env` file in the project root with the following variables:

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com
```

## 2. Gmail Setup (Recommended)

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
   - Use this password in `SMTP_PASS`

## 3. Alternative Email Providers

### Outlook/Hotmail:
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
```

### Yahoo:
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
```

### Custom SMTP Server:
```env
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
```

## 4. Test the Configuration

After setting up the environment variables, restart your development server and try sending an email through the design creator.

## 5. Production Considerations

For production, consider using:
- SendGrid
- Mailgun
- Amazon SES
- Or other professional email services

These services provide better deliverability and monitoring than basic SMTP.

