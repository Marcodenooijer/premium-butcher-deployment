// ============================================
// GOOGLE WALLET SERVICE - GENERIC PASS WITH QR CODE
// ============================================
// Simple, clean identification pass with customer name, ID, and QR code
// Uses file-based credentials (google-wallet-key.json)

const { google } = require('googleapis');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// Load service account credentials from file
const keyFilePath = path.join(__dirname, 'credentials', 'google-wallet-key.json');
const serviceAccount = JSON.parse(fs.readFileSync(keyFilePath, 'utf8'));

// Configuration
const ISSUER_ID = '3388000000023082364';
const CLASS_ID = `${ISSUER_ID}.biologisch_vleesch_customer_card`;

/**
 * Initialize Google Wallet API client
 */
function getWalletClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: serviceAccount,
    scopes: ['https://www.googleapis.com/auth/wallet_object.issuer'],
  });

  return google.walletobjects({
    version: 'v1',
    auth: auth,
  });
}

/**
 * Create or update the generic class (template for all customer cards)
 */
async function createOrUpdateGenericClass() {
  const client = getWalletClient();

  const genericClass = {
    id: CLASS_ID,
    
    // LOGO - Your Biologisch Vleesch Atelier logo
    logo: {
      sourceUri: {
        uri: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663030165800/sNVUYdNOySIOSpnz.png'
      },
      contentDescription: {
        defaultValue: { 
          language: 'nl-NL', 
          value: 'Biologisch Vleesch Atelier' 
        }
      }
    },

    // HERO IMAGE - Premium steak photo
    heroImage: {
      sourceUri: {
        uri: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663030165800/oyJcUGgNncgSEmAQ.jpg'
      },
      contentDescription: {
        defaultValue: { 
          language: 'nl-NL', 
          value: 'Premium biologisch vlees' 
        }
      }
    },

    // DARK ELEGANT THEME
    hexBackgroundColor: '#1a1a1a',

    // ENABLE SMART TAP (NFC)
    enableSmartTap: true,
    
    // ALLOW MULTIPLE DEVICES
    multipleDevicesAndHoldersAllowedStatus: 'MULTIPLE_HOLDERS',

    // SECURITY ANIMATION
    securityAnimation: {
      animationType: 'FOIL_SHIMMER'
    },

    // REVIEW STATUS
    reviewStatus: 'UNDER_REVIEW'
  };

  try {
    // Try to get existing class
    await client.genericclass.get({ resourceId: CLASS_ID });

    // Update if exists
    await client.genericclass.update({
      resourceId: CLASS_ID,
      requestBody: genericClass
    });

    console.log('✅ Generic customer card class updated:', CLASS_ID);
  } catch (error) {
    if (error.code === 404) {
      // Create if doesn't exist
      await client.genericclass.insert({
        requestBody: genericClass
      });

      console.log('✅ Generic customer card class created:', CLASS_ID);
    } else {
      throw error;
    }
  }
}

/**
 * Create generic object (individual customer card)
 * @param {Object} customerData - Customer information
 * @param {number} customerData.id - Customer ID
 * @param {string} customerData.name - Customer name
 * @param {string} customerData.ean13 - EAN-13 barcode
 * @returns {string} - Save URL for "Add to Google Wallet" button
 */
async function createGenericObject(customerData) {
  const client = getWalletClient();

  const objectId = `${ISSUER_ID}.${customerData.id}`;
  
  // Extract first name for greeting
  const firstName = customerData.name ? customerData.name.split(' ')[0] : 'Klant';
  
  // Format customer ID
  const customerId = String(customerData.id).padStart(6, '0');

  const genericObject = {
    id: objectId,
    classId: CLASS_ID,
    state: 'ACTIVE',

    // CARD TITLE - Customer name prominently displayed
    cardTitle: {
      defaultValue: {
        language: 'nl-NL',
        value: customerData.name || 'Klant'
      }
    },

    // HEADER - Greeting
    header: {
      defaultValue: {
        language: 'nl-NL',
        value: `Welkom terug, ${firstName}!`
      }
    },

    // SUBHEADER - Customer ID
    subheader: {
      defaultValue: {
        language: 'nl-NL',
        value: `Klant ID: #${customerId}`
      }
    },

    // QR CODE - Customer barcode
    barcode: {
      type: 'QR_CODE',
      value: customerData.ean13 || '0000000000000',
      alternateText: customerData.ean13 || '0000000000000',
      kind: 'walletobjects#barcode'
    },

    // TEXT MODULES - Additional information
    textModulesData: [
      {
        header: '🥩 Biologisch Vleesch Atelier',
        body: 'Premium biologisch vlees van Nederlandse bodem',
        id: 'company_info'
      },
      {
        header: '📱 Gebruik',
        body: 'Toon deze QR code bij het afrekenen voor snelle identificatie',
        id: 'usage_info'
      }
    ],

    // LINKS - Profile, Webshop, Contact
    linksModuleData: {
      uris: [
        {
          uri: 'https://biologischvleeschatelier.profile.elysia.marketing',
          description: '📱 Mijn Profiel',
          id: 'profile_link'
        },
        {
          uri: 'https://biologischvleeschatelier.nl',
          description: '🛒 Webshop',
          id: 'webshop_link'
        },
        {
          uri: 'https://biologischvleeschatelier.nl/pages/contact',
          description: '📞 Contact',
          id: 'contact_link'
        }
      ]
    }
  };

  try {
    // Try to get existing object
    await client.genericobject.get({ resourceId: objectId });

    // Update if exists
    await client.genericobject.update({
      resourceId: objectId,
      requestBody: genericObject
    });

    console.log(`✅ Generic customer card updated:`, objectId);
  } catch (error) {
    // If not found (404) OR wrong type (400 - was loyalty object), create new one
    if (error.code === 404 || error.code === 400) {
      await client.genericobject.insert({
        requestBody: genericObject
      });

      console.log(`✅ Generic customer card created:`, objectId);
    } else {
      throw error;
    }
  }

  // Generate JWT for "Add to Google Wallet" button
  const saveUrl = generateSaveUrl(genericObject);
  return saveUrl;
}

/**
 * Generate JWT and "Add to Google Wallet" URL
 * @param {Object} genericObject - The generic object
 * @returns {string} - Save URL
 */
function generateSaveUrl(genericObject) {
  const claims = {
    iss: serviceAccount.client_email,
    aud: 'google',
    origins: [
      'https://biologischvleeschatelier.profile.elysia.marketing',
      'https://biologischvleeschatelier.nl'
    ],
    typ: 'savetowallet',
    payload: {
      genericObjects: [genericObject]  // Note: genericObjects, not loyaltyObjects
    }
  };

  const token = jwt.sign(claims, serviceAccount.private_key, {
    algorithm: 'RS256'
  });

  return `https://pay.google.com/gp/v/save/${token}`;
}

/**
 * Update generic object (e.g., when customer info changes)
 * @param {number} customerId - Customer ID
 * @param {Object} updates - Updates to apply
 */
async function updateGenericObject(customerId, updates) {
  const client = getWalletClient();
  const objectId = `${ISSUER_ID}.${customerId}`;

  try {
    const response = await client.genericobject.get({ resourceId: objectId });
    const genericObject = response.data;

    // Apply updates
    if (updates.name) {
      const firstName = updates.name.split(' ')[0];
      genericObject.cardTitle.defaultValue.value = updates.name;
      genericObject.header.defaultValue.value = `Welkom terug, ${firstName}!`;
    }
    
    if (updates.ean13) {
      genericObject.barcode.value = updates.ean13;
      genericObject.barcode.alternateText = updates.ean13;
    }

    await client.genericobject.update({
      resourceId: objectId,
      requestBody: genericObject
    });

    console.log(`✅ Updated generic customer card for customer ${customerId}`);
  } catch (error) {
    console.error(`Error updating generic customer card for customer ${customerId}:`, error.message);
    throw error;
  }
}

module.exports = {
  createOrUpdateGenericClass,
  createGenericObject,
  updateGenericObject,
  ISSUER_ID,
  CLASS_ID
};
