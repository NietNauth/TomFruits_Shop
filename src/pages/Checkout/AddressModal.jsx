import React, { useState, useEffect } from 'react';
import styles from './styles.module.scss';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
  X,
  MapPin,
  User,
  Phone,
  Check,
  Plus,
  Edit2,
  Trash2,
  ArrowLeft,
} from 'lucide-react';
import addressService from '../../apis/addressService';
import Swal from 'sweetalert2';

const PROVINCE_API = 'https://provinces.open-api.vn/api';

function AddressModal({ isOpen, onClose, addresses, onSelect, onRefresh }) {
  const [view, setView] = useState('list'); // 'list' or 'form'
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    receiver_name: '',
    receiver_phone: '',
    province: '',
    province_code: '',
    district: '',
    district_code: '',
    ward: '',
    ward_code: '',
    address_detail: '',
    is_default: false,
  });
  const [message, setMessage] = useState({
    show: false,
    type: '',
    text: '',
  });
  const showMessage = (type, text) => {
    setMessage({
      show: true,
      type,
      text,
    });

    setTimeout(() => {
      setMessage({
        show: false,
        type: '',
        text: '',
      });
    }, 2500);
  };
  // Fetch provinces once
  useEffect(() => {
    if (isOpen) {
      axios.get(`${PROVINCE_API}/p/`).then((res) => setProvinces(res.data));
    }
  }, [isOpen]);

  // Fetch districts when province changes
  useEffect(() => {
    if (formData.province_code) {
      axios
        .get(`${PROVINCE_API}/p/${formData.province_code}?depth=2`)
        .then((res) => setDistricts(res.data.districts || []));
    } else {
      setDistricts([]);
    }
  }, [formData.province_code]);

  // Fetch wards when district changes
  useEffect(() => {
    if (formData.district_code) {
      axios
        .get(`${PROVINCE_API}/d/${formData.district_code}?depth=2`)
        .then((res) => setWards(res.data.wards || []));
    } else {
      setWards([]);
    }
  }, [formData.district_code]);

  // When opening modal, reset to list view
  useEffect(() => {
    if (isOpen) {
      setView('list');
      setEditId(null);
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setFormData({
      receiver_name: '',
      receiver_phone: '',
      province: '',
      province_code: '',
      district: '',
      district_code: '',
      ward: '',
      ward_code: '',
      address_detail: '',
      is_default: false,
    });
  };

  const handleEdit = (addr) => {
    setEditId(addr.id);
    setFormData({
      receiver_name: addr.receiver_name,
      receiver_phone: addr.receiver_phone,
      province: addr.province,
      province_code:
        provinces.find((p) => p.name === addr.province)?.code || '',
      district: addr.district,
      district_code: '', // We will let the useEffects handle loading districts/wards but it might be tricky
      ward: addr.ward,
      ward_code: '',
      address_detail: addr.address_detail,
      is_default: !!addr.is_default,
    });
    setView('form');
  };

  const handleChange = (field, value) => {
    if (field === 'province') {
      const p = provinces.find((x) => x.name === value);
      setFormData((prev) => ({
        ...prev,
        province: value,
        province_code: p?.code || '',
        district: '',
        district_code: '',
        ward: '',
        ward_code: '',
      }));
    } else if (field === 'district') {
      const d = districts.find((x) => x.name === value);
      setFormData((prev) => ({
        ...prev,
        district: value,
        district_code: d?.code || '',
        ward: '',
        ward_code: '',
      }));
    } else if (field === 'ward') {
      const w = wards.find((x) => x.name === value);
      setFormData((prev) => ({
        ...prev,
        ward: value,
        ward_code: w?.code || '',
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };
  const phoneRegex = /^(0[35789])[0-9]{8}$/;
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.receiver_name ||
      !formData.receiver_phone ||
      !formData.province ||
      !formData.district ||
      !formData.ward ||
      !formData.address_detail
    ) {
      Swal.fire({
        title: 'Cảnh báo!',
        text: 'Vui lòng nhập đầy đủ thông tin địa chỉ',
        icon: 'warning',
        confirmButtonColor: '#f59e0b',
        confirmButtonText: 'Đồng ý',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (editId) {
        await addressService.updateAddress(editId, formData);
        Swal.fire({
          title: 'Thành công!',
          text: 'Cập nhật địa chỉ thành công!',
          icon: 'success',
          confirmButtonColor: '#10b981',
          confirmButtonText: 'Đồng ý',
        });
      } else {
        await addressService.createAddress(formData);
        Swal.fire({
          title: 'Thành công!',
          text: 'Thêm địa chỉ mới thành công!',
          icon: 'success',
          confirmButtonColor: '#10b981',
          confirmButtonText: 'Đồng ý',
        });
      }
      onRefresh();
      setView('list');
    } catch (err) {
      Swal.fire({
        title: 'Thất bại!',
        text: err.message || 'Có lỗi xảy ra trong quá trình lưu địa chỉ.',
        icon: 'error',
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'Đồng ý',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Xóa địa chỉ?',
      text: 'Bạn có chắc chắn muốn xóa địa chỉ này? Thao tác này không thể hoàn tác.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Xóa ngay',
      cancelButtonText: 'Hủy',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await addressService.deleteAddress(id);
          Swal.fire({
            title: 'Đã xóa!',
            text: 'Địa chỉ đã được xóa thành công.',
            icon: 'success',
            confirmButtonColor: '#10b981',
            confirmButtonText: 'Đồng ý',
          });
          onRefresh();
        } catch (err) {
          Swal.fire({
            title: 'Thất bại!',
            text: err.message || 'Không thể xóa địa chỉ này.',
            icon: 'error',
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Đồng ý',
          });
        }
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {message.show && (
          <div className={`${styles.messagePopup} ${styles[message.type]}`}>
            {message.text}
          </div>
        )}
        {/* HEADER */}
        <div className={styles.modalHeader}>
          <div className={styles.headerLeft}>
            {view === 'form' && (
              <button
                className={styles.backBtnModal}
                onClick={() => setView('list')}
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <h3>
              {view === 'list'
                ? 'Địa chỉ của tôi'
                : editId
                  ? 'Cập nhật địa chỉ'
                  : 'Thêm địa chỉ mới'}
            </h3>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* LIST VIEW */}
        {view === 'list' && (
          <div className={styles.addressListContainer}>
            <div className={styles.addressScrollList}>
              {addresses.length === 0 ? (
                <div className={styles.emptyAddress}>
                  <MapPin size={48} />
                  <p>Bạn chưa có địa chỉ nào</p>
                </div>
              ) : (
                addresses.map((addr) => (
                  <div key={addr.id} className={styles.addressListItem}>
                    <div
                      className={styles.addrMain}
                      onClick={() => onSelect(addr)}
                    >
                      <div className={styles.addrHeader}>
                        <span className={styles.senderName}>
                          {addr.receiver_name}
                        </span>
                        <span className={styles.senderPhone}>
                          {addr.receiver_phone}
                        </span>
                        {addr.is_default && (
                          <span className={styles.defaultBadge}>Mặc định</span>
                        )}
                      </div>
                      <div className={styles.addrDetail}>
                        {addr.address_detail}, {addr.ward}, {addr.district},{' '}
                        {addr.province}
                      </div>
                    </div>
                    <div className={styles.addrActions}>
                      <button
                        className={styles.editBtn}
                        onClick={() => handleEdit(addr)}
                      >
                        Sửa
                      </button>
                      {!addr.is_default && (
                        <button
                          className={styles.deleteBtn}
                          onClick={() => handleDelete(addr.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            <button
              className={styles.addNewBtnModal}
              onClick={() => {
                setEditId(null);
                resetForm();
                setView('form');
              }}
            >
              <Plus size={18} /> Thêm địa chỉ mới
            </button>
          </div>
        )}

        {/* FORM VIEW */}
        {view === 'form' && (
          <form onSubmit={handleSubmit} className={styles.modalForm}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>
                  <User size={14} /> Tên người nhận
                </label>
                <input
                  type='text'
                  placeholder='Họ tên...'
                  required
                  value={formData.receiver_name}
                  onChange={(e) =>
                    handleChange('receiver_name', e.target.value)
                  }
                  onInvalid={(e) =>
                    e.target.setCustomValidity(
                      'Vui lòng xác nhập tên người nhận!'
                    )
                  }
                  onInput={(e) => e.target.setCustomValidity('')}
                />
              </div>
              <div className={styles.formGroup}>
                <label>
                  <Phone size={14} /> Số điện thoại
                </label>
                <input
                  type='text'
                  placeholder='Số điện thoại...'
                  required
                  value={formData.receiver_phone}
                  onChange={(e) =>
                    handleChange('receiver_phone', e.target.value)
                  }
                  pattern='^(0[35789])[0-9]{8}$'
                  onInvalid={(e) => {
                    if (e.target.validity.valueMissing) {
                      e.target.setCustomValidity(
                        'Vui lòng nhập số điện thoại!'
                      );
                    } else {
                      e.target.setCustomValidity('Số điện thoại không hợp lệ!');
                    }
                  }}
                  onInput={(e) => e.target.setCustomValidity('')}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>
                <MapPin size={14} /> Tỉnh / Thành phố
              </label>
              <select
                value={formData.province}
                onChange={(e) => handleChange('province', e.target.value)}
                required
                onInvalid={(e) =>
                  e.target.setCustomValidity('Vui lòng chọn tỉnh/thành!')
                }
                onInput={(e) => e.target.setCustomValidity('')}
              >
                <option value=''>Chọn Tỉnh/Thành</option>
                {provinces.map((p) => (
                  <option key={p.code} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Quận / Huyện</label>
                <select
                  value={formData.district}
                  onChange={(e) => handleChange('district', e.target.value)}
                  disabled={!formData.province}
                  required
                  onInvalid={(e) =>
                    e.target.setCustomValidity('Vui lòng chọn Quận/Huyện!')
                  }
                  onInput={(e) => e.target.setCustomValidity('')}
                >
                  <option value=''>Chọn Quận/Huyện</option>
                  {districts.map((d) => (
                    <option key={d.code} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Phường / Xã</label>
                <select
                  value={formData.ward}
                  onChange={(e) => handleChange('ward', e.target.value)}
                  disabled={!formData.district}
                  required
                  onInvalid={(e) =>
                    e.target.setCustomValidity('Vui lòng chọn Phường/Xã!')
                  }
                  onInput={(e) => e.target.setCustomValidity('')}
                >
                  <option value=''>Chọn Phường/Xã</option>
                  {wards.map((w) => (
                    <option key={w.code} value={w.name}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Địa chỉ cụ thể</label>
              <textarea
                placeholder='Số nhà, tên đường...'
                value={formData.address_detail}
                onChange={(e) => handleChange('address_detail', e.target.value)}
                required
                onInvalid={(e) =>
                  e.target.setCustomValidity('Vui lòng nhập địa chỉ cụ thể!')
                }
                onInput={(e) => e.target.setCustomValidity('')}
              />
            </div>

            <div className={styles.checkboxGroup}>
              <label>
                <input
                  type='checkbox'
                  checked={formData.is_default}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      is_default: e.target.checked,
                    }))
                  }
                />
                Đặt làm địa chỉ mặc định
              </label>
            </div>

            <div className={styles.modalFooter}>
              <button
                type='button'
                className={styles.cancelBtn}
                onClick={() => setView('list')}
              >
                Hủy
              </button>
              <button
                type='submit'
                className={styles.submitBtn}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Đang lưu...' : 'Hoàn thành'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default AddressModal;
