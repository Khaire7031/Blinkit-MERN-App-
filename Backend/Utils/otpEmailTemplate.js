const otpEmailTemplate = ({ username, otp }) => {
    return `
        <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center; background-color: #f9f9f9;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
                <h2 style="color: #333;">Pranav Ecommerce Shop</h2>
                <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 20px 0;">
                <p style="font-size: 18px; color: #333;">Hi ${username},</p>
                <p style="font-size: 16px; color: #555;">You requested to reset your password. Please use the OTP below to proceed:</p>
                
                <div style="margin: 30px 0;">
                    <span style="
                        display: inline-block;
                        font-size: 24px;
                        font-weight: bold;
                        color: #ff6600;
                        background-color: #fce4d6;
                        padding: 15px 25px;
                        border-radius: 8px;
                        letter-spacing: 4px;
                    ">${otp}</span>
                </div>
                
                <p style="font-size: 16px; color: #555;">This OTP is valid for 1 hour. Please do not share it with anyone for security purposes.</p>

                <hr style="border: none; border-top: 2px solid #f0f0f0; margin: 20px 0;">
                <p style="font-size: 14px; color: #777;">If you did not request this, please ignore this email or contact our support team immediately.</p>
                <p style="font-size: 14px; color: #777;">Thank you,<br>Pranav Ecommerce Shop</p>
            </div>
        </div>
    `;
};

export default otpEmailTemplate;
