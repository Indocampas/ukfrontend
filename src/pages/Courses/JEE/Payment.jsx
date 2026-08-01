// src/pages/Courses/JEE/Payment.jsx
import PaymentOptionsPage from "../shared/PaymentOptionsPage";
import { JEE_TREE } from "./data";

export default function Payment() {
  return <PaymentOptionsPage category={JEE_TREE} />;
}
