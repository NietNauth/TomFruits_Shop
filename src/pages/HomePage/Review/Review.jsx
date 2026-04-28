import { dataReviews } from './constants';
import ReviewInfo from './ReviewInfo';
import styles from './styles.module.scss';
function Review() {
  const { container, header, title, subtitle, list } = styles;

  return (
    // <MainLayout>
    <div className={container}>
      <div className={header}>
        <h2 className={title}>Khách hàng nói gì về chúng tôi</h2>
        <p className={subtitle}>
          Hàng nghìn khách hàng đã tin tưởng Tom Fruits
        </p>
      </div>

      <div className={list}>
        {dataReviews.map((item) => (
          <ReviewInfo
            key={item.id}
            name={item.name}
            role={item.role}
            content={item.content}
            rating={item.rating}
            avatar={item.avatar}
          />
        ))}
      </div>
    </div>
    // </MainLayout>
  );
}

export default Review;
