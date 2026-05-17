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
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

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
    is_default: false
  });

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
        confirmButtonText: 'Đồng ý'
      });
    }
  };

  const fetchProvinces = async () => {
    try {
      const res = await axios.get(`${PROVINCE_API}/p/`);
      setProvinces(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (formData.provinceCode) {
      axios.get(`${PROVINCE_API}/p/${formData.provinceCode}?depth=2`).then(res => {
        setDistricts(res.data.districts);
      });
    } else {
      setDistricts([]);
    }
    setWards([]);
  }, [formData.provinceCode]);

  useEffect(() => {
    if (formData.districtCode) {
      axios.get(`${PROVINCE_API}/d/${formData.districtCode}?depth=2`).then(res => {
        setWards(res.data.wards);
      });
    } else {
      setWards([]);
    }
  }, [formData.districtCode]);

  const handleChange = (field, value) => {
    if (field === 'province') {
      const selected = provinces.find(p => p.name === value);
      setFormData(prev => ({ 
        ...prev, 
        province: value, 
        provinceCode: selected?.code || '',
        district: '', districtCode: '', ward: '', wardCode: '' 
      }));
    } else if (field === 'district') {
      const selected = districts.find(d => d.name === value);
      setFormData(prev => ({ 
        ...prev, 
        district: value, 
        districtCode: selected?.code || '',
        ward: '', wardCode: '' 
      }));
    } else if (field === 'ward') {
      const selected = wards.find(w => w.name === value);
      setFormData(prev => ({ 
        ...prev, 
        ward: value, 
        wardCode: selected?.code || '',
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await addressService.createAddress(formData);
      if (res.success) {
        Swal.fire({
          title: 'Thành công!',
          text: 'Thêm địa chỉ mới thành công!',
          icon: 'success',
          confirmButtonColor: '#10b981',
          confirmButtonText: 'Đồng ý'
        });
        setShowForm(false);
        fetchAddresses();
        setFormData({
          receiver_name: '', receiver_phone: '',
          province: '', provinceCode: '', district: '', districtCode: '',
          ward: '', wardCode: '', address_detail: '', is_default: false
        });
      }
    } catch (err) {
      Swal.fire({
        title: 'Thất bại!',
        text: err.message || 'Lỗi khi lưu địa chỉ.',
        icon: 'error',
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'Đồng ý'
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
      cancelButtonText: 'Hủy'
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
              confirmButtonText: 'Đồng ý'
            });
            fetchAddresses();
          }
        } catch (err) {
          Swal.fire({
            title: 'Thất bại!',
            text: err.message || 'Lỗi khi xóa địa chỉ.',
            icon: 'error',
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Đồng ý'
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
          confirmButtonText: 'Đồng ý'
        });
        fetchAddresses();
      }
    } catch (err) {
      Swal.fire({
        title: 'Thất bại!',
        text: err.message || 'Lỗi hệ thống.',
        icon: 'error',
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'Đồng ý'
      });
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '600' }}>Sổ địa chỉ</h3>
        <button 
          onClick={() => setShowForm(!showForm)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#16a34a', color: 'white', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
        >
          <Plus size={18} /> {showForm ? 'Hủy' : 'Thêm địa chỉ mới'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ backgroundColor: '#f9fafb', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #e5e7eb' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500' }}>Tên người nhận</label>
              <input required value={formData.receiver_name} onChange={e => handleChange('receiver_name', e.target.value)} style={{ padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500' }}>Số điện thoại</label>
              <input required value={formData.receiver_phone} onChange={e => handleChange('receiver_phone', e.target.value)} style={{ padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }} />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500' }}>Tỉnh/Thành</label>
              <select required value={formData.province} onChange={e => handleChange('province', e.target.value)} style={{ padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}>
                <option value="">Chọn tỉnh thành</option>
                {provinces.map(p => <option key={p.code} value={p.name}>{p.name}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500' }}>Quận/Huyện</label>
              <select required value={formData.district} onChange={e => handleChange('district', e.target.value)} style={{ padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}>
                <option value="">Chọn quận huyện</option>
                {districts.map(d => <option key={d.code} value={d.name}>{d.name}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500' }}>Phường/Xã</label>
              <select required value={formData.ward} onChange={e => handleChange('ward', e.target.value)} style={{ padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}>
                <option value="">Chọn phường xã</option>
                {wards.map(w => <option key={w.code} value={w.name}>{w.name}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500' }}>Địa chỉ chi tiết</label>
              <input required value={formData.address_detail} onChange={e => handleChange('address_detail', e.target.value)} style={{ padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }} />
            </div>
          </div>
          <div style={{ marginTop: '15px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
              <input type="checkbox" checked={formData.is_default} onChange={e => handleChange('is_default', e.target.checked)} />
              Đặt làm địa chỉ mặc định
            </label>
          </div>
          <button type="submit" disabled={loading} style={{ marginTop: '20px', width: '100%', padding: '10px', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
            {loading ? 'Đang lưu...' : 'Lưu địa chỉ'}
          </button>
        </form>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {addresses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>Bạn chưa có địa chỉ nào lưu lại.</div>
        ) : (
          addresses.map(addr => (
            <div key={addr.id} style={{ padding: '15px', border: '1px solid #e5e7eb', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', backgroundColor: addr.is_default ? '#f0fdf4' : 'transparent' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '5px' }}><User size={16}/> {addr.receiver_name}</span>
                  {addr.is_default && <span style={{ fontSize: '12px', color: '#16a34a', backgroundColor: '#dcfce7', padding: '2px 8px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle2 size={12}/> Mặc định</span>}
                </div>
                <span style={{ fontSize: '14px', color: '#4b5563', display: 'flex', alignItems: 'center', gap: '5px' }}><Phone size={16}/> {addr.receiver_phone}</span>
                <span style={{ fontSize: '14px', color: '#4b5563', display: 'flex', alignItems: 'center', gap: '5px' }}><MapPin size={16}/> {addr.address_detail}, {addr.ward}, {addr.district}, {addr.province}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                {!addr.is_default && (
                  <button 
                    onClick={() => handleSetDefault(addr.id)}
                    style={{ fontSize: '13px', color: '#2563eb', border: 'none', background: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Thiết lập mặc định
                  </button>
                )}
                {!addr.is_default && (
                  <button 
                    onClick={() => handleDelete(addr.id)}
                    style={{ color: '#dc2626', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AddressBook;
