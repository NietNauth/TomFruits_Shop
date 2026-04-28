import { Link } from 'react-router-dom';
import styles from './styles.module.scss';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';

function Register() {
  const {
    container,
    card,
    header,
    form,
    inputText,
    button,
    logo,
    inputGroup,
    terms,
    loginLink,
    subtitle,
    errorMsg,
    inputError,
    strengthBar,
    strengthLabel,
  } = styles;

  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);

  // Lỗi inline (chỉ hiện khi điền sai, không hiện khi để trống)
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [agreeError, setAgreeError] = useState('');

  // ── Strength bar ──────────────────────────────────────────
  const getStrength = (pw) => {
    let score = 0;
    if (pw.length >= 6) score++;
    if (pw.length >= 10) score++;
    if (/[A-Z]/.test(pw) || /[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score; // 0-4
  };
  const strengthColors = ['#ddd', '#e53e3e', '#dd6b20', '#d69e2e', '#38a169'];
  const strengthLabels = ['', 'Yếu', 'Trung bình', 'Khá', 'Mạnh'];
  const strength = password ? getStrength(password) : 0;

  // ── Validate inline (chỉ khi đã có giá trị) ──────────────
  const validatePhone = (val) => {
    if (!val) {
      setPhoneError('');
      return;
    }
    if (!/^(0[3|5|7|8|9])[0-9]{8}$/.test(val))
      setPhoneError('Số điện thoại không hợp lệ');
    else setPhoneError('');
  };

  const validateConfirm = (val) => {
    if (!val) {
      setConfirmError('');
      return;
    }
    if (val !== password) setConfirmError('Mật khẩu không khớp');
    else setConfirmError('');
  };

  // ── Submit ────────────────────────────────────────────────
  const { register, isLoading } = useAuth();
  
  const handleRegister = async (e) => {
    e.preventDefault();

    // Kiểm tra lại toàn bộ trước khi submit
    let valid = true;

    if (phone && !/^(0[3|5|7|8|9])[0-9]{8}$/.test(phone)) {
      setPhoneError('Số điện thoại không hợp lệ');
      valid = false;
    }

    if (password && password.length < 6) {
      setPasswordError('Mật khẩu phải ít nhất 6 ký tự');
      valid = false;
    } else {
      setPasswordError('');
    }

    if (confirmPassword && confirmPassword !== password) {
      setConfirmError('Mật khẩu không khớp');
      valid = false;
    }

    if (!agreed) {
      setAgreeError('Vui lòng đồng ý với điều khoản');
      valid = false;
    } else {
      setAgreeError('');
    }

    if (!valid) return;

    const result = await register({ name, email, password, password_confirmation: confirmPassword, phone });
    if (result.success) {
      toast.success('Đăng ký thành công!');
      navigate('/');
    } else {
      setAgreeError(result.message);
    }
  };

  return (
    <div className={container}>
      <div className={card}>
        {/* HEADER */}
        <div className={header}>
          <div className={logo}>
            <Leaf />
          </div>
          <h2>Tom Fruits</h2>
          <p>Tạo tài khoản mới</p>
        </div>

        {/* BODY */}
        {/* noValidate=false → browser vẫn tự hiện tooltip "Vui lòng điền vào trường này" khi để trống */}
        <form className={form} onSubmit={handleRegister}>
          <h3>Đăng ký</h3>
          <span className={subtitle}>Tham gia cộng đồng thực phẩm sạch</span>

          {/* Họ và tên */}
          <div className={inputGroup}>
            <label>Họ và tên *</label>
            <input
              className={inputText}
              type='text'
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Nguyễn Văn A'
              onInvalid={(e) =>
                e.target.setCustomValidity('Vui lòng nhập họ và tên!')
              }
              onInput={(e) => e.target.setCustomValidity('')}
            />
          </div>

          {/* Email */}
          <div className={inputGroup}>
            <label>Email *</label>
            <input
              className={inputText}
              type='email'
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onInvalid={(e) => {
                if (e.target.validity.valueMissing)
                  e.target.setCustomValidity('Vui lòng nhập email!');
                else if (e.target.validity.typeMismatch)
                  e.target.setCustomValidity(
                    'Email không hợp lệ, vui lòng kiểm tra lại!'
                  );
              }}
              onInput={(e) => e.target.setCustomValidity('')}
            />
          </div>

          {/* Số điện thoại */}
          <div className={inputGroup}>
            <label>Số điện thoại *</label>
            <input
              className={`${inputText} ${phoneError ? inputError : ''}`}
              type='text'
              required
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setPhoneError('');
              }}
              onInvalid={(e) => {
                if (e.target.validity.valueMissing)
                  e.target.setCustomValidity('Vui lòng nhập số điện thoại!');
              }}
              onInput={(e) => e.target.setCustomValidity('')}
            />
            {phoneError && <p className={errorMsg}>{phoneError}</p>}
          </div>

          {/* Mật khẩu */}
          <div className={inputGroup}>
            <label>Mật khẩu *</label>
            <input
              className={`${inputText} ${passwordError ? inputError : ''}`}
              type='password'
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (e.target.value && e.target.value.length < 6)
                  setPasswordError('Mật khẩu phải ít nhất 6 ký tự');
                else setPasswordError('');
                if (confirmPassword)
                  setConfirmError(
                    e.target.value !== confirmPassword
                      ? 'Mật khẩu không khớp'
                      : ''
                  );
              }}
              onInvalid={(e) => {
                if (e.target.validity.valueMissing)
                  e.target.setCustomValidity('Vui lòng nhập mật khẩu!');
              }}
              onInput={(e) => e.target.setCustomValidity('')}
            />
            {passwordError && <p className={errorMsg}>{passwordError}</p>}
            {/* Strength bar — chỉ hiện khi đang gõ */}
            {password && (
              <>
                <div className={strengthBar}>
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        height: 4,
                        borderRadius: 2,
                        background:
                          i <= strength ? strengthColors[strength] : '#ddd',
                        transition: 'background 0.3s',
                      }}
                    />
                  ))}
                </div>
                <p
                  className={strengthLabel}
                  style={{ color: strengthColors[strength] }}
                >
                  {strengthLabels[strength]}
                </p>
              </>
            )}
          </div>

          {/* Xác nhận mật khẩu */}
          <div className={inputGroup}>
            <label>Xác nhận mật khẩu *</label>
            <input
              className={`${inputText} ${confirmError ? inputError : ''}`}
              type='password'
              required
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                validateConfirm(e.target.value);
              }}
              onInvalid={(e) => {
                if (e.target.validity.valueMissing)
                  e.target.setCustomValidity('Vui lòng xác nhận mật khẩu!');
              }}
              onInput={(e) => e.target.setCustomValidity('')}
            />
            {confirmError && <p className={errorMsg}>{confirmError}</p>}
          </div>

          {/* TERMS */}
          <div className={terms}>
            <input
              type='checkbox'
              id='agree'
              checked={agreed}
              onChange={(e) => {
                setAgreed(e.target.checked);
                if (e.target.checked) setAgreeError('');
              }}
            />
            <label htmlFor='agree'>
              Tôi đồng ý với <span>Điều khoản sử dụng</span> và{' '}
              <span>Chính sách bảo mật</span> của Tom Fruits
            </label>
          </div>
          {agreeError && (
            <p
              className={errorMsg}
              style={{ marginTop: -14, marginBottom: 10 }}
            >
              {agreeError}
            </p>
          )}

          {/* BUTTON */}
          <button type='submit' className={button} disabled={isLoading}>
            {isLoading ? 'Đang đăng ký...' : 'Tạo tài khoản'}
          </button>

          <div className={loginLink}>
            Đã có tài khoản? <Link to='/login'>Đăng nhập</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
