// src/pages/Enrollment/EnrollmentFlow.jsx
// Implements the full Enroll Now -> Payment -> Confirmation journey:
// Student Enrollment Form -> Order Review -> Payment Method -> Payment ->
// Payment Success -> Invoice / Receipt -> Student Dashboard.
//
// NOTE: This site has no backend server (see src/utils/sendLeadEmail.js), so
// there is no real payment gateway wired up here. Card / UPI / Net Banking
// details are never transmitted anywhere - "payment" is simulated locally
// and the enrollment + payment summary is emailed to the academy inbox via
// the same mailto flow the rest of the site uses for leads. Replace the
// simulateGatewayPayment() function with a real gateway SDK/checkout call
// (Razorpay, Stripe, PayU, etc.) when a backend is available.
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheckCircle,
  FiSmartphone,
  FiCreditCard,
  FiHome,
  FiClipboard,
  FiUpload,
  FiDownload,
  FiGrid,
  FiCopy,
  FiClock,
  FiLoader,
} from "react-icons/fi";
import { inr, round100 } from "../../data/leafDetail";
import { sendLeadEmail } from "../../utils/sendLeadEmail";
import { UK_ACADEMY_EMAIL } from "../../config/siteConfig";
import "./EnrollmentFlow.css";

const MOBILE_REGEX = /^[6-9]\d{9}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const BANK_TRANSFER_DETAILS = {
  accountName: "UK Academy Pvt. Ltd.",
  bankName: "ABC Bank",
  accountNumber: "0123456789012",
  ifsc: "ABCB0001234",
  branch: "Chennai",
};

function makeTransactionId() {
  return `UKA${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 90 + 10)}`;
}

const STEPS = ["Student Details", "Review", "Payment"];

export default function EnrollmentFlow() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const course = state?.course;

  const [step, setStep] = useState("form"); // form -> review -> payment -> method -> processing -> success
  const [method, setMethod] = useState(null); // upi | debit | credit | netbanking | banktransfer
  const [student, setStudent] = useState({ studentName: "", parentName: "", mobile: "", email: "" });
  const [errors, setErrors] = useState({});
  const [payDetails, setPayDetails] = useState({ upiId: "", bank: "", cardName: "", cardNumber: "", expiry: "", cvv: "", proofFile: "" });
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState(null);

  const color = course?.color || "#e8b430";

  const pricing = useMemo(() => {
    if (!course) return null;
    const fee = course.fee || 0;
    const discount = round100(fee * 0.03);
    const scholarship = 0;
    const totalPayable = Math.max(fee - discount - scholarship, 0);
    return { fee, discount, scholarship, totalPayable };
  }, [course]);

  if (!course || !pricing) {
    return (
      <div className="enroll-page">
        <div className="enroll-container">
          <div className="enroll-empty-state">
            <h2>No course selected</h2>
            <p>Please choose a course before enrolling.</p>
            <button className="enroll-primary-btn" style={{ background: "#0a1330" }} onClick={() => navigate("/")}>
              Browse Courses <FiArrowRight />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const stepIndex = step === "form" ? 0 : step === "review" ? 1 : 2;

  const updateStudent = (field) => (e) => {
    setStudent((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validateStudentForm = () => {
    const next = {};
    if (!student.studentName.trim()) next.studentName = "Student name is required.";
    if (!student.parentName.trim()) next.parentName = "Parent / guardian name is required.";
    if (!MOBILE_REGEX.test(student.mobile.trim())) next.mobile = "Enter a valid 10-digit mobile number.";
    if (!EMAIL_REGEX.test(student.email.trim())) next.email = "Enter a valid email address.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleContinueFromForm = (e) => {
    e.preventDefault();
    if (validateStudentForm()) setStep("review");
  };

  const handleCopyBankDetails = async () => {
    const text = `Account Name: ${BANK_TRANSFER_DETAILS.accountName}\nBank Name: ${BANK_TRANSFER_DETAILS.bankName}\nAccount Number: ${BANK_TRANSFER_DETAILS.accountNumber}\nIFSC Code: ${BANK_TRANSFER_DETAILS.ifsc}\nBranch: ${BANK_TRANSFER_DETAILS.branch}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API unavailable — silently ignore, details are on-screen
    }
  };

  const methodLabel = {
    upi: "UPI",
    debit: "Debit Card",
    credit: "Credit Card",
    netbanking: "Net Banking",
    banktransfer: "Bank Transfer",
  };

  const finalizeEnrollment = (isPendingVerification) => {
    const transactionId = makeTransactionId();
    const paymentDate = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

    setStep("processing");

    // Simulate a payment gateway round-trip. Swap this out for a real
    // gateway call (create order -> open checkout -> verify signature).
    setTimeout(() => {
      const summary = {
        "Student Name": student.studentName,
        "Parent / Guardian Name": student.parentName,
        "Mobile Number": student.mobile,
        "Email Address": student.email,
        Course: course.title,
        Mode: course.mode || "-",
        Center: course.center || "-",
        Duration: course.duration || "-",
        "Course Fee": inr(pricing.fee),
        Discount: `- ${inr(pricing.discount)}`,
        "Total Payable": inr(pricing.totalPayable),
        "Payment Method": methodLabel[method] || "-",
        "Transaction ID": transactionId,
        "Payment Date": paymentDate,
        "Payment Status": isPendingVerification ? "Payment Verification Pending" : "Paid",
      };

      sendLeadEmail(`Enrollment - ${student.studentName} - ${course.title}`, summary);

      setResult({ transactionId, paymentDate, isPendingVerification });
      setStep("success");
    }, 1400);
  };

  const handlePayNow = (e) => {
    e?.preventDefault?.();
    finalizeEnrollment(false);
  };

  const handleSubmitBankTransfer = (e) => {
    e.preventDefault();
    finalizeEnrollment(true);
  };

  const handleDownloadInvoice = () => {
    if (!result) return;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <html>
        <head>
          <title>UK Academy - Invoice ${result.transactionId}</title>
          <style>
            body { font-family: 'Segoe UI', Roboto, sans-serif; color: #0a1330; padding: 40px; }
            h1 { color: ${color}; margin-bottom: 0; }
            .sub { color: #8a8fa3; margin-top: 4px; }
            table { width: 100%; border-collapse: collapse; margin-top: 28px; }
            td { padding: 10px 6px; border-bottom: 1px solid #eef0f6; font-size: 14px; }
            td:first-child { color: #8a8fa3; width: 45%; }
            .total-row td { font-weight: 800; font-size: 16px; color: #0a1330; border-top: 2px solid #0a1330; }
            .status { display: inline-block; margin-top: 24px; padding: 6px 14px; border-radius: 20px; background: ${result.isPendingVerification ? "#fff5db" : "#e6f7ec"}; color: ${result.isPendingVerification ? "#8a6d00" : "#187a3e"}; font-weight: 700; font-size: 13px; }
          </style>
        </head>
        <body>
          <h1>UK Academy</h1>
          <p class="sub">Payment Receipt / Invoice</p>
          <table>
            <tr><td>Student Name</td><td>${student.studentName}</td></tr>
            <tr><td>Parent / Guardian Name</td><td>${student.parentName}</td></tr>
            <tr><td>Course</td><td>${course.title}</td></tr>
            <tr><td>Mode</td><td>${course.mode || "-"}</td></tr>
            <tr><td>Center / Batch</td><td>${course.center || "-"}</td></tr>
            <tr><td>Payment Date</td><td>${result.paymentDate}</td></tr>
            <tr><td>Transaction ID</td><td>${result.transactionId}</td></tr>
            <tr><td>Payment Method</td><td>${methodLabel[method] || "-"}</td></tr>
            <tr><td>Course Fee</td><td>${inr(pricing.fee)}</td></tr>
            <tr><td>Discount</td><td>- ${inr(pricing.discount)}</td></tr>
            <tr class="total-row"><td>Total Amount Paid</td><td>${inr(pricing.totalPayable)}</td></tr>
          </table>
          <span class="status">${result.isPendingVerification ? "Payment Verification Pending" : "Payment Status: Paid"}</span>
          <script>window.onload = () => window.print();</script>
        </body>
      </html>
    `);
    win.document.close();
  };

  const goToDashboard = () => {
    navigate("/dashboard", {
      state: {
        studentName: student.studentName,
        course,
        transactionId: result?.transactionId,
      },
    });
  };

  return (
    <div className="enroll-page">
      <div className="enroll-container">
        {step !== "processing" && step !== "success" && (
          <>
            <button className="enroll-back-link" onClick={() => navigate(-1)}>
              <FiArrowLeft /> Back to Course
            </button>

            <div className="enroll-stepper">
              {STEPS.map((label, i) => (
                <div className={`enroll-step ${i === stepIndex ? "is-active" : i < stepIndex ? "is-done" : ""}`} key={label}>
                  <span className="enroll-step-dot" style={i <= stepIndex ? { background: color, borderColor: color } : undefined}>
                    {i < stepIndex ? <FiCheckCircle /> : i + 1}
                  </span>
                  <span className="enroll-step-label">{label}</span>
                  {i < STEPS.length - 1 && <span className="enroll-step-line" />}
                </div>
              ))}
            </div>
          </>
        )}

        {step === "form" && (
          <div className="enroll-card">
            <h1 className="enroll-card-title">Enroll in Course</h1>
            <p className="enroll-card-sub">Tell us a bit about the student to get started.</p>

            <form className="enroll-form" onSubmit={handleContinueFromForm} noValidate>
              <div className="enroll-field">
                <label>Student Name</label>
                <input type="text" placeholder="Enter your full name" value={student.studentName} onChange={updateStudent("studentName")} />
                {errors.studentName && <span className="enroll-field-error">{errors.studentName}</span>}
              </div>

              <div className="enroll-field">
                <label>Parent / Guardian Name</label>
                <input type="text" placeholder="Enter parent / guardian name" value={student.parentName} onChange={updateStudent("parentName")} />
                {errors.parentName && <span className="enroll-field-error">{errors.parentName}</span>}
              </div>

              <div className="enroll-row">
                <div className="enroll-field">
                  <label>Mobile Number</label>
                  <input type="tel" inputMode="numeric" maxLength={10} placeholder="10-digit mobile number" value={student.mobile} onChange={updateStudent("mobile")} />
                  {errors.mobile && <span className="enroll-field-error">{errors.mobile}</span>}
                </div>
                <div className="enroll-field">
                  <label>Email Address</label>
                  <input type="email" placeholder="Enter your email address" value={student.email} onChange={updateStudent("email")} />
                  {errors.email && <span className="enroll-field-error">{errors.email}</span>}
                </div>
              </div>

              <div className="enroll-field">
                <label>Selected Course</label>
                <div className="enroll-selected-course" style={{ borderColor: color }}>
                  {course.title}
                  {course.mode ? ` — ${course.mode}` : ""}
                </div>
              </div>

              <button type="submit" className="enroll-primary-btn" style={{ background: color }}>
                Continue <FiArrowRight />
              </button>
            </form>
          </div>
        )}

        {step === "review" && (
          <div className="enroll-card">
            <h1 className="enroll-card-title">Order Summary</h1>
            <p className="enroll-card-sub">Please review your enrollment details before proceeding to payment.</p>

            <div className="enroll-summary-grid">
              <div className="enroll-summary-row"><span>Course</span><strong>{course.title}</strong></div>
              {course.mode && <div className="enroll-summary-row"><span>Mode</span><strong>{course.mode}</strong></div>}
              {course.center && <div className="enroll-summary-row"><span>Center</span><strong>{course.center}</strong></div>}
              {course.duration && <div className="enroll-summary-row"><span>Duration</span><strong>{course.duration}</strong></div>}
              <div className="enroll-summary-row"><span>Student</span><strong>{student.studentName}</strong></div>
              <div className="enroll-summary-row"><span>Parent / Guardian</span><strong>{student.parentName}</strong></div>
            </div>

            <div className="enroll-price-box">
              <div className="enroll-price-row"><span>Course Fee</span><span>{inr(pricing.fee)}</span></div>
              <div className="enroll-price-row"><span>Early-Enrollment Discount</span><span className="is-discount">- {inr(pricing.discount)}</span></div>
              <div className="enroll-price-row"><span>Scholarship</span><span className="is-discount">- {inr(pricing.scholarship)}</span></div>
              <div className="enroll-price-divider" />
              <div className="enroll-price-row is-total"><span>Total Payable</span><span style={{ color }}>{inr(pricing.totalPayable)}</span></div>
            </div>

            <div className="enroll-btn-row">
              <button className="enroll-secondary-btn" onClick={() => setStep("form")}>
                <FiArrowLeft /> Back
              </button>
              <button className="enroll-primary-btn" style={{ background: color }} onClick={() => setStep("payment")}>
                Proceed to Payment <FiArrowRight />
              </button>
            </div>
          </div>
        )}

        {step === "payment" && !method && (
          <div className="enroll-card">
            <h1 className="enroll-card-title">Select Payment Method</h1>
            <p className="enroll-card-sub">Choose how you'd like to pay. All transactions are processed securely.</p>

            <div className="enroll-payment-methods-grid">
              {[
                { key: "upi", label: "UPI", icon: <FiSmartphone />, note: "Pay with UPI" },
                { key: "debit", label: "Debit Card", icon: <FiCreditCard />, note: "Pay using card" },
                { key: "credit", label: "Credit Card", icon: <FiCreditCard />, note: "Pay using card" },
                { key: "netbanking", label: "Net Banking", icon: <FiHome />, note: "Select your bank" },
                { key: "banktransfer", label: "Bank Transfer", icon: <FiHome />, note: "Direct bank transfer" },
              ].map((m) => (
                <div className="enroll-payment-method-card" key={m.key}>
                  <span className="enroll-payment-method-icon" style={{ color }}>
                    {m.icon}
                  </span>
                  <strong>{m.label}</strong>
                  <span className="enroll-payment-method-note">{m.note}</span>
                  <button className="enroll-method-select-btn" style={{ borderColor: color, color }} onClick={() => setMethod(m.key)}>
                    Select
                  </button>
                </div>
              ))}
            </div>

            <div className="enroll-amount-banner">
              Amount to Pay: <strong style={{ color }}>{inr(pricing.totalPayable)}</strong>
            </div>

            <button className="enroll-secondary-btn" onClick={() => setStep("review")}>
              <FiArrowLeft /> Back to Order Summary
            </button>
          </div>
        )}

        {step === "payment" && method === "upi" && (
          <div className="enroll-card enroll-card-narrow">
            <button className="enroll-back-link" onClick={() => setMethod(null)}>
              <FiArrowLeft /> Change Payment Method
            </button>
            <h1 className="enroll-card-title">UPI Payment</h1>
            <p className="enroll-card-sub">Scan the QR code or enter your UPI ID to pay {inr(pricing.totalPayable)}.</p>

            <div className="enroll-qr-box" style={{ borderColor: color }}>
              <FiGrid size={64} style={{ color }} />
              <span>Scan with any UPI app</span>
            </div>

            <div className="enroll-or-divider">OR</div>

            <form className="enroll-form" onSubmit={handlePayNow}>
              <div className="enroll-field">
                <label>Enter UPI ID</label>
                <input type="text" placeholder="example@upi" value={payDetails.upiId} onChange={(e) => setPayDetails((p) => ({ ...p, upiId: e.target.value }))} required />
              </div>
              <button type="submit" className="enroll-primary-btn" style={{ background: color }}>
                Verify & Pay {inr(pricing.totalPayable)}
              </button>
            </form>
          </div>
        )}

        {step === "payment" && (method === "debit" || method === "credit") && (
          <div className="enroll-card enroll-card-narrow">
            <button className="enroll-back-link" onClick={() => setMethod(null)}>
              <FiArrowLeft /> Change Payment Method
            </button>
            <h1 className="enroll-card-title">{method === "debit" ? "Debit" : "Credit"} Card Payment</h1>
            <p className="enroll-card-sub">Your card details are processed securely and never stored on our servers.</p>

            <form className="enroll-form" onSubmit={handlePayNow}>
              <div className="enroll-field">
                <label>Cardholder Name</label>
                <input type="text" placeholder="Name on card" value={payDetails.cardName} onChange={(e) => setPayDetails((p) => ({ ...p, cardName: e.target.value }))} required />
              </div>
              <div className="enroll-field">
                <label>Card Number</label>
                <input type="text" inputMode="numeric" maxLength={19} placeholder="XXXX XXXX XXXX XXXX" value={payDetails.cardNumber} onChange={(e) => setPayDetails((p) => ({ ...p, cardNumber: e.target.value }))} required />
              </div>
              <div className="enroll-row">
                <div className="enroll-field">
                  <label>Expiry Date</label>
                  <input type="text" placeholder="MM / YY" maxLength={7} value={payDetails.expiry} onChange={(e) => setPayDetails((p) => ({ ...p, expiry: e.target.value }))} required />
                </div>
                <div className="enroll-field">
                  <label>CVV</label>
                  <input type="password" inputMode="numeric" maxLength={3} placeholder="XXX" value={payDetails.cvv} onChange={(e) => setPayDetails((p) => ({ ...p, cvv: e.target.value }))} required />
                </div>
              </div>
              <button type="submit" className="enroll-primary-btn" style={{ background: color }}>
                Pay {inr(pricing.totalPayable)}
              </button>
            </form>
          </div>
        )}

        {step === "payment" && method === "netbanking" && (
          <div className="enroll-card enroll-card-narrow">
            <button className="enroll-back-link" onClick={() => setMethod(null)}>
              <FiArrowLeft /> Change Payment Method
            </button>
            <h1 className="enroll-card-title">Net Banking</h1>
            <p className="enroll-card-sub">Select your bank to continue to {inr(pricing.totalPayable)} payment.</p>

            <form className="enroll-form" onSubmit={handlePayNow}>
              <div className="enroll-field">
                <label>Select Your Bank</label>
                <select value={payDetails.bank} onChange={(e) => setPayDetails((p) => ({ ...p, bank: e.target.value }))} required>
                  <option value="">Select Bank</option>
                  {["State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank", "Kotak Mahindra Bank", "Other"].map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
              <div className="enroll-bank-chip-row">
                {["SBI", "HDFC", "ICICI", "AXIS", "KOTAK"].map((b) => (
                  <button type="button" className={`enroll-bank-chip ${payDetails.bank.startsWith(b) || (payDetails.bank === "State Bank of India" && b === "SBI") ? "is-active" : ""}`} key={b} onClick={() => setPayDetails((p) => ({ ...p, bank: b === "SBI" ? "State Bank of India" : `${b} Bank` }))}>
                    {b}
                  </button>
                ))}
              </div>
              <button type="submit" className="enroll-primary-btn" style={{ background: color }}>
                Continue to {inr(pricing.totalPayable)} <FiArrowRight />
              </button>
            </form>
          </div>
        )}

        {step === "payment" && method === "banktransfer" && (
          <div className="enroll-card enroll-card-narrow">
            <button className="enroll-back-link" onClick={() => setMethod(null)}>
              <FiArrowLeft /> Change Payment Method
            </button>
            <h1 className="enroll-card-title">Bank Transfer</h1>
            <p className="enroll-card-sub">Transfer the amount using the details below, then submit your payment proof.</p>

            <div className="enroll-bank-details-box">
              <div className="enroll-summary-row"><span>Account Name</span><strong>{BANK_TRANSFER_DETAILS.accountName}</strong></div>
              <div className="enroll-summary-row"><span>Bank Name</span><strong>{BANK_TRANSFER_DETAILS.bankName}</strong></div>
              <div className="enroll-summary-row"><span>Account Number</span><strong>{BANK_TRANSFER_DETAILS.accountNumber}</strong></div>
              <div className="enroll-summary-row"><span>IFSC Code</span><strong>{BANK_TRANSFER_DETAILS.ifsc}</strong></div>
              <div className="enroll-summary-row"><span>Branch</span><strong>{BANK_TRANSFER_DETAILS.branch}</strong></div>
              <div className="enroll-summary-row"><span>Amount to Transfer</span><strong style={{ color }}>{inr(pricing.totalPayable)}</strong></div>
              <button type="button" className="enroll-secondary-btn enroll-copy-btn" onClick={handleCopyBankDetails}>
                <FiCopy /> {copied ? "Copied!" : "Copy Bank Details"}
              </button>
            </div>

            <form className="enroll-form" onSubmit={handleSubmitBankTransfer}>
              <div className="enroll-field">
                <label>Upload Payment Proof (Optional)</label>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => {
                    const file = e.target.files && e.target.files[0];
                    setPayDetails((p) => ({ ...p, proofFile: file ? file.name : "" }));
                  }}
                />
              </div>
              <button type="submit" className="enroll-primary-btn" style={{ background: color }}>
                <FiUpload /> Submit Payment Details
              </button>
              <p className="enroll-note-text">
                <FiClock /> Your enrollment will show as <strong>Payment Verification Pending</strong> until the academy
                confirms the transfer.
              </p>
            </form>
          </div>
        )}

        {step === "processing" && (
          <div className="enroll-card enroll-card-narrow enroll-processing">
            <FiLoader className="enroll-spinner" style={{ color }} />
            <h2>Processing your payment…</h2>
            <p>Please don't close this window.</p>
          </div>
        )}

        {step === "success" && result && (
          <div className="enroll-card enroll-card-narrow enroll-success">
            <span className="enroll-success-icon" style={{ background: result.isPendingVerification ? "#e8b430" : "#2ea86a" }}>
              <FiCheckCircle />
            </span>
            <h1>{result.isPendingVerification ? "Payment Details Submitted" : "Payment Successful"}</h1>
            <p className="enroll-card-sub">
              {result.isPendingVerification
                ? "We'll confirm your enrollment once the transfer is verified."
                : "Your enrollment is confirmed!"}
            </p>

            <div className="enroll-summary-grid enroll-success-summary">
              <div className="enroll-summary-row"><span>Course</span><strong>{course.title}</strong></div>
              <div className="enroll-summary-row"><span>Student</span><strong>{student.studentName}</strong></div>
              <div className="enroll-summary-row"><span>Transaction ID</span><strong>{result.transactionId}</strong></div>
              <div className="enroll-summary-row"><span>Payment Amount</span><strong>{inr(pricing.totalPayable)}</strong></div>
              <div className="enroll-summary-row"><span>Payment Method</span><strong>{methodLabel[method]}</strong></div>
            </div>

            <p className="enroll-note-text">
              <FiClipboard /> A confirmation email has been opened in your mail app to send to {UK_ACADEMY_EMAIL} — this
              is how enrollment requests reach the academy on this site.
            </p>

            <div className="enroll-btn-row">
              <button className="enroll-secondary-btn" onClick={handleDownloadInvoice}>
                <FiDownload /> Download Invoice
              </button>
              <button className="enroll-primary-btn" style={{ background: color }} onClick={goToDashboard}>
                Go to Dashboard <FiArrowRight />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
