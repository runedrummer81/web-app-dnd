// Complete Sunblight Fortress Room Data
// Based on Rime of the Frostmaiden Chapter 3

export const FORTRESS_LEVELS = {
  ICE_GATE: "ice-gate",
  COMMAND: "command",
  FORGE: "forge",
};

export const fortressRooms = {
  // ========================================
  // COMMAND LEVEL (X1-X12)
  // ========================================

  X1: {
    id: "X1",
    name: "Entrance",
    level: FORTRESS_LEVELS.COMMAND,
    readAloud: {
      en: "Moving east from the top of the stairs leads you to the entrance of the fortress: a ten-foot-high double door of featureless stone. An arrow slit facing in your direction guards the approach.",
      da: "At bevæge sig østpå fra toppen af trappen fører jer til indgangen til fortet: en tre meter høj dobbeltdør af karakterløs sten. En pilspalte vendt i jeres retning vogter tilgangen.",
    },
    dmNotes: {
      en: "**Arrow Slit:** A duergar guard in area X6 watches through the arrow slit (three-quarters cover). If he sees the party, he turns invisible. He's loyal to Grandolpha and hopes the characters will dispose of Xardorok. He will secretly open the doors from X6.\n\n**Doors:** Barred shut from within. Can't be opened except with knock spell or from area X6.\n\n**Portcullis:** Lowered iron portcullis. Can be raised from X6's winch or forced with knock spell.",
      da: "**Pilspalte:** En duergar-vagt i område X6 holder øje gennem pilspalten (tre-fjerdedele dækning). Hvis han ser gruppen, bliver han usynlig. Han er loyal over for Grandolpha og håber at karakterne vil skaffe sig af med Xardorok. Han vil i hemmelighed åbne dørene fra X6.\n\n**Døre:** Blokeret fra inderside. Kan ikke åbnes undtagen med knock trylleformular eller fra område X6.\n\n**Faldgitter:** Sænket jernfaldgitter. Kan hæves fra X6's spil eller tvinges med knock trylleformular.",
    },
    enemies: [],
    loot: [],
  },

  X2: {
    id: "X2",
    name: "Vestibule",
    level: FORTRESS_LEVELS.COMMAND,
    readAloud: {
      en: "Beyond the portcullis is an empty room with a narrow opening at the far end and an arrow slit in the western wall.",
      da: "Hinsides faldgitteret er et tomt rum med en smal åbning i den fjerne ende og en pilspalte i den vestlige væg.",
    },
    dmNotes: {
      en: '**Arrow Slit:** A duergar guard in area X3 watches this room (three-quarters cover). If she sees or hears intruders, she shouts "To arms!" in Undercommon. The nine duergar guards in X3 spend 1 round rallying before attacking.',
      da: '**Pilspalte:** En duergar-vagt i område X3 holder øje med dette rum (tre-fjerdedele dækning). Hvis hun ser eller hører indtrængere, råber hun "Til våben!" på Undercommon. De ni duergar-vagter i X3 bruger 1 runde på at samle sig før de angriber.',
    },
    enemies: [],
    loot: [],
  },

  X3: {
    id: "X3",
    name: "Upper Barracks",
    level: FORTRESS_LEVELS.COMMAND,
    readAloud: {
      en: "A low stone table flanked by stone benches dominates this room, which is heated and illuminated by braziers of glowing-hot coals. Through the hazy smoke, you see featureless stone doors lining the walls.",
      da: "Et lavt stenbord flankeret af stenbænke dominerer dette rum, som opvarmes og oplyses af ildkar med glødende kul. Gennem den diesede røg ser I karakterløse stendøre langs væggene.",
    },
    dmNotes: {
      en: "**Enemies:** 1 female duergar guard (at arrow slit) + 8 duergar guards resting in side rooms.\n\n**Secret Door (DC 15 Perception):** East wall. 5-foot-wide stone door leads to tunnel connecting to area X4. No check needed to find from inside tunnel.",
      da: "**Fjender:** 1 kvindelig duergar-vagt (ved pilspalte) + 8 duergar-vagter hviler i siderum.\n\n**Hemmelig Dør (DC 15 Perception):** Østlig væg. 1,5 meter bred stendør fører til tunnel der forbinder til område X4. Ingen check nødvendig for at finde fra inde i tunnelen.",
    },
    enemies: ["9 Duergar Guards"],
    loot: [],
  },

  X4: {
    id: "X4",
    name: "Xardorok's War Room",
    level: FORTRESS_LEVELS.COMMAND,
    readAloud: {
      en: "This rectangular room has two sets of double doors. A brazier of glowing-hot coals stands in each corner. In the middle of the room is a low stone table, on the top of which is drawn an illustration that looks something like a map.",
      da: "Dette rektangulære rum har to sæt dobbeltdøre. Et ildkar med glødende kul står i hvert hjørne. I midten af rummet er et lavt stenbord, på toppen af hvilket er tegnet en illustration der ligner et kort.",
    },
    dmNotes: {
      en: '**Map:** Accurate depiction of Ten-Towns and environs. Dragon figurine on iron stand shows the chardalyn dragon\'s flight path. Pull lever to see the dragon "fly" over Ten-Towns.\n\n**Dragon Figurine:** Worth 50 gp. Anyone who keeps it for 1+ hours gains random indefinite madness.\n\n**Secret Door (DC 15 Perception):** Southwest corner behind brazier. Leads to area X3.',
      da: '**Kort:** Nøjagtig afbildning af Ten-Towns og omegn. Drage-figur på jernstativ viser chardalyn-dragens flyvevej. Træk i håndtag for at se dragen "flyve" over Ten-Towns.\n\n**Drage-figur:** Værd 50 gp. Enhver der beholder den i 1+ timer får tilfældig ubestemt vanvid.\n\n**Hemmelig Dør (DC 15 Perception):** Sydvestlige hjørne bag ildkar. Fører til område X3.',
    },
    enemies: [],
    loot: ["Dragon figurine (50 gp, causes madness)"],
  },

  X5: {
    id: "X5",
    name: "Xardorok's Quarters",
    level: FORTRESS_LEVELS.COMMAND,
    readAloud: {
      en: "Braziers heaped with glowing-hot coals heat this chamber, which contains a large stone bed covered with soot-stained furs. In a shallow niche above the bed is a bas relief of a giant, scowling duergar. At the foot of the bed is a flat-topped iron trunk sealed with a bulky padlock.",
      da: "Ildkar fyldt med glødende kul opvarmer dette kammer, som indeholder en stor steneseng dækket med sodplettet pels. I en lav niche over sengen er et basrelief af en kæmpe, surmulende duergar. Ved foden af sengen er en fladtoppet jernkiste forseglet med en klumpet hængelås.",
    },
    dmNotes: {
      en: "**Closet/Shrine:** West door leads to shrine with chardalyn statuette of Deep Duerra (2-foot-tall, nude female duergar with spiked crown). 7 mind flayer skulls on shelves. Key to trunk hidden in statuette's base indentation.\n\n**Statuette Touch:** Non-Xardorok must make DC 16 Wis save or take 18 (4d8) psychic damage. Keeping it 1+ hours = random indefinite madness.\n\n**Iron Trunk (DC 20 Dex to pick):** Bolted to floor. Contains treasure. TRAPPED: Removing all contents triggers poison gas (DC 14 Con save, 22/4d10 poison damage, gas lasts 10 minutes).",
      da: "**Skab/Helligdom:** Vestlig dør fører til helligdom med chardalyn-statuette af Deep Duerra (0,6 meter høj, nøgen kvindelig duergar med pigget krone). 7 mind flayer-kranier på hylder. Nøgle til kiste gemt i statuettens base-fordybning.\n\n**Statuette Berøring:** Ikke-Xardorok skal lave DC 16 Wis save eller tage 18 (4d8) psykisk skade. At beholde den 1+ timer = tilfældig ubestemt vanvid.\n\n**Jernkiste (DC 20 Dex at dirke):** Boltet til gulv. Indeholder skat. FÆLDE: Fjernelse af alt indhold udløser giftgas (DC 14 Con save, 22/4d10 giftskade, gas varer 10 minutter).",
    },
    enemies: [],
    loot: [
      "Dwarven obsidian sandals (250 gp)",
      "Quilted smoking jacket with 50 gemstones (500 gp)",
      "Malachite beard comb with 7 red garnets (750 gp)",
      "Platinum & star sapphire hookah (2,500 gp)",
      "Scroll with chest combinations for X37",
    ],
  },

  X6: {
    id: "X6",
    name: "Guard Post",
    level: FORTRESS_LEVELS.COMMAND,
    readAloud: {
      en: "This room is heated and illuminated by braziers of glowing-hot coals. Visible on the west wall are an arrow slit, an iron lever, and a heavy iron winch. A floor-to-ceiling iron cage in the middle contains an elevator shaft with chains in constant motion.",
      da: "Dette rum opvarmes og oplyses af ildkar med glødende kul. Synlige på den vestlige væg er en pilspalte, et jernhåndtag og et tungt jernspil. Et jernbur fra gulv til loft i midten indeholder en elevatorskakt med kæder i konstant bevægelse.",
    },
    dmNotes: {
      en: "**Invisible Duergar (Dreck):** Huddles in SW corner (DC 14 passive Perception to notice cold breath). Secretly loyal to Grandolpha. Wants Xardorok dead. Only fights in self-defense.\n\n**Elevator:** Iron car goes up/down constantly. Stops 1 minute per floor, takes 1 minute between floors. Goes up 100ft to X13, down 100ft to X22.\n\n**Lever:** Opens/closes fortress outer doors (X1).\n\n**Winch:** Raises/lowers portcullis between X1 and X2.",
      da: "**Usynlig Duergar (Dreck):** Krymper sig i SV hjørne (DC 14 passiv Perception for at bemærke kold ånde). Hemmeligt loyal over for Grandolpha. Vil have Xardorok død. Kæmper kun i selvforsvar.\n\n**Elevator:** Jernvogn går op/ned konstant. Stopper 1 minut per etage, tager 1 minut mellem etager. Går op 30m til X13, ned 30m til X22.\n\n**Håndtag:** Åbner/lukker fortets ydre døre (X1).\n\n**Spil:** Hæver/sænker faldgitter mellem X1 og X2.",
    },
    enemies: ["Dreck (invisible duergar, friendly)"],
    loot: [],
  },

  X7: {
    id: "X7",
    name: "Office of the Captain of the Guard",
    level: FORTRESS_LEVELS.COMMAND,
    readAloud: {
      en: "A stone desk and chair stand empty on the east side of the room. The braziers that normally heat and light the room have been extinguished. An arrow slit in the south wall lets in the frigid mountain air.",
      da: "Et stenskrivebord og stol står tomme på den østlige side af rummet. Ildkarrene der normalt opvarmer og oplyser rummet er slukket. En pilspalte i den sydlige væg lukker den iskolde bjergluft ind.",
    },
    dmNotes: {
      en: "**Empty:** Former office of Xardorok's captain of the guard, who is being tortured in area X34 for allegedly plotting a coup.",
      da: "**Tomt:** Tidligere kontor for Xardoroks kaptajn af vagten, som bliver tortureret i område X34 for angiveligt at planlægge et kup.",
    },
    enemies: [],
    loot: [],
  },

  X8: {
    id: "X8",
    name: "Private Dining Hall",
    level: FORTRESS_LEVELS.COMMAND,
    readAloud: {
      en: "Three braziers heaped with glowing-hot coals illuminate and heat this long hall. At the eastern end is a hexagonal stone table surrounded by six stone chairs. Seated in the chair facing the door is a haggard old duergar with long black hair streaked with white. She is devouring a hearty buffet. Lurking next to her is a small mechanical dragon made of shiny black substance. Three duergar cooks hunch over a hot stove in the west side of the room.",
      da: "Tre ildkar fyldt med glødende kul oplyser og opvarmer denne lange hal. I den østlige ende er et sekskant stenbord omgivet af seks stensstole. Siddende i stolen vendt mod døren er en udmattet gammel duergar med langt sort hår stribet med hvidt. Hun fortærer en solid buffet. Lurende ved siden af hende er en lille mekanisk drage lavet af skinnende sort substans. Tre duergar-kokke hænger over en varm komfur i den vestlige side af rummet.",
    },
    dmNotes: {
      en: "**Grandolpha Muzgardt:** Present with chardalyn dragonet (pseudodragon stats) and 3 duergar cook bodyguards. She invites party to dinner (cooked intellect devourer). Shares intel if asked:\n- Xardorok likely in forge (X24)\n- Dragon follows preset flight plan (see X4)\n- Capturing Underdark monsters\n- Has myconid sovereign for reanimation\n- Several duergar secretly loyal to her\n\n**Combat:** Casts stoneskin, uses faerie fire, withdraws.\n\n**Slaad Host:** If character has slaad tadpole secret, it could burst out during dinner!",
      da: "**Grandolpha Muzgardt:** Til stede med chardalyn-dragonet (pseudodragon stats) og 3 duergar-kok livvagter. Hun inviterer gruppen til middag (tilberedt intellect devourer). Deler information hvis spurgt:\n- Xardorok sandsynligvis i smede (X24)\n- Drage følger forudindstillet flyveplan (se X4)\n- Fanger Underdark-monstre\n- Har myconid-hersker til genoplivning\n- Flere duergar hemmeligt loyale over for hende\n\n**Kamp:** Kaster stoneskin, bruger faerie fire, trækker sig tilbage.\n\n**Slaad Vært:** Hvis karakter har slaad-tudse hemmelighed, kan den bryde ud under middagen!",
    },
    enemies: ["Grandolpha Muzgardt", "Chardalyn dragonet", "3 Duergar cooks"],
    loot: [],
  },

  X9: {
    id: "X9",
    name: "Portcullis",
    level: FORTRESS_LEVELS.COMMAND,
    readAloud: {
      en: "Across from the double doors is a short hallway with a lowered iron portcullis at its southernmost end. Beyond the portcullis is a wide shaft.",
      da: "Over for dobbeltdørene er en kort korridor med et sænket jernfaldgitter i dens sydligste ende. Hinsides faldgitteret er en bred skakt.",
    },
    dmNotes: {
      en: "**Lever:** Iron lever on west wall raises/lowers portcullis.\n\n**Shaft:** Descends 100ft to X26, climbs 120ft to ice doors. Requires magic or climbing gear to scale rough walls.",
      da: "**Håndtag:** Jernhåndtag på vestlig væg hæver/sænker faldgitter.\n\n**Skakt:** Falder 30m til X26, klatrer 36m til is-døre. Kræver magi eller klatreudstyr for at bestige ru vægge.",
    },
    enemies: [],
    loot: [],
  },

  X10: {
    id: "X10",
    name: "Durth's Quarters",
    level: FORTRESS_LEVELS.COMMAND,
    readAloud: {
      en: "This dark chamber contains a plain stone bed, a stone trunk, and four unlit braziers.",
      da: "Dette mørke kammer indeholder en simpel steneseng, en stenkiste og fire uslukte ildkar.",
    },
    dmNotes: {
      en: "**Durth Sunblight (Duergar Mind Master):** Only here if forced to abandon Easthaven in Chapter 1. If he hears suspicious activity, shrinks to Tiny and hides under bed.\n\n**Mimic Trunk:** Intelligent, speaks Undercommon. Attacks anyone who disturbs it. Durth joins battle on round 2 if present.",
      da: "**Durth Sunblight (Duergar Mind Master):** Kun her hvis tvunget til at forlade Easthaven i Kapitel 1. Hvis han hører mistænkelig aktivitet, skrumper til Lillebitte og gemmer sig under sengen.\n\n**Mimic-kiste:** Intelligent, taler Undercommon. Angriber alle der forstyrrer den. Durth slutter sig til kamp i runde 2 hvis til stede.",
    },
    enemies: ["Durth Sunblight (if present)", "Mimic"],
    loot: [],
  },

  X11: {
    id: "X11",
    name: "Nildar's Quarters",
    level: FORTRESS_LEVELS.COMMAND,
    readAloud: {
      en: "This dark room contains a plain stone bed, a stone trunk, and four unlit braziers. Mounted on the walls are the heads of various creatures.",
      da: "Dette mørke rum indeholder en simpel steneseng, en stenkiste og fire uslukte ildkar. Monteret på væggene er hovederne af forskellige skabninger.",
    },
    dmNotes: {
      en: "**Nildar:** Only here if forced to abandon post in Chapter 1. Sulking and plotting revenge. If his ogre zombie escaped with him, it stands in NE corner.\n\n**Trophies:** Mounted heads - crag cat, grick, male drow, kuo-toa, troglodyte, wolf, peryton, female grimlock. Nildar didn't kill most himself.",
      da: "**Nildar:** Kun her hvis tvunget til at forlade post i Kapitel 1. Surmulende og planlægger hævn. Hvis hans ogre-zombie undslap med ham, står den i NØ hjørne.\n\n**Trofæer:** Monterede hoveder - crag cat, grick, mandlig drow, kuo-toa, troglodyt, ulv, peryton, kvindelig grimlock. Nildar dræbte ikke de fleste selv.",
    },
    enemies: ["Nildar (if present)", "Ogre zombie (if present)"],
    loot: ["Ceramic jug of wine", "Drinking horn", "Charcoal sketch of mother"],
  },

  X12: {
    id: "X12",
    name: "Training Room",
    level: FORTRESS_LEVELS.COMMAND,
    readAloud: {
      en: "Braziers of glowing-hot coals stand in the corners, working to offset the cold air from arrow slits. Scattered around are training dummies and four freestanding suits of plate armor. A floor-to-ceiling iron cage in the middle contains an elevator shaft with chains in constant motion.",
      da: "Ildkar med glødende kul står i hjørnerne og arbejder på at opveje den kolde luft fra pilspalter. Spredt omkring er træningsdukker og fire fritståen de pladesæt. Et jernbur fra gulv til loft i midten indeholder en elevatorskakt med kæder i konstant bevægelse.",
    },
    dmNotes: {
      en: "**Training Dummies:** Harmless, been dismembered and sewn back together many times.\n\n**Animated Armor:** Touching or damaging any suit animates all 4. They attack all creatures in room, can't leave. Deactivate if no targets.\n\n**Elevator:** Goes up 100ft to X15, down 100ft to X30.",
      da: "**Træningsdukker:** Harmløse, er blevet parteret og syet sammen igen mange gange.\n\n**Animeret Rustning:** Berøring eller skade på nogen dragt animerer alle 4. De angriber alle skabninger i rummet, kan ikke forlade det. Deaktiverer hvis ingen mål.\n\n**Elevator:** Går op 30m til X15, ned 30m til X30.",
    },
    enemies: ["4 Animated Armor (if triggered)"],
    loot: [],
  },

  // ========================================
  // ICE GATE LEVEL (X13-X15)
  // ========================================

  X13: {
    id: "X13",
    name: "Western Gear Room",
    level: FORTRESS_LEVELS.ICE_GATE,
    readAloud: {
      en: "A large room with machinery filling the eastern half. Braziers heaped with hot coals do little to offset cold air blowing through arrow slits in the south wall.",
      da: "Et stort rum med maskiner der fylder den østlige halvdel. Ildkar fyldt med varme kul gør lidt for at opveje kold luft der blæser gennem pilspalter i den sydlige væg.",
    },
    dmNotes: {
      en: "**Enemies:** 2 duergar (at doors/lever) + 2 duergar hammerers in west chambers. Duergar enlarge on turn 1. Hammerers join after everyone else acts.\n\n**Ice Gate:** Stone wheel + lever controls western half of ice gate doors. Pull lever to open, slide back to close.\n\n**Elevator:** Down 100ft to X6, down 200ft to X22.",
      da: "**Fjender:** 2 duergar (ved døre/håndtag) + 2 duergar-hammerers i vest kamre. Duergar forstørrer i tur 1. Hammerers slutter sig til efter alle andre har handlet.\n\n**Is-port:** Stenhjul + håndtag kontrollerer vestlige halvdel af is-port døre. Træk håndtag for at åbne, skub tilbage for at lukke.\n\n**Elevator:** Ned 30m til X6, ned 60m til X22.",
    },
    enemies: ["2 Duergar", "2 Duergar Hammerers"],
    loot: [],
  },

  X14: {
    id: "X14",
    name: "Workshop",
    level: FORTRESS_LEVELS.ICE_GATE,
    readAloud: {
      en: "This messy workshop is heated and illuminated by braziers in the corners. Stone tables and cabinets fill the room. In the middle, surrounded by twisted metal bits, is a half-finished exoskeletal construct.",
      da: "Dette rodede værksted opvarmes og oplyses af ildkar i hjørnerne. Stenborde og skabe fylder rummet. I midten, omgivet af snoede metalstykker, er en halvfærdig exoskeletal konstruktion.",
    },
    dmNotes: {
      en: "**2 Duergar Mechanics:** Turn invisible when they hear combat in X13. Try to hide, fight only in self-defense.",
      da: "**2 Duergar-mekanikere:** Bliver usynlige når de hører kamp i X13. Forsøger at gemme sig, kæmper kun i selvforsvar.",
    },
    enemies: ["2 Duergar mechanics"],
    loot: ["2 sets of smith's tools", "1 set of tinker's tools"],
  },

  X15: {
    id: "X15",
    name: "Eastern Gear Room",
    level: FORTRESS_LEVELS.ICE_GATE,
    readAloud: {
      en: "A large room with machinery filling the western half. Braziers heaped with hot coals do little to offset cold air blowing through arrow slits.",
      da: "Et stort rum med maskiner der fylder den vestlige halvdel. Ildkar fyldt med varme kul gør lidt for at opveje kold luft der blæser gennem pilspalter.",
    },
    dmNotes: {
      en: "**1 Duergar Guard:** Enlarges to Large before combat.\n\n**Ice Gate:** Stone wheel + lever controls eastern half of ice gate. Pull to open, slide back to close.\n\n**Elevator:** Down 100ft to X12, down 200ft to X30.",
      da: "**1 Duergar-vagt:** Forstørrer til Stor før kamp.\n\n**Is-port:** Stenhjul + håndtag kontrollerer østlige halvdel af is-porten. Træk for at åbne, skub tilbage for at lukke.\n\n**Elevator:** Ned 30m til X12, ned 60m til X30.",
    },
    enemies: ["1 Duergar guard"],
    loot: [],
  },

  // ========================================
  // FORGE LEVEL (X16-X37) - First batch
  // ========================================

  X16: {
    id: "X16",
    name: "Northwest Cavern / Underdark Tunnel",
    level: FORTRESS_LEVELS.FORGE,
    readAloud: {
      en: "This cavern is unlit and has a jagged, 30-foot-high ceiling. Four duergar, two much larger than normal, use ropes to restrain a hulking biped with an insectoid body. A large sack has been pulled over the creature's bulbous head.",
      da: "Denne hule er uoplyst og har et takket, 9 meter højt loft. Fire duergar, to meget større end normalt, bruger reb til at begrænse en klumpet tofodet med insektlignende krop. En stor sæk er trukket over skabningens knoldede hoved.",
    },
    dmNotes: {
      en: "**4 Duergar + Umber Hulk:** 2 enlarged duergar. If challenged, they remove sack and release umber hulk, then turn invisible. Umber hulk attacks party. If party kills umber hulk, duergar attack.\n\n**Underdark Tunnel:** 10-foot-wide, miles-long tunnel to vast Underdark caverns.",
      da: "**4 Duergar + Umber Hulk:** 2 forstørrede duergar. Hvis udfordret, fjerner de sækken og frigiver umber hulk, bliver så usynlige. Umber hulk angriber gruppe. Hvis gruppe dræber umber hulk, angriber duergar.\n\n**Underdark-tunnel:** 3 meter bred, kilometer lang tunnel til enorme Underdark-huler.",
    },
    enemies: ["4 Duergar", "1 Umber Hulk"],
    loot: [],
  },

  X17: {
    id: "X17",
    name: "Duergar Mines",
    level: FORTRESS_LEVELS.FORGE,
    readAloud: {
      en: "Rich veins of iron ore run through the walls of this cavern. Narrow tunnels are cut deep into the rock. Here and there lie stacks of mining equipment.",
      da: "Rige årer af jernmalm løber gennem væggene i denne hule. Smalle tunneler er skåret dybt ind i klippen. Her og der ligger stabler af mineudstyr.",
    },
    dmNotes: {
      en: "**Mines:** Provide iron ore for tools, weapons, exoskeletons. Currently no duergar working.\n\n**3 Rust Monsters:** Came from Underdark, scrounging for iron. Attack anyone with metal armor/shields/weapons.",
      da: "**Miner:** Leverer jernmalm til værktøj, våben, exoskeletons. For tiden ingen duergar arbejder.\n\n**3 Rust Monsters:** Kom fra Underdark, søger efter jern. Angriber alle med metal rustning/skjolde/våben.",
    },
    enemies: ["3 Rust Monsters"],
    loot: [],
  },

  X18: {
    id: "X18",
    name: "Guarded Corridor",
    level: FORTRESS_LEVELS.FORGE,
    readAloud: {
      en: "Between two sets of double doors is a corridor with a dozen arrow slits along its walls.",
      da: "Mellem to sæt dobbeltdøre er en korridor med et dusin pilspalter langs væggene.",
    },
    dmNotes: {
      en: "**4 Duergar Guards:** Stationed in hallways (2 per side). Carry heavy crossbows (+2 to hit, 5/1d10 piercing damage).",
      da: "**4 Duergar-vagter:** Stationeret i korridorer (2 per side). Bærer tunge armbrøster (+2 at ramme, 5/1d10 gennemborende skade).",
    },
    enemies: ["4 Duergar guards with heavy crossbows"],
    loot: [],
  },

  X19: {
    id: "X19",
    name: "Chardalyn Throne",
    level: FORTRESS_LEVELS.FORGE,
    readAloud: {
      en: "The ceiling of this hall arches to thirty feet. Stone steps lead to a dais with a misshapen throne of black crystal. Crackling flames burn in braziers. Near the east wall slumps a tall fungus creature with luminous spores floating around it.",
      da: "Loftet i denne hal hvælver sig til ni meter. Stentrin fører til en plads med en misdannet trone af sort krystal. Knitrende flammer brænder i ildkar. Nær den østlige væg slumrer en høj svampeskabning med lysende sporer omkring.",
    },
    dmNotes: {
      en: "**Xardorok May Be Here:** Sitting on throne.\n\n**Enemies:** Thonot Krob (quaggoth thonot) + 4 quaggoth spore servants. Fight to death.\n\n**Reinforcements:** Combat brings 4 duergar from X18 + 4 quaggoths from X20.\n\n**Throne:** Contact for 1 hour = random indefinite madness. Permanent after 24 hours.",
      da: "**Xardorok Kan Være Her:** Sidder på trone.\n\n**Fjender:** Thonot Krob + 4 quaggoth spore-tjenere. Kæmper til døden.\n\n**Forstærkninger:** Kamp bringer 4 duergar fra X18 + 4 quaggoths fra X20.\n\n**Trone:** Kontakt i 1 time = tilfældig ubestemt vanvid. Permanent efter 24 timer.",
    },
    enemies: ["Thonot Krob", "4 Quaggoth spore servants"],
    loot: ["Jugs of animating spores"],
  },

  X20: {
    id: "X20",
    name: "Quaggoth Den",
    level: FORTRESS_LEVELS.FORGE,
    readAloud: {
      en: "This dark, filthy room is strewn with bones. It contains ten crude beds made of moss and fur. Loud mechanical noises come from behind the west wall.",
      da: "Dette mørke, beskidte rum er bestrøet med knogler. Det indeholder ti primitive senge af mos og pels. Høje mekaniske lyde fra den vestlige væg.",
    },
    dmNotes: {
      en: "**4 Quaggoths:** Gnawing bones. Attack on sight unless drawn to X19. Follow Thonot Krob.",
      da: "**4 Quaggoths:** Gnasker knogler. Angriber ved øjekontakt med mindre trukket til X19. Følger Thonot Krob.",
    },
    enemies: ["4 Quaggoths"],
    loot: [],
  },

  X21: {
    id: "X21",
    name: "Treacherous Guards",
    level: FORTRESS_LEVELS.FORGE,
    readAloud: {
      en: "Braziers of glowing coals in corners. Loud mechanical noises from behind the double door in the east wall.",
      da: "Ildkar med glødende kul i hjørner. Høje mekaniske lyde fra bag dobbeltdøren i den østlige væg.",
    },
    dmNotes: {
      en: "**2 Duergar (Friendly!):** Secretly loyal to Grandolpha. Allow party to pass. 50% know Xardorok's location.",
      da: "**2 Duergar (Venlige!):** Hemmeligt loyale over for Grandolpha. Lader gruppe passere. 50% ved Xardoroks placering.",
    },
    enemies: ["2 Duergar (secretly friendly)"],
    loot: [],
  },

  X22: {
    id: "X22",
    name: "Western Elevator",
    level: FORTRESS_LEVELS.FORGE,
    readAloud: {
      en: "The elevator shaft terminates here. A large stone wheel next to the iron cage turns constantly.",
      da: "Elevatorskakten slutter her. Et stort stenhjul ved jernburet drejer konstant.",
    },
    dmNotes: {
      en: "**Elevator:** Up 100ft to X6, up 200ft to X13.",
      da: "**Elevator:** Op 30m til X6, op 60m til X13.",
    },
    enemies: [],
    loot: [],
  },

  X23: {
    id: "X23",
    name: "Outer Gate",
    level: FORTRESS_LEVELS.FORGE,
    readAloud: {
      en: "A 15-foot-high iron gate with a bulky padlock on its eastern side.",
      da: "En 4,5 meter høj jernport med en klumpet hængelås på dens østlige side.",
    },
    dmNotes: {
      en: "**Lock:** Key with Thontara (X25). DC 20 Dex to pick. Knock spell opens. Breach alerts guards in X24-X26.",
      da: "**Lås:** Nøgle hos Thontara (X25). DC 20 Dex at dirke. Knock åbner. Brud alarmerer vagter i X24-X26.",
    },
    enemies: [],
    loot: [],
  },

  X24: {
    id: "X24",
    name: "The Forge",
    level: FORTRESS_LEVELS.FORGE,
    readAloud: {
      en: "Smoke fills this cavern. A pyramid-shaped stone forge emits heat and a pulsating heartbeat. Four guard towers overlook the area.",
      da: "Røg fylder denne hule. En pyramideformet stensmedje udsender varme og et pulserende hjerteslag. Fire vagttårne overskuer området.",
    },
    dmNotes: {
      en: "**Xardorok May Be Here:** On platform X25.\n\n**Guards:** 12 duergar (3 per tower). One per tower loyal to Grandolpha.\n\n**Forge:** Touch = 10 (3d6) fire damage. Contains red dragon heart (AC 13, 27 HP, vulnerable to cold).\n\n**Reinforcements:** 3 duergar hammerers from X28.",
      da: "**Xardorok Kan Være Her:** På platform X25.\n\n**Vagter:** 12 duergar (3 per tårn). En per tårn loyal over for Grandolpha.\n\n**Smedje:** Berøring = 10 (3d6) ildskade. Indeholder rød drage-hjerte (AC 13, 27 HP, sårbar over for kulde).\n\n**Forstærkninger:** 3 duergar hammerers fra X28.",
    },
    enemies: ["12 Duergar", "Thontara", "6 Quaggoths"],
    loot: ["Key to outer gate (Thontara's boot)"],
  },

  X25: {
    id: "X25",
    name: "Assembly Platform",
    level: FORTRESS_LEVELS.FORGE,
    readAloud: {
      en: "An enormous iron platform with cranes and clamps. Iron stairs lead to the top.",
      da: "En enorm jernplatform med kraner og klemmer. Jerntrapper fører til toppen.",
    },
    dmNotes: {
      en: "Where dragon was assembled. 5ft crawlspace underneath.",
      da: "Hvor dragen blev samlet. 1,5m krybekælder under.",
    },
    enemies: [],
    loot: [],
  },

  X26: {
    id: "X26",
    name: "Vertical Shaft",
    level: FORTRESS_LEVELS.FORGE,
    readAloud: {
      en: "A rectangular hole in the ceiling above. Below is a bin filled with twisted metal fragments.",
      da: "Et rektangulært hul i loftet over. Nedenunder er en beholder fyldt med snoede metalfragmenter.",
    },
    dmNotes: {
      en: "**Shaft:** Up 200ft to ice gate. Need magic/climbing gear.\n\n**Bin:** Chardalyn dragon fragments.",
      da: "**Skakt:** Op 60m til is-port. Kræver magi/klatreudstyr.\n\n**Beholder:** Chardalyn-drage fragmenter.",
    },
    enemies: [],
    loot: ["Chardalyn fragments"],
  },

  X27: {
    id: "X27",
    name: "Giant Lizard Pens",
    level: FORTRESS_LEVELS.FORGE,
    readAloud: {
      en: "Six arched cells with latched iron gates. Each houses a big lizard fitted with riding gear.",
      da: "Seks buede celler med hægte jernporte. Hver huserer en stor øgle med ridegrej.",
    },
    dmNotes: {
      en: "**6 Giant Lizards:** Mounts. Hostile to non-duergar. Can't attack through gates (latched not locked).",
      da: "**6 Kæmpe-øgler:** Ridedyr. Fjendtlige over for ikke-duergar. Kan ikke angribe gennem porte (hægtet ikke låst).",
    },
    enemies: ["6 Giant Lizards (caged)"],
    loot: [],
  },

  X28: {
    id: "X28",
    name: "Dungeon",
    level: FORTRESS_LEVELS.FORGE,
    readAloud: {
      en: "Dark corridor with iron doors. Iron crossbars seal each. Loud banging from one cell, gentle tapping from another.",
      da: "Mørk korridor med jerndøre. Jernstænger forsegles hver. Høj banken fra en celle, blid banken fra en anden.",
    },
    dmNotes: {
      en: "**3 Duergar Hammerers:** Unless at forge.\n\n**Tapping:** Doppelganger as 'Pekoe Quint'.\n\n**Banging:** Kapanuk Talltree (goliath warrior). Invites to Wyrmdoom Crag.",
      da: "**3 Duergar Hammerers:** Med mindre ved smedje.\n\n**Banken:** Doppelganger som 'Pekoe Quint'.\n\n**Dunken:** Kapanuk Talltree (goliath-kriger). Inviterer til Wyrmdoom Crag.",
    },
    enemies: ["3 Duergar Hammerers"],
    loot: [],
  },

  X29: {
    id: "X29",
    name: "Deep Duerra's Temple",
    level: FORTRESS_LEVELS.FORGE,
    readAloud: {
      en: "A seven-foot statue of a female duergar with a brazier in its sheared-off head. An emaciated creature with a metal plate on its head is chained to the pedestal.",
      da: "En to meter statue af en kvindelig duergar med et ildkar i dens afskårne hoved. En udmagret skabning med en metalplade på hovedet er lænket til piedestalen.",
    },
    dmNotes: {
      en: "**Xardorok May Be Here:** Praying. Gets +5 (1d10) psychic damage bonus here. Extinguish flame to remove.\n\n**Mind Flayer (F'yorl):** 9 HP. Harmless, has telepathy.\n\n**Side Rooms:** NW=clothing. NE=weapons.\n\n**Secret Door (DC 15):** East to X34.",
      da: "**Xardorok Kan Være Her:** Beder. Får +5 (1d10) psykisk skade bonus her. Sluk flamme for at fjerne.\n\n**Mind Flayer (F'yorl):** 9 HP. Harmløs, har telepati.\n\n**Siderum:** NV=tøj. NØ=våben.\n\n**Hemmelig Dør (DC 15):** Øst til X34.",
    },
    enemies: ["F'yorl (harmless)"],
    loot: ["Cold weather clothing", "Weapons"],
  },

  X30: {
    id: "X30",
    name: "Eastern Elevator",
    level: FORTRESS_LEVELS.FORGE,
    readAloud: {
      en: "Elevator shaft terminates here. A duergar in an exoskeletal construct guards it, his face a mask of pain.",
      da: "Elevatorskakt slutter her. En duergar i exoskeletal konstruktion vogter den, hans ansigt en maske af smerte.",
    },
    dmNotes: {
      en: "**1 Duergar Hammerer:** Attacks on sight.\n\n**Elevator:** Up 100ft to X12, up 200ft to X15.",
      da: "**1 Duergar Hammerer:** Angriber ved øjekontakt.\n\n**Elevator:** Op 30m til X12, op 60m til X15.",
    },
    enemies: ["1 Duergar Hammerer"],
    loot: [],
  },

  X31: {
    id: "X31",
    name: "Devil in Disguise",
    level: FORTRESS_LEVELS.FORGE,
    readAloud: {
      en: "Stacks of granite tablets. Behind them lurks a bearded duergar in black robes and a tall black miter.",
      da: "Stabler af granittavler. Bag dem lurer en skægget duergar i sorte kåber og en høj sort mitra.",
    },
    dmNotes: {
      en: "**Klondorn:** BARBED DEVIL with hat of disguise. Reveals form if threatened. Vanishes at 0 HP, leaves hat.\n\n**92 Tablets:** Infernal runes reveal Asmodeus' plot.",
      da: "**Klondorn:** PIGGET DJÆVEL med hat of disguise. Afslører form hvis truet. Forsvinder ved 0 HP, efterlader hat.\n\n**92 Tavler:** Infernalske runer afslører Asmodeus' plot.",
    },
    enemies: ["Klondorn (Barbed Devil)"],
    loot: ["Hat of Disguise"],
  },

  X32: {
    id: "X32",
    name: "Trapped Hall",
    level: FORTRESS_LEVELS.FORGE,
    readAloud: {
      en: "Short corridor with black boxes bolted to walls, giving off a low hum.",
      da: "Kort korridor med sorte kasser boltet til vægge, afgiver lav summen.",
    },
    dmNotes: {
      en: "**TRAP!** Lever in X36 deactivates. Enter/start turn = DC 15 Dex or 18 (4d8) lightning.",
      da: "**FÆLDE!** Håndtag i X36 deaktiverer. Gå ind/start tur = DC 15 Dex eller 18 (4d8) lyn.",
    },
    enemies: [],
    loot: [],
  },

  X33: {
    id: "X33",
    name: "Lower Barracks",
    level: FORTRESS_LEVELS.FORGE,
    readAloud: {
      en: "Six duergar sit around hexagonal tables with copper kegs. Braziers provide light. Nine doors in the walls.",
      da: "Seks duergar sidder omkring sekskantet borde med kobberfade. Ildkar giver lys. Ni døre i væggene.",
    },
    dmNotes: {
      en: "**15 Duergar:** 6 in hall, 9 in rooms. 10 LOYAL TO GRANDOLPHA! Will turn on kin if party claims to be on her side.",
      da: "**15 Duergar:** 6 i hal, 9 i rum. 10 LOYALE OVER FOR GRANDOLPHA! Vil vende sig mod slægt hvis gruppe påstår at være på hendes side.",
    },
    enemies: ["15 Duergar (10 potentially friendly)"],
    loot: [],
  },

  X34: {
    id: "X34",
    name: "Torture Chamber",
    level: FORTRESS_LEVELS.FORGE,
    readAloud: {
      en: "Walls lined with iron sarcophagi. A duergar woman is shackled to a chair, blistered flesh. Two hooded duergar torture her with hot irons.",
      da: "Vægge foret med jernsarkofager. En duergar-kvinde er lænket til en stol, vablende kød. To hætteklædte duergar torturerer hende med varme jern.",
    },
    dmNotes: {
      en: "**Nefrun:** Prisoner (7 HP), innocent.\n\n**2 Duergar Mind Masters:** Torturers.\n\n**Xardorok May Be Here:** Retreats to X30 if losing.\n\n**10 Iron Maidens:** 11 (2d10) damage.\n\n**Secret Door (DC 15):** West to X29.",
      da: "**Nefrun:** Fange (7 HP), uskyldig.\n\n**2 Duergar Mind Masters:** Torturere.\n\n**Xardorok Kan Være Her:** Trækker sig til X30 hvis taber.\n\n**10 Jernjomfruer:** 11 (2d10) skade.\n\n**Hemmelig Dør (DC 15):** Vest til X29.",
    },
    enemies: ["2 Duergar Mind Masters"],
    loot: [],
  },

  X35: {
    id: "X35",
    name: "Guest Quarters",
    level: FORTRESS_LEVELS.FORGE,
    readAloud: {
      en: "Two beds, one with yeti hide. Stone chests and copper keg stacks. Glowing coals in braziers.",
      da: "To senge, en med yeti-skind. Stenkister og kobberfad-stabler. Glødende kul i ildkar.",
    },
    dmNotes: {
      en: "**Grandolpha's Room:** She's in X8. Empty chests. Darklake Stout kegs.",
      da: "**Grandolphas Rum:** Hun er i X8. Tomme kister. Darklake Stout fade.",
    },
    enemies: [],
    loot: [],
  },

  X36: {
    id: "X36",
    name: "Duergar Hammerers",
    level: FORTRESS_LEVELS.FORGE,
    readAloud: {
      en: "Stone pillars support ceiling. A duergar in exoskeleton before a portcullis. Another in alcove. Stone lever in south alcove.",
      da: "Stensøjler støtter loft. En duergar i exoskeleton foran faldgitter. En anden i alkove. Stenhåndtag i sydlig alkove.",
    },
    dmNotes: {
      en: "**2 Duergar Hammerers:** Attack unknowns.\n\n**Portcullis:** Needs Xardorok's gauntlet OR knock OR DC 25 Str.\n\n**Lever:** Deactivates X32 trap.",
      da: "**2 Duergar Hammerers:** Angriber ukendte.\n\n**Faldgitter:** Kræver Xardoroks handske ELLER knock ELLER DC 25 Str.\n\n**Håndtag:** Deaktiverer X32 fælde.",
    },
    enemies: ["2 Duergar Hammerers"],
    loot: [],
  },

  X37: {
    id: "X37",
    name: "Treasure Vault",
    level: FORTRESS_LEVELS.FORGE,
    readAloud: {
      en: "Eight alcoves, each with an iron chest. Raised portcullises above.",
      da: "Otte alkover, hver med en jernkiste. Hævede faldgitter over.",
    },
    dmNotes: {
      en: "**8 Chests (combinations in X5, DC 20 Dex or knock):**\n1: Fire lichen liquor (120 gp)\n2: Gold drow mask (750 gp) + 350 gp\n3: Spider chalice (250 gp)\n4: Wand of Web + robe\n5: Piwafwi (cloak of elvenkind)\n6: Amber headdress (2,500 gp)\n7: Demogorgon statue (cursed)\n8: Moonstone eye (75 gp) + yellow mold",
      da: "**8 Kister (kombinationer i X5, DC 20 Dex eller knock):**\n1: Ild-lav likør (120 gp)\n2: Guld drow-maske (750 gp) + 350 gp\n3: Edderkop-kalk (250 gp)\n4: Wand of Web + kjole\n5: Piwafwi (cloak of elvenkind)\n6: Rav hovedpynt (2,500 gp)\n7: Demogorgon statue (forbandet)\n8: Månesten øje (75 gp) + gul mug",
    },
    enemies: [],
    loot: ["Total value: ~5,000+ gp worth of treasure + magic items"],
  },
};

export const FORTRESS_START = {
  room: "X1",
  level: FORTRESS_LEVELS.COMMAND,
};
