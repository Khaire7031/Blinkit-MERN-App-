const verifyEmailTemplate = ({ name, url }) => {
    return `
        <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center; background-color: #f7f7f7;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
                <p style="font-size: 18px; color: #333;">Dear ${name},</p>
                <p style="font-size: 16px; color: #555;">Thank you for registering with Pranav Ecommerce Shop! We're excited to have you onboard.</p>
                
                <p style="font-size: 16px; color: #555;">Please click the button below to verify your email address:</p>

                <a href="${url}" style="
                    background-color: #ff6600;
                    color: white;
                    padding: 15px 25px;
                    font-size: 18px;
                    text-decoration: none;
                    border-radius: 5px;
                    display: inline-block;
                    margin-top: 20px;
                    transition: background-color 0.3s ease;
                ">Verify Email</a>

                <p style="font-size: 14px; color: #777; margin-top: 20px;">If you did not create an account with us, please ignore this email.</p>
            </div>
        </div>
    `;
};

export default verifyEmailTemplate;
