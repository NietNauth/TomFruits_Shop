import styles from './styles.module.scss';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MyHeader from '../../components/Header/Header';
import MyFooter from '../../components/Footer/Footer';
import axios from 'axios';
import addressService from '../../apis/addressService';
import cartService from '../../apis/cartService';
import { useAuth } from '../../contexts/AuthContext';
import { MapPin, CreditCard, CheckCircle, Plus } from 'lucide-react';
import AddressModal from './AddressModal';
import Swal from 'sweetalert2';
// ─── Constants ───────────────────────────────────────────────────────────────
const SHIPPING_FEE = 30000;
const FREE_SHIP_THRESHOLD = 500000;

const steps = [
  { id: 1, label: 'Thông tin', Icon: MapPin },
  { id: 2, label: 'Thanh toán', Icon: CreditCard },
  { id: 3, label: 'Xác nhận', Icon: CheckCircle },
];

// ─── Component ───────────────────────────────────────────────────────────────
function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, user } = useAuth();

  // ── Cart data ──
  const buyNowData = location.state;
  const [cartItems, setCartItems] = useState(() => {
    if (buyNowData)
      return [{ ...buyNowData.product, quantity: buyNowData.quantity }];
    return JSON.parse(localStorage.getItem('cart')) || [];
  });

  // ── Address Data States ──
  const [userAddresses, setUserAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ── Form state ──
  const [activeStep] = useState(1);
  const [form, setForm] = useState(() => {
    const saved = sessionStorage.getItem('checkoutForm');
    if (saved) return JSON.parse(saved);
    return {
      fullName: user?.name || '',
      phone: user?.phone || '',
      email: user?.email || '',
      tinh: '',
      tinhCode: '',
      quan: '',
      quanCode: '',
      phuong: '',
      phuongCode: '',
      address: '',
      note: '',
    };
  });

  // ── Validation state ──
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');

  // ── Redirect if not logged in & Fetch Data ──
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    if (isLoggedIn) {
      if (buyNowData) {
        // Sync buy-now product to server cart by clearing existing and adding the item
        const syncBuyNow = async () => {
          try {
            await cartService.clearCart();
            await cartService.addItem(buyNowData.product.id, buyNowData.quantity);
          } catch (err) {
            console.error('Failed to sync Buy Now product to server cart:', err);
          }
        };
        syncBuyNow();
      } else {
        // Check for empty cart
        cartService.getCart().then((res) => {
          if (!res.data || res.data.length === 0) {
            navigate('/cart');
            return;
          }
          const normalized = res.data.map((item) => {
            const product = item.product || item;
            return {
              ...product,
              quantity: item.quantity || 1,
              cartItemId: item.id,
            };
          });
          setCartItems(normalized);
        });
      }

      // Fetch saved addresses
      addressService.getAddresses().then((res) => {
        if (res.success) {
          setUserAddresses(res.data);
          const defaultAddr = res.data.find((a) => a.is_default);
          if (defaultAddr) {
            setSelectedAddressId(defaultAddr.id);
            applyAddress(defaultAddr);
          }
        }
      });
    }
  }, [isLoggedIn, buyNowData, navigate]);

  const formatAddressDisplay = (addr) => {
    const parts = [
      addr.receiver_name,
      addr.address_detail,
      addr.ward,
      addr.district,
      addr.province,
    ].filter((p) => p && p !== 'Chưa cập nhật' && p !== '');

    return parts.join(' - ') || 'Địa chỉ chưa đầy đủ';
  };

  const applyAddress = (addr) => {
    setForm((f) => ({
      ...f,
      fullName: addr.receiver_name,
      phone: addr.receiver_phone,
      tinh: addr.province === 'Chưa cập nhật' ? '' : addr.province,
      quan: addr.district === 'Chưa cập nhật' ? '' : addr.district,
      phuong: addr.ward === 'Chưa cập nhật' ? '' : addr.ward,
      address:
        addr.address_detail === 'Chưa cập nhật' ? '' : addr.address_detail,
      tinhCode: '',
      quanCode: '',
      phuongCode: '',
    }));
  };

  const handleAddressSelect = (e) => {
    const id = e.target.value;
    setSelectedAddressId(id);
    if (id === 'new') {
      setForm((f) => ({
        ...f,
        fullName: user?.name || '',
        phone: user?.phone || '',
        tinh: '',
        tinhCode: '',
        quan: '',
        quanCode: '',
        phuong: '',
        phuongCode: '',
        address: '',
      }));
    } else {
      const addr = userAddresses.find((a) => a.id === parseInt(id));
      if (addr) applyAddress(addr);
    }
  };

  const handleRefreshAddresses = async () => {
    try {
      const res = await addressService.getAddresses();
      setUserAddresses(res.data || []);
    } catch (err) {
      console.error('Lỗi tải lại địa chỉ:', err);
    }
  };

  const handleSelectAddress = (addr) => {
    setSelectedAddressId(addr.id);
    applyAddress(addr);
    setIsModalOpen(false);
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * item.quantity,
    0
  );
  const shippingFee = subtotal >= FREE_SHIP_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shippingFee;

  // ── Handlers ──
  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
  };

  const handleSubmit = () => {
    if (!selectedAddressId) {
      Swal.fire({
        icon: 'warning',
        title: 'Chưa chọn địa chỉ',
        text: 'Vui lòng chọn địa chỉ giao hàng!',
        confirmButtonColor: '#22c55e',
        width: '320px',
      });
      return;
    }

    localStorage.setItem(
      'shipping',
      JSON.stringify({
        fullName: form.fullName,
        phone: form.phone,
        address: form.address,
        phuong: form.phuong,
        quan: form.quan,
        tinh: form.tinh,
        note: form.note,
      })
    );
    navigate('/checkout/payment', { state: { cartItems } });
  };

  useEffect(() => {
    sessionStorage.setItem('checkoutForm', JSON.stringify(form));
  }, [form]);

  const getImageUrl = (item) => {
    return item.image_url || item.img || '/placeholder.png';
  };

  const fmt = (n) =>
    Math.round(n || 0)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',') + 'đ';

  return (
    <>
      <MyHeader />
      <div className={styles.container}>
        {/* HERO */}
        <div className={styles.hero}>
          <h1 className={styles.heroTitle}>Thanh toán &amp; Đặt hàng</h1>
          <div className={styles.steps}>
            {steps.map((s, idx) => (
              <div key={s.id} className={styles.stepGroup}>
                <div
                  className={`${styles.step} ${
                    activeStep === s.id
                      ? styles.stepActive
                      : activeStep > s.id
                        ? styles.stepDone
                        : ''
                  }`}
                >
                  <s.Icon size={14} />
                  <span>{s.label}</span>
                </div>
                {idx < steps.length - 1 && (
                  <span className={styles.stepArrow}>›</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CONTENT */}
        <div className={styles.content}>
          <form
            className={styles.left}
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <div className={styles.formCard}>
              <h2 className={styles.formTitle}>
                <MapPin size={18} /> Thông tin giao hàng
              </h2>

              {/* Saved Addresses Section */}
              {isLoggedIn && (
                <div style={{ marginBottom: '24px' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '12px',
                    }}
                  >
                    <label style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                      Địa chỉ nhận hàng
                    </label>
                    <button
                      type='button'
                      className={styles.editBtn}
                      style={{
                        color: '#27ae60',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                      }}
                      onClick={() => setIsModalOpen(true)}
                    >
                      THAY ĐỔI
                    </button>
                  </div>

                  {selectedAddressId !== 'new' ? (
                    <div
                      className={styles.infoBox}
                      style={{
                        border: '1.5px solid #eafaf1',
                        background: '#fbfdfc',
                        cursor: 'pointer',
                      }}
                      onClick={() => setIsModalOpen(true)}
                    >
                      <div className={styles.addrHeader}>
                        <span className={styles.senderName}>
                          {form.fullName}
                        </span>
                        <span className={styles.senderPhone}>{form.phone}</span>
                      </div>
                      <div className={styles.addrDetail}>
                        {form.address}, {form.phuong}, {form.quan}, {form.tinh}
                      </div>
                    </div>
                  ) : (
                    <button
                      type='button'
                      className={styles.addAddressBtn}
                      onClick={() => setIsModalOpen(true)}
                      style={{ width: '100%', marginTop: '0' }}
                    >
                      <Plus size={16} /> Chọn hoặc thêm địa chỉ nhận hàng
                    </button>
                  )}
                </div>
              )}

              {/* Ghi chú */}
              <div className={styles.formGroup}>
                <label>Ghi chú đơn hàng</label>
                <textarea
                  placeholder='Ví dụ: Giao buổi sáng trước 10h, gọi trước khi giao...'
                  rows={4}
                  value={form.note}
                  onChange={handleChange('note')}
                />
              </div>

              {/* Actions */}
              <div className={styles.formActions}>
                <div
                  className={styles.backLink}
                  onClick={() => navigate('/cart')}
                >
                  ← Quay lại giỏ hàng
                </div>
                <button type='submit' className={styles.continueBtn}>
                  Tiếp tục →
                </button>
              </div>
            </div>
          </form>

          {/* RIGHT - ORDER SUMMARY */}
          <div className={styles.right}>
            <div className={styles.summary}>
              <div className={styles.summaryHeader}>
                Đơn hàng ({cartItems.length})
              </div>

              <div className={styles.summaryBody}>
                <div className={styles.orderItems}>
                  {cartItems.map((item) => (
                    <div key={item.id} className={styles.orderItem}>
                      <div className={styles.orderItemThumb}>
                        <img src={getImageUrl(item)} alt={item.name} />
                        <span className={styles.orderItemQtyBadge}>
                          {item.quantity}
                        </span>
                      </div>
                      <div className={styles.orderItemInfo}>
                        <div className={styles.orderItemName}>{item.name}</div>
                        <div className={styles.orderItemPrice}>
                          {fmt((item.price || 0) * item.quantity)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className={styles.divider} />
                <div className={styles.row}>
                  <span>Tạm tính</span>
                  <span>{fmt(subtotal)}</span>
                </div>
                <div className={styles.row}>
                  <span>Phí vận chuyển</span>
                  <span>
                    {shippingFee === 0 ? 'Miễn phí' : fmt(SHIPPING_FEE)}
                  </span>
                </div>
                <div className={styles.divider} />

                <div className={styles.totalRow}>
                  <span>Tổng cộng</span>
                  <span className={styles.totalAmount}>{fmt(total)}</span>
                </div>

                <div className={styles.trust}>
                  🔒 Bảo mật SSL &nbsp;|&nbsp; ✓ Đảm bảo hoàn tiền
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <MyFooter />

      <AddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        addresses={userAddresses}
        onSelect={handleSelectAddress}
        onRefresh={handleRefreshAddresses}
      />
    </>
  );
}

export default CheckoutPage;
