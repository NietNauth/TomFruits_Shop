import { useState } from 'react';
import styles from './styles.module.scss';
import { CircleCheckBig, CircleX } from 'lucide-react';
import authService from '../../../apis/authService';
import Swal from 'sweetalert2';

function ChangePassword() {
  const [form, setForm] = useState({ current: '', newPass: '', confirm: '' });

  // const [newPassError, setNewPassError] = useState('');
  // const [confirmError, setConfirmError] = useState('');
  const [errors, setErrors] = useState({
    newPass: '',
    confirm: '',
  });
  const [message, setMessage] = useState({
    type: '',
    text: '',
  });
  const showMessage = (type, text) => {
    setMessage({ type, text });

    setTimeout(() => {
      setMessage({ type: '', text: '' });
    }, 3000);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === 'newPass') {
      if (value && value.length < 8) {
        setErrors((prev) => ({
          ...prev,
          newPass: 'Mật khẩu phải ít nhất 8 ký tự',
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          newPass: '',
        }));
      }

      // re-validate confirm nếu đã nhập
      if (form.confirm) {
        setErrors((prev) => ({
          ...prev,
          confirm: value !== form.confirm ? 'Mật khẩu không khớp' : '',
        }));
      }
    }

    if (name === 'confirm') {
      if (value && value !== form.newPass)
        setErrors((prev) => ({
          ...prev,
          confirm: 'Mật khẩu không khớp',
        }));
      else {
        setErrors((prev) => ({
          ...prev,
          confirm: '',
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (errors.newPass || errors.confirm) return;

    try {
      await authService.changePassword({
        current_password: form.current,
        password: form.newPass,
        password_confirmation: form.confirm,
      });
      Swal.fire({
        title: 'Thành công!',
        text: 'Mật khẩu của bạn đã được cập nhật thành công.',
        icon: 'success',
        confirmButtonColor: '#10b981',
        confirmButtonText: 'Đồng ý',
      });
      setSuccessMsg('Đổi mật khẩu thành công!');
      setTimeout(() => setSuccessMsg(''), 3000);
      setForm({ current: '', newPass: '', confirm: '' });
      setErrors({
        newPass: '',
        confirm: '',
      });
    } catch (err) {
      Swal.fire({
        title: 'Thất bại!',
        text: err.message || 'Đổi mật khẩu thất bại!',
        icon: 'error',
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'Đồng ý',
      });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.boxHeader}>
        <h3>🔒 Đổi mật khẩu</h3>
        {message.text && (
          <span
            className={`${styles.messageBadge} ${message.type === 'success' ? styles.successBadge : styles.errorBadge}`}
          >
            {message.type === 'error' ? (
              <CircleX size={14} />
            ) : (
              <CircleCheckBig size={14} />
            )}
            {message.text}
          </span>
        )}
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        {/* Mật khẩu hiện tại */}
        <div className={styles.group}>
          <label>Mật khẩu hiện tại</label>
          <input
            type='password'
            name='current'
            required
            value={form.current}
            onChange={handleChange}
            placeholder='Nhập mật khẩu hiện tại'
            onInvalid={(e) =>
              e.target.setCustomValidity('Vui lòng nhập mật khẩu hiện tại!')
            }
            onInput={(e) => e.target.setCustomValidity('')}
          />
        </div>

        {/* Mật khẩu mới */}
        <div className={styles.group}>
          <label>Mật khẩu mới</label>
          <input
            type='password'
            name='newPass'
            required
            value={form.newPass}
            onChange={handleChange}
            placeholder='Nhập mật khẩu mới'
            className={errors.newPass ? styles.inputError : ''}
            onInvalid={(e) =>
              e.target.setCustomValidity('Vui lòng nhập mật khẩu mới!')
            }
            onInput={(e) => e.target.setCustomValidity('')}
          />
          {errors.newPass && (
            <p className={styles.errorMsg}>{errors.newPass}</p>
          )}
        </div>

        {/* Xác nhận mật khẩu */}
        <div className={styles.group}>
          <label>Xác nhận mật khẩu mới</label>
          <input
            type='password'
            name='confirm'
            required
            value={form.confirm}
            onChange={handleChange}
            placeholder='Nhập lại mật khẩu'
            className={errors.confirm ? styles.inputError : ''}
            onInvalid={(e) =>
              e.target.setCustomValidity('Vui lòng xác nhận mật khẩu!')
            }
            onInput={(e) => e.target.setCustomValidity('')}
          />
          {errors.confirm && (
            <p className={styles.errorMsg}>{errors.confirm}</p>
          )}
        </div>

        <button type='submit' className={styles.submit}>
          Cập nhật mật khẩu
        </button>
      </form>

      <div className={styles.note}>
        <p>💡 Gợi ý bảo mật:</p>
        <ul>
          <li>Mật khẩu ít nhất 8 ký tự</li>
          <li>Kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt</li>
          <li>Không sử dụng thông tin cá nhân dễ đoán</li>
          <li>Đổi mật khẩu định kỳ mỗi 3-6 tháng</li>
        </ul>
      </div>
    </div>
  );
}

export default ChangePassword;
