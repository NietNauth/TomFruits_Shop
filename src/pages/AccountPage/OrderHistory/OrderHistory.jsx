import styles from './styles.module.scss';
import { useState, useEffect } from 'react';
import userService from '../../../apis/userService';
import Swal from 'sweetalert2';

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    userService.getMyOrders()
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
    if (!url) return 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2250%22%20height%3D%2250%22%20viewBox%3D%220%200%2050%2050%22%3E%3Crect%20width%3D%2250%22%20height%3D%2250%22%20fill%3D%22%23f3f4f6%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22%239ca3af%22%20font-family%3D%22sans-serif%22%20font-size%3D%2210%22%3ENo%20Img%3C%2Ftext%3E%3C%2Fsvg%3E';
    if (url.startsWith('http')) return url;
    return `http://localhost:8000/storage/${url}`;
  };

  if (isLoading) {
    return <div className={styles.container}>Đang tải lịch sử đơn hàng...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className={styles.container}>
        <h3>📦 Lịch sử đơn hàng</h3>
        <div className={styles.empty}>
          <p>Bạn chưa có đơn hàng nào.</p>
        </div>
      </div>
    );
  }

  if (selectedOrder) {
    const status = getStatus(selectedOrder.status);
    return (
      <div className={styles.detailView}>
        <div className={styles.detailHeader}>
          <button onClick={() => setSelectedOrder(null)} className={styles.backBtn}>
            ← Quay lại
          </button>
          <h3>Chi tiết đơn hàng #{selectedOrder.order_code || selectedOrder.id}</h3>
        </div>

        <div className={styles.orderInfo}>
          <div className={styles.infoCard}>
            <h4>Thông tin giao hàng</h4>
            <p><strong>Người nhận:</strong> {selectedOrder.receiver_name}</p>
            <p><strong>SĐT:</strong> {selectedOrder.receiver_phone}</p>
            <p><strong>Địa chỉ:</strong> {selectedOrder.shipping_address}</p>
            {selectedOrder.note && <p><strong>Ghi chú:</strong> {selectedOrder.note}</p>}
          </div>

          <div className={styles.infoCard}>
            <h4>Thanh toán</h4>
            <p><strong>Phương thức:</strong> {selectedOrder.payment_method === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : selectedOrder.payment_method}</p>
            <p><strong>Trình trạng:</strong> {selectedOrder.payment_status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}</p>
            <p><strong>Trạng thái:</strong> <span className={`${styles.status} ${status.className}`}>{status.text}</span></p>
          </div>
        </div>

        <div className={styles.itemsList}>
          <h4>Sản phẩm ({selectedOrder.items?.length})</h4>
          {selectedOrder.items.map((item) => (
            <div key={item.id} className={styles.itemRow}>
              <div className={styles.itemMain}>
                <img src={getImageUrl(item.product_image_url, item.product_img)} alt={item.product_name} />
                <div>
                  <p className={styles.itemName}>{item.product_name}</p>
                  <span>SL: x{item.quantity}</span>
                </div>
              </div>
              <p className={styles.itemPrice}>{Math.round(item.price).toLocaleString()}đ</p>
            </div>
          ))}
        </div>

        <div className={styles.orderSummary}>
          <div className={styles.summaryRow}>
            <span>Tạm tính:</span>
            <span>{Math.round(selectedOrder.total_price).toLocaleString()}đ</span>
          </div>
          {selectedOrder.shipping_fee > 0 && (
            <div className={styles.summaryRow}>
              <span>Phí vận chuyển:</span>
              <span>{Math.round(selectedOrder.shipping_fee).toLocaleString()}đ</span>
            </div>
          )}
          {selectedOrder.discount_amount > 0 && (
            <div className={styles.summaryRow}>
              <span>Giảm giá {selectedOrder.coupon?.code && <b style={{color: '#16a34a'}}>({selectedOrder.coupon.code})</b>}:</span>
              <span className={styles.discount}>-{Math.round(selectedOrder.discount_amount).toLocaleString()}đ</span>
            </div>
          )}
          <div className={`${styles.summaryRow} ${styles.totalRow}`}>
            <span>Tổng cộng:</span>
            <span>{Math.round(selectedOrder.final_price).toLocaleString()}đ</span>
          </div>
        </div>
      </div>
    );
  }

  const handleDetailClick = async (order) => {
    try {
      setIsLoading(true);
      const res = await userService.getOrderDetail(order.id);
      setSelectedOrder(res.data?.data || res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    const result = await Swal.fire({
      title: 'Xác nhận hủy đơn?',
      text: "Bạn sẽ không thể hoàn tác hành động này!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Đồng ý hủy',
      cancelButtonText: 'Quay lại'
    });

    if (result.isConfirmed) {
      try {
        setIsLoading(true);
        await userService.cancelOrder(orderId);
        Swal.fire('Đã hủy!', 'Đơn hàng của bạn đã được hủy thành công.', 'success');
        // Refresh orders
        const res = await userService.getMyOrders();
        setOrders(res.data?.data || []);
      } catch (err) {
        Swal.fire('Lỗi!', err.response?.data?.message || 'Không thể hủy đơn hàng này.', 'error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className={styles.container}>
      <h3>📦 Lịch sử đơn hàng</h3>

      <div className={styles.list}>
        {orders.map((order) => {
          const status = getStatus(order.status);

          return (
            <div key={order.id} className={styles.card}>
              <div className={styles.top}>
                <div>
                  <p className={styles.code}>#{order.order_code || order.id}</p>
                  <span>{order.created_at ? new Date(order.created_at).toLocaleDateString('vi-VN') : order.date}</span>
                </div>

                <div className={`${styles.status} ${status.className}`}>
                  {status.text}
                </div>
              </div>

              <p className={styles.items}>{order.items?.length || 0} sản phẩm</p>

              <div className={styles.bottom}>
                <div className={styles.actions}>
                  <button onClick={() => handleDetailClick(order)} className={styles.detail}>Xem chi tiết</button>
                  {(order.status === 'shipping' || order.status === 'processing') && (
                    <button className={styles.track}>Theo dõi</button>
                  )}
                  {order.status === 'pending' && order.payment_status !== 'paid' && (
                    <button onClick={() => handleCancelOrder(order.id)} className={styles.track} style={{backgroundColor: '#fee2e2', color: '#dc2626'}}>Hủy đơn</button>
                  )}
                </div>

                <p className={styles.price}>{Math.round(order.final_price || order.total || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}đ</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default OrderHistory;
