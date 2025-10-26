# Email Configuration for OkTaxis

This document explains how to set up and configure the email functionality used in contact and driver registration forms.

## Setup Instructions

1. Create a `.env.local` file in the root of the project with the following content:

```
# Email Configuration
EMAIL_HOST=smtp.hostinger.com
EMAIL_PORT=587
EMAIL_USER=info@oktaxis.co.uk
EMAIL_PASSWORD=your_password_here
```

2. Replace `your_password_here` with the actual email password.

3. For production deployment, make sure to set these environment variables in your hosting provider's configuration panel.

## Email Service Details

- **Service Provider**: Hostinger Email Service
- **Email Address**: info@oktaxis.co.uk
- **SMTP Server**: smtp.hostinger.com
- **Port**: 587 (TLS)

## Security Notes

- Never commit the `.env.local` file or any file containing the email password to version control
- The `.gitignore` file should already include `.env*` patterns to prevent accidental commits
- In production, use the hosting provider's secure environment variable storage

## Troubleshooting

If emails are not being sent:

1. Check that all environment variables are set correctly
2. Verify that the email account credentials are valid
3. Check the server logs for any error messages related to email sending
4. Make sure your hosting provider allows outgoing SMTP connections
5. For Hostinger specifically, ensure that the email account is properly set up and active

## Additional Configuration

The email functionality is implemented using:

- `nodemailer` for sending emails
- HTML templates for formatting the email content
- Sanitization to prevent XSS attacks

All email code can be found in:

- `lib/sendEmail.ts` - Main email sending functionality
- `lib/utils.ts` - Utility functions for email validation and sanitization
- `app/api/contactEmail/route.ts` - Contact form API endpoint
- `app/api/registerDriver/route.ts` - Driver registration API endpoint
