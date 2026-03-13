// ============================================
// FORCE UPDATE GOOGLE WALLET CLASS
// ============================================
// Run this script manually to push image updates to Google Wallet
// Usage: node updateWalletClass.js

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const keyFilePath = path.join(__dirname, 'credentials', 'google-wallet-key.json');
const serviceAccount = JSON.parse(fs.readFileSync(keyFilePath, 'utf8'));

const ISSUER_ID = '3388000000023082364';
const CLASS_ID = `${ISSUER_ID}.biologisch_vleesch_premium_v3`;

async function updateClassBranding() {
  const auth = new google.auth.GoogleAuth({
    credentials: serviceAccount,
    scopes: ['https://www.googleapis.com/auth/wallet_object.issuer'],
  });
  
  const client = google.walletobjects({ version: 'v1', auth });
  
  const updatedClass = {
    id: CLASS_ID,
    issuerName: 'Biologisch Vleesch Atelier',
    reviewStatus: 'UNDER_REVIEW', // Ensures the update is processed
    hexBackgroundColor: '#262626',
    
    // Logo (top-left in "Algemeen" section)
    logo: {
      sourceUri: { 
        uri: 'https://elysia.marketing/Romano-logo.png?v=3' 
      },
      contentDescription: {
        defaultValue: { 
          language: 'nl-NL', 
          value: 'Biologisch Vleesch Atelier Logo' 
        }
      }
    },
    
    // Hero image (wide banner in "Afbeeldingsmodules" section)
    heroImage: {
      sourceUri: { 
        uri: 'https://elysia.marketing/Romano_wallet_hero.png?v=3' 
      },
      contentDescription: {
        defaultValue: { 
          language: 'nl-NL', 
          value: 'Romano Wallet Hero Banner' 
        }
      }
    }
  };
  
  try {
    console.log(`🔄 Updating class: ${CLASS_ID}...`);
    console.log(`📸 Logo: ${updatedClass.logo.sourceUri.uri}`);
    console.log(`📸 Hero: ${updatedClass.heroImage.sourceUri.uri}`);
    
    const res = await client.genericclass.patch({
      resourceId: CLASS_ID,
      requestBody: updatedClass,
    });
    
    console.log('\n✅ SUCCESS! Class updated with images.');
    console.log(`📋 Class ID: ${res.data.id}`);
    console.log(`🎨 Background: ${res.data.hexBackgroundColor}`);
    console.log(`\n👉 Next steps:`);
    console.log(`   1. Delete old pass from Google Wallet app`);
    console.log(`   2. Generate new pass from profile website`);
    console.log(`   3. Images should now appear!\n`);
    
  } catch (error) {
    console.error('\n❌ Update failed!');
    console.error('Error details:', error.response?.data || error.message);
    
    if (error.code === 404) {
      console.log('\n💡 Class not found. Creating new class...');
      try {
        await client.genericclass.insert({
          requestBody: updatedClass
        });
        console.log('✅ New class created successfully!');
      } catch (insertError) {
        console.error('❌ Failed to create class:', insertError.message);
      }
    }
  }
}

// Run the update
updateClassBranding();
