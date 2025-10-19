

function AdminLogin(){
  return(
    <div>
      
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
  
    </div>
  )
}

export default AdminLogin;