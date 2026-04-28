import MyFooter from '../../../components/Footer/Footer';
import MyHeader from '../../../components/Header/Header';
import styles from './styles.module.scss';
import { useNavigate } from 'react-router-dom';

function EmptyCart() {
  const { container, box, icon, title, desc, button } = styles;
  const navigate = useNavigate();

  return (
    <>
      <MyHeader />
      <div className={container}>
        <div className={box}>
          {/* ICON */}
          <div className={icon}>🛒</div>

          {/* TEXT */}
          <h2 className={title}>Giỏ hàng trống</h2>
          <p className={desc}>
            Hãy thêm những sản phẩm yêu thích vào giỏ hàng của bạn
          </p>

          {/* BUTTON */}
          <button className={button} onClick={() => navigate('/')}>
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
      <MyFooter />
    </>
  );
}

export default EmptyCart;
