import styles from './styles.module.scss';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../../apis/userService';
import Swal from 'sweetalert2';
import MyHeader from '../../components/Header/Header';
import MyFooter from '../../components/Footer/Footer';
import MainLayout from '../../layouts/Layout/Layout';
function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    userService
      .getMyOrders()
      .then((res) => {
        // Laravel pagination wraps data in a 'data' field
        const ordersArray = res.data?.data || [];
        setOrders(ordersArray);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const getStatus = (status) => {
    switch (status) {
      case 'pending':
        return { text: 'Chờ xác nhận', className: styles.pending };
      case 'processing':
        return { text: 'Đang xử lý', className: styles.processing };
      case 'shipping':
        return { text: 'Đang giao', className: styles.shipping };
      case 'completed':
      case 'done':
        return { text: 'Đã giao', className: styles.done };
      case 'cancelled':
        return { text: 'Đã huỷ', className: styles.cancel };
      default:
        return { text: status, className: '' };
    }
  };

  const getImageUrl = (imgUrl, altUrl) => {
    const url = imgUrl || altUrl;
    if (!url)
      return 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2250%22%20height%3D%2250%22%20viewBox%3D%220%200%2050%2050%22%3E%3Crect%20width%3D%2250%22%20height%3D%2250%22%20fill%3D%22%23f3f4f6%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22%239ca3af%22%20font-family%3D%22sans-serif%22%20font-size%3D%2210%22%3ENo%20Img%3C%2Ftext%3E%3C%2Fsvg%3E';
    if (url.startsWith('http')) return url;
    return `http://localhost:8000/storage/${url}`;
  };

  if (isLoading) {
    return <div className={styles.container}>Đang tải lịch sử đơn hàng...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className={styles.container}>
        <MyHeader />
        <MainLayout>
          <h3>📦 Danh sách đơn hàng</h3>
          <div className={styles.empty}>
            <p>Bạn chưa có đơn hàng nào.</p>
          </div>
        </MainLayout>
        <MyFooter />
      </div>
    );
  }

  const handleCancelOrder = async (orderId) => {
    const result = await Swal.fire({
      title: 'Xác nhận hủy đơn?',
      text: 'Bạn sẽ không thể hoàn tác hành động này!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Đồng ý hủy',
      cancelButtonText: 'Quay lại',
    });

    if (result.isConfirmed) {
      try {
        setIsLoading(true);
        await userService.cancelOrder(orderId);
        Swal.fire(
          'Đã hủy!',
          'Đơn hàng của bạn đã được hủy thành công.',
          'success'
        );
        // Refresh orders
        const res = await userService.getMyOrders();
        setOrders(res.data?.data || []);
      } catch (err) {
        Swal.fire(
          'Lỗi!',
          err.response?.data?.message || 'Không thể hủy đơn hàng này.',
          'error'
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className={styles.container}>
      <MyHeader />
      {/* Banner */}{' '}
      <div className={styles.banner}>
        {' '}
        <h2>Quản lý đơn hàng</h2>{' '}
        <p>Theo dõi và quản lý tất cả đơn hàng của bạn</p>{' '}
      </div>
      <MainLayout>
        <h3>📦 Danh sách đơn hàng</h3>

        <div className={styles.list}>
          {orders.map((order) => {
            const status = getStatus(order.status);

            return (
              <div key={order.id} className={styles.card}>
                <div className={styles.top}>
                  <div>
                    <p className={styles.code}>
                      #{order.order_code || order.id}
                    </p>
                    <span>
                      {order.created_at
                        ? new Date(order.created_at).toLocaleDateString('vi-VN')
                        : order.date}
                    </span>
                  </div>

                  <div className={`${styles.status} ${status.className}`}>
                    {status.text}
                  </div>
                </div>

                <p className={styles.items}>
                  {order.items?.length || 0} sản phẩm
                </p>

                <div className={styles.bottom}>
                  <div className={styles.actions}>
                    <button
                      onClick={() => {
                        navigate(`/orders/${order.id}`);
                      }}
                      className={styles.detail}
                    >
                      Xem chi tiết
                    </button>
                    {(order.status === 'shipping' ||
                      order.status === 'processing') && (
                      <button className={styles.track}>Theo dõi</button>
                    )}
                    {order.status === 'pending' &&
                      order.payment_status !== 'paid' && (
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          className={styles.track}
                          style={{
                            backgroundColor: '#fee2e2',
                            color: '#dc2626',
                          }}
                        >
                          Hủy đơn
                        </button>
                      )}
                  </div>

                  <p className={styles.price}>
                    {Math.round(order.final_price || order.total || 0)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    đ
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </MainLayout>
      <MyFooter />
    </div>
  );
}

export default OrderHistory;
