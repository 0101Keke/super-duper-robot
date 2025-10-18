import { Routes, Route } from 'react-router-dom';
import './App.css';

// Import pages
import Home from './pages/Home.jsx';
import StudentReg from './pages/StudentReg.jsx';
import StudentLogin from './pages/StudentLogin.jsx';
import TutorReg from './pages/TutorReg.jsx';
import TutorLogin from './pages/TutorLogin.jsx';
import StudentDash from './pages/StudentDash.jsx';
import TutorDash from './pages/TutorDash.jsx';
import Chatbot from './pages/Chatbot.jsx';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/StuReg" element={<StudentReg />} />
            <Route path="/StuLogin" element={<StudentLogin />} />
            <Route path="/TutReg" element={<TutorReg />} />
            <Route path="/TutLogin" element={<TutorLogin />} />
            <Route path="/student" element={<StudentDash />} />
            <Route path="/tutor" element={<TutorDash />} />
            <Route path="/chatbot" element={<Chatbot />} />
        </Routes>
    );
}

export default App;