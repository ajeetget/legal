import { useState } from "react";
import { Link, useNavigate} from "react-router-dom";
import { Mail, Phone, ArrowLeft } from "lucide-react";
import AuthLayout from "../../layouts/AuthLayout";
import "./Auth.css";

function Login() {
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loginType, setLoginType] = useState("");
  const navigate = useNavigate();

  // Detect whether the input is an email or phone number
  const getLoginType = (value) => {
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "email";
    }

    if (/^[6-9]\d{9}$/.test(value)) {
      return "phone";
    }

    return "";
  };

  // Send OTP
  const handleSendOTP = (e) => {
    e.preventDefault();

    const value = identifier.trim();
    const type = getLoginType(value);

    if (!value) {
      setErrors({ identifier: "Email or phone number is required" });
      return;
    }

    if (!type) {
      setErrors({
        identifier: "Please enter a valid email or 10-digit mobile number",
      });
      return;
    }

    setErrors({});
    setLoginType(type);

    // Connect OTP sending API here.
    // Email: Send OTP to email address.
    // Phone: Send OTP through SMS.

    setOtpSent(true);
    setSuccess(
      `OTP sending API needs to be connected for your ${
        type === "email" ? "email address" : "mobile number"
      }.`
    );
  };

  // Verify OTP
  const handleVerifyOTP = (e) => {
    e.preventDefault();

    if (!otp.trim()) {
      setErrors({ otp: "Please enter the OTP" });
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setErrors({ otp: "Please enter a valid 6-digit OTP" });
      return;
    }

    setErrors({});

    // Connect OTP verification API here.
   //setSuccess("OTP verification API needs to be connected.");
     navigate("/services");
  };

  // Change email or phone number
  const handleChangeNumber = () => {
    setOtpSent(false);
    setOtp("");
    setErrors({});
    setSuccess("");
  };

  return (
    <AuthLayout>
      <div className="auth-heading">
        <h1>Welcome Back!</h1>
        <p>Login to access your legal services.</p>
      </div>

      {!otpSent ? (
        <form className="auth-form" onSubmit={handleSendOTP} noValidate>
          <div className="form-group">
            <label htmlFor="identifier">Email Address or Phone Number</label>

            <input
              type="text"
              id="identifier"
              name="identifier"
              placeholder="Enter email or mobile number"
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                setErrors({});
                setSuccess("");
              }}
            />

            {errors.identifier && (
              <span className="error-message">{errors.identifier}</span>
            )}
          </div>

          <button type="submit" className="auth-submit">
            Send OTP
          </button>
        </form>
      ) : (
        <form className="auth-form" onSubmit={handleVerifyOTP} noValidate>
          <div className="form-group">
            <label>OTP sent to</label>

            <div className="otp-destination">
              {loginType === "email" ? (
                <Mail size={18} />
              ) : (
                <Phone size={18} />
              )}

              <span>{identifier}</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="otp">Enter 6-digit OTP</label>

            <input
              type="text"
              id="otp"
              name="otp"
              placeholder="Enter OTP"
              value={otp}
              maxLength={6}
              inputMode="numeric"
              onChange={(e) => {
                setOtp(e.target.value.replace(/\D/g, ""));
                setErrors({});
                setSuccess("");
              }}
            />

            {errors.otp && (
              <span className="error-message">{errors.otp}</span>
            )}
          </div>

          <button type="submit" className="auth-submit">
            Verify & Login
          </button>

          <button type="button" className="change-number-button"
            onClick={handleChangeNumber}>
            <ArrowLeft size={16} />
            Change Email or Phone
          </button>
        </form>
      )}

      {success && <p className="success-message">{success}</p>}

      <p className="auth-switch">
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>
    </AuthLayout>
  );
}

export default Login;