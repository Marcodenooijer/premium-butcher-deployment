// ============================================
// GOOGLE WALLET SERVICE - GENERIC MEMBERSHIP
// ============================================

const { google } = require('googleapis');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// Load service account credentials
const keyFilePath = path.join(__dirname, 'credentials', 'google-wallet-key.json');
const serviceAccount = JSON.parse(fs.readFileSync(keyFilePath, 'utf8'));

// CONFIGURATION
const ISSUER_ID = '3388000000023082364';
const CLASS_ID = `${ISSUER_ID}.biologisch_vleesch_premium_v3`;

/**
 * Initialize Wallet API client
 */
function getWalletClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: serviceAccount,
    scopes: ['https://www.googleapis.com/auth/wallet_object.issuer'],
  });

  return google.walletobjects({
    version: 'v1',
    auth,
  });
}

/**
 * Create or update Generic Class
 */
async function createOrUpdateGenericClass() {
  const client = getWalletClient();
  
  const genericClass = {
    id: CLASS_ID,
    issuerName: 'Biologisch Vleesch Atelier',
    reviewStatus: 'UNDER_REVIEW',
    hexBackgroundColor: '#262626',
    
    // Normal logo (top-left)
    logo: {
      sourceUri: {
        uri: 'https://elysia.marketing/Romano-logo.png'
      },
      contentDescription: {
        defaultValue: {
          language: 'nl-NL',
          value: 'Biologisch Vleesch Atelier Logo'
        }
      }
    },
    
    // Hero image (wide banner)
    heroImage: {
      sourceUri: {
        uri: 'https://elysia.marketing/Romano_wallet_hero.png'
      },
      contentDescription: {
        defaultValue: {
          language: 'nl-NL',
          value: 'Romano Wallet Hero'
        }
      }
    },
    
    // Image modules (for Google Wallet Console "Afbeeldingsmodules" section)
    imageModulesData: [
      {
        mainImage: {
          sourceUri: {
            uri: 'https://elysia.marketing/Romano_wallet_hero.png'
          },
          contentDescription: {
            defaultValue: {
              language: 'nl-NL',
              value: 'Hero Afbeelding'
            }
          }
        },
        id: 'hero_image_module'
      }
    ]
  };

  try {
    await client.genericclass.get({ resourceId: CLASS_ID });
    
    await client.genericclass.update({
      resourceId: CLASS_ID,
      requestBody: genericClass
    });
    
    console.log('✅ Generic class updated:', CLASS_ID);
  } catch (error) {
    if (error.code === 404) {
      await client.genericclass.insert({
        requestBody: genericClass
      });
      
      console.log('✅ Generic class created:', CLASS_ID);
    } else {
      console.error('❌ Generic class update/create failed:', error.response?.data || error.message);
      throw error;
    }
  }
}

/**
 * Create or update Generic Object (Customer Card)
 */
async function createGenericObject(customerData) {
  const client = getWalletClient();
  
  const objectId = `${ISSUER_ID}.member_${customerData.id}`;
  const customerId = String(customerData.id).padStart(6, '0');
  
  const genericObject = {
    id: objectId,
    classId: CLASS_ID,
    state: 'ACTIVE',
    
    // Override background color at object level
    hexBackgroundColor: '#262626',
    
    // Card title (required)
    cardTitle: {
      defaultValue: {
        language: 'nl-NL',
        value: 'Biologisch Vleesch Atelier'
      }
    },
    
    // Large header
    header: {
      defaultValue: {
        language: 'nl-NL',
        value: `Welkom ${customerData.name || 'Klant'}`
      }
    },
    
    // Customer ID visible
    subheader: {
      defaultValue: {
        language: 'nl-NL',
        value: `Klant ID: #${customerId}`
      }
    },
    
    // QR Code
    barcode: {
      type: 'QR_CODE',
      value: String(customerData.ean13 || customerId),
      alternateText: String(customerData.ean13 || customerId)
    },
    
    // Expandable info section
    textModulesData: [
      {
        header: 'Lid sinds',
        body: customerData.memberSince
          ? new Date(customerData.memberSince)
              .toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' })
          : new Date()
              .toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' }),
        id: 'member_since'
      }
    ]
  };

  try {
    await client.genericobject.get({ resourceId: objectId });
    
    await client.genericobject.update({
      resourceId: objectId,
      requestBody: genericObject
    });
    
    console.log('✅ Generic object updated:', objectId);
  } catch (error) {
    if (error.code === 404) {
      await client.genericobject.insert({
        requestBody: genericObject
      });
      
      console.log('✅ Generic object created:', objectId);
    } else {
      console.error('❌ Generic object update/create failed:', error.response?.data || error.message);
      throw error;
    }
  }

  return generateSaveUrl(genericObject);
}

/**
 * Generate "Add to Google Wallet" URL
 */
function generateSaveUrl(genericObject) {
  const claims = {
    iss: serviceAccount.client_email,
    aud: 'google',
    typ: 'savetowallet',
    payload: {
      genericObjects: [genericObject]
    }
  };

  const token = jwt.sign(claims, serviceAccount.private_key, {
    algorithm: 'RS256'
  });

  return `https://pay.google.com/gp/v/save/${token}`;
}

module.exports = {
  createOrUpdateGenericClass,
  createGenericObject,
  ISSUER_ID,
  CLASS_ID
};
