export const loadRazorpay = () => {
  return new Promise((resolve) => {
    // Check if Razorpay is already loaded
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    // Create script element to load Razorpay
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error("Razorpay SDK failed to load");
      resolve(false);
    };

    document.body.appendChild(script);
  });
};
