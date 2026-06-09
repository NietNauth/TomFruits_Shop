import CategoryProductsInfo from './CategoryProductsInfo';
import MainLayout from '../../../layouts/Layout/Layout';
import styles from './styles.module.scss';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import categoryService from '../../../apis/categoryService';

function CategoryProducts() {
  const { container, header, titleBox, underline, viewAll, list } = styles;

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    categoryService
      .getHome()
      .then((res) => setCategories(res.data?.data || res.data || []))
      .catch(console.error);
  }, []);
  return (
    <MainLayout>
      <div className={container}>
        <div className={header}>
          <div className={titleBox}>
            <h2>Danh mục sản phẩm</h2>
            <div className={underline}></div>
          </div>

          <Link to='/products' className={viewAll}>
            Xem tất cả danh mục <span>›</span>
          </Link>
        </div>

        <div className={list}>
          {Array.isArray(categories) &&
            categories.map((item, id) => {
              return (
                <Link
                  key={id}
                  to={`/products?category=${item.id}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <CategoryProductsInfo
                    key={id}
                    content={item.title || item.name}
                    img={
                      item.image_url ||
                      'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22150%22%20height%3D%22150%22%20viewBox%3D%220%200%20150%20150%22%3E%3Crect%20width%3D%22150%22%20height%3D%22150%22%20fill%3D%22%23f3f4f6%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22%239ca3af%22%20font-family%3D%22sans-serif%22%20font-size%3D%2214%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fsvg%3E'
                    }
                  />
                </Link>
              );
            })}
        </div>
      </div>
    </MainLayout>
  );
}

export default CategoryProducts;
