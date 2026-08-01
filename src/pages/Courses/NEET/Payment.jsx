// src/pages/Courses/NEET/Payment.jsx
import PaymentOptionsPage from "../shared/PaymentOptionsPage";
import { NEET_TREE } from "./data";

export default function Payment() {
  return <PaymentOptionsPage category={NEET_TREE} />;
}
