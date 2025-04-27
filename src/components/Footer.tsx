
import React from 'react';
import { Heart, Github, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="mt-auto border-t">
      <div className="container mx-auto px-4 py-4 flex flex-col items-center text-sm text-muted-foreground gap-4">
        <div className="flex items-center gap-1">
          Made with <Heart className="h-4 w-4 text-red-500 fill-red-500" /> by Ritik | Crafted in Noida
        </div>
        <div>
          © The Ritik Katiyar Production
        </div>
        <div className="flex items-center justify-center gap-6">
          <a 
            href="https://github.com/ritik" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors flex items-center gap-2"
          >
            <Github className="h-5 w-5" />
            <span className="sr-only md:not-sr-only">GitHub</span>
          </a>
          <a 
            href="https://linkedin.com/in/ritik" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors flex items-center gap-2"
          >
            <Linkedin className="h-5 w-5" />
            <span className="sr-only md:not-sr-only">LinkedIn</span>
          </a>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <Link to="/terms" className="hover:text-primary transition-colors">Terms & Conditions</Link>
          <span>•</span>
          <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
