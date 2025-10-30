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
import Contact from './pages/Contact.jsx';
import Discussion from './pages/Discussion.jsx';
import Feedback from './pages/Feedback.jsx';
import Admin from './pages/Admin.jsx';
import AdminReg from './pages/AdminReg.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import Profile from './pages/Profile.jsx';
import Messages from './pages/Messages.jsx';
import ThankYou from './pages/ThankYou.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import Resource from './pages/Resource.jsx';
import ModuleCourse from './pages/ModuleCourse.jsx';
import Topic from './pages/Topic.jsx';
import Chatbot from './pages/Chatbot.jsx';
import Courses from './pages/Courses.jsx'; 
import MyCourses from './pages/MyCourses.jsx';
import Assignments from './pages/Assignments.jsx'
import StudentSubmissions from './pages/StudentSubmissions.jsx';
import ManageTutors from './pages/ManageTutors';// create if missing
import Discussions from './pages/Discussions';
import DiscussionDetail from './pages/DiscussionDetail';
import TutorResources from "./pages/TutorResources.jsx"; 

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/StuReg" element={<StudentReg />} />
            <Route path="/StuLogin" element={<StudentLogin />} />
            <Route path="/TutReg" element={<TutorReg />} />
            <Route path="/TutLogin" element={<TutorLogin />} />
            <Route path="/dashboard" element={<StudentDash />} />
            <Route path="/student" element={<StudentDash />} />
            <Route path="/tutor" element={<TutorDash />} />
            <Route path="/Contact" element={<Contact />} />
            <Route path="/Discussion" element={<Discussion />} />
            <Route path="/Feedback" element={<Feedback />} />
            <Route path="/Admin" element={<Admin />} />
            <Route path="/AdminReg" element={<AdminReg />} /> 
            <Route path="/Forgot" element={<ForgotPassword />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/ThankYou" element={<ThankYou />} />
            <Route path="/AdminLogin" element={<AdminLogin />} />
            <Route path="/resource" element={<Resource />} />
            <Route path="/ModuleCourse" element={<ModuleCourse />} />
            <Route path="/Topic" element={<Topic />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/courses" element={<Courses />} /> 
            <Route path="/courses/my-courses" element={<MyCourses />} />
            <Route path="/courses/:courseId/assignments" element={<Assignments />} />
            <Route path="/student/my-submissions" element={<StudentSubmissions />} />
            <Route path='/admin/manage-tutors' element={<ManageTutors />} />
            <Route path="/discussions" element={<Discussions />} />
            <Route path="/discussions/:id" element={<DiscussionDetail />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/tutor-resources" element={<TutorResources />} />
        </Routes>
    );
}

export default App;