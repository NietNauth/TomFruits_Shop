import styles from './styles.module.scss';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import userService from '../../../apis/userService';

import MyHeader from '../../../components/Header/Header';
import MyFooter from '../../../components/Footer/Footer';
import MainLayout from '../../../layouts/Layout/Layout';

function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await userService.getOrderDetail(id);
        setOrder(res.data?.data || res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

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

    if (!url) {
      return 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="50" height="50"%3E%3Crect width="50" height="50" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-size="10"%3ENo Img%3C/text%3E%3C/svg%3E';
    }

    if (url.startsWith('http')) return url;

    return `http://localhost:8000/storage/${url}`;
  };

  if (isLoading) {
    return <div className={styles.container}>Đang tải...</div>;
  }

  if (!order) {
    return <div className={styles.container}>Không tìm thấy đơn hàng</div>;
  }

  const status = getStatus(order.status);

  return (
    <div className={styles.container}>
      <MyHeader />

      <div className={styles.banner}>
        <h2>Quản lý đơn hàng</h2>{' '}
        <p>Theo dõi và quản lý tất cả đơn hàng của bạn</p>
      </div>

      <MainLayout>
        <div className={styles.detailView}>
          {/* <div className={styles.detailHeader}>
            <button
              onClick={() => navigate('/orders')}
              className={styles.backBtn}
            >
              ← Quay lại
            </button>

            <h3>Chi tiết đơn hàng #{order.order_code || order.id}</h3>
          </div> */}
          <div className={styles.detailHeader}>
            <button
              onClick={() => navigate('/orders')}
              className={styles.backBtn}
            >
              ← Quay lại
            </button>
            <h1>Chi tiết đơn hàng</h1>
            <div className={styles.orderCode}>
              <span>Mã đơn hàng:</span>
              <strong>#{order.order_code || order.id}</strong>
            </div>
          </div>
          <div className={styles.orderInfo}>
            <div className={styles.infoCard}>
              <h4>Thông tin giao hàng</h4>

              <p>
                <strong>Người nhận:</strong> {order.receiver_name}
              </p>

              <p>
                <strong>SĐT:</strong> {order.receiver_phone}
              </p>

              <p>
                <strong>Địa chỉ:</strong> {order.shipping_address}
              </p>

              {order.note && (
                <p>
                  <strong>Ghi chú:</strong> {order.note}
                </p>
              )}
            </div>

            <div className={styles.infoCard}>
              <h4>Thanh toán</h4>

              <p>
                <strong>Phương thức:</strong>{' '}
                {order.payment_method === 'cod'
                  ? 'Thanh toán khi nhận hàng (COD)'
                  : order.payment_method}
              </p>

              <p>
                <strong>Trình trạng:</strong>{' '}
                {order.payment_status === 'paid'
                  ? 'Đã thanh toán'
                  : 'Chưa thanh toán'}
              </p>

              <p>
                <strong>Trạng thái:</strong>{' '}
                <span className={`${styles.status} ${status.className}`}>
                  {status.text}
                </span>
              </p>
            </div>
          </div>

          <div className={styles.itemsSection}>
            <h4>Sản phẩm ({order.items?.length})</h4>
            <div className={styles.orderCard}>
              <div className={styles.itemsList}>
                {order.items?.map((item) => (
                  <div key={item.id} className={styles.itemRow}>
                    <div className={styles.itemMain}>
                      <img
                        src={getImageUrl(
                          item.product_image_url,
                          item.product_img
                        )}
                        alt={item.product_name}
                      />

                      <div>
                        <p className={styles.itemName}>{item.product_name}</p>
                        <span className={styles.itemMeta}>
                          Số lượng: x{item.quantity}
                        </span>
                      </div>
                    </div>

                    <p className={styles.itemPrice}>
                      {Math.round(item.price).toLocaleString()}đ
                    </p>
                  </div>
                ))}
              </div>

              <div className={styles.orderSummary}>
                <div className={styles.summaryRow}>
                  <span>Tạm tính:</span>

                  <span>{Math.round(order.total_price).toLocaleString()}đ</span>
                </div>

                {order.shipping_fee > 0 && (
                  <div className={styles.summaryRow}>
                    <span>Phí vận chuyển:</span>

                    <span>
                      {Math.round(order.shipping_fee).toLocaleString()}đ
                    </span>
                  </div>
                )}

                {order.discount_amount > 0 && (
                  <div className={styles.summaryRow}>
                    <span>
                      Giảm giá{' '}
                      {order.coupon?.code && (
                        <b style={{ color: '#16a34a' }}>
                          ({order.coupon.code})
                        </b>
                      )}
                      :
                    </span>

                    <span className={styles.discount}>
                      -{Math.round(order.discount_amount).toLocaleString()}đ
                    </span>
                  </div>
                )}

                <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                  <span>Tổng cộng:</span>

                  <span>{Math.round(order.final_price).toLocaleString()}đ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>

      <MyFooter />
    </div>
  );
}

export default OrderDetail;
