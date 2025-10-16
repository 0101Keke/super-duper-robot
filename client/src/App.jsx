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
   return (
    <div>
      <Header />
      <div className="container my-5">
        <h2 className="text-center mb-4">Tutor Registration</h2>
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
            Tutor Email:
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

           <label htmlFor="name" className="form-label">CV:</label>
          <input type="file" className="form-control" accept=".pdf" required />
          <h4>Upload your CV in PDF here</h4>
          <h5>"PDF, DOC, DOCX, JPG, PNG up to 10MB"</h5>

          <button type="submit" className="btn btn-dark text-white w-100 mt-3">
            Register
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
}


function ForgotPassword(){
  return(
    <div>
      <Header/>
      <h1 className="text-center mb-4">Forgot Password</h1>
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
      <div className="container my-5">
      <h1 className="text-center mb-4">Login</h1>
      <form  className="p-4 rounded shadow bg-green"
          style={{ maxWidth: "400px", margin: "0 auto" }}>
            <div className="mb-3">
            <label htmlFor="name" className="form-label">Tutor Email:</label>
          <input type="email" className="form-control" placeholder='Enter Email' required />
          </div>
          <div className="mb-3">
           <label htmlFor="name" className="form-label">Password:</label>
          <input type="password" className="form-control" placeholder='Enter Email' required />
          </div>
          <button type="submit" className="btn btn-dark text-white w-100 mt-3">
            Submit
          </button>
        </form>
       </div>
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
      <div className="container my-5">
      <h1 className="text-center mb-4">Login</h1>
      <form
          className="p-4 rounded shadow bg-green"
          style={{ maxWidth: "400px", margin: "0 auto" }}
        >
          <div className="mb-3">
          <label htmlFor="name" className="form-label">Admin Username:</label>
          <input type="text" className="form-control" placeholder='Enter Username' required />
          </div>

          <div className="mb-3">
          <label htmlFor="name" className="form-label">Admin Email:</label>
          <input type="email" className="form-control" placeholder='Enter Email' required />
          </div>

          <div className="mb-3">
          <label htmlFor="name" className="form-label">Password:</label>
          <input type="password" className="form-control" placeholder='Enter Email' required />
          </div>
           <button type="submit" className="btn btn-dark text-white w-100 mt-3">
            Submit
          </button>
        </form>
        </div>
      <Footer/>
    </div>
  )
}

function Notification() {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Header />

      <div className="container py-4 flex-grow-1">
        <div className="col-md-9 mx-auto">
          <div
            className="bg-light-green p-4 rounded shadow-sm d-flex flex-column"
            style={{ height: '75vh' }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="m-0 text-success fw-bold">Notifications</h3>
              <button className="btn btn-outline-success btn-sm">Mark all as read</button>
            </div>

            {/* Notifications List */}
            <div
              className="flex-grow-1 overflow-auto p-3 bg-white rounded"
              style={{ maxHeight: '55vh' }}
            >
              {/* Example Notification Items */}
            </div>

            {/* Footer Section */}
            <div className="mt-3 text-center">
              <button className="btn btn-success btn-sm">Clear All Notifications</button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
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
    <div className="d-flex flex-column min-vh-100">
      <Header />

      <div className="container py-4 flex-grow-1">

        <div className="row g-4">
          {/* Div 1 */}
          <div className="col-md-4">
            <h4>Information</h4>
            <div className="bg-light-green p-3 rounded shadow-sm text-center">
              
              
            </div>
          </div>

          {/* Div 2 */}
          <div className="col-md-4">
            <h4>Mission</h4>
            <div className="bg-light-green p-3 rounded shadow-sm text-center">
              
            </div>
          </div>

          {/* Div 3 */}
          <div className="col-md-4">
            <h4>Vision</h4>
            <div className="bg-light-green p-3 rounded shadow-sm text-center">
              
              
            </div>
          </div>
        </div>
      </div>

      <Footer />
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

function Resource(){
<div className="d-flex flex-column min-vh-100">
      <Header />
      <div className="container-fluid py-4 flex-grow-1">
        <div className="row g-4">
          {/* Post Comment Section */}
          <div className="col-md-4">
            <div className="bg-light-green p-4 rounded shadow-sm">
              <label htmlFor="comment" className="form-label fw-semibold">
                Post a Comment:
              </label>
              <input
                type="text"
                id="comment"
                className="form-control mb-3"
                placeholder="Enter your comment"
              />
              <button
                type="submit"
                className="btn btn-dark text-white w-100"
              >
                Submit
              </button>
            </div>
          </div>

          {/* Response Section */}
          <div className="col-md-4">
            <div className="bg-light-green p-4 rounded shadow-sm">
              <label className="form-label fw-semibold">Response:</label>
              <p className="text-muted">No responses yet...</p>
            </div>
          </div>

          {/* Comments Section */}
          <div className="col-md-4">
            <div className="bg-light-green p-4 rounded shadow-sm">
              <label className="form-label fw-semibold">Comments:</label>
              <ul className="list-unstyled mt-2">
                <li className="border-bottom pb-2 mb-2">User1: Great topic!</li>
                <li className="border-bottom pb-2 mb-2">User2: I totally agree.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
}

function Discussion() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />

      <div className="container-fluid py-4 flex-grow-1">
        {/* Top controls */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <button className="btn btn-dark text-white px-4">New Topic</button>
          <input
            type="search"
            placeholder="Search..."
            className="form-control w-25 border-success"
          />
        </div>

        {/* Three side-by-side sections */}
        <div className="row g-4">
          {/* Left Column */}
          <div className="col-md-4">
            <div className="p-3 rounded bg-success text-white shadow-sm">
              <h5>General Discussions</h5>
              <p className="mb-0">Join community topics and student chat threads.</p>
            </div>
          </div>

          {/* Middle Column */}
          <div className="col-md-4">
            <div className="p-3 rounded bg-light-green shadow-sm">
              <h5>Course Help</h5>
              <p className="mb-0">Ask questions or share study resources here.</p>
            </div>
          </div>

          {/* Right Column */}
          <div className="col-md-4">
            <div className="p-3 rounded bg-light-green shadow-sm">
              <h5>Announcements</h5>
              <p className="mb-0">Stay updated with the latest platform news.</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}


function ModuleCourse() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />

      <div className="container py-4 flex-grow-1">
        <h1 className="text-center text-success mb-4">Add Module or Course</h1>

        <div className="row g-4">
          {/* Div 1 */}
          <div className="col-md-4">
            <div className="bg-light-green p-3 rounded shadow-sm text-center">
              <h4>Module Details</h4>
              <p>Add new module information here.</p>
              <button className="btn btn-success">Add Module</button>
            </div>
          </div>

          {/* Div 2 */}
          <div className="col-md-4">
            <div className="bg-light-green p-3 rounded shadow-sm text-center">
              <h4>Course Information</h4>
              <p>Manage or update your course details.</p>
              <button className="btn btn-success">Add Course</button>
            </div>
          </div>

          {/* Div 3 */}
          <div className="col-md-4">
            <div className="bg-light-green p-3 rounded shadow-sm text-center">
              <h4>Assignments</h4>
              <p>Link assignments to modules or courses.</p>
              <button className="btn btn-success">Add Assignment</button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}


function Topic() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />

      <div className="container-fluid py-4 flex-grow-1">
        <div className="row g-4">
          {/* Post Comment Section */}
          <div className="col-md-4">
            <div className="bg-light-green p-4 rounded shadow-sm">
              <label htmlFor="comment" className="form-label fw-semibold">
                Post a Comment:
              </label>
              <input
                type="text"
                id="comment"
                className="form-control mb-3"
                placeholder="Enter your comment"
              />
              <button
                type="submit"
                className="btn btn-dark text-white w-100"
              >
                Submit
              </button>
            </div>
          </div>

          {/* Response Section */}
          <div className="col-md-4">
            <div className="bg-light-green p-4 rounded shadow-sm">
              <label className="form-label fw-semibold">Response:</label>
              <p className="text-muted">No responses yet...</p>
            </div>
          </div>

          {/* Comments Section */}
          <div className="col-md-4">
            <div className="bg-light-green p-4 rounded shadow-sm">
              <label className="form-label fw-semibold">Comments:</label>
              <ul className="list-unstyled mt-2">
                <li className="border-bottom pb-2 mb-2">User1: Great topic!</li>
                <li className="border-bottom pb-2 mb-2">User2: I totally agree.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}


function Messages() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />

      <div className="container-fluid flex-grow-1 py-4">
        <div className="row">
          {/* Left Sidebar - User List */}
          <div className="col-md-3 mb-3">
            <div className="bg-light-green p-3 rounded shadow-sm h-100">
              <h5 className="fw-bold mb-3">Chats</h5>
              <ul className="list-group">
                <li className="list-group-item list-group-item-action">John Doe</li>
                <li className="list-group-item list-group-item-action">Jane Smith</li>
                <li className="list-group-item list-group-item-action">Tutor Mike</li>
                <li className="list-group-item list-group-item-action">Admin</li>
              </ul>
            </div>
          </div>

          {/* Right Chat Window */}
          <div className="col-md-9">
            <div className="bg-light-green p-3 rounded shadow-sm d-flex flex-column" style={{ height: '75vh' }}>
              {/* Chat Header */}
              <div className="border-bottom pb-2 mb-3">
                <h5 className="mb-0">Chat with <span className="text-success">John Doe</span></h5>
              </div>

              {/* Chat Messages Area */}
              <div className="flex-grow-1 overflow-auto mb-3 p-2 bg-white rounded" style={{ maxHeight: '55vh' }}>
                <div className="text-start mb-2">
                  <div className="bg-success text-white p-2 rounded-3 d-inline-block">Hey, how’s it going?</div>
                </div>
                <div className="text-end mb-2">
                  <div className="bg-dark text-white p-2 rounded-3 d-inline-block">I’m good, thanks!</div>
                </div>
              </div>

              {/* Message Input */}
              <form className="d-flex gap-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Type your message..."
                />
                <button type="submit" className="btn btn-dark text-white">
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}


function StudentDash(){
  return(
    <div>
      <Header/>
      <h1>
        Student dash board
      </h1>
      <Footer/>
    </div>
  )
}

function AIcopilot(){
  return(
    <div className="d-flex flex-column min-vh-100">
      <Header />

      <div className="container-fluid flex-grow-1 py-4">
        <div className="row">
           {/* Right Chat Window */}
          <div className="col-md-9">
            <div className="bg-light-green p-3 rounded shadow-sm d-flex flex-column" style={{ height: '75vh' }}>
              {/* Chat Header */}
              <div className="border-bottom pb-2 mb-3">
                <h5 className="mb-0">AI Assistant</h5>
              </div>

              {/* Chat Messages Area */}
              <div className="flex-grow-1 overflow-auto mb-3 p-2 bg-white rounded" style={{ maxHeight: '55vh' }}>
                
                
              </div>

              {/* Message Input */}
              <form className="d-flex gap-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Type your message..."
                />
                <button type="submit" className="btn btn-dark text-white">
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
)}


function FAQ(){
  return(
    <div>
      <Header/>
      <h1>Add</h1>
      <Footer/>
    </div>
  )
}



function Profile() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />

      <div className="container py-4 flex-grow-1">
        {/* BIO Section */}
        <div className="bg-light-green p-4 rounded shadow-sm mb-4 text-center">
          <h3 className="fw-bold mb-3">BIO</h3>
          <p><strong>Name:</strong> John Doe</p>
          <p><strong>Email:</strong> johndoe@example.com</p>
          <p><strong>Role:</strong> Student</p>
        </div>

        {/* Update Profile Section */}
        <div className="bg-light-green p-4 rounded shadow-sm mb-4">
          <h5 className="fw-semibold mb-3">Update Profile</h5>
          <form>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input
                type="text"
                id="name"
                className="form-control"
                placeholder="Enter your name"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                className="form-control"
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                className="form-control"
                placeholder="Enter new password"
              />
            </div>
            <button type="submit" className="btn btn-dark text-white w-100 mt-2">
              Save Changes
            </button>
          </form>
        </div>

        {/* Extra Section */}
        <div className="bg-white p-4 rounded shadow-sm mb-4">
          <h4>Profile Details</h4>
          <p className="text-muted">
            This section can display additional information such as recent activity,
            badges, or statistics.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}


function Feedback() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />

      <div className="container py-5 flex-grow-1">
        <div className="bg-light-green p-5 rounded shadow-sm">
          <h2 className="text-center mb-4 text-success">Tutor Feedback</h2>

          <form>
            {/* Tutor Selection */}
            <div className="mb-4">
              <label htmlFor="tutorSelect" className="form-label fw-bold">
                Select Tutor
              </label>
              <select id="tutorSelect" className="form-select">
                <option value="">-- Choose a Tutor --</option>
                <option value="john">John Doe</option>
                <option value="sarah">Sarah Lee</option>
                <option value="michael">Michael Smith</option>
              </select>
            </div>

            {/* Star Rating */}
            <div className="mb-4">
              <label className="form-label fw-bold">Rate Your Tutor</label>
              <div className="d-flex gap-2 fs-3 text-warning">
                <i className="bi bi-star"></i>
                <i className="bi bi-star"></i>
                <i className="bi bi-star"></i>
                <i className="bi bi-star"></i>
                <i className="bi bi-star"></i>
              </div>
              <small className="text-muted">Click to select your rating</small>
            </div>

            {/* Complaint / Feedback */}
            <div className="mb-4">
              <label htmlFor="feedback" className="form-label fw-bold">
                Feedback / Complaint
              </label>
              <textarea
                id="feedback"
                className="form-control"
                rows="4"
                placeholder="Share your experience or issues..."
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button type="submit" className="btn btn-success px-5">
                Submit Feedback
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}


function ThankYou() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />

      <div className="container flex-grow-1 d-flex align-items-center justify-content-center">
        <div className="bg-light-green p-5 rounded shadow-sm text-center">
          <h1 className="text-success mb-3">Thank You!</h1>
          <p className="lead text-muted mb-4">
            Your message has been received. We’ll get back to you shortly.
          </p>
          <a href="/" className="btn btn-success text-white">
            Return Home
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
}


function Contact() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />

      <div className="container py-5 flex-grow-1">
        <h2 className="text-center text-success mb-4">Contact Us</h2>

        <div className="row g-4">
          {/* Contact Form */}
          <div className="col-md-6">
            <div className="bg-light-green p-4 rounded shadow-sm">
              <h4 className="mb-3">Send us a message</h4>
              <form>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="message" className="form-label">
                    Message
                  </label>
                  <textarea
                    className="form-control"
                    id="message"
                    rows="4"
                    placeholder="Type your message..."
                    required
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-success w-100">
                  Send Message
                </button>
              </form>
            </div>
          </div>

          {/* Contact Information */}
          <div className="col-md-6">
            <div className="bg-light-green p-4 rounded shadow-sm">
              <h4 className="mb-3">Our Contact Information</h4>
              <p>
                <strong>Address:</strong><br />
                123 Green Street,<br />
                Cape Town, South Africa
              </p>

              <p>
                <strong>Phone:</strong><br />
                +27 12 345 6789
              </p>

              <p>
                <strong>Email:</strong><br />
                contact@progskillai.com
              </p>

              <p>
                <strong>Office Hours:</strong><br />
                Mon - Fri, 9:00 AM - 5:00 PM
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
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
          <Link to ={"/profile"}><button className="btn btn-dark text-white">Profile</button></Link>
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
  <div className="d-flex justify-content-center gap-3 py-3">
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
        <Route path= '/profile' element={<Profile/>}/>
        <Route path= '/resource' element={<Resource/>}/>
        <Route path= '/Discussion' element={<Discussion/>}/>
        <Route path= '/module' element={<ModuleCourse/>}/>
        <Route path= '/Topic' element={<Topic/>}/>
        <Route path= '/Message' element={<Messages/>}/>
        <Route path= '/Notify' element={<Notification/>}/>
        <Route path= '/AI' element={<AIcopilot/>}/>
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
