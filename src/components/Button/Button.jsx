import styles from './styles.module.scss';
function Button({ content, onClick }) {
  const { btn } = styles;
  return (
    <button onClick={onClick} className={btn} style={{ marginRight: '12px' }}>
      {content}
    </button>
  );
}

export default Button;
