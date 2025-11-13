import { NextRequest, NextResponse } from 'next/server';
import sendEmail from '@/lib/sendEmail';
import { format } from "date-fns";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { passengerInfo, bookingDetails } = body;

  const commonStyles = `
    font-family: Arial, sans-serif;
    line-height: 1.6;
    color: #333;
  `;

  const headerStyle = `
    background-color: #1f2937; 
    color: white;
    padding: 20px;
    text-align: center;
  `;

  const contentStyle = `
    background-color: #f9f9f9;
    padding: 20px;
  `;

  const buttonStyle = `
    display: inline-block;
    padding: 10px 20px;
    margin: 10px 5px;
    color: white;
    text-decoration: none;
    border-radius: 5px;
    font-weight: bold;
  `;

  // Function to conditionally display fields
  const renderField = (label: string, value: string | number | string[] | undefined, condition = true) => {
    if (!value || !condition) return ''; 
  
    if (Array.isArray(value)) {
      return value.length > 0
        ? `<p><b>${label}:</b><br> ${value.map(stop => `- ${stop}`).join('<br>')}</p>`
        : '';
    }
  
    // Format Date...
    if (label.toLowerCase().includes('date')) {
      const parsedDate = new Date(value);
      if (!isNaN(parsedDate.getTime())) {
        const formattedDate = format(parsedDate, 'PPP');
        return `<p><b>${label}:</b> ${formattedDate}</p>`;
      }
    }

      // Format prices...
      if (label.toLowerCase().includes('price')) {
        const actualPrice = parseFloat(value as string) / 100; // Divide by 100
        const formattedPrice = `€${actualPrice.toFixed(0)}`;
        return `<p><b>${label}:</b> ${formattedPrice}</p>`;
      }
  
    return `<p><b>${label}:</b> ${value}</p>`;
  };
  

  try {
    // Admin Email...
    const adminEmailContent = `
      <div style="${commonStyles}">
        <div style="${headerStyle}">
          <h2>New Booking Received</h2>
        </div>
        <div style="${contentStyle}">
          <h3>Passenger Information</h3>
          ${renderField('Name', passengerInfo.name)}
          ${renderField('Email', passengerInfo.email)}
          ${renderField('Phone', passengerInfo.phone)}

          <h3>Booking Details</h3>
          ${renderField('Pickup Address', bookingDetails.pickUpAddress)}
          ${renderField('Drop-off Address', bookingDetails.dropOffAddress)}
          ${renderField('Date', bookingDetails.date)}
          ${renderField('Time', bookingDetails.time)}
          ${renderField('Booking Type', bookingDetails.bookingType)}
          ${renderField('Vehicle', bookingDetails.vehicleTitle)}
          ${renderField('Category', bookingDetails.category)}
          ${renderField('Passengers', bookingDetails.passengerCount)}
          ${renderField('Children', bookingDetails.childCount)}
          ${renderField('Bags', bookingDetails.bagCount)}
          ${renderField('Additional Notes', bookingDetails.textarea)}
          ${renderField('Stops', bookingDetails.stops)}
          ${renderField('Hourly Charter', bookingDetails.hourly, bookingDetails.bookingType === 'Hourly')}
          ${renderField('Distance', parseFloat(bookingDetails.distance).toFixed(0))} 
          ${renderField('Booking Price €', bookingDetails.price)}

          <div style="margin-top: 20px;">
            <a href="https://chauffeurio.com/api/booking/action?status=accept&email=${passengerInfo.email}" 
              style="${buttonStyle} background-color: #2ecc71;">Accept</a>
            <a href="https://chauffeurio.com/api/booking/action?status=decline&email=${passengerInfo.email}" 
              style="${buttonStyle} background-color: #e74c3c;">Decline</a>
          </div>
        </div>
      </div>
    `;

    // Send email to User...
    await sendEmail({
      to: "info@oktaxis.co.uk",
      subject: 'New Booking Confirmation',
      html: adminEmailContent,
    });

    const userEmailContent = `
      <div style="${commonStyles}">
        <div style="${headerStyle}">
          <h2>Welcome to OkaTaxis</h2>
        </div>
        <div style="${contentStyle}">
          <h3>Thank you for your booking, ${passengerInfo.name}</h3>
          <p>Here are your booking details:</p>

          <h4>Booking Details</h4>
          ${renderField('Pickup Address', bookingDetails.pickUpAddress)}
          ${renderField('Drop-off Address', bookingDetails.dropOffAddress)}
          ${renderField('Date', bookingDetails.date)}
          ${renderField('Time', bookingDetails.time)}
          ${renderField('Booking Type', bookingDetails.bookingType)}
          ${renderField('Vehicle', bookingDetails.vehicleTitle)}
          ${renderField('Category', bookingDetails.category)}
          ${renderField('Passengers', bookingDetails.passengerCount)}
          ${renderField('Bags', bookingDetails.bagCount)}
          ${renderField('Children', bookingDetails.childCount)}
          ${renderField('Additional Notes', bookingDetails.textarea)}
          ${renderField('Stops', bookingDetails.stops)}
          ${renderField('Hourly Charter', bookingDetails.hourly, bookingDetails.bookingType === 'Hourly')}
          ${renderField('Distance', parseFloat(bookingDetails.distance).toFixed(0))} 
          ${renderField('Booking Price €', bookingDetails.price)}

          <p style="margin-top: 20px;">If you have any questions, feel free to contact us.</p>
          <p>Best regards,<br>The OkaTaxis Team</p>
        </div>
      </div>
    `;

    // Send email to user
    await sendEmail({
      to: passengerInfo.email,
      subject: 'Booking Confirmation',
      html: userEmailContent,
    });

    return NextResponse.json({ message: 'Emails sent successfully' });
  } catch (error) {
    console.error('Failed to send emails:', error);
    return NextResponse.json({ message: 'Failed to send emails' }, { status: 500 });
  }
}

