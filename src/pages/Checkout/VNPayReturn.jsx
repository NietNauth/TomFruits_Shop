import styles from './styles.module.scss';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import MyHeader from '../../components/Header/Header';
import MyFooter from '../../components/Footer/Footer';
import orderService from '../../apis/orderService';

function VNPayReturn() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null); // 'success' | 'error'
  const [order, setOrder] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleReturn = async () => {
      const queryParams = new URLSearchParams(location.search);
      const params = Object.fromEntries(queryParams.entries());

      try {
        const res = await orderService.handleVNPayReturn(params);
        if (res.success) {
          setStatus('success');
          setOrder(res.data);
          // Xoá cart
          localStorage.removeItem('cart');
          window.dispatchEvent(new Event('cartUpdated'));
          sessionStorage.removeItem('checkoutForm');
        } else {
          setStatus('error');
          setMessage(res.message || 'Thanh toán không thành công');
        }
      } catch (err) {
        console.error(err);
        setStatus('error');
        setMessage(
          err.response?.data?.message || 'Có lỗi xảy ra khi xác thực giao dịch'
        );
      } finally {
        setLoading(false);
      }
    };

    handleReturn();
  }, [location.search]);

  return (
    <>
      <MyHeader />
      <div className={styles.container}>
        <div
          className={styles.content}
          style={{
            minHeight: '60vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            className={styles.formCard}
            style={{
              textAlign: 'center',
              padding: '60px 40px',
              maxWidth: '600px',
              width: '100%',
            }}
          >
            {loading ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '20px',
                }}
              >
                <Loader2
                  size={60}
                  className={styles.spin}
                  style={{
                    color: '#16a34a',
                    animation: 'spin 1s linear infinite',
                  }}
                />
                <h3>Đang xác thực giao dịch...</h3>
                <p>Vui lòng không tắt trình duyệt hoặc tải lại trang.</p>
              </div>
            ) : status === 'success' ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '20px',
                }}
              >
                <CheckCircle size={80} color='#16a34a' />
                <h2 style={{ color: '#16a34a', fontSize: '28px' }}>
                  Thanh toán thành công!
                </h2>
                <p style={{ fontSize: '16px', color: '#666' }}>
                  Cảm ơn bạn đã đặt hàng. Đơn hàng{' '}
                  <strong>{order?.order_code || `#${order?.id}`}</strong> của
                  bạn đang được xử lý.
                </p>
                <div
                  style={{ marginTop: '30px', display: 'flex', gap: '15px' }}
                >
                  <button
                    className={styles.continueBtn}
                    onClick={() => navigate('/')}
                    style={{ padding: '12px 30px' }}
                  >
                    Tiếp tục mua sắm
                  </button>
                  <button
                    className={styles.backLink}
                    onClick={() => navigate('/orders')}
                    style={{
                      border: '1px solid #ddd',
                      padding: '12px 30px',
                      cursor: 'pointer',
                      borderRadius: '8px',
                    }}
                  >
                    Xem đơn hàng
                  </button>
                </div>
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '20px',
                }}
              >
                <XCircle size={80} color='#dc2626' />
                <h2 style={{ color: '#dc2626', fontSize: '28px' }}>
                  Thanh toán thất bại
                </h2>
                <p style={{ fontSize: '16px', color: '#666' }}>{message}</p>
                <div
                  style={{ marginTop: '30px', display: 'flex', gap: '15px' }}
                >
                  <button
                    className={styles.continueBtn}
                    onClick={() => navigate('/cart')}
                    style={{ background: '#dc2626', padding: '12px 30px' }}
                  >
                    Quay lại giỏ hàng
                  </button>
                  <button
                    className={styles.backLink}
                    onClick={() => navigate('/')}
                    style={{
                      border: '1px solid #ddd',
                      padding: '12px 30px',
                      cursor: 'pointer',
                      borderRadius: '8px',
                    }}
                  >
                    Về trang chủ
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <MyFooter />
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}

export default VNPayReturn;
