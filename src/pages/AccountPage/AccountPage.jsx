import MyHeader from '../../components/Header/Header';
import MyFooter from '../../components/Footer/Footer';
import styles from './styles.module.scss';
import Infomation from './Infomation/Infomation';
import OrderHistory from './OrderHistory/OrderHistory';
import ChangePassword from './ChangePassword/ChangePassword';
import AddressBook from './AddressBook/AddressBook';
import { useState } from 'react';
import MainLayout from '../../layouts/Layout/Layout';
function AccountPage() {
  const { container } = styles;
  const user = JSON.parse(localStorage.getItem('user'));
  const [activeTab, setActiveTab] = useState('profile');
  return (
    <div className={container}>
      <MyHeader />
      {/* Banner */}
      <div className={styles.banner}>
        <h2>Quản lý tài khoản</h2>
        <p>Xem và cập nhật thông tin cá nhân của bạn</p>
      </div>
      <MainLayout>
        <div className={styles.content}>
          <div className={styles.sidebar}>
            <div className={styles.profileBox}>
              <div className={styles.avatar}>{user?.name?.charAt(0)}</div>
              {user && (
                <>
                  <h4>{user.name}</h4>
                  <span>{user.email}</span>
                  <p>Thành viên</p>
                </>
              )}
              <div className={styles.menu}>
                <button
                  className={activeTab === 'profile' ? styles.active : ''}
                  onClick={() => setActiveTab('profile')}
                >
                  Thông tin cá nhân
                </button>
                <button
                  className={activeTab === 'orders' ? styles.active : ''}
                  onClick={() => setActiveTab('orders')}
                >
                  Lịch sử đơn hàng
                </button>
                <button
                  className={activeTab === 'password' ? styles.active : ''}
                  onClick={() => setActiveTab('password')}
                >
                  Đổi mật khẩu
                </button>
                <button
                  className={activeTab === 'addresses' ? styles.active : ''}
                  onClick={() => setActiveTab('addresses')}
                >
                  Sổ địa chỉ
                </button>
              </div>
            </div>
          </div>
          <div className={styles.main}>
            {activeTab === 'profile' && <Infomation />}
            {activeTab === 'orders' && <OrderHistory />}
            {activeTab === 'password' && <ChangePassword />}
            {activeTab === 'addresses' && <AddressBook />}
          </div>
        </div>
      </MainLayout>
      <MyFooter />
    </div>
  );
}

export default AccountPage;
