import sgMail from '@sendgrid/mail';
import { Product } from '@shared/schema';

// SendGrid API 키 설정
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

interface EmailOptions {
  to: string;
  from: string;
  subject: string;
  html: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn('SENDGRID_API_KEY not configured, email not sent');
    return false;
  }

  try {
    await sgMail.send(options);
    console.log('Email sent successfully to:', options.to);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

export async function sendLowStockAlert(products: Product[], adminEmail: string): Promise<boolean> {
  if (products.length === 0) return true;

  const productList = products.map(product => 
    `<li><strong>${product.name}</strong> - Current Stock: ${product.stockQuantity || 0} (Threshold: ${product.lowStockThreshold || 5})</li>`
  ).join('');

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #d63384;">🚨 Low Stock Alert - Healside Store</h2>
      
      <p>The following products are running low on stock and need to be restocked:</p>
      
      <ul style="background-color: #f8f9fa; padding: 20px; border-left: 4px solid #d63384;">
        ${productList}
      </ul>
      
      <p>Please restock these items as soon as possible to avoid customer disappointment.</p>
      
      <hr style="margin: 30px 0;">
      
      <p style="color: #6c757d; font-size: 14px;">
        This is an automated message from your Healside inventory management system.
        <br>
        You can manage your inventory in the <a href="${process.env.FRONTEND_URL || 'https://healside.replit.app'}/admin">admin dashboard</a>.
      </p>
    </div>
  `;

  return await sendEmail({
    to: adminEmail,
    from: process.env.ADMIN_EMAIL || 'noreply@healside.com',
    subject: `🚨 Low Stock Alert - ${products.length} Product${products.length > 1 ? 's' : ''} Need Restocking`,
    html
  });
}

export async function sendOrderConfirmation(orderDetails: any, customerEmail: string): Promise<boolean> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #28a745;">✅ Order Confirmation - Healside</h2>
      
      <p>Thank you for your order! Here are your order details:</p>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Order #${orderDetails.id}</h3>
        <p><strong>Total:</strong> $${orderDetails.total}</p>
        <p><strong>Status:</strong> ${orderDetails.status}</p>
      </div>
      
      <p>Your order is being processed and you'll receive another email when it ships.</p>
      
      <hr style="margin: 30px 0;">
      
      <p style="color: #6c757d; font-size: 14px;">
        Thank you for choosing Healside for your wellness journey!
      </p>
    </div>
  `;

  return await sendEmail({
    to: customerEmail,
    from: process.env.ADMIN_EMAIL || 'orders@healside.com',
    subject: `Order Confirmation #${orderDetails.id} - Healside`,
    html
  });
}