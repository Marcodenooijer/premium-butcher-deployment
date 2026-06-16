// frontend/src/services/mockData.js
//
// DEV-ONLY mock layer. When VITE_DEV_BYPASS_AUTH=true, api.js and loyaltyApi.js
// short-circuit their network calls and return this canned data instead. This
// lets the profile render locally with no backend and no Firebase login.
//
// NEVER ship this path to production — it is gated entirely on the dev bypass flag.

export const MOCK_ENABLED = import.meta.env.VITE_DEV_BYPASS_AUTH === 'true';

// ─── Reference data (ids referenced by the customer below) ──────────
const languages = {
  results: [
    { id: 1, name: 'Dutch' },
    { id: 2, name: 'English' },
    { id: 3, name: 'German' },
    { id: 4, name: 'French' },
  ],
};

const countries = [
  { country_id: 156, name: 'Netherlands' },
  { country_id: 56, name: 'Belgium' },
  { country_id: 276, name: 'Germany' },
  { country_id: 250, name: 'France' },
];

const cities = [
  { city_id: 1, name: 'Amsterdam' },
  { city_id: 2, name: 'Rotterdam' },
  { city_id: 3, name: 'Utrecht' },
  { city_id: 4, name: 'The Hague' },
];

// ─── Customer profile ───────────────────────────────────────────────
const customer = {
  id: 1,
  name: 'Jan de Vries',
  first_name: 'Jan',
  last_name: 'de Vries',
  email: 'jan.devries@example.com',
  secondary_email: '',
  phone: '+31 6 12345678',
  date_of_birth: '1985-06-15',
  address: 'Prinsengracht 263',
  postal_code: '1016 GV',
  city_id: 1,
  country_id: 156,
  language_ids: [1, 2],
  nationality_ids: [156],
  ethnicity_ids: [156],
  marketing_communications: true,
  marketing_personalization: true,
  secondary_email_communications: false,
  member_since: '2021-03-01',
  loyalty_points: 1250,
  loyalty_tier: 'Gold',
  preferences: {
    household_size: 4,
    weekly_meat_consumption: '2-3 kg',
    favorite_meat_types: ['Beef', 'Lamb'],
    favorite_meat_other: '',
    preferred_cuts: ['Ribeye', 'Tenderloin'],
    preferred_cut_other: '',
    cooking_preference: 'Medium',
    cooking_skill_level: 'Intermediate',
    cooking_equipment: ['Oven', 'BBQ'],
    cooking_minutes_weekdays: 30,
    cooking_minutes_weekend: 60,
    cooking_minutes_festive: 120,
    has_bbq: true,
    bbq_type: 'Charcoal',
    bbq_frequency: 'Weekly',
    bbq_skill_level: 'Advanced',
    grass_fed_preference: true,
    organic_only: true,
    local_sourcing_priority: 'High',
  },
};

// ─── Loyalty enrollment (array; the app uses enrollments[0]) ─────────
const enrollments = [
  {
    id: 'enr_1',
    points: 1250,
    bonus_points: 150,
    reserved_points: 0,
    member_since: '2021-03-01',
    loyalty_tier: 'Gold',
  },
];

// ─── Family members ─────────────────────────────────────────────────
const family = [
  { id: 1, name: 'Sophie de Vries', date_of_birth: '2012-09-20', relationship: 'Daughter', requirements: { retail: { dietary_requirements: ['No pork', 'Gluten-free'] } } },
  { id: 2, name: 'Lucas de Vries', date_of_birth: '2015-01-10', relationship: 'Son', requirements: { retail: { dietary_requirements: [] } } },
];

// ─── Recommended order ──────────────────────────────────────────────
const recommendedOrder = [
  {
    id: 1, product_variant_id: 101, product_name: 'Grass-Fed Ribeye',
    product_image_url: null, recommendation_reason: 'Based on your love of beef',
    is_recommended: true, price: 18.5, quantity: 2,
  },
  {
    id: 2, product_variant_id: 102, product_name: 'Organic Lamb Chops',
    product_image_url: null, recommendation_reason: 'Popular for your weekend BBQ',
    is_recommended: false, price: 14.0, quantity: 1,
  },
];

// ─── Orders + order items ───────────────────────────────────────────
const orders = [
  {
    id: 1, order_number: 'ORD-1001', order_date: '2026-05-20',
    created_at: '2026-05-20T10:00:00Z', status: 'delivered',
    delivery_date: '2026-05-22', estimated_delivery_from: '2026-05-22',
    items: [{ id: 1 }, { id: 2 }],
  },
  {
    id: 2, order_number: 'ORD-1002', order_date: '2026-06-05',
    created_at: '2026-06-05T09:30:00Z', status: 'processing',
    delivery_date: '2026-06-18', estimated_delivery_from: '2026-06-18',
    items: [{ id: 3 }],
  },
];

const orderItems = [
  { id: 1, product_id: 101, name: 'Grass-Fed Ribeye', product_sku: 'RIB-001', quantity: 2, original_price: 20.0, discounted_price: 18.5, total_price: 37.0 },
  { id: 2, product_id: 102, name: 'Organic Lamb Chops', product_sku: 'LMB-001', quantity: 1, original_price: 16.0, discounted_price: 14.0, total_price: 14.0 },
];

// ─── Header blocks ──────────────────────────────────────────────────
const rewards = [{ name: 'Free Delivery' }, { name: '€10 Voucher' }];
const tipOfDay = { title: 'Rest your steak', content: 'Let red meat rest 5 minutes before serving for juicier results.', url: null };
const nextEvent = { name: 'Summer BBQ Masterclass', start_date: '2026-07-12' };

// ─── Loyalty products (redemption store) ────────────────────────────
// Shape mirrors the Loyalty API's /{programId}/product-variants response.
const loyaltyProducts = {
  total_count: 16,
  results: [
    {
      id: 'aaaa0001-0000-7000-8000-000000000001',
      product_variant_id: 'bbbb0001-0000-7000-8000-000000000001',
      name: 'Bio Kogelbiefstuk 100 gram',
      description: '<p>Onze biologische kogelbiefstuk is een bijzonder mals stuk rundvlees, gesneden van de zijlende. Deze spier wordt weinig belast, wat zorgt voor een botermalse structuur en een volle, pure rundsmaak.</p>',
      image_url: 'https://cdn.shopify.com/s/files/1/0700/4635/1681/files/iStock-kogelbiefstuk.jpg?v=1729005723',
      channel_links: [
        { channel_id: 'cccc0001-0000-7000-8000-000000000001', product_url: 'https://biologischvleeschatelier.nl/products/kogelbiefstuk', channel_name: 'In winkel', channel_description: 'In winkel', external_connection_id: 'dddd0001-0000-7000-8000-000000000001', external_connection_type: 'DIGI' },
        { channel_id: 'cccc0002-0000-7000-8000-000000000002', product_url: 'https://biologischvleeschatelier.nl/products/kogelbiefstuk', channel_name: 'Online', channel_description: 'Shopify', external_connection_id: 'dddd0002-0000-7000-8000-000000000002', external_connection_type: 'SHOPIFY' },
      ],
      categories: ['Grasgevoerd Rundvlees', "Romano's Loyalty Rewards", 'Beef'],
      price: 5,
      points: 500,
      barcode: '2218004000010',
    },
    {
      id: 'aaaa0002-0000-7000-8000-000000000002',
      product_variant_id: 'bbbb0002-0000-7000-8000-000000000002',
      name: 'Bio Rundergehakt 500 gram',
      description: '<p>Ons biologisch rundergehakt wordt gemalen van de magerste delen, met een vetpercentage van maximaal 20%. Perfect voor wie gezond, eiwitrijk en puur wil eten — zonder in te leveren op smaak.</p>',
      image_url: 'https://cdn.shopify.com/s/files/1/0700/4635/1681/files/iStock-rundergehakt_29acd72b-6455-4b83-92b3-eaff996e3c3f.jpg?v=1729004916',
      channel_links: [
        { channel_id: 'cccc0001-0000-7000-8000-000000000001', product_url: 'https://biologischvleeschatelier.nl/products/rundergehakt', channel_name: 'In winkel', channel_description: 'In winkel', external_connection_id: 'dddd0001-0000-7000-8000-000000000001', external_connection_type: 'DIGI' },
        { channel_id: 'cccc0002-0000-7000-8000-000000000002', product_url: 'https://biologischvleeschatelier.nl/products/rundergehakt', channel_name: 'Online', channel_description: 'Shopify', external_connection_id: 'dddd0002-0000-7000-8000-000000000002', external_connection_type: 'SHOPIFY' },
      ],
      categories: ['Grasgevoerd Rundvlees', 'Voordeel vlees pakketten', "Romano's Loyalty Rewards", 'Beef'],
      price: 13,
      points: 1300,
      barcode: '2218014000017',
    },
    {
      id: 'aaaa0003-0000-7000-8000-000000000003',
      product_variant_id: 'bbbb0003-0000-7000-8000-000000000003',
      name: 'Bio Brisket 1000 gram',
      description: '<p>Onze biologische brisket is een klassiek stuk rundvlees van de borst, rijk aan vetmarmering en een hoog bindweefselgehalte, wat het uitermate geschikt maakt voor low &amp; slow bereidingen zoals roken, stoven of sous-vide.</p>',
      image_url: 'https://cdn.shopify.com/s/files/1/0700/4635/1681/files/iStock-brisket.jpg?v=1729007548',
      channel_links: [
        { channel_id: 'cccc0001-0000-7000-8000-000000000001', product_url: 'https://biologischvleeschatelier.nl/products/bio-brisket', channel_name: 'In winkel', channel_description: 'In winkel', external_connection_id: 'dddd0001-0000-7000-8000-000000000001', external_connection_type: 'DIGI' },
        { channel_id: 'cccc0002-0000-7000-8000-000000000002', product_url: 'https://biologischvleeschatelier.nl/products/bio-brisket', channel_name: 'Online', channel_description: 'Shopify', external_connection_id: 'dddd0002-0000-7000-8000-000000000002', external_connection_type: 'SHOPIFY' },
      ],
      categories: ["Romano's Loyalty Rewards", 'BBQ & Gourmet', 'Beef', 'Grasgevoerd Rundvlees'],
      price: 31,
      points: 2500,
      barcode: '2218094000013',
    },
    {
      id: 'aaaa0004-0000-7000-8000-000000000004',
      product_variant_id: 'bbbb0004-0000-7000-8000-000000000004',
      name: 'Bio Beef Jerky 100 gram',
      description: '<p>Onze biologische beef jerky is een ambachtelijke, langzaam gegaarde vleessnack, gemaakt van biologisch grasgevoerd rundvlees. Gemarineerd in natuurlijke kruiden en vervolgens langzaam droog gegaard voor een stevige bite en geconcentreerde smaak.</p>',
      image_url: 'https://cdn.shopify.com/s/files/1/0700/4635/1681/files/iStock-beefjerkey.jpg?v=1729002769',
      channel_links: [
        { channel_id: 'cccc0001-0000-7000-8000-000000000001', product_url: 'https://biologischvleeschatelier.nl/products/bio-beef-jerky', channel_name: 'In winkel', channel_description: 'In winkel', external_connection_id: 'dddd0001-0000-7000-8000-000000000001', external_connection_type: 'DIGI' },
        { channel_id: 'cccc0002-0000-7000-8000-000000000002', product_url: 'https://biologischvleeschatelier.nl/products/bio-beef-jerky', channel_name: 'Online', channel_description: 'Shopify', external_connection_id: 'dddd0002-0000-7000-8000-000000000002', external_connection_type: 'SHOPIFY' },
      ],
      categories: ['Charcuterie', 'Grasgevoerd Rundvlees', 'Carnivoor Dieet', 'Jerky', "Romano's Loyalty Rewards"],
      price: 8,
      points: 800,
      barcode: '2218024000014',
    },
    {
      id: 'aaaa0005-0000-7000-8000-000000000005',
      product_variant_id: 'bbbb0005-0000-7000-8000-000000000005',
      name: 'Bio Biltong 100 gram',
      description: '<p>Onze biologische biltong is een Zuid-Afrikaanse vleessnack die langzaam aan de lucht is gedroogd en uitgesproken gekruid. Gemaakt van biologisch grasgevoerd rundvlees, zonder suiker, e-nummers of conserveermiddelen.</p>',
      image_url: 'https://cdn.shopify.com/s/files/1/0700/4635/1681/files/iStock-biltong.jpg?v=1729002794',
      channel_links: [
        { channel_id: 'cccc0001-0000-7000-8000-000000000001', product_url: 'https://biologischvleeschatelier.nl/products/bio-biltong', channel_name: 'In winkel', channel_description: 'In winkel', external_connection_id: 'dddd0001-0000-7000-8000-000000000001', external_connection_type: 'DIGI' },
        { channel_id: 'cccc0002-0000-7000-8000-000000000002', product_url: 'https://biologischvleeschatelier.nl/products/bio-biltong', channel_name: 'Online', channel_description: 'Shopify', external_connection_id: 'dddd0002-0000-7000-8000-000000000002', external_connection_type: 'SHOPIFY' },
      ],
      categories: ['Carnivoor Dieet', 'Charcuterie', 'Grasgevoerd Rundvlees', "Romano's Loyalty Rewards", 'Lunch & Deli Meats'],
      price: 8,
      points: 800,
      barcode: '2218124000013',
    },
    {
      id: 'aaaa0006-0000-7000-8000-000000000006',
      product_variant_id: 'bbbb0006-0000-7000-8000-000000000006',
      name: 'Bio Côte de bœuf Dry Aged 1000 gram',
      description: '<p>Onze biologische côte de boeuf dry aged is een eyecatcher op tafel. ideaal voor bereiding op de BBQ of oven. Dit royale stuk vlees is afkomstig van biologisch, grasgevoerd, en staat bekend om zijn sappigheid, rijke marmering en intense smaak.</p>',
      image_url: 'https://cdn.shopify.com/s/files/1/0700/4635/1681/files/iStock-cotedeboeuff.jpg?v=1729004248',
      channel_links: [
        { channel_id: 'cccc0001-0000-7000-8000-000000000001', product_url: 'https://biologischvleeschatelier.nl/products/cote-de-boeuff-dry-aged', channel_name: 'In winkel', channel_description: 'In winkel', external_connection_id: 'dddd0001-0000-7000-8000-000000000001', external_connection_type: 'DIGI' },
        { channel_id: 'cccc0002-0000-7000-8000-000000000002', product_url: 'https://biologischvleeschatelier.nl/products/cote-de-boeuff-dry-aged', channel_name: 'Online', channel_description: 'Shopify', external_connection_id: 'dddd0002-0000-7000-8000-000000000002', external_connection_type: 'SHOPIFY' },
      ],
      categories: ["Romano's Loyalty Rewards", 'BBQ & Gourmet', 'Premium Dry-Aged Beef', 'Beef'],
      price: 60,
      points: 5000,
      barcode: '2218104000019',
    },
    {
      id: 'aaaa0007-0000-7000-8000-000000000007',
      product_variant_id: 'bbbb0007-0000-7000-8000-000000000007',
      name: 'MEATER Draadloze Kernthermometer – Loyalty Exclusive Default Title',
      description: '<h2>🔒 MEATER Draadloze Kernthermometer – Alleen voor members</h2><p>Dit product is niet te koop. Verzilver je punten en krijg een unieke code, die je kan gebruiken bij het afrekenen om deze <strong>GRATIS te ontvangen</strong>. Alleen te verkrijgen met punten binnen Romano’s Loyalty Club.</p>',
      image_url: 'https://cdn.shopify.com/s/files/1/0700/4635/1681/files/meater.webp?v=1774763296',
      channel_links: [
        { channel_id: 'cccc0001-0000-7000-8000-000000000001', product_url: 'https://biologischvleeschatelier.nl/products/meater-draadloze-kernthermometer-loyalty-exclusive', channel_name: 'In winkel', channel_description: 'In winkel', external_connection_id: 'dddd0001-0000-7000-8000-000000000001', external_connection_type: 'DIGI' },
        { channel_id: 'cccc0002-0000-7000-8000-000000000002', product_url: 'https://biologischvleeschatelier.nl/products/meater-draadloze-kernthermometer-loyalty-exclusive', channel_name: 'Online', channel_description: 'Shopify', external_connection_id: 'dddd0002-0000-7000-8000-000000000002', external_connection_type: 'SHOPIFY' },
      ],
      categories: ['Wireless Thermometers', "Romano's Loyalty Rewards"],
      price: 149,
      points: 10000,
      barcode: '2218164000011',
    },
    {
      id: 'aaaa0008-0000-7000-8000-000000000008',
      product_variant_id: 'bbbb0008-0000-7000-8000-000000000008',
      name: 'Bio Hele Landhoen 1500 gram',
      description: '<p>Onze biologische landhoen is een traditioneel langzaam groeiend ras, afkomstig van kleinschalige, biologische pluimveehouders. Door de vrije uitloop, natuurlijke voeding en langere groeiperiode ontwikkelt deze landhoen een volle, stevige en karakteristieke smaak.</p>',
      image_url: 'https://cdn.shopify.com/s/files/1/0700/4635/1681/files/iStock-helekip.jpg?v=1728916941',
      channel_links: [
        { channel_id: 'cccc0001-0000-7000-8000-000000000001', product_url: 'https://biologischvleeschatelier.nl/products/hele-landhoen', channel_name: 'In winkel', channel_description: 'In winkel', external_connection_id: 'dddd0001-0000-7000-8000-000000000001', external_connection_type: 'DIGI' },
        { channel_id: 'cccc0002-0000-7000-8000-000000000002', product_url: 'https://biologischvleeschatelier.nl/products/hele-landhoen', channel_name: 'Online', channel_description: 'Shopify', external_connection_id: 'dddd0002-0000-7000-8000-000000000002', external_connection_type: 'SHOPIFY' },
      ],
      categories: ['BBQ & Gourmet', 'Kip en Kalkoen', '(H)eerlijke Paasdagen', 'Chicken', "Romano's Loyalty Rewards"],
      price: 28,
      points: 2500,
      barcode: '2218084000016',
    },
    {
      id: 'aaaa0009-0000-7000-8000-000000000009',
      product_variant_id: 'bbbb0009-0000-7000-8000-000000000009',
      name: 'HexClad Hybride Koekenpan 25 cm – Loyalty Exclusive Default Title',
      description: '<h2>🔒 HexClad Hybride Koekenpan 25 cm – Alleen voor members</h2><p>Dit product is niet te koop. Alleen te verkrijgen met punten binnen Romano’s Loyalty Club. Verzilver je punten en vul de unieke code in bij het afrekenen om deze <strong>GRATIS te ontvangen</strong>.</p>',
      image_url: 'https://cdn.shopify.com/s/files/1/0700/4635/1681/files/Hexclad25cmpan.webp?v=1774761630',
      channel_links: [
        { channel_id: 'cccc0001-0000-7000-8000-000000000001', product_url: 'https://biologischvleeschatelier.nl/products/hexclad-hybride-koekenpan-25-cm-loyalty-exclusive', channel_name: 'In winkel', channel_description: 'In winkel', external_connection_id: 'dddd0001-0000-7000-8000-000000000001', external_connection_type: 'DIGI' },
        { channel_id: 'cccc0002-0000-7000-8000-000000000002', product_url: 'https://biologischvleeschatelier.nl/products/hexclad-hybride-koekenpan-25-cm-loyalty-exclusive', channel_name: 'Online', channel_description: 'Shopify', external_connection_id: 'dddd0002-0000-7000-8000-000000000002', external_connection_type: 'SHOPIFY' },
      ],
      categories: ["Romano's Loyalty Rewards", 'Frying Pans'],
      price: 189,
      points: 15000,
      barcode: '2218174000018',
    },
    {
      id: 'aaaa0010-0000-7000-8000-000000000010',
      product_variant_id: 'bbbb0010-0000-7000-8000-000000000010',
      name: 'Houten Snijplank met Romano’s Logo (37x19 cm) – Loyalty Exclusive Default Title',
      description: '<h2>🔒 Houten Snijplank – Alleen voor members</h2><p>Dit product is niet te koop. Verzilver je punten en krijg een unieke code, die je kunt gebruiken bij het afrekenen om deze <strong>GRATIS te ontvangen</strong>. Alleen te verkrijgen met punten binnen Romano’s Loyalty Club.</p>',
      image_url: 'https://cdn.shopify.com/s/files/1/0700/4635/1681/files/snijplank37x19bedruktkopie.png?v=1774763557',
      channel_links: [
        { channel_id: 'cccc0001-0000-7000-8000-000000000001', product_url: 'https://biologischvleeschatelier.nl/products/houten-snijplank-met-romano-s-logo-37x19-cm-loyalty-exclusive', channel_name: 'In winkel', channel_description: 'In winkel', external_connection_id: 'dddd0001-0000-7000-8000-000000000001', external_connection_type: 'DIGI' },
        { channel_id: 'cccc0002-0000-7000-8000-000000000002', product_url: 'https://biologischvleeschatelier.nl/products/houten-snijplank-met-romano-s-logo-37x19-cm-loyalty-exclusive', channel_name: 'Online', channel_description: 'Shopify', external_connection_id: 'dddd0002-0000-7000-8000-000000000002', external_connection_type: 'SHOPIFY' },
      ],
      categories: ["Romano's Loyalty Rewards", 'Cutting Boards'],
      price: 50,
      points: 4500,
      barcode: '2218144000017',
    },
    {
      id: 'aaaa0011-0000-7000-8000-000000000011',
      product_variant_id: 'bbbb0011-0000-7000-8000-000000000011',
      name: 'Forged Slagersmes – Loyalty Exclusive Default Title',
      description: '<h2>🔒 Forged Slagersmes – Alleen voor members</h2><p>Dit product is niet te koop. Verzilver je punten en gebruik de unieke code, tijdens het afrekenen om deze <strong>GRATIS te ontvangen</strong>. Alleen te verkrijgen met punten binnen Romano’s Loyalty Club.</p>',
      image_url: 'https://cdn.shopify.com/s/files/1/0700/4635/1681/files/Forgedslagersmes.jpg?v=1774762996',
      channel_links: [
        { channel_id: 'cccc0001-0000-7000-8000-000000000001', product_url: 'https://biologischvleeschatelier.nl/products/forged-slagersmes-loyalty-exclusive', channel_name: 'In winkel', channel_description: 'In winkel', external_connection_id: 'dddd0001-0000-7000-8000-000000000001', external_connection_type: 'DIGI' },
        { channel_id: 'cccc0002-0000-7000-8000-000000000002', product_url: 'https://biologischvleeschatelier.nl/products/forged-slagersmes-loyalty-exclusive', channel_name: 'Online', channel_description: 'Shopify', external_connection_id: 'dddd0002-0000-7000-8000-000000000002', external_connection_type: 'SHOPIFY' },
      ],
      categories: ["Romano's Loyalty Rewards", "Chef's Knives"],
      price: 75,
      points: 6000,
      barcode: '2218154000014',
    },
    {
      id: 'aaaa0012-0000-7000-8000-000000000012',
      product_variant_id: 'bbbb0012-0000-7000-8000-000000000012',
      name: 'Bio Spareribs dik bevleesd 750 gram',
      description: '<p>Onze dik bevleesde biologische spareribs zijn een echte traktatie voor de vleesliefhebber. Gesneden van het ribgedeelte van het varken, met een royale vleesbedekking op het bot – ideaal om langzaam te garen tot boterzachte perfectie.</p>',
      image_url: 'https://cdn.shopify.com/s/files/1/0700/4635/1681/files/iStock-spareribs_40c776e1-663b-456e-b38f-85854ddc95cf.jpg?v=1729004961',
      channel_links: [
        { channel_id: 'cccc0001-0000-7000-8000-000000000001', product_url: 'https://biologischvleeschatelier.nl/products/spareribs-dik-bevleesd', channel_name: 'In winkel', channel_description: 'In winkel', external_connection_id: 'dddd0001-0000-7000-8000-000000000001', external_connection_type: 'DIGI' },
        { channel_id: 'cccc0002-0000-7000-8000-000000000002', product_url: 'https://biologischvleeschatelier.nl/products/spareribs-dik-bevleesd', channel_name: 'Online', channel_description: 'Shopify', external_connection_id: 'dddd0002-0000-7000-8000-000000000002', external_connection_type: 'SHOPIFY' },
      ],
      categories: ['BBQ & Gourmet', 'Pork', 'Biologisch Varkensvlees', "Romano's Loyalty Rewards"],
      price: 14,
      points: 1400,
      barcode: '221805400015',
    },
    {
      id: 'aaaa0013-0000-7000-8000-000000000013',
      product_variant_id: 'bbbb0013-0000-7000-8000-000000000013',
      name: 'Bio Entrecote Dry Aged 40 days+ 200 gram',
      description: '<p>Een van onze dry aged signatures. lekker mals en een nootachtige smaak. Deze dry aged entrecote is minimaal 40 dagen gerijpt, wat zorgt voor een ongekend diepe, nootachtige smaak en een prachtige malsheid.</p>',
      image_url: 'https://cdn.shopify.com/s/files/1/0700/4635/1681/files/iStock-dryentrecote.jpg?v=1729044463',
      channel_links: [
        { channel_id: 'cccc0001-0000-7000-8000-000000000001', product_url: 'https://biologischvleeschatelier.nl/products/entrecote-dry-aged-40-days', channel_name: 'In winkel', channel_description: 'In winkel', external_connection_id: 'dddd0001-0000-7000-8000-000000000001', external_connection_type: 'DIGI' },
        { channel_id: 'cccc0002-0000-7000-8000-000000000002', product_url: 'https://biologischvleeschatelier.nl/products/entrecote-dry-aged-40-days', channel_name: 'Online', channel_description: 'Shopify', external_connection_id: 'dddd0002-0000-7000-8000-000000000002', external_connection_type: 'SHOPIFY' },
      ],
      categories: ['Premium Dry-Aged Beef', 'BBQ & Gourmet', 'Beef', "Romano's Loyalty Rewards"],
      price: 14,
      points: 1400,
      barcode: '2218034000011',
    },
    {
      id: 'aaaa0014-0000-7000-8000-000000000014',
      product_variant_id: 'bbbb0014-0000-7000-8000-000000000014',
      name: 'Bio Ribeye Dry Aged 40 days+ 200 gram',
      description: '<p><strong>Onze held!</strong> Gegarandeerd een succes op tafel en verrassend eenvoudig te bereiden. Deze Dry Aged Ribeye 40 Days+ is minimaal 40 dagen gerijpt in onze eigen rijpingskast.</p>',
      image_url: 'https://cdn.shopify.com/s/files/1/0700/4635/1681/files/iStock-ribeye1.jpg?v=1729009293',
      channel_links: [
        { channel_id: 'cccc0001-0000-7000-8000-000000000001', product_url: 'https://biologischvleeschatelier.nl/products/ribeye-dry-aged-40-days', channel_name: 'In winkel', channel_description: 'In winkel', external_connection_id: 'dddd0001-0000-7000-8000-000000000001', external_connection_type: 'DIGI' },
        { channel_id: 'cccc0002-0000-7000-8000-000000000002', product_url: 'https://biologischvleeschatelier.nl/products/ribeye-dry-aged-40-days', channel_name: 'Online', channel_description: 'Shopify', external_connection_id: 'dddd0002-0000-7000-8000-000000000002', external_connection_type: 'SHOPIFY' },
      ],
      categories: ['Beef', 'BBQ & Gourmet', "Romano's Loyalty Rewards", 'Premium Dry-Aged Beef'],
      price: 14,
      points: 1400,
      barcode: '2218044000018',
    },
    {
      id: 'aaaa0015-0000-7000-8000-000000000015',
      product_variant_id: 'bbbb0015-0000-7000-8000-000000000015',
      name: 'Smash Burger Pers – Loyalty Exclusive Default Title',
      description: '<h2>🔒 Smash Burger Pers – Alleen voor members</h2><p>Dit product is niet te koop. Alleen te verkrijgen met punten binnen Romano’s Loyalty Club. Verzilver je punten en krijg een unieke kortingscode, die je kan gebruiken tijdens het afrekenen om deze <strong>GRATIS te ontvangen</strong>.</p>',
      image_url: 'https://cdn.shopify.com/s/files/1/0700/4635/1681/files/Stainless-Steel-Burger-Press-6572-6572A_rgb-1200x1200-28e5ebb.png?v=1774761003',
      channel_links: [
        { channel_id: 'cccc0001-0000-7000-8000-000000000001', product_url: 'https://biologischvleeschatelier.nl/products/smash-burger-pers-loyalty-exclusive', channel_name: 'In winkel', channel_description: 'In winkel', external_connection_id: 'dddd0001-0000-7000-8000-000000000001', external_connection_type: 'DIGI' },
        { channel_id: 'cccc0002-0000-7000-8000-000000000002', product_url: 'https://biologischvleeschatelier.nl/products/smash-burger-pers-loyalty-exclusive', channel_name: 'Online', channel_description: 'Shopify', external_connection_id: 'dddd0002-0000-7000-8000-000000000002', external_connection_type: 'SHOPIFY' },
      ],
      categories: ["Romano's Loyalty Rewards", 'Kitchen Molds'],
      price: 40,
      points: 3600,
      barcode: '2218184000015',
    },
    {
      id: 'aaaa0016-0000-7000-8000-000000000016',
      product_variant_id: 'bbbb0016-0000-7000-8000-000000000016',
      name: 'Smash Burger Experience Box – Loyalty Exclusive Default Title',
      description: '<h2>🔒 Smash Burger Experience Box – Alleen voor members</h2><p>Dit product is niet te koop! Verzilver je punten en gebruik de unieke code tijdens het afrekenen om deze <strong>GRATIS te ontvangen</strong>. Alleen te verkrijgen met punten binnen Romano’s Loyalty Club.</p>',
      image_url: 'https://cdn.shopify.com/s/files/1/0700/4635/1681/files/smashburgermetbuns.jpg?v=1774763456',
      channel_links: [
        { channel_id: 'cccc0002-0000-7000-8000-000000000002', product_url: 'https://biologischvleeschatelier.nl/products/smash-burger-experience-box-romanos-loyalty-club-exclusive', channel_name: 'Online', channel_description: 'Shopify', external_connection_id: 'dddd0002-0000-7000-8000-000000000002', external_connection_type: 'SHOPIFY' },
      ],
      categories: ['BBQ & Gourmet', 'Beef', "Romano's Loyalty Rewards"],
      price: 75,
      points: 6000,
      barcode: null,
    },
  ],
};

// ─── Resolvers ──────────────────────────────────────────────────────
// Match the logical endpoint (query string stripped) to canned data.

export function resolveApiMock(endpoint, options = {}) {
  const path = endpoint.split('?')[0];
  const method = (options.method || 'GET').toUpperCase();

  if (path === '/customer/profile') {
    if (method === 'PUT') return { ...customer, ...JSON.parse(options.body || '{}') };
    return customer;
  }
  if (path === '/customer/family-members') {
    if (method === 'POST') return { id: Date.now(), ...JSON.parse(options.body || '{}') };
    return family;
  }
  if (path.startsWith('/customer/family-members/')) {
    if (method === 'DELETE') return undefined;
    return { ...JSON.parse(options.body || '{}') };
  }
  if (/^\/customer\/\d+\/recent-orders$/.test(path)) return orders;
  if (/^\/customer\/recommendation\//.test(path)) return recommendedOrder;
  if (path === '/customer/header/loyalty-points') return { points: customer.loyalty_points };
  if (/^\/orders\/.+\/items$/.test(path)) return orderItems;
  if (path === '/api/profile/subscriptions') return [];
  if (path === '/api/header/rewards') return rewards;
  if (path === '/api/header/tip-of-the-day') return tipOfDay;
  if (path === '/calendar/events/next') return nextEvent;
  if (path === '/api/sustainability') return { co2_saved_kg: 42, local_sourcing_percentage: 85, partner_farms_count: 6 };
  if (path === '/localization/languages') return languages;
  if (path === '/localization/countries') return countries;
  if (path === '/localization/cities') return cities;
  if (path.startsWith('/carts')) {
    return { id: 'cart_1', items_update_url: 'https://example.com/cart', checkout_url: 'https://example.com/checkout' };
  }

  console.warn('[mock] no api mock for', path, '— returning []');
  return [];
}

export function resolveRecommendedOrderMock() {
  return recommendedOrder;
}

export function resolveBarcodeMock() {
  // The real method returns an object-URL for an image blob; a placeholder path is fine in dev.
  return '/no-photo.png';
}

export function resolveLoyaltyMock(endpoint, options = {}) {
  const path = endpoint.split('?')[0];
  const method = (options.method || 'GET').toUpperCase();

  if (path === '/enrollments') return enrollments;
  if (/\/product-variants$/.test(path)) return loyaltyProducts;
  if (path === '/products/affordable') return [];
  if (/^\/products\//.test(path)) return { product: null };
  if (/\/redemption-channels$/.test(path)) return [{ id: 'ch_1', name: 'In-store' }];
  if (/\/redemptions$/.test(path)) return method === 'POST' ? { success: true } : [];
  if (/\/transactions$/.test(path)) return { results: [] };
  if (/\/cancel$/.test(path)) return { success: true, pointsRefunded: 0 };
  if (path === '/health') return { status: 'ok' };

  console.warn('[mock] no loyalty mock for', path, '— returning []');
  return [];
}