import { useNavigate } from 'react-router-dom';
import styles from '../styles.module.scss';
import { useContext } from 'react';
function Menu({ content, className }) {
  const { menu } = styles;
  const navigate = useNavigate();
  const handleClickShow = () => {
    if (content == 'Đăng nhập') {
      navigate('/login');
    }
    if (content == 'Trang chủ') {
      navigate('/');
    }
    if (content == 'Sản phẩm') {
      navigate('/products');
    }
    if (content == 'Cửa hàng') {
      navigate('/system');
    }
    if (content == 'Liên hệ') {
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          document
            .getElementById('contact')
            ?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        document
          .getElementById('contact')
          ?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };
  return (
    // <div className={menu}>{content}</div>;
    <div className={`${menu} ${className}`} onClick={handleClickShow}>
      {content}
    </div>
  );
}

export default Menu;
