import MainLayout from '../../../layouts/Layout/Layout';
import styles from './styles.module.scss';
import { Link } from 'react-router-dom';
import ProductCard from '@/components/ProductCard/ProductCard';
import { useState, useEffect } from 'react';
import productService from '../../../apis/productService';

function FeaturedProducts() {
  const { container, header, titleBox, underline, viewAll, list } = styles;

  const [products, setProducts] = useState([]);

  useEffect(() => {
    productService.getFeatured()
      .then((res) => setProducts(res.data?.data || []))
      .catch(console.error);
  }, []);

  return (
    <MainLayout>
      <div className={container}>
        <div className={header}>
          <div className={titleBox}>
            <h2>Sản phẩm nổi bật</h2>
            <p>Được khách hàng yêu thích nhất</p>
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
                key={item.id}
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

export default FeaturedProducts;
