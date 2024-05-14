/**
 * AugmentationName.ZOE 
 * "Allows sleeves to benefit from Stanek's Gift, but is less powerful if several are installed.",
 * fct []
 * 
 * [AugmentationName.Xanipher]: {
    repCost: 8.75e5,
    moneyCost: 4.25e9,
    hacking: 1.2,
    strength: 1.2,
    defense: 1.2,
    dexterity: 1.2,
    agility: 1.2,
    charisma: 1.2,
    hacking_exp: 1.15,
    strength_exp: 1.15,
    defense_exp: 1.15,
    dexterity_exp: 1.15,
    agility_exp: 1.15,
    charisma_exp: 1.15,
    factions: [FactionName.NWO]
[AugmentationName.HydroflameLeftArm]: {
    repCost: 1.25e6,
    moneyCost: 2.5e12,
    info:
      "The left arm of a legendary BitRunner who ascended beyond this world. " +
      "It projects a light blue energy shield that protects the exposed inner parts. " +
      "Even though it contains no weapons, the advanced tungsten titanium " +
      "alloy increases the user's strength to unbelievable levels.",
    strength: 2.8,
    factions: [FactionName.NWO]
  },
 * 
 * 
 * 
 * moneyCost: 5e9,
    repCost: 3.625e5,
    info:
      "An experimental nanobot injection. Its unstable nature leads to " +
      "unpredictable results based on your circadian rhythm.",
    factions: [FactionName.SpeakersForTheDead],   
    RANDOM BONUSES: https://github.com/bitburner-official/bitburner-src/blob/dev/src/Augmentation/CircadianModulator.ts
[AugmentationName.GrapheneBrachiBlades]: {
    repCost: 2.25e5,
    moneyCost: 2.5e9,
    info:
      "An upgrade to the BrachiBlades augmentation. It infuses " +
      "the retractable blades with an advanced graphene material, " +
      "making them stronger and lighter.",
    prereqs: [AugmentationName.BrachiBlades],
    strength: 1.4,
    defense: 1.4,
    crime_success: 1.1,
    crime_money: 1.3,
    factions: [FactionName.SpeakersForTheDead]
  },
 * 
 * [AugmentationName.SmartJaw]: {
    repCost: 3.75e5,
    moneyCost: 2.75e9,
    info:
      "A bionic jaw that contains advanced hardware and software " +
      "capable of psychoanalyzing and profiling the personality of " +
      "others using optical imaging software.",
    charisma: 1.5,
    charisma_exp: 1.5,
    company_rep: 1.25,
    faction_rep: 1.25,
    factions: [FactionName.BachmanAssociates]
 * 
 * [AugmentationName.PhotosyntheticCells]: {
    repCost: 5.625e5,
    moneyCost: 2.75e9,
    info:
      "Chloroplasts are added to epidermal stem cells and are applied " +
      "to the body using a skin graft. The result is photosynthetic " +
      "skin cells, allowing users to generate their own energy " +
      "and nutrition using solar power.",
    strength: 1.4,
    defense: 1.4,
    agility: 1.4,
    factions: [FactionName.KuaiGongInternational]
  },
 * 
 * [AugmentationName.PCDNIOptimizer]: {
    repCost: 5e5,
    moneyCost: 4.5e9,
    info:
      "This is a submodule upgrade to the PC Direct-Neural Interface augmentation. It " +
      "improves the performance of the interface and gives the user more control options " +
      "to a connected computer.",
    prereqs: [AugmentationName.PCDNI],
    company_rep: 1.75,
    hacking: 1.1,
    factions: [
      FactionName.FulcrumSecretTechnologies,
      FactionName.ECorp,
      FactionName.BladeIndustries
    ]
  },
   [AugmentationName.Neotra]: {
    repCost: 5.625e5,
    moneyCost: 2.875e9,
    info:
      "A highly-advanced techno-organic drug that is injected into the skeletal " +
      "and integumentary system. The drug permanently modifies the DNA of the " +
      "body's skin and bone cells, granting them the ability to repair " +
      "and restructure themselves.",
    strength: 1.55,
    defense: 1.55,
    factions: [FactionName.BladeIndustries]
  },
  [AugmentationName.Hypersight]: {
    repCost: 1.5e5,
    moneyCost: 2.75e9,
    info:
      "A bionic eye implant that grants sight capabilities far beyond those of a natural human. " +
      "Embedded circuitry within the implant provides the ability to detect heat and movement " +
      "through solid objects such as walls, thus providing 'x-ray vision'-like capabilities.",
    dexterity: 1.4,
    hacking_speed: 1.03,
    hacking_money: 1.1,
    factions: [FactionName.BladeIndustries, FactionName.KuaiGongInternational]
 * 
 * [AugmentationName.PCDNINeuralNetwork]: {
    repCost: 1.5e6,
    moneyCost: 7.5e9,
    info:
      "This is an additional installation that upgrades the functionality of the " +
      "PC Direct-Neural Interface augmentation. When connected to a computer, " +
      "the Neural Network upgrade allows the user to use their own brain's " +
      "processing power to aid the computer in computational tasks.",
    prereqs: [AugmentationName.PCDNI],
    company_rep: 2,
    hacking: 1.1,
    hacking_speed: 1.05,
    factions: [FactionName.FulcrumSecretTechnologies]
  },
  AugmentationName.GrapheneBionicLegs]: {
    repCost: 7.5e5,
    moneyCost: 4.5e9,
    info:
      "An upgrade to the 'Bionic Legs' augmentation. The legs are fused " +
      "with graphene, greatly enhancing jumping ability.",
    prereqs: [AugmentationName.BionicLegs],
    agility: 2.5,
    factions: [
      FactionName.MegaCorp,
      FactionName.ECorp,
      FactionName.FulcrumSecretTechnologies
    ]
  },
  [AugmentationName.GrapheneBionicSpine]: {
    repCost: 1.625e6,
    moneyCost: 6e9,
    info:
      "An upgrade to the 'Bionic Spine' augmentation. The spine is fused with graphene " +
      "which enhances durability and supercharges all body functions.",
    prereqs: [AugmentationName.BionicSpine],
    strength: 1.6,
    defense: 1.6,
    agility: 1.6,
    dexterity: 1.6,
    factions: [FactionName.FulcrumSecretTechnologies, FactionName.ECorp]
  },
 * 
 * [AugmentationName.PCDNI]: {
    repCost: 3.75e5,
    moneyCost: 3.75e9,
    info:
      "Installs a Direct-Neural Interface jack into your arm that is compatible with most " +
      "computers. Connecting to a computer through this jack allows you to interface with " +
      "it using the brain's electrochemical signals.",
    company_rep: 1.3,
    hacking: 1.08,
    factions: [
      FactionName.FourSigma,
      FactionName.OmniTekIncorporated,
      FactionName.ECorp,
      FactionName.BladeIndustries
    ]
  },
 * 
 * [AugmentationName.OmniTekInfoLoad]: {
    repCost: 6.25e5,
    moneyCost: 2.875e9,
    info:
      "OmniTek's data and information repository is uploaded " +
      "into your brain, enhancing your programming and " +
      "hacking abilities.",
    hacking: 1.2,
    hacking_exp: 1.25,
    factions: [FactionName.OmniTekIncorporated]
  },
 * 
 * [AugmentationName.nextSENS]: {
    repCost: 4.375e5,
    moneyCost: 1.925e9,
    info:
      "The body is genetically re-engineered to maintain a state " +
      "of negligible senescence, preventing the body from " +
      "deteriorating with age.",
    hacking: 1.2,
    strength: 1.2,
    defense: 1.2,
    dexterity: 1.2,
    agility: 1.2,
    charisma: 1.2,
    factions: [FactionName.ClarkeIncorporated]
  },
 * 
 * [AugmentationName.Neurotrainer3]: {
    repCost: 2.5e4,
    moneyCost: 1.3e8,
    info:
      "A decentralized cranial implant that improves the brain's ability to learn. This " +
      "is a more powerful version of the Neurotrainer I and Neurotrainer II augmentation, " +
      "but it does not require either of them to be installed as a prerequisite.",
    hacking_exp: 1.2,
    strength_exp: 1.2,
    defense_exp: 1.2,
    dexterity_exp: 1.2,
    agility_exp: 1.2,
    charisma_exp: 1.2,
    factions: [FactionName.NWO, FactionName.FourSigma]
  },
 * 
 * [AugmentationName.NeuronalDensification]: {
    repCost: 1.875e5,
    moneyCost: 1.375e9,
    info:
      "The brain is surgically re-engineered to have increased neuronal density " +
      "by decreasing the neuron gap junction. Then, the body is genetically modified " +
      "to enhance the production and capabilities of its neural stem cells.",
    hacking: 1.15,
    hacking_exp: 1.1,
    hacking_speed: 1.03,
    factions: [FactionName.ClarkeIncorporated]
  },
 * 
 * [AugmentationName.HiveMind]: {
    repCost: 1.5e6,
    moneyCost: 5.5e9,
    info:
      `A brain implant developed by ${FactionName.ECorp}. They do not reveal what ` +
      "exactly the implant does, but they promise that it will greatly " +
      "enhance your abilities.",
    hacking_grow: 3,
    stats: "",
    factions: [FactionName.ECorp]
  },
  [AugmentationName.FocusWire]: {
    repCost: 7.5e4,
    moneyCost: 9e8,
    info:
      "A cranial implant that stops procrastination by blocking specific neural pathways in the brain.",
    hacking_exp: 1.05,
    strength_exp: 1.05,
    defense_exp: 1.05,
    dexterity_exp: 1.05,
    agility_exp: 1.05,
    charisma_exp: 1.05,
    company_rep: 1.1,
    work_money: 1.2,
    factions: [
      FactionName.BachmanAssociates,
      FactionName.ClarkeIncorporated,
      FactionName.FourSigma,
      FactionName.KuaiGongInternational
    ]
  },
  [AugmentationName.EnhancedSocialInteractionImplant]: {
    repCost: 3.75e5,
    moneyCost: 1.375e9,
    info:
      "A cranial implant that greatly assists in the user's ability to analyze social situations " +
      "and interactions. The system uses a wide variety of factors such as facial expression, body " +
      "language, voice tone, and inflection to determine the best course of action during social " +
      "situations. The implant also uses deep learning software to continuously learn new behavior " +
      "patterns and how to best respond.",
    charisma: 1.6,
    charisma_exp: 1.6,
    factions: [
      FactionName.BachmanAssociates,
      FactionName.NWO,
      FactionName.ClarkeIncorporated,
      FactionName.OmniTekIncorporated,
      FactionName.FourSigma
    ]
  },
 * 
 * [AugmentationName.GrapheneBionicArms]: {
    repCost: 5e5,
    moneyCost: 3.75e9,
    info:
      "An upgrade to the Bionic Arms augmentation. It infuses the " +
      "prosthetic arms with an advanced graphene material " +
      "to make them stronger and lighter.",
    prereqs: [AugmentationName.BionicArms],
    strength: 1.85,
    dexterity: 1.85,
    factions: [FactionName.TheDarkArmy]
  },
 * 
 * [AugmentationName.CordiARCReactor]: {
    repCost: 1.125e6,
    moneyCost: 5e9,
    info:
      "The thoracic cavity is equipped with a small chamber designed " +
      "to hold and sustain hydrogen plasma. The plasma is used to generate " +
      "fusion power through nuclear fusion, providing limitless amounts of clean " +
      "energy for the body.",
    strength: 1.35,
    defense: 1.35,
    dexterity: 1.35,
    agility: 1.35,
    strength_exp: 1.35,
    defense_exp: 1.35,
    dexterity_exp: 1.35,
    agility_exp: 1.35,
    factions: [FactionName.MegaCorp]
  },
 * 
 * [AugmentationName.BigDsBigBrain]: {
    isSpecial: true,
    factions: [],
    repCost: Infinity,
    moneyCost: Infinity,
    info:
      "A chip containing the psyche of the greatest BitRunner to ever exists. " +
      "Installing this relic significantly increases ALL of your stats. " +
      "However, it may have unintended consequence on the users mental well-being.",
    stats: "Grants access to unimaginable power.",
    hacking: 2,
    strength: 2,
    defense: 2,
    dexterity: 2,
    agility: 2,
    charisma: 2,
    hacking_exp: 2,
    strength_exp: 2,
    defense_exp: 2,
    dexterity_exp: 2,
    agility_exp: 2,
    charisma_exp: 2,
    hacking_chance: 2,
    hacking_speed: 2,
    hacking_money: 2,
    hacking_grow: 2,
    company_rep: 2,
    faction_rep: 2,
    crime_money: 2,
    crime_success: 2,
    work_money: 2,
    hacknet_node_money: 2,
    hacknet_node_purchase_cost: 0.5,
    hacknet_node_ram_cost: 0.5,
    hacknet_node_core_cost: 0.5,
    hacknet_node_level_cost: 0.5,
    bladeburner_max_stamina: 2,
    bladeburner_stamina_gain: 2,
    bladeburner_analysis: 2,
    bladeburner_success_chance: 2,

    startingMoney: 1e12,
    programs: [
      CompletedProgramName.bruteSsh,
      CompletedProgramName.ftpCrack,
      CompletedProgramName.relaySmtp,
      CompletedProgramName.httpWorm,
      CompletedProgramName.sqlInject,
      CompletedProgramName.deepScan1,
      CompletedProgramName.deepScan2,
      CompletedProgramName.serverProfiler,
      CompletedProgramName.autoLink,
      CompletedProgramName.formulas
    ]
  },
 * 
 * 
 * 
 * 
 */
