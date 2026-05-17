import styles from './styles.module.scss';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Swal from 'sweetalert2';
function Login() {
  const {
    container,
    card,
    header,
    form,
    inputText,
    button,
    logo,
    inputGroup,
    row,
  } = styles;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(''); // lỗi sai tài khoản/mật khẩu
  const navigate = useNavigate();

  const { login, isLoading } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault(); // chặn reload

    const result = await login({ email, password });
    if (result.success) {
      Swal.fire({
        title: 'Đăng nhập thành công!',
        text: 'Chào mừng bạn quay trở lại với Tom Fruits!',
        icon: 'success',
        confirmButtonColor: '#10b981',
        confirmButtonText: 'Đồng ý'
      }).then(() => {
        navigate('/');
      });
    } else {
      setLoginError(result.message || 'Email hoặc mật khẩu không đúng!');
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
          <p>Thực phẩm sạch - Sống khỏe mỗi ngày</p>
        </div>

        {/* FORM — required giữ nguyên → browser tự hiện tooltip khi để trống */}
        <form className={form} onSubmit={handleLogin}>
          <h3>Đăng nhập</h3>
          <p className={styles.welcome}>Chào mừng bạn quay lại!</p>

          {/* EMAIL */}
          <div className={inputGroup}>
            <label>Email</label>
            <input
              className={`${inputText} ${loginError ? styles.inputError : ''}`}
              type='email'
              placeholder='email@example.com'
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setLoginError('');
              }}
              onInvalid={(e) => {
                if (e.target.validity.valueMissing) {
                  e.target.setCustomValidity('Vui lòng nhập email!');
                } else if (e.target.validity.typeMismatch) {
                  e.target.setCustomValidity(
                    'Email không hợp lệ, vui lòng kiểm tra lại!'
                  );
                }
              }}
            />
          </div>

          {/* PASSWORD */}
          <div className={inputGroup}>
            <label>Mật khẩu</label>
            <input
              className={`${inputText} ${loginError ? styles.inputError : ''}`}
              type='password'
              placeholder='Nhập mật khẩu...'
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setLoginError('');
              }}
              onInvalid={(e) => {
                if (e.target.validity.valueMissing) {
                  e.target.setCustomValidity('Vui lòng nhập mật khẩu!');
                }
              }}
              onInput={(e) => e.target.setCustomValidity('')}
            />
            {/* Lỗi sai tài khoản — chỉ hiện sau khi submit */}
            {loginError && <p className={styles.errorMsg}>{loginError}</p>}
          </div>

          {/* REMEMBER + FORGOT */}
          <div className={row}>
            <label>
              <input type='checkbox' /> Ghi nhớ đăng nhập
            </label>
            <span className={styles.forgot}>Quên mật khẩu?</span>
          </div>

          {/* BUTTON */}
          <button type='submit' className={button} disabled={isLoading}>
            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>

          <p className={styles.register}>
            Chưa có tài khoản?{' '}
            <Link to='/register'>
              <span>Đăng ký ngay</span>
            </Link>
          </p>

          {/* SOCIAL */}
          <div className={styles.divider}>
            <span>Hoặc đăng nhập với</span>
          </div>
          <div className={styles.social}>
            <button type='button' className={styles.socialBtn}>
              <FcGoogle size={18} /> Google
            </button>
            <button type='button' className={styles.socialBtn}>
              <FaFacebook size={18} color='#1877f2' /> Facebook
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
