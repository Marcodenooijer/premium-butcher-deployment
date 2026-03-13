import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

/**
 * PWA Install Prompt Component
 * Shows a banner prompting users to install the app on their home screen
 */
export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the default mini-infobar
      e.preventDefault();
      // Store the event for later use
      setDeferredPrompt(e);
      // Show our custom install prompt
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for app installed event
    const handleAppInstalled = () => {
      console.log('✅ PWA installed successfully');
      setShowPrompt(false);
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for user response
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install prompt: ${outcome}`);

    if (outcome === 'accepted') {
      console.log('✅ User accepted the install prompt');
    } else {
      console.log('❌ User dismissed the install prompt');
    }

    // Clear the prompt
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Remember dismissal for this session
    sessionStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  // Don't show if already installed or dismissed
  if (isInstalled || !showPrompt) {
    return null;
  }

  // Check if dismissed in this session
  if (sessionStorage.getItem('pwa-prompt-dismissed')) {
    return null;
  }

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full px-4">
      <div className="bg-white rounded-lg shadow-2xl border-2 border-green-600 p-4 flex items-center gap-4">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
            <Download className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-sm">
            Installeer onze App
          </h3>
          <p className="text-xs text-gray-600 mt-1">
            Snelle toegang tot je barcode en aanbevelingen
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleInstallClick}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Installeer
          </button>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Sluiten"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

