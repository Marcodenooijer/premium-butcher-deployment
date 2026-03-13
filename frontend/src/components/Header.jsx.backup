import { useState, useEffect } from 'react';
import { ExternalLink, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import PremiumHeaderBlocks from './PremiumHeaderBlocks';
import './Header.css';

export default function Header({ customerData, onLogout }) {
  const [greeting, setGreeting] = useState('');

  // Determine greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good Morning');
    } else if (hour < 18) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }
  }, []);

  // Extract first name from full name
  const firstName = customerData?.name?.split(' ')[0] || 'Guest';

  return (
    <div className="header-wrapper">
      <div className="header-background">
        {/* Dark overlay - 40% opacity */}
        <div className="header-overlay"></div>

        {/* Header content */}
        <div className="header-inner">
          <div className="header-top-section">
            {/* Logo and greeting */}
            <div className="header-left-content">
              <img 
                src="/logo2.png" 
                alt="Company Logo" 
                className="header-logo"
              />
              <h1 className="header-greeting">
                {greeting}, <span className="header-name">{firstName}</span>
              </h1>
            </div>

            {/* Action buttons */}
            <div className="header-buttons-group">
              <Button
                onClick={() => window.open('https://biologischvleeschatelier.nl', '_blank')}
                className="visit-website-button"
                title="Visit Website"
              >
                <ExternalLink className="button-icon" />
                <span className="button-text">Visit Website</span>
              </Button>
              <Button
                onClick={onLogout}
                className="logout-button"
                title="Logout"
              >
                <LogOut className="button-icon" />
                <span className="button-text">Logout</span>
              </Button>
            </div>
          </div>

          {/* Premium Header Blocks - Overlaying background */}
          <div className="header-blocks-wrapper">
            <PremiumHeaderBlocks />
          </div>
        </div>
      </div>
    </div>
  );
}

