import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';


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

export default Messages;
