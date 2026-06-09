import MyFooter from '../../../components/Footer/Footer';
import MyHeader from '../../../components/Header/Header';
import styles from './styles.module.scss';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { useAuth } from '../../../hooks/useAuth';
import { removeFromCart, updateCartQuantity } from '../../../utils/cart';

const SHIPPING_FEE = 30000;
const FREE_SHIP_THRESHOLD = 500000;

function CartContent({ cartItems, setCartItems }) {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState({ text: '', type: '' });

  const formatPrice = (value) => {
    if (value === undefined || value === null) return '0đ';
    return (
      Math.round(value)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',') + 'đ'
    );
  };

  const pendingUpdates = useRef({});

  const changeQty = (item, newQty) => {
    // 1. Cập nhật UI cục bộ ngay lập tức để người dùng thấy số lượng và giá thay đổi không trễ
    setCartItems((prev) =>
      prev.map((x) => (x.id === item.id ? { ...x, quantity: newQty } : x))
    );

    // 2. Debounce cuộc gọi API đồng bộ CSDL
    if (pendingUpdates.current[item.id]) {
      clearTimeout(pendingUpdates.current[item.id]);
    }

    pendingUpdates.current[item.id] = setTimeout(async () => {
      await updateCartQuantity(item.id, newQty, item.cartItemId);
      delete pendingUpdates.current[item.id];
    }, 450); // 450ms debounce
  };

  const increaseQty = (item) => {
    if (item.quantity >= item.stock) {
      Swal.fire({
        icon: 'warning',
        title: 'Giới hạn tồn kho',
        text: `Số lượng sản phẩm trong giỏ đã đạt mức tối đa của kho (Tồn kho: ${item.stock})`,
        confirmButtonText: 'Đồng ý',
      });
      return;
    }
    changeQty(item, item.quantity + 1);
  };

  const decreaseQty = (item) => {
    if (item.quantity > 1) {
      changeQty(item, item.quantity - 1);
    } else {
      removeItem(item);
    }
  };

  const handleQtyChange = (item, valStr) => {
    if (valStr === '') {
      setCartItems((prev) =>
        prev.map((x) => (x.id === item.id ? { ...x, quantity: '' } : x))
      );
      return;
    }

    let val = parseInt(valStr, 10);
    if (isNaN(val) || val < 1) {
      val = 1;
    }

    if (val > item.stock) {
      Swal.fire({
        icon: 'warning',
        title: 'Giới hạn tồn kho',
        text: `Số lượng vượt quá tồn kho tối đa của sản phẩm này (Tồn kho: ${item.stock})`,
        confirmButtonText: 'Đồng ý',
      });
      val = item.stock;
    }

    changeQty(item, val);
  };

  const handleQtyBlur = (item) => {
    if (item.quantity === '' || item.quantity < 1) {
      changeQty(item, 1);
    }
  };

  const removeItem = async (item) => {
    await removeFromCart(item.id, item.cartItemId);
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const remaining = FREE_SHIP_THRESHOLD - subtotal;
  const shippingFee = subtotal >= FREE_SHIP_THRESHOLD ? 0 : SHIPPING_FEE;
  // const total = subtotal + shippingFee;
  const discountAmount = subtotal * discount;
  const total = subtotal - discountAmount + shippingFee;

  const handleCheckout = () => {
    if (!isLoggedIn) {
      Swal.fire({
        icon: 'warning',
        title: 'Chưa đăng nhập',
        text: 'Vui lòng đăng nhập trước khi thanh toán!',
        confirmButtonText: 'Đăng nhập',
        customClass: {
          popup: styles.swalPopup,
          title: styles.swalTitle,
          htmlContainer: styles.swalText,
          confirmButton: styles.swalBtn,
        },
        buttonsStyling: false,
      }).then(() => {
        navigate('/login');
      });
      return;
    }
    navigate('/checkout');
  };
  const handleApplyCoupon = () => {
    if (coupon.trim().toUpperCase() === 'TOMFRUITS20') {
      setDiscount(0.2); // giảm 20%
      setCouponMessage({
        text: `✓ Áp dụng mã ${coupon.trim().toUpperCase()} thành công!`,
        type: 'success',
      });
    } else {
      setDiscount(0);
      setCouponMessage({ text: '✗ Mã không hợp lệ!', type: 'error' });
    }
  };
  const [inputValues, setInputValues] = useState({});
  useEffect(() => {
    const values = {};

    cartItems.forEach((item) => {
      values[item.id] = item.quantity;
    });

    setInputValues(values);
  }, [cartItems]);
  return (
    <>
      <MyHeader />
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Giỏ hàng của tôi</h2>
          <p>{cartItems.length} sản phẩm trong giỏ hàng</p>
        </div>

        <div className={styles.content}>
          {/* LEFT */}
          <div className={styles.left}>
            <div className={styles.tableHeader}>
              <div>Sản phẩm</div>
              <div>Đơn giá</div>
              <div>Số lượng</div>
              <div>Thành tiền</div>
            </div>

            {cartItems.length === 0 ? (
              <div className={styles.empty}>Giỏ hàng trống</div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className={styles.item}>
                  {/* PRODUCT */}
                  <div className={styles.product}>
                    <img
                      src={
                        item.img ||
                        'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22150%22%20height%3D%22150%22%20viewBox%3D%220%200%20150%20150%22%3E%3Crect%20width%3D%22150%22%20height%3D%22150%22%20fill%3D%22%23f3f4f6%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22%239ca3af%22%20font-family%3D%22sans-serif%22%20font-size%3D%2214%22%3ENo%20Img%3C%2Ftext%3E%3C%2Fsvg%3E'
                      }
                      alt={item.name}
                    />
                    <div className={styles.info}>
                      <div className={styles.name}>{item.name}</div>
                      <div className={styles.category}>{item.category}</div>
                      <div className={styles.unit}>{item.unit}</div>
                    </div>
                  </div>

                  {/* PRICE */}
                  <div className={styles.price}>{formatPrice(item.price)}</div>

                  {/* QUANTITY + DELETE */}
                  <div className={styles.quantityWrap}>
                    <div className={styles.quantity}>
                      <button onClick={() => decreaseQty(item)}>−</button>
                      <input
                        type='number'
                        value={item.quantity}
                        onChange={(e) => handleQtyChange(item, e.target.value)}
                        onBlur={() => handleQtyBlur(item)}
                        min={1}
                        max={item.stock}
                      />
                      <button
                        onClick={() => increaseQty(item)}
                        disabled={item.quantity >= item.stock}
                        style={{
                          cursor:
                            item.quantity >= item.stock
                              ? 'not-allowed'
                              : 'pointer',
                          opacity: item.quantity >= item.stock ? 0.5 : 1,
                        }}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => removeItem(item)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* TOTAL */}
                  <div className={styles.total}>
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))
            )}

            <div className={styles.backLink} onClick={() => navigate('/')}>
              ← Tiếp tục mua sắm
            </div>
          </div>

          {/* RIGHT */}
          <div className={styles.right}>
            <div className={styles.summary}>
              <div className={styles.summaryHeader}>Tóm tắt đơn hàng</div>

              <div className={styles.summaryBody}>
                {/* COUPON */}
                <div className={styles.couponRow}>
                  <span className={styles.couponLabel}> Mã giảm giá</span>
                  <div className={styles.couponInputWrapper}></div>
                  <div className={styles.couponInput}>
                    <input
                      type='text'
                      placeholder='Nhập mã...'
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                    />
                    <button onClick={handleApplyCoupon}>Áp dụng</button>
                  </div>
                  {couponMessage.text && (
                    <div
                      className={
                        couponMessage.type === 'success'
                          ? styles.couponSuccess
                          : styles.couponError
                      }
                    >
                      {couponMessage.text}
                    </div>
                  )}
                  <div className={styles.couponHint}>Thử mã: TOMFRUITS20</div>
                </div>

                <div className={styles.divider} />

                {/* SUBTOTAL */}
                <div className={styles.row}>
                  <span>Tạm tính ({cartItems.length} sản phẩm)</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                {/* SHIPPING */}
                <div className={styles.row}>
                  <span>Phí vận chuyển</span>
                  <span>
                    {shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}
                  </span>
                </div>

                {remaining > 0 && (
                  <div className={styles.freeShipHint}>
                    Mua thêm {formatPrice(remaining)} để được miễn phí ship
                  </div>
                )}

                <div className={styles.divider} />

                {/* TOTAL */}
                {discount > 0 && (
                  <div className={styles.row}>
                    <span>Giảm giá</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className={styles.totalRow}>
                  <span>Tổng cộng</span>
                  <span className={styles.totalAmount}>
                    {formatPrice(total)}
                  </span>
                </div>

                <button className={styles.checkoutBtn} onClick={handleCheckout}>
                  Tiến hành thanh toán →
                </button>

                <div className={styles.trust}>
                  🔒 Bảo mật SSL &nbsp;|&nbsp; ✓ Đảm bảo hoàn tiền
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <MyFooter />
    </>
  );
}

export default CartContent;
