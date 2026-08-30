// Utility helper to load and trigger Razorpay Checkout popup (supports QR, Cards, UPI, GPay, PhonePe, Paytm)

export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const launchRazorpayCheckout = async ({
  orderData,
  user,
  booking,
  onSuccess,
  onError,
  onDismiss,
}) => {
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded || !window.Razorpay) {
    onError?.(new Error("Failed to load Razorpay Payment Gateway. Check internet connection."));
    return;
  }

  const options = {
    key: orderData.key,
    amount: orderData.amount,
    currency: orderData.currency || "INR",
    name: "GoDrive Self Drive",
    description: `Token Advance for ${booking?.vehicleName || "Self Drive Vehicle"}`,
    image: "https://cdn-icons-png.flaticon.com/512/3202/3202926.png",
    order_id: orderData.orderId,
    prefill: {
      name: user?.name || booking?.customerName || "",
      email: user?.email || booking?.customerEmail || "",
      contact: user?.mobile || booking?.customerMobile || "",
    },
    notes: {
      bookingId: booking?._id || "",
      vehicle: booking?.vehicleName || "",
      serviceType: booking?.serviceType || "Self Drive",
    },
    theme: {
      color: "#0f172a", // Primary Navy / Gold accent
      backdrop_color: "rgba(15, 23, 42, 0.8)",
    },
    modal: {
      confirm_close: true,
      ondismiss: () => {
        onDismiss?.();
      },
    },
    handler: async function (response) {
      // response contains: razorpay_payment_id, razorpay_order_id, razorpay_signature
      try {
        await onSuccess?.(response);
      } catch (err) {
        onError?.(err);
      }
    },
  };

  const rzp = new window.Razorpay(options);

  rzp.on("payment.failed", function (response) {
    onError?.(new Error(response.error?.description || "Payment failed or was cancelled"));
  });

  rzp.open();
};
