import Banner from './Banner/Banner';
import MyHeader from '@/components/Header/Header';
import styles from './styles.module.scss';
import Info from './Info/Info';
import FeaturedProducts from './FeaturedProducts/FeaturedProducts';
import CategoryProducts from './CategoryProducts/CategoryProducts';
import WhyChoose from './WhyChoose/WhyChoose';
import DiscountProducts from './DiscountProducts/DiscountProducts';
import Review from './Review/Review';
import MyFooter from '@/components/Footer/Footer';

function HomePage() {
  const { container } = styles;
  
  return (
    <div>
      <MyHeader />
      <div className={container}>
        <Banner />
        <Info />
      </div>
      <CategoryProducts />
      <FeaturedProducts />
      <WhyChoose />
      <DiscountProducts />
      <Review />
      <MyFooter />
    </div>
  );
}

export default HomePage;
