import Button from '../../../components/Button/Button';
import styles from './styles.module.scss';
import { Link } from 'react-router-dom';
function Banner() {
  const { container, content, title, des } = styles;
  return (
    <div className={container}>
      <div className={content}>
        <h1 className={title}>
          Trái cây sạch <br />
          Tươi mỗi ngày
        </h1>
        <div className={des}>
          Tom Fruits mang đến những loại trái cây tươi ngon, sạch an toàn từ{' '}
          <br />
          khắp Việt Nam và nhập khẩu chất lượng cao.
        </div>
        <Link to='/products'>
          <Button content={'Mua ngay'} />
        </Link>
        <Button
          content={'Tìm hiểu thêm'}
          onClick={() =>
            document
              .getElementById('why-choose')
              .scrollIntoView({ behavior: 'smooth' })
          }
        />
      </div>
    </div>
  );
}

export default Banner;
