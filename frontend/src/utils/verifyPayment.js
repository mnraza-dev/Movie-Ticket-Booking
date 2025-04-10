import axios from "axios";
const verifyPayment = async (response, bookingId) => {
  try {
    if (
      !razorpayPaymentId ||
      !razorpayOrderId ||
      !razorpaySignature ||
      !bookingId
    ) {
      return res.status(400).json({ message: "Missing payment details" });
    }

    const verificationData = {
      razorpayPaymentId: response.razorpay_payment_id,
      razorpayOrderId: response.razorpay_order_id,
      razorpaySignature: response.razorpay_signature,
      bookingId: bookingId,
    };
    console.log("Sending verification data:", verificationData);
    const res = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/book/verify-payment`,
      verificationData,
      { withCredentials: true }
    );

    if (res.data.success) {
      return { success: true };
    } else {
      return { success: false, message: res.data.message };
    }
  } catch (error) {
    console.error("❌ Error during payment verification:", error);
    return { success: false, message: "Payment verification failed" };
  }
};
export default verifyPayment;
