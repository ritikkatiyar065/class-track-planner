
import React from 'react';
import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-auto border-t">
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground gap-2">
        <div className="flex items-center gap-1">
          Made with <Heart className="h-4 w-4 text-red-500 fill-red-500" /> by Ritik | Crafted in Noida
        </div>
        <div>
          © The Ritik Katiyar Production
        </div>
      </div>
    </footer>
  );
};

export default Footer;
