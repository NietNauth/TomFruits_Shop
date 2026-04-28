import { useState } from 'react';
import styles from './styles.module.scss';
import { CircleCheckBig } from 'lucide-react';
import authService from '../../../apis/authService';
import { toast } from 'react-toastify';

function ChangePassword() {
  const [form, setForm] = useState({ current: '', newPass: '', confirm: '' });

  const [newPassError, setNewPassError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === 'newPass') {
      if (value && value.length < 8)
        setNewPassError('Mật khẩu phải ít nhất 8 ký tự');
      else setNewPassError('');

      // re-validate confirm nếu đã nhập
      if (form.confirm)
        setConfirmError(value !== form.confirm ? 'Mật khẩu không khớp' : '');
    }

    if (name === 'confirm') {
      if (value && value !== form.newPass)
        setConfirmError('Mật khẩu không khớp');
      else setConfirmError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassError || confirmError) return;

    try {
      await authService.changePassword({
        current_password: form.current,
        password: form.newPass,
        password_confirmation: form.confirm,
      });
      setSuccessMsg('Đổi mật khẩu thành công!');
      setTimeout(() => setSuccessMsg(''), 3000);
      setForm({ current: '', newPass: '', confirm: '' });
    } catch (err) {
      toast.error(err.message || 'Đổi mật khẩu thất bại!');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.boxHeader}>
        <h3>🔒 Đổi mật khẩu</h3>
        {successMsg && (
          <span className={styles.successBadge}>
            <CircleCheckBig size={14} /> {successMsg}
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
            className={newPassError ? styles.inputError : ''}
            onInvalid={(e) =>
              e.target.setCustomValidity('Vui lòng nhập mật khẩu mới!')
            }
            onInput={(e) => e.target.setCustomValidity('')}
          />
          {newPassError && <p className={styles.errorMsg}>{newPassError}</p>}
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
            className={confirmError ? styles.inputError : ''}
            onInvalid={(e) =>
              e.target.setCustomValidity('Vui lòng xác nhận mật khẩu!')
            }
            onInput={(e) => e.target.setCustomValidity('')}
          />
          {confirmError && <p className={styles.errorMsg}>{confirmError}</p>}
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
