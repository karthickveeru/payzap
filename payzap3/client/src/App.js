
import Login from './pages/Login'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";



function App() {
  return (
    <>
      <Router >
        <Routes>
            <Route path="*" element={<NotFound />} />
            <Route path="/login" element={<Login />}/>
            <Route path="/home" element={<Home />} />
        </Routes>
      </Router>
      
    </>
  );
}

export default App;
