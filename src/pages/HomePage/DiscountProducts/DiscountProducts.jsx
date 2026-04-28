import MainLayout from '../../../layouts/Layout/Layout';
import styles from './styles.module.scss';
import { Link } from 'react-router-dom';
import ProductCard from '../../../components/ProductCard/ProductCard';
import { useState, useEffect } from 'react';
import productService from '../../../apis/productService';

function DiscountProducts() {
  const { container, header, titleBox, underline, viewAll, list } = styles;
  
  const [products, setProducts] = useState([]);

  useEffect(() => {
    productService.getSale()
      .then((res) => setProducts(res.data?.data || []))
      .catch(console.error);
  }, []);
  return (
    <MainLayout>
      <div className={container}>
        <div className={header}>
          <div className={titleBox}>
            <h2>🔥Đang giảm giá</h2>
            <p>Ưu đãi có hạn, mua ngay kẻo hết!</p>
            <div className={underline}></div>
          </div>

          <Link to='/products' className={viewAll}>
            Xem tất cả <span>›</span>
          </Link>
        </div>

        <div className={list}>
          {products.slice(0, 4).map((item, id) => {
            return (
              <ProductCard
                key={id}
                id={item.id}
                name={item.name}
                category={item.category?.title || 'Chưa phân loại'}
                price={item.price}
                oldPrice={item.old_price}
                discount={item.discount}
                tag={item.tag}
                img={item.image_url}
                unit={item.unit}
                status={item.status}
              />
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
}

export default DiscountProducts;
