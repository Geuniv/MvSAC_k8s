import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout'; 
import Login from './user/login';
import Signup from './user/signup';
import UserList from './user/UserList';
import MoveInListPage from './MoveIn/MoveInListPage';
import MoveInReg from './MoveIn/MoveInReg';
import Profile from './user/profile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="profile" element={<Profile />} />
          <Route path="movelInReg" element={<MoveInReg />} />
          <Route path="users" element={<UserList />} />
          <Route path="list" element={<MoveInListPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;