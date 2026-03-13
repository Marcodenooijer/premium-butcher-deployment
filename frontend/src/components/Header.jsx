import { useState, useEffect } from 'react';
import { ExternalLink, LogOut, QrCode, Download, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import api from '../services/api';
import PremiumHeaderBlocks from './PremiumHeaderBlocks';
import './Header.css';

export default function Header({ customerData, onLogout }) {
  const [greeting, setGreeting] = useState('');
  const [barcodeUrl, setBarcodeUrl] = useState(null);
  const [showBarcodeModal, setShowBarcodeModal] = useState(false);
  const [loadingBarcode, setLoadingBarcode] = useState(false);

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

  // Handle barcode button click
  const handleShowBarcode = async () => {
    try {
      setLoadingBarcode(true);
      if (!barcodeUrl) {
        const url = await api.getBarcode();
        setBarcodeUrl(url);
      }
      setShowBarcodeModal(true);
    } catch (error) {
      console.error("Error loading barcode:", error);
      alert("Failed to load barcode");
    } finally {
      setLoadingBarcode(false);
    }
  };

  // Handle barcode download
  const handleDownloadBarcode = () => {
    if (barcodeUrl) {
      const link = document.createElement('a');
      link.href = barcodeUrl;
      link.download = 'customer-barcode.png';
      link.click();
    }
  };

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
                onClick={handleShowBarcode}
                disabled={loadingBarcode}
                className="barcode-button"
                title="Show Barcode"
                style={{
                  backgroundColor: 'oklch(0.35 0.12 15)',
                  color: 'white',
                  marginRight: '8px'
                }}
              >
                <QrCode className="button-icon" />
                <span className="button-text">
                  {loadingBarcode ? 'Loading...' : 'My Barcode'}
                </span>
              </Button>

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

      {/* Barcode Modal */}
      {showBarcodeModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}
          onClick={() => setShowBarcodeModal(false)}
        >
          <div 
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '500px',
              width: '90%',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setShowBarcodeModal(false)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px'
              }}
            >
              <X size={24} />
            </button>

            {/* Modal content */}
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ marginBottom: '8px', fontSize: '24px', fontWeight: 'bold' }}>
                Your Customer Barcode
              </h2>
              <p style={{ color: '#666', marginBottom: '24px' }}>
                Show this at checkout for quick identification
              </p>

              {barcodeUrl && (
                <div style={{
                  padding: '24px',
                  backgroundColor: 'white',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  marginBottom: '24px'
                }}>
                  <img 
                    src={barcodeUrl} 
                    alt="Customer Barcode" 
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                </div>
              )}

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <Button
                  onClick={() => setShowBarcodeModal(false)}
                  variant="outline"
                >
                  Close
                </Button>
                <Button
                  onClick={handleDownloadBarcode}
                  style={{
                    backgroundColor: 'oklch(0.35 0.12 15)',
                    color: 'white'
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

