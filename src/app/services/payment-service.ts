export const paymentService = {
  async uploadReceipt() {
    await new Promise((resolve) =>
      setTimeout(resolve, 1200)
    );

    return {
      success: true,
    };
  },

  async verifyPayment() {
    await new Promise((resolve) =>
      setTimeout(resolve, 1500)
    );

    return {
      verified: true,
    };
  },
};