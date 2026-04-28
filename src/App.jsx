import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import routers from '@/routers/routers';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AiAssistant from './components/AiAssistant/AiAssistant';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {routers.map((item, index) => {
          return (
            <Route path={item.path} element={<item.component />} key={index} />
          );
        })}
      </Routes>
      <AiAssistant />
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </BrowserRouter>
  );
}

export default App;
