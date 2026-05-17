import styles from './styles.module.scss';
import { useState, useEffect } from 'react';
import {
  CircleCheckBig,
  User,
  Mail,
  Phone,
  Calendar,
  Heart,
} from 'lucide-react';
import authService from '../../../apis/authService';
import { useAuth } from '../../../hooks/useAuth';
import { storage } from '../../../utils/storage';
import Swal from 'sweetalert2';

function Infomation() {
  const { user, setUser } = useAuth();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    gender: 'Nam',
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        dob: user.dob || '',
        gender: user.gender || 'Nam',
      });
    }
  }, [user]);

  const [successMsg, setSuccessMsg] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [dobError, setDobError] = useState('');
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === 'phone') {
      if (value && !/^(0[3|5|7|8|9])[0-9]{8}$/.test(value))
        setPhoneError('Số điện thoại không hợp lệ');
      else setPhoneError('');
    }

    if (name === 'dob') {
      const selectedDate = new Date(value);
      if (value && selectedDate > new Date()) {
        setDobError('Ngày sinh không hợp lệ');
      } else {
        setDobError('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // validate số điện thoại
    if (!/^(0[3|5|7|8|9])[0-9]{8}$/.test(form.phone)) {
      setPhoneError('Số điện thoại không hợp lệ');
      return;
    }

    // validate ngày sinh
    const today = new Date();
    const selectedDate = new Date(form.dob);

    if (selectedDate > today) {
      setDobError('Ngày sinh không hợp lệ');
      return;
    }

    try {
      const res = await authService.updateProfile({
        name: form.name,
        phone: form.phone,
        dob: form.dob,
        gender: form.gender,
      });

      const updatedUser = res.data;
      storage.setUser(updatedUser);
      if (setUser) setUser(updatedUser);

      setSuccessMsg('Cập nhật thông tin thành công!');
      Swal.fire({
        title: 'Thành công!',
        text: 'Đã lưu các thay đổi thông tin cá nhân của bạn.',
        icon: 'success',
        confirmButtonColor: '#10b981',
        confirmButtonText: 'Đồng ý',
      });
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      Swal.fire({
        title: 'Thất bại!',
        text: err.message || 'Cập nhật thông tin thất bại.',
        icon: 'error',
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'Thử lại',
      });
    }
  };
  return (
    <div className={styles.box}>
      <div className={styles.boxHeader}>
        <h3>
          <User size={20} /> Thông tin cá nhân
        </h3>
        {successMsg && (
          <span className={styles.successBadge}>
            <CircleCheckBig size={16} /> {successMsg}
          </span>
        )}
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <div className={styles.field}>
            <label>
              <User size={14} /> Họ và tên
            </label>
            <input
              name='name'
              required
              value={form.name}
              onChange={handleChange}
              placeholder='Nhập họ tên...'
            />
          </div>

          <div className={styles.field}>
            <label>
              <Mail size={14} /> Email
            </label>
            <input
              name='email'
              type='email'
              value={form.email}
              disabled
              style={{ background: '#f5f5f5', cursor: 'not-allowed' }}
              title='Không thể đổi email'
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label>
              <Phone size={14} /> Số điện thoại
            </label>
            <input
              name='phone'
              required
              value={form.phone}
              onChange={handleChange}
              className={phoneError ? styles.inputError : ''}
              placeholder='09xx xxx xxx'
            />
            {phoneError && <p className={styles.errorMsg}>{phoneError}</p>}
          </div>

          <div className={styles.field}>
            <label>
              <Calendar size={14} /> Ngày sinh
            </label>
            <input
              name='dob'
              type='date'
              required
              value={form.dob}
              onChange={handleChange}
              min='1925-01-01'
              max={new Date().toISOString().split('T')[0]}
              className={dobError ? styles.inputError : ''}
            />
            {dobError && <p className={styles.errorMsg}>{dobError}</p>}
          </div>
        </div>

        <div className={styles.field}>
          <label>
            <Heart size={14} /> Giới tính
          </label>
          <select
            name='gender'
            required
            value={form.gender}
            onChange={handleChange}
          >
            <option>Nam</option>
            <option>Nữ</option>
            <option>Khác</option>
          </select>
        </div>

        <div className={styles.footer}>
          <button type='submit' className={styles.saveBtn}>
            Lưu thay đổi
          </button>
        </div>
      </form>
    </div>
  );
}

export default Infomation;
