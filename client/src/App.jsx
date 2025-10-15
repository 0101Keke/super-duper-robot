import { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import './App.css'

function StudentReg() {
  return (
    <div>
      <Header />
      <div className="container my-5">
        <h2 className="text-center mb-4">Student Registration</h2>
        <form
          className="bg-green"
          style={{ maxWidth: "500px", margin: "0 auto" }}
        >
          <label htmlFor="name" className="form-label fw-bold">
            Full Name:
          </label>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Enter Name"
            required
          />

          <label htmlFor="email" className="form-label fw-bold">
            Student Email:
          </label>
          <input
            type="email"
            className="form-control mb-3"
            placeholder="Enter Email"
            required
          />

          <label htmlFor="phone" className="form-label fw-bold">
            Phone Number:
          </label>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Enter Number"
            required
          />

          <button type="submit" className="btn btn-dark text-white w-100 mt-3">
            Register
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
}

function TutorReg(){
  return(
    <div>
      <Header/>
      <h2>Register</h2>
      <form className='bg-green'>
          <label htmlFor="name" className="form-label">Full Name:</label>
          <input type="text" className="form-control" placeholder='Enter Name' required />

            <label htmlFor="name" className="form-label">Student Email:</label>
          <input type="email" className="form-control" placeholder='Enter Email' required />

            <label htmlFor="name" className="form-label">Phone Number:</label>
          <input type="text" className="form-control" placeholder='Enter Number' required />

           <label htmlFor="name" className="form-label">CV:</label>
          <input type="file" className="form-control" accept=".pdf" required />
          <h4>Upload your CV in PDF here</h4>
          <h5>"PDF, DOC, DOCX, JPG, PNG up to 10MB"</h5>


          <button type="submit" className="btn bg-black  mt-3">Register</button>
      </form>
      <Footer/>
    </div>
  )
}

function ForgotPassword(){
  return(
    <div>
      <Header/>
      <h1>Forgot Password</h1>
      <form className='bg-green'>
            <label htmlFor="name" className="form-label">Student Email:</label>
          <input type="email" className="form-control" placeholder='Enter Email' required />

           <label htmlFor="name" className="form-label">Enter Recovery Email:</label>
          <input type="email" className="form-control" placeholder='Enter Email' required />
          <button type="submit" className="btn bg-black  mt-3">Submit</button>
        </form>
      <Footer/>
    </div>
  )
}

function TutorLogin(){
  return(
    <div>
      <Header/>
      <h1>Login</h1>
      <form className='bg-green'>
            <label htmlFor="name" className="form-label">Tutor Email:</label>
          <input type="email" className="form-control" placeholder='Enter Email' required />

           <label htmlFor="name" className="form-label">Password:</label>
          <input type="password" className="form-control" placeholder='Enter Email' required />
          <button type="submit" className="btn bg-black  mt-3">Submit</button>
        </form>
      <Footer/>
    </div>
  )
}

function StudentLogin() {
  return (
    <div>
      <Header />
      <div className="container my-5">
        <h1 className="text-center mb-4">Student Login</h1>

        <form
          className="p-4 rounded shadow bg-green"
          style={{ maxWidth: "400px", margin: "0 auto" }}
        >
          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-bold">
              Student Email:
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter Email"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label fw-bold">
              Password:
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Enter Password"
              required
            />
          </div>

          <button type="submit" className="btn btn-dark text-white w-100 mt-3">
            Submit
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
}
function AdminLogin(){
  return(
    <div>
      <Header/>
      <h1>Login</h1>
      <form className='bg-green'>
          <label htmlFor="name" className="form-label">Admin Username:</label>
          <input type="text" className="form-control" placeholder='Enter Username' required />


            <label htmlFor="name" className="form-label">Admin Email:</label>
          <input type="email" className="form-control" placeholder='Enter Email' required />

           <label htmlFor="name" className="form-label">Password:</label>
          <input type="password" className="form-control" placeholder='Enter Email' required />
          <button type="submit" className="btn bg-black  mt-3">Submit</button>
        </form>
      <Footer/>
    </div>
  )
}

function StudentDash(){
return(
 <div>
  <Header/>
  <div className="container-fluid py-4 flex-grow-1">
        <h4 className="text-center mb-4">Home Page</h4>

        {/* Three side-by-side divs below */}
        <div className="row g-4">
          <div className="col-md-4">
            <div className="bg-light-green mb-3">
              <p>Column 1</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="bg-light-green mb-3">
              <p>Column 2</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="bg-light-green mb-3">
              <p>Column 3</p>
            </div>
          </div>
        </div>
      </div>
  <Footer/>
 </div> 
)
}

function TutorDash(){
  return(
    <div>
      <Header/>
      <h1>Tutor Page</h1>
      <Footer/>
    </div>
  )
}

function Home(){
  return(
    <div>
      <Header/>
      <h1>Home page</h1>
      <Footer/>
    </div>
  )
}
function Tutor(){
  return(
    <div>
      <Header/>
      <h1>Tutor Page</h1>
      <Footer/>
    </div>
  )
}

function Admin(){
  return(
    <div>
      <Header/>
      <h1>Admin Page</h1>
      <Footer/>
    </div>
  )
}
function AdminPanel(){
  return(
    <div>
      <Header/>
      <h1>Admin Page</h1>
      <Footer/>
    </div>
  )
}

function resource(){
  return(
    <div>
      <Header/>
      <h1>Resources</h1>
      <Footer/>
    </div>
  )
}

function Discussion(){
  return(
    <div>
      <Header/>
      <h1>Add</h1>
      <Footer/>
    </div>
  )
}

function modulecourse(){
  return(
    <div>
      <Header/>
      <h1>Add</h1>
      <Footer/>
    </div>
  )
}

function Topic(){
  return(
    <div>
      <Header/>
      <h1>Add</h1>
      <Footer/>
    </div>
  )
}

function Messages(){
  return(
    <div>
      <Header/>
      <h1>Add</h1>
      <Footer/>
    </div>
  )
}

function Notification(){
  return(
    <div>
      <Header/>
      <h1>Add</h1>
      <Footer/>
    </div>
  )
}

function AIcopilot(){
  return(
    <div>
      <Header/>
      <h1>Add</h1>
      <Footer/>
    </div>
  )
}

function FAQ(){
  return(
    <div>
      <Header/>
      <h1>Add</h1>
      <Footer/>
    </div>
  )
}



function profile(){
  return(
    <div>
      <Header/>
      <h1>Add</h1>
      <Footer/>
    </div>
  )
}

function Feedback(){
  return(
    <div>
      <Header/>
      <h1>Add</h1>
      <Footer/>
    </div>
  )
}

function ThankYou(){
  return(
    <div>
      <Header/>
      <h1>Add</h1>
      <Footer/>
    </div>
  )
}

function Contact(){
  return(
    <div>
      <Header/>
      <h1>Add</h1>
      <Footer/>
    </div>
  )
}


function Header() {
  return (
    <header className="bg-success py-3 shadow">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* Left: Logo */}
        <div className="d-flex align-items-center">
          <img
            src="/logo.png"
            alt="Logo"
            width="40"
            height="40"
            className="me-2"
          />
        </div>

        {/* Center: Navigation */}
        <Nav className="d-flex gap-3" />

        {/* Right: Search + Profile */}
        <div className="d-flex align-items-center gap-2">
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Search..."
            style={{ width: "150px" }}
          />
          <button className="btn btn-light">Profile</button>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-success py-3 mt-auto">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* Left Button: FAQ */}
         <button 
          className="btn btn-success text-white fw-semibold"
          onClick={() => window.location.href = '/faq'}
        >
          FAQ
        </button>

        {/* Right Button: Copy */}
        <button 
          className="btn btn-success text-white fw-semibold"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            // Optional: show a subtle toast or message
          }}
        >
          Copy
        </button>
      </div>
    </footer>
  );
}

function Nav(){
  return(
  <div>
    <Link to ={"/"}><button className="btn btn-dark text-white">Home</button></Link>
    <Link to ={"/student"}><button className="btn btn-dark text-white">Student</button></Link>
    <Link to ={"/tutor"}><button className="btn btn-dark text-white">Tutor</button></Link>
    <Link to ={"/admin"}><button className="btn btn-dark text-white">Admin</button></Link>
    </div>
  )
}

function Linking(){
  return(
    <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path='/student' element={<StudentDash/>}/>
        <Route path='/tutor' element={<TutorDash/>}/>


        <Route path= '/StuReg' element={<StudentReg/>}/>
        <Route path= '/TutReg' element={<TutorReg/>}/>
        <Route path= '/Forgot' element={<ForgotPassword/>}/>
        <Route path= '/TutLogin' element={<TutorLogin/>}/>
        <Route path= '/StuLogin' element={<StudentLogin/>}/>
        <Route path= '/AdmLogin' element={<AdminLogin/>}/>
        <Route path= '/Admin' element={<Admin/>}/>
        <Route path= '/profile' element={<profile/>}/>
        <Route path= '/resource' element={<resource/>}/>
        <Route path= '/Discussion' element={<Discussion/>}/>
        <Route path= '/modulecourse' element={<modulecourse/>}/>
        <Route path= '/Topic' element={<Topic/>}/>
        <Route path= '/Messages' element={<Messages/>}/>
        <Route path= '/Notification' element={<Notification/>}/>
        <Route path= '/AIcopilot' element={<AIcopilot/>}/>
        <Route path= '/FAQ' element={<FAQ/>}/>
        <Route path= '/Feedback' element={<Feedback/>}/>
        <Route path= '/ThankYou' element={<ThankYou/>}/>
        <Route path= '/Contact' element={<Contact/>}/>
        <Route path= '/AdminPanel' element={<AdminPanel/>}/>
      </Routes>
  )
}

function App() {
  return (
    <div>
      <Linking/>
    </div>
  )
}

export default App
