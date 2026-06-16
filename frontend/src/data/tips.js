// frontend/src/data/tips.js
// Static product tips — rotates daily, no API dependency

const tips = [
  { id: 1, tip: "Laat ribeye minstens 30 minuten op kamertemperatuur komen voor het bakken voor een gelijkmatige garing.", product_name: "Ribeye", product_link: "https://biologischvleeschatelier.nl/products/ribeye" },
  { id: 2, tip: "Gebruik een kernthermometer voor perfecte medium-rare: haal het vlees van het vuur bij 52°C.", product_name: "Entrecôte", product_link: "https://biologischvleeschatelier.nl/products/entrecote" },
  { id: 3, tip: "Laat biefstuk na het bakken 5 minuten rusten onder aluminiumfolie voor sappiger resultaat.", product_name: "Biefstuk", product_link: "https://biologischvleeschatelier.nl/products/biefstuk" },
  { id: 4, tip: "Braad ossobuco op laag vuur minstens 2 uur — het vlees moet van het bot vallen.", product_name: "Ossobuco", product_link: "https://biologischvleeschatelier.nl/products/ossobuco" },
  { id: 5, tip: "Schouderkarbonade wordt het lekkerst als je hem langzaam gaart op 160°C gedurende 3 uur.", product_name: "Schouderkarbonade", product_link: "https://biologischvleeschatelier.nl/products/schouderkarbonade" },
  { id: 6, tip: "Gehakt niet te lang kneden — dan wordt het taai. Meng net tot alles gebonden is.", product_name: "Rundergehakt", product_link: "https://biologischvleeschatelier.nl/products/rundergehakt" },
  { id: 7, tip: "Varkenshaas is gaar bij een kerntemperatuur van 63°C — licht roze van binnen is perfect.", product_name: "Varkenshaas", product_link: "https://biologischvleeschatelier.nl/products/varkenshaas" },
  { id: 8, tip: "Lamsrack 20 minuten op 200°C voor medium-rare. Laat 10 minuten rusten voor aansnijden.", product_name: "Lamsrack", product_link: "https://biologischvleeschatelier.nl/products/lamsrack" },
  { id: 9, tip: "Stoofvlees wordt malser als je het de dag ervoor maakt en opnieuw opwarmt.", product_name: "Stoofvlees", product_link: "https://biologischvleeschatelier.nl/products/stoofvlees" },
  { id: 10, tip: "Speklappen eerst op hoog vuur aanbraden, dan op laag vuur verder garen voor knapperige randjes.", product_name: "Speklappen", product_link: "https://biologischvleeschatelier.nl/products/speklappen" },
  { id: 11, tip: "Kalfsschnitzel plat slaan tot 5mm dik voor gelijkmatige en snelle garing.", product_name: "Kalfsschnitzel", product_link: "https://biologischvleeschatelier.nl/products/kalfsschnitzel" },
  { id: 12, tip: "Kippenbouten zijn sappiger dan kipfilet — gaar ze op 180°C tot een kerntemperatuur van 75°C.", product_name: "Kippenbout", product_link: "https://biologischvleeschatelier.nl/products/kippenbout" },
  { id: 13, tip: "Bavette is een smaakvolle snit — snijd altijd dwars op de draad voor malsheid.", product_name: "Bavette", product_link: "https://biologischvleeschatelier.nl/products/bavette" },
  { id: 14, tip: "Pulled pork: gaar varkensschouder op 120°C gedurende 8 uur voor perfecte draadjesstructuur.", product_name: "Varkensschouder", product_link: "https://biologischvleeschatelier.nl/products/varkensschouder" },
  { id: 15, tip: "Tartaar altijd vers bereiden en direct serveren — nooit langer dan 2 uur bewaren.", product_name: "Rundertartaar", product_link: "https://biologischvleeschatelier.nl/products/rundertartaar" },
  { id: 16, tip: "Rosbief: zet 20 minuten op 220°C, daarna 40 minuten op 160°C voor een mooie korst.", product_name: "Rosbief", product_link: "https://biologischvleeschatelier.nl/products/rosbief" },
  { id: 17, tip: "Lamsbout marineer je het beste een nacht in olijfolie, knoflook en rozemarijn.", product_name: "Lamsbout", product_link: "https://biologischvleeschatelier.nl/products/lamsbout" },
  { id: 18, tip: "Worstjes nooit inprikken — zo blijft het vocht en de smaak binnenin.", product_name: "Worst", product_link: "https://biologischvleeschatelier.nl/products/worst" },
  { id: 19, tip: "Kalfswang is het lekkerst als stoofgerecht — minimaal 3 uur op laag vuur.", product_name: "Kalfswang", product_link: "https://biologischvleeschatelier.nl/products/kalfswang" },
  { id: 20, tip: "T-bone steak: bak eerst het ossenhaasgedeelte kort, dan het entrecôtegedeelte iets langer.", product_name: "T-bone steak", product_link: "https://biologischvleeschatelier.nl/products/t-bone-steak" },
  { id: 21, tip: "Eendenborst: snijd de huid kruislings in, begin in een koude pan en bak langzaam op laag vuur.", product_name: "Eendenborst", product_link: "https://biologischvleeschatelier.nl/products/eendenborst" },
  { id: 22, tip: "Runderrib: low & slow op 130°C gedurende 5-6 uur voor boterzacht vlees.", product_name: "Runderrib", product_link: "https://biologischvleeschatelier.nl/products/runderrib" },
  { id: 23, tip: "Varkensrib: wikkel in folie en gaar 2,5 uur op 150°C, daarna 15 min open voor karamelisatie.", product_name: "Varkensrib", product_link: "https://biologischvleeschatelier.nl/products/varkensrib" },
  { id: 24, tip: "Lamskoteletten zijn heerlijk als je ze 2 minuten per kant op hoog vuur bakt — niet langer.", product_name: "Lamskoteletten", product_link: "https://biologischvleeschatelier.nl/products/lamskoteletten" },
  { id: 25, tip: "Sukadelappen worden malser als je ze met een scheutje rode wijn stooft.", product_name: "Sukadelappen", product_link: "https://biologischvleeschatelier.nl/products/sukadelappen" },
  { id: 26, tip: "Kipfilet niet te lang bakken — bij 70°C kerntemperatuur is hij gaar en nog sappig.", product_name: "Kipfilet", product_link: "https://biologischvleeschatelier.nl/products/kipfilet" },
  { id: 27, tip: "Hamburger: druk een kuiltje in het midden voor het bakken zodat hij plat blijft.", product_name: "Hamburger", product_link: "https://biologischvleeschatelier.nl/products/hamburger" },
  { id: 28, tip: "Côte de boeuf: 3 minuten per kant op de grill, dan 10 minuten in de oven op 180°C.", product_name: "Côte de boeuf", product_link: "https://biologischvleeschatelier.nl/products/cote-de-boeuf" },
  { id: 29, tip: "Kalfsgehakt is zachter van smaak — combineer met verse kruiden voor een lichte balletje.", product_name: "Kalfsgehakt", product_link: "https://biologischvleeschatelier.nl/products/kalfsgehakt" },
  { id: 30, tip: "Hert of wild: marineer 24 uur in rode wijn om de wildsmaak te verzachten.", product_name: "Wildfleisch", product_link: "https://biologischvleeschatelier.nl/products/wildfleisch" },
];

/**
 * Returns a tip that rotates daily based on the current date.
 * Same tip all day, changes at midnight.
 */
export function getDailyTip() {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today - new Date(today.getFullYear(), 0, 0)) / 86400000
  );
  return tips[dayOfYear % tips.length];
}

export default tips;