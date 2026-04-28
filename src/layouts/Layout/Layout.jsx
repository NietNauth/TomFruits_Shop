import styles from './styles.module.scss';
import MyHeader from '../../components/Header/Header';
function MainLayout({ children }) {
  const { wrapLayout, container } = styles;
  return (
    <>
      {/* <MyHeader /> */}
      <main className={wrapLayout}>
        <div className={container}>{children}</div>
      </main>
    </>
  );
}

export default MainLayout;
