export const onboardingSteps = {
  "/home": [
    {
      title: "Welcome, Adventurer!",
      content:
        "Your journey begins here. Navigate to different sections using the menu to manage your campaigns, encounters, and more. Use the back arrow to return to previous pages. Click the 'i' icon anytime to access this guide again.",
    },
  ],

  "/newcampaign": [
    {
      title: "Create Your Campaign",
      content:
        "Select your module and forge your path forward. Once chosen, christen your campaign with a name worthy of legend, something that captures the heart of your coming adventure. Need a little guidance before you begin? Click 'Learn More' on any module to uncover its secrets.",
    },
  ],

  "/session": [
    {
      title: "Session Management",
      content:
        "Begin a new chapter in your campaign by clicking 'New Session'. Prepare your notes, encounters, maps, everything you need to bring the next adventure to life. From this view, you can oversee every session in your campaign, each one chronicling your party's journey through the world you've built.",
    },
  ],

  "/session-edit": [
    {
      title: "Session Preparation",
      content:
        "Prepare your next session by gathering your tools, DM notes, encounters, and combat maps. Draw upon your library of pre-made encounters or conjure new challenges in the moment.",
    },
    {
      title: "Epic Fights",
      content:
        "Choose battle maps that bring each location to life, surrounding your players in the heart of the fight.",
    },
    {
      title: "OBS!",
      content:
        "Remember to save your session before departing, the Vault will warn you if any secrets remain unsaved.",
    },
  ],

  "/encounters": [
    {
      title: "Encounter Builder",
      content:
        "Forge reusable encounters worthy of any campaign. Search the bestiaries to summon creatures into your roster, and hover to reveal their full stat blocks. Adjust their numbers with a click, commanding legions or lone foes alike.",
    },
    {
      title: "Encounter Builder",
      content:
        "Name your creation well, saved encounters appear at your side, ready to be unleashed into any session at a moment's notice.",
    },
  ],

  "/loadcampaign": [
    {
      title: "Load your campaigns",
      content:
        "Every world you've crafted: every choice, every legend, gathered and waiting. Select a campaign to step back into your story, or begin a new one to forge another tale.",
    },
  ],

  // Easy to add more pages. Like this:
  // "/maps": [
  //   {
  //     title: "Map Library",
  //     content:
  //       "Browse and manage all combat and world maps available for your campaigns.",
  //   },
  // ],
};

// Fallback for pages without specific onboarding
export const defaultOnboarding = [
  {
    title: "Navigation",
    content:
      "Use the back arrow to return to the previous page, or click on the logo to return to the main menu.",
  },
];
