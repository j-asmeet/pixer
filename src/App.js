import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import './pages/Login'
import LoginForm from './pages/Login';
import CreateAccount from './pages/CreateAccount';
import ImageUpload from './pages/ImageUpload';
import UserGallery from './pages/UserGallery';

function App() {
  return (
    <div className="App">
     <BrowserRouter>
      <Routes>
        <Route path='/' element={<LoginForm />} />
        <Route path='/signup' element={<CreateAccount />} />
        <Route path='/upload' element={<ImageUpload />} />
        <Route path='/gallery' element={<UserGallery />} />
      </Routes>
     </BrowserRouter>
    </div>
  );
}

export default App;
