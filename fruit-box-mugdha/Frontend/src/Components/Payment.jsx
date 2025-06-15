import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import PropTypes from "prop-types";
import api from "../api/config";
import "./Payment.css";

const PaymentForm = ({ amount, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);
    setError(null);

    if (!stripe || !elements) {
      return;
    }

    try {
      // Create payment intent
      const {
        data: { clientSecret },
      } = await api.post("/create-payment-intent", {
        amount,
        currency: "inr",
      });

      // Confirm card payment
      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        });

      if (stripeError) {
        setError(stripeError.message);
        await api.post("/payment-failure", {
          paymentIntentId: paymentIntent?.id,
        });
        onError(stripeError.message);
      } else {
        await api.post("/payment-success", {
          paymentIntentId: paymentIntent.id,
        });
        onSuccess(paymentIntent);
      }
    } catch (err) {
      setError(err.message || "An error occurred during payment processing");
      onError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="card-element-container">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#9e2146",
              },
            },
          }}
        />
      </div>
      {error && <div className="error-message">{error}</div>}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="pay-button"
      >
        {processing ? "Processing..." : `Pay ₹${amount}`}
      </button>
    </form>
  );
};

PaymentForm.propTypes = {
  amount: PropTypes.number.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
};

const Payment = ({ amount, onSuccess, onError }) => {
  return (
    <div className="payment-container">
      <h2>Payment Details</h2>
      <div className="payment-info">
        <p>Amount to pay: ₹{amount}</p>
        <p>Payment method: Credit/Debit Card</p>
      </div>
      <PaymentForm amount={amount} onSuccess={onSuccess} onError={onError} />
    </div>
  );
};

Payment.propTypes = {
  amount: PropTypes.number.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
};

export default Payment;
