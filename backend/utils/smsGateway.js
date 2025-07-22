import axios from 'axios';

export async function sendOTP(phone, otp) {
  const encodedMessage = encodeURIComponent(`Here is your OTP ${otp}`);
  const apiKey = 'KoMf8uiDCUIkex5VqLgsldzw1Ym2vGQ0ETA9HBnZS7OayhWPctfnrG82utshxzaoeJ9TgKHF40L1pBWP';

  const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${apiKey}&route=q&message=${encodedMessage}&flash=0&numbers=${encodeURIComponent(phone)}&schedule_time=`;

  try {
    const response = await axios.get(url);
    if (response.data.return) {
      console.log(`✅ OTP ${otp} sent to ${phone}`);
    } else {
      console.error('❌ Failed to send OTP:', response.data);
    }
  } catch (error) {
    console.error('🚨 Error sending OTP:', error.response?.data || error.message);
  }
}
