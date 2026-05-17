import { useState, useEffect } from 'react';
import addressService from '../../../apis/addressService';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Plus, MapPin, Phone, User, Trash2, CheckCircle2 } from 'lucide-react';

const PROVINCE_API = 'https://provinces.open-api.vn/api';

function AddressBook() {
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [errors, setErrors] = useState({
    receiver_phone: '',
  });
  const validatePhone = (phone) => {
    // SDT Việt Nam: 10 số, bắt đầu bằng 0
    const regex = /^(0[3|5|7|8|9])+([0-9]{8})$/;

    return regex.test(phone);
  };
  const [formData, setFormData] = useState({
    receiver_name: '',
    receiver_phone: '',
    province: '',
    provinceCode: '',
    district: '',
    districtCode: '',
    ward: '',
    wardCode: '',
    address_detail: '',
    is_default: false,
  });
  const [popup, setPopup] = useState({
    show: false,
    type: '',
    text: '',
  });
  const showPopup = (type, text) => {
    setPopup({
      show: true,
      type,
      text,
    });

    setTimeout(() => {
      setPopup({
        show: false,
        type: '',
        text: '',
      });
    }, 2000);
  };
  useEffect(() => {
    fetchAddresses();
    fetchProvinces();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await addressService.getAddresses();
      if (res.success) setAddresses(res.data);
    } catch (err) {
      Swal.fire({
        title: 'Thất bại!',
        text: 'Lỗi tải danh sách địa chỉ. Vui lòng thử lại!',
        icon: 'error',
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'Đồng ý',
      });
    }
  };

  const fetchProvinces = async () => {
    try {
      const res = await axios.get(`${PROVINCE_API}/p/`);
      setProvinces(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchDistricts = async () => {
      if (!formData.provinceCode) {
        setDistricts([]);
        return;
      }

      try {
        const res = await axios.get(
          `${PROVINCE_API}/p/${formData.provinceCode}?depth=2`
        );

        setDistricts(res.data.districts || []);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDistricts();
    setWards([]);
  }, [formData.provinceCode]);

  useEffect(() => {
    const fetchWards = async () => {
      if (!formData.districtCode) {
        setWards([]);
        return;
      }

      try {
        const res = await axios.get(
          `${PROVINCE_API}/d/${formData.districtCode}?depth=2`
        );

        setWards(res.data.wards || []);
      } catch (error) {
        console.log(error);
      }
    };

    fetchWards();
  }, [formData.districtCode]);

  const handleChange = (field, value) => {
    if (field === 'province') {
      const selected = provinces.find((province) => province.name === value);

      setFormData((prev) => ({
        ...prev,
        province: value,
        provinceCode: selected?.code || '',
        district: '',
        districtCode: '',
        ward: '',
        wardCode: '',
      }));

      return;
    }

    if (field === 'district') {
      const selected = districts.find((district) => district.name === value);

      setFormData((prev) => ({
        ...prev,
        district: value,
        districtCode: selected?.code || '',
        ward: '',
        wardCode: '',
      }));

      return;
    }

    if (field === 'ward') {
      const selected = wards.find((ward) => ward.name === value);

      setFormData((prev) => ({
        ...prev,
        ward: value,
        wardCode: selected?.code || '',
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      receiver_name: '',
      receiver_phone: '',
      province: '',
      provinceCode: '',
      district: '',
      districtCode: '',
      ward: '',
      wardCode: '',
      address_detail: '',
      is_default: false,
    });
  };
  const handleEdit = async (addr) => {
    try {
      const province = provinces.find((p) => p.name === addr.province);

      let districtList = [];
      let wardList = [];

      // load districts
      if (province) {
        const districtRes = await axios.get(
          `${PROVINCE_API}/p/${province.code}?depth=2`
        );

        districtList = districtRes.data.districts || [];
        setDistricts(districtList);
      }

      // tìm district code
      const district = districtList.find((d) => d.name === addr.district);

      // load wards
      if (district) {
        const wardRes = await axios.get(
          `${PROVINCE_API}/d/${district.code}?depth=2`
        );

        wardList = wardRes.data.wards || [];
        setWards(wardList);
      }

      // tìm ward code
      const ward = wardList.find((w) => w.name === addr.ward);

      setEditingId(addr.id);

      setFormData({
        receiver_name: addr.receiver_name,
        receiver_phone: addr.receiver_phone,

        province: addr.province,
        provinceCode: province?.code || '',

        district: addr.district,
        districtCode: district?.code || '',

        ward: addr.ward,
        wardCode: ward?.code || '',

        address_detail: addr.address_detail,
        is_default: addr.is_default,
      });

      setShowForm(true);
    } catch (error) {
      showPopup('error', 'Không thể tải dữ liệu địa chỉ');
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({
      receiver_phone: '',
    });

    // validate SDT
    if (!validatePhone(formData.receiver_phone)) {
      setErrors({
        receiver_phone: 'Số điện thoại không hợp lệ',
      });

      return;
    }

    setLoading(true);

    try {
      const res = editingId
        ? await addressService.updateAddress(editingId, formData)
        : await addressService.createAddress(formData);

      if (res.success) {
        Swal.fire({
          title: 'Thành công!',
          text: 'Thêm địa chỉ mới thành công!',
          icon: 'success',
          confirmButtonColor: '#10b981',
          confirmButtonText: 'Đồng ý',
        });
        setShowForm(false);
        resetForm();
        setEditingId(null);
      }
    } catch (err) {
      Swal.fire({
        title: 'Thất bại!',
        text: err.message || 'Lỗi khi lưu địa chỉ.',
        icon: 'error',
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'Đồng ý',
      });
    } finally {
      setLoading(false);
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
          const res = await addressService.deleteAddress(id);
          if (res.success) {
            Swal.fire({
              title: 'Đã xóa!',
              text: 'Địa chỉ đã được xóa thành công.',
              icon: 'success',
              confirmButtonColor: '#10b981',
              confirmButtonText: 'Đồng ý',
            });
            fetchAddresses();
          }
        } catch (err) {
          Swal.fire({
            title: 'Thất bại!',
            text: err.message || 'Lỗi khi xóa địa chỉ.',
            icon: 'error',
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Đồng ý',
          });
        }
      }
    });
  };

  const handleSetDefault = async (id) => {
    try {
      const res = await addressService.setDefault(id);

      if (res.success) {
        Swal.fire({
          title: 'Thành công!',
          text: 'Đã đặt địa chỉ này làm mặc định.',
          icon: 'success',
          confirmButtonColor: '#10b981',
          confirmButtonText: 'Đồng ý',
        });
        fetchAddresses();
      }
    } catch (err) {
      Swal.fire({
        title: 'Thất bại!',
        text: err.message || 'Lỗi hệ thống.',
        icon: 'error',
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'Đồng ý',
      });
    }
  };

  return (
    <div className={styles.addressBook}>
      <div className={styles.header}>
        <h3>Sổ địa chỉ</h3>

        <button
          type='button'
          className={styles.addBtn}
          onClick={() => {
            setShowForm(!showForm);

            if (showForm) {
              resetForm();
              setEditingId(null);
            }
          }}
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}

          {showForm ? 'Hủy' : 'Thêm địa chỉ mới'}
        </button>
      </div>

      {showForm && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Tên người nhận</label>

              <input
                type='text'
                required
                value={formData.receiver_name}
                onChange={(e) => handleChange('receiver_name', e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Số điện thoại</label>

              <input
                type='text'
                required
                value={formData.receiver_phone}
                onChange={(e) => {
                  handleChange('receiver_phone', e.target.value);
                  // xoá lỗi khi nhập lại
                  if (errors.receiver_phone) {
                    setErrors((prev) => ({
                      ...prev,
                      receiver_phone: '',
                    }));
                  }
                }}
              />
              {errors.receiver_phone && (
                <span className={styles.errorText}>
                  {errors.receiver_phone}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Tỉnh / Thành phố</label>

              <select
                required
                value={formData.province}
                onChange={(e) => handleChange('province', e.target.value)}
              >
                <option value=''>Chọn tỉnh thành</option>

                {provinces.map((province) => (
                  <option key={province.code} value={province.name}>
                    {province.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Quận / Huyện</label>

              <select
                required
                value={formData.district}
                onChange={(e) => handleChange('district', e.target.value)}
              >
                <option value=''>Chọn quận huyện</option>

                {districts.map((district) => (
                  <option key={district.code} value={district.name}>
                    {district.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Phường / Xã</label>

              <select
                required
                value={formData.ward}
                onChange={(e) => handleChange('ward', e.target.value)}
              >
                <option value=''>Chọn phường xã</option>

                {wards.map((ward) => (
                  <option key={ward.code} value={ward.name}>
                    {ward.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Địa chỉ chi tiết</label>

              <input
                type='text'
                required
                value={formData.address_detail}
                onChange={(e) => handleChange('address_detail', e.target.value)}
              />
            </div>
          </div>

          <div className={styles.checkbox}>
            <label>
              <input
                type='checkbox'
                checked={formData.is_default}
                onChange={(e) => handleChange('is_default', e.target.checked)}
              />
              Đặt làm địa chỉ mặc định
            </label>
          </div>

          <button type='submit' disabled={loading} className={styles.submitBtn}>
            {loading ? 'Đang lưu...' : 'Lưu địa chỉ'}
          </button>
        </form>
      )}

      <div className={styles.list}>
        {addresses.length === 0 ? (
          <div className={styles.empty}>Bạn chưa có địa chỉ nào lưu lại.</div>
        ) : (
          addresses.map((addr) => (
            <div
              key={addr.id}
              className={`${styles.card} ${
                addr.is_default ? styles.defaultCard : ''
              }`}
            >
              <div className={styles.info}>
                <div className={styles.top}>
                  <span className={styles.name}>
                    <User size={16} />

                    {addr.receiver_name}
                  </span>

                  {addr.is_default && (
                    <span className={styles.badge}>
                      <CheckCircle2 size={12} />
                      Mặc định
                    </span>
                  )}
                </div>

                <span className={styles.text}>
                  <Phone size={16} />

                  {addr.receiver_phone}
                </span>

                <span className={styles.text}>
                  <MapPin size={16} />
                  {addr.address_detail}, {addr.ward}, {addr.district},{' '}
                  {addr.province}
                </span>
              </div>

              {!addr.is_default && (
                <div className={styles.actions}>
                  <button
                    type='button'
                    className={styles.defaultBtn}
                    onClick={() => handleSetDefault(addr.id)}
                  >
                    Thiết lập mặc định
                  </button>
                  <div className={styles.actionButtons}>
                    <button
                      type='button'
                      className={styles.editBtn}
                      onClick={() => handleEdit(addr)}
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      type='button'
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(addr.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      {popup.show && (
        <div className={styles.popupOverlay}>
          <div
            className={`${styles.popup} ${
              popup.type === 'error' ? styles.popupError : styles.popupSuccess
            }`}
          >
            <CheckCircle2 size={42} />

            <span>{popup.text}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddressBook;
