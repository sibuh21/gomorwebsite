import Link from "next/link";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        {/* Email */}
        <div>
          <p className="footer-section-title">Email</p>
          <Link href="mailto:info@gomorarchitecture.com" className="footer-link">
            info@gomorarchitecture.com
          </Link>
          <Link href="mailto:press@gomor.com" className="footer-link">
            press@gomor.com
          </Link>
          <Link href="mailto:careers@gomor.com" className="footer-link">
            careers@gomor.com
          </Link>
        </div>

        {/* Office */}
        <div>
          <p className="footer-section-title">Office</p>
          <p className="footer-link" style={{ cursor: "default" }}>
            Addis Ababa, Ethiopia
          </p>
          <Link href="tel:+251913324275" className="footer-link">
            +251 912 131 415
          </Link>
          <Link href="mailto:addis@gomorarchitecture.com" className="footer-link">
            addis@gomorarchitecture.com
          </Link>
        </div>

        {/* Social */}
        <div>
          <p className="footer-section-title">Social</p>
          <Link
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            Instagram
          </Link>
          <Link
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            LinkedIn
          </Link>
          <Link
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            Facebook
          </Link>
          <Link
            href="https://x.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            X
          </Link>
        </div>

        {/* Legal */}
        <div>
          <p className="footer-section-title">Legal</p>
          <Link href="/about" className="footer-link">
            Privacy Policy
          </Link>
          <Link href="/about" className="footer-link">
            Terms of Service
          </Link>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Gomor Architects PLC. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
