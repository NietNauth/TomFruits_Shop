import styles from './styles.module.scss';
import { FaStar } from 'react-icons/fa';
function ReviewInfo({ name, content, rating, avatar }) {
  const { card, stars, contentText, user, avatarBox, info, nameText } = styles;
  return (
    <div className={card}>
      <div className={stars}>
        {Array.from({ length: rating }).map((_, index) => (
          <FaStar key={index} />
        ))}
      </div>

      <p className={contentText}>{content}</p>

      <div className={user}>
        <div className={avatarBox}>{avatar}</div>
        <div className={info}>
          <span className={nameText}>{name}</span>
        </div>
      </div>
    </div>
  );
}

export default ReviewInfo;
