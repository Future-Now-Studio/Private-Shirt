export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email, content } = body

    if (!email || !content) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email and content are required',
      })
    }

    // Dynamic import for nodemailer
    const nodemailer = await import('nodemailer')
    
    // Create transporter (you'll need to configure this with your email service)
    const transporter = nodemailer.default.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER, // your email
        pass: process.env.SMTP_PASS, // your email password or app password
      },
    })

    // Email options
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: content.subject || 'Dein Design - Private Shirt',
      html: content.html,
    }

    // Send email
    const info = await transporter.sendMail(mailOptions)
    
    console.log('Email sent successfully:', info.messageId)
    
    return {
      success: true,
      messageId: info.messageId,
      message: 'Email sent successfully'
    }

  } catch (error) {
    console.error('Error sending email:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to send email',
    })
  }
})
