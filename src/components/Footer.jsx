const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Left: Copyright */}
          <div className="text-primary-foreground">
            <span className="font-medium">RailTrack@2025</span>
          </div>

          {/* Right: Links */}
          <div className="flex items-center space-x-6">
            <a 
              href="/terms" 
              className="text-primary-foreground/80 hover:text-primary-foreground smooth-transition text-sm"
            >
              Terms of Service
            </a>
            <a 
              href="/privacy" 
              className="text-primary-foreground/80 hover:text-primary-foreground smooth-transition text-sm"
            >
              Privacy Policy
            </a>
            <a 
              href="/contact" 
              className="text-primary-foreground/80 hover:text-primary-foreground smooth-transition text-sm"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;