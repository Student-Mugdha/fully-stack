import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PropTypes from "prop-types";
import Payment from "./Payment";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentWrapper = ({ amount, onSuccess, onError }) => {
  return (
    <Elements stripe={stripePromise}>
      <Payment amount={amount} onSuccess={onSuccess} onError={onError} />
    </Elements>
  );
};

PaymentWrapper.propTypes = {
  amount: PropTypes.number.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
};

export default PaymentWrapper;
