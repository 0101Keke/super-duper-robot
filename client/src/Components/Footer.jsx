function Footer() {
    return (
        <footer className="bg-success py-3 mt-auto">
            <div className="container-fluid d-flex justify-content-between align-items-center">
                {/* Left Button: FAQ */}
                <button
                    className="btn btn-success text-white fw-semibold"
                    onClick={() => window.location.href = '/FAQ'}
                >
                    FAQ
                </button>

                {/* Right Button: Copy */}
                <button
                    className="btn btn-success text-white fw-semibold"
                    onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                    }}
                >
                    Copy
                </button>
            </div>
        </footer>
    );
}

export default Footer;