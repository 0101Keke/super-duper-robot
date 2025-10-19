

 
 function ForgotPassword(){
  return(
    <div>
      
      <h1 className="text-center mb-4">Forgot Password</h1>
      <form className='bg-green'>
            <label htmlFor="name" className="form-label">Student Email:</label>
          <input type="email" className="form-control" placeholder='Enter Email' required />

           <label htmlFor="name" className="form-label">Enter Recovery Email:</label>
          <input type="email" className="form-control" placeholder='Enter Email' required />
          <button type="submit" className="btn bg-black  mt-3">Submit</button>
        </form>
      
    </div>
  )
}

export default ForgotPassword;