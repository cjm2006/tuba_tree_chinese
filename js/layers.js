addLayer("p", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    passiveGeneration(){
      return hasMilestone("a", 2) ? 1 : 0
    },
    color: "#006666",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "prestige points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        mult = mult.mul(hasUpgrade("p",13)?3:1)
        mult = mult.mul(hasUpgrade("a",12)?upgradeEffect("a", 12):1)
        mult = mult.mul(buyableEffect("p",12))
        mult = mult.pow(hasUpgrade("p",22)?1.1:1)
        mult = mult.mul(inChallenge("t",21) || inChallenge("t",41) || inChallenge("t",52) ? new Decimal(1) : player.t.shards.add(1).pow(new Decimal(0.5).mul(hasUpgrade("t",13)?3:1).mul(hasUpgrade("p",33)?2:1)).mul(hasChallenge("t",21)?1e8:1))
        mult = mult.mul(hasUpgrade("t",11)?1e6:1)
        mult = mult.pow(inChallenge("t",31) || inChallenge("t",52)?0.1:1)
        mult = mult.pow(hasChallenge("t",31)?1.05:1)
        mult = mult.mul(inChallenge("t",51) || inChallenge("t",52) ? new Decimal(1) : player.r.quarkEnergy.add(1).pow(new Decimal(2.5).add(hasUpgrade("r",14)?player.r.total.log10().div(10):0)))
        mult = mult.mul(inChallenge("r",12)?0:1)
        mult = mult.pow(hasUpgrade("t",45)?1.01:1)
        mult = mult.mul(buyableEffect("sp",11))
        mult = mult.mul(hasUpgrade("sp",14)?upgradeEffect("sp",14):1)
        mult = mult.pow(hasUpgrade("sp",22)?2:1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    automate(){
      if (player.p.points.lte(0)) return
      if (player.p.auto && !inChallenge("r",21) && !inChallenge("r",31)) {
        hasMilestone("t",4) ? addBuyables("p",11,player.p.points.dividedBy(10).times(9).dividedBy(getBuyableAmount("p",11).plus(1).pow10()).plus(1).log(100).floor()) : buyBuyable("p",11)
      }
      if (player.p.auto2 && !inChallenge("r",21) && !inChallenge("r",31)) {
        hasMilestone("t",4) ? addBuyables("p", 12, player.p.points.dividedBy(1e10).times(99).dividedBy(new Decimal(100).pow(getBuyableAmount("p",12).plus(1))).plus(1).log(100).floor()) : buyBuyable("p",12)
      }
    },
    layerShown(){return true},
    doReset(layer){
      if(layer=="p")return
        let keep = []
      if (layer=="a") {
        if (hasMilestone("a", 0)) keep.push("upgrades")
      }
      if (layer=="t"){
        if (!hasMilestone("t", 1)) player.p.auto = false;
        if (!hasMilestone("t", 1)) player.p.auto2 = false;
        if (hasMilestone("t", 0)) keep.push("upgrades")
      }
      if (layer=="r"){
        if (!hasMilestone("r", 1)) player.p.auto = false;
        if (!hasMilestone("r", 1)) player.p.auto2 = false;
        if (hasMilestone("r", 0)) keep.push("upgrades")
      }
      if (layer=="sp"){
        if (hasMilestone("sp", 0)) keep.push("upgrades")
      }
      layerDataReset("p",keep)
    },
    upgrades: {
      11: {
        title: "Point Multiplier",
        description: "Multiply point gain by 5.",
        cost: new Decimal(1),
      },
      12: {
        title: "Buyable Unlock",
        description: "Unlock a buyable.",
        cost: new Decimal(10),
        unlocked(){return hasUpgrade("p",11) || hasUpgrade("p",12) || player.a.total.gte(1) || player.t.total.gte(1)}
      },
      13: {
        title: "Prestige Enhancement",
        description: "Triple prestige point gain.",
        cost: new Decimal(25),
        unlocked(){return hasUpgrade("p",11) || hasUpgrade("p",13) || player.a.total.gte(1) || player.t.total.gte(1)}
      },
      14: {
        title: "Prestige Bonus",
        description: "Gain more points based on total prestige points.",
        cost: new Decimal(200),
        unlocked(){return hasUpgrade("p",13) || hasUpgrade("p",14) || player.a.total.gte(1) || player.t.total.gte(1)},
        effect(){return player.p.total.pow(hasUpgrade("a",14)?0.75:0.5).add(1)},
        effectDisplay(){return `x${format(this.effect())}`}
      },
      15: {
        title: "Short & Simple",
        description: "Multiply point gain by 1e10.",
        cost: new Decimal(1e220),
        unlocked(){return hasUpgrade("a",22) || hasUpgrade("p",15)}
      },
      21: {
        title: "Self-Synergy",
        description: "Gain more points based on points.",
        cost: new Decimal(1e275),
        unlocked(){return hasUpgrade("a",22) || hasUpgrade("p",21)},
        effect(){return hasUpgrade("p",35) ? player.points.pow(hasUpgrade("a",35)?(hasUpgrade("sp",21)?0.08:0.06):0.055).add(1) : player.points.pow(0.05).add(1)},
        effectDisplay(){return `x${format(this.effect())}`}
      },
      22: {
        title: "Prestige Exponential",
        description: "Prestige points ^1.1.",
        cost: new Decimal("1e420"),
        unlocked(){return hasUpgrade("a",22) || hasUpgrade("p",22)},
      },
      23: {
        title: "Hardcap Repellent",
        description: "Remove the hardcap for <b>Ascension Bonus</b>, but the formula for that upgrade is (softcapped).",
        cost: new Decimal("1e465"),
        unlocked(){return hasUpgrade("a",22) || hasUpgrade("p",23)},
      },
      24: {
        title: "Transcendental Tripler",
        description: "Gain 3x more transcension points.",
        cost: new Decimal("1e600"),
        unlocked(){return hasUpgrade("t",15) || hasUpgrade("p",24)},
      },
      25: {
        title: "New Shard Buyable",
        description: "Unlock a new buyable for shards.",
        cost: new Decimal("6.666e666"),
        unlocked(){return hasUpgrade("t",15) || hasUpgrade("p",25)},
      },
      31: {
        title: "Transcension Point Cloning",
        description: "Gain 1e10x more transcension points.",
        cost: new Decimal("1e6150"),
        unlocked(){return hasChallenge("t",12) || hasUpgrade("p",31)},
      },
      32: {
        title: "Transcendental Shards",
        description: "Shards boost transcension point gain at a reduced rate. (hardcaps at 1e30x)",
        cost: new Decimal("1e6810"),
        unlocked(){return hasChallenge("t",12) || hasUpgrade("p",32)},
        effect(){return player.t.shards.pow(0.25).add(1).gte("1e30") ? new Decimal(1e30) : player.t.shards.pow(0.25).add(1)},
        effectDisplay(){return `x${format(this.effect())}`}
      },
      33: {
        title: "Shard Refinery II",
        description: "The multiplier from shards is squared.",
        cost: new Decimal("1e7300"),
        unlocked(){return hasChallenge("t",12) || hasUpgrade("p",33)},
      },
      34: {
        title: "Short & Simple II",
        description: "Multiply ascension point gain by 1e100.",
        cost: new Decimal("1e21370"),
        unlocked(){return hasChallenge("t",12) || hasUpgrade("p",34)},
      },
      35: {
        title: "Self-Synergy Enhancement",
        description: "<b>Self-Synergy</b> uses a better formula.",
        cost: new Decimal("1e72600"),
        unlocked(){return hasChallenge("t",12) || hasUpgrade("p",35)},
      },
      41: {
        title: "Spirit Power",
        description: "Harness the power of Ant God--oh wait, wrong game, harness the power of the high gods and make the Shards Spirit more powerful.",
        cost: new Decimal("1e490000"),
        unlocked(){return hasChallenge("t",51) || hasUpgrade("p",41)},
      },
      42: {
        title: "Benevolence",
        description: "Gain 1000x more sacrificial gifts.",
        cost: new Decimal("1e700000"),
        unlocked(){return hasChallenge("t",51) || hasUpgrade("p",42)},
      },
      43: {
        title: "Hardcap Repellent II",
        description: "Remove the hardcap for <b>Reincarnation Bonus</b>, but the formula for that upgrade is (softcapped).",
        cost: new Decimal("1e1380000"),
        unlocked(){return hasChallenge("t",51) || hasUpgrade("p",43)},
      },
      44: {
        title: "Supercharged Energy",
        description: "Make the formula for generating quark energy even better.",
        cost: new Decimal("1e1435000"),
        unlocked(){return hasChallenge("t",51) || hasUpgrade("p",44)},
      },
      45: {
        title: "Even More Upgrades",
        description: "Unlock 5 new ascension upgrades.",
        cost: new Decimal("1e1620000"),
        unlocked(){return hasChallenge("t",51) || hasUpgrade("p",45)},
      },
    },
    buyables: {
    11: {
        title: "Point Quadrupler",
        cost(x) { return inChallenge("r",21) || inChallenge("r",31) ? new Decimal(Infinity) : new Decimal(10).mul(new Decimal(10).pow(x)) },
        display() {return `Quadruple point gain every time you buy this!\nTimes Bought: ${format(getBuyableAmount(this.layer, this.id))}\nCost: ${format(this.cost())}\nEffect: ${format(this.effect())}x points`},
        canAfford() {return player.p.points.gte(this.cost())},
        buy() {
            player.p.points = player.p.points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        unlocked(){return hasUpgrade("p",12)},
        effect(x) {
          mult2 = new Decimal(x).gte(15)? new Decimal(4).pow(15).mul(new Decimal(2.5).pow(new Decimal(x).sub(15))):new Decimal(4).pow(x)
          return mult2
        },
    },
    12: {
        title: "Prestige Point Tripler",
        cost(x) { return inChallenge("r",21) || inChallenge("r",31) ? new Decimal(Infinity) : new Decimal(1e10).mul(new Decimal(100).pow(x)) },
        display() {return `Triple prestige point gain every time you buy this!\nTimes Bought: ${format(getBuyableAmount(this.layer, this.id))}\nCost: ${format(this.cost())}\nEffect: ${format(this.effect())}x prestige points`},
        canAfford() {return player.p.points.gte(this.cost())},
        buy() {
            player.p.points = player.p.points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        unlocked(){return hasUpgrade("a",21)},
        effect(x) {
          mult2 = new Decimal(x).gte(45)? new Decimal(3).pow(45).mul(new Decimal(1.25).pow(new Decimal(x).sub(45))):new Decimal(3).pow(x)
          return mult2
        },
    },
    13: {
        title: "Ascension Point Doubler",
        cost(x) { return inChallenge("r",21) || inChallenge("r",31) ? new Decimal(Infinity) : new Decimal("1e20000").mul(new Decimal(1e20).pow(x)) },
        display() {return `Double ascension point gain every time you buy this!\nTimes Bought: ${format(getBuyableAmount(this.layer, this.id))}\nCost: ${format(this.cost())}\nEffect: ${format(this.effect())}x ascension points`},
        canAfford() {return player.p.points.gte(this.cost())},
        buy() {
            player.p.points = player.p.points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        unlocked(){return hasChallenge("t",22)},
        effect(x) {
          mult2 = new Decimal(x).gte(2500) ? new Decimal(2).pow(2500).mul(new Decimal(1.25).pow(new Decimal(x).sub(2500))) : new Decimal(2).pow(x)
          return mult2
        },
    },
}
})
addLayer("a", {
    name: "ascension", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    passiveGeneration(){
      return hasMilestone("t", 3) ? 1 : 0
    },
    color: "#FFFF00",
    requires: new Decimal(10000), // Can be a function that takes requirement increases into account
    resource: "ascension points", // Name of prestige currency
    baseResource: "prestige points", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        mult = mult.mul(hasUpgrade("a",13)?upgradeEffect("a", 13):1)
        mult = mult.mul(hasUpgrade("a",23)?1000:1)
        mult = mult.mul(hasUpgrade("t",12)?upgradeEffect("t",12):1)
        mult = mult.mul(hasUpgrade("t",14)?(inChallenge("t",21) || inChallenge("t",41) || inChallenge("t",52) ? new Decimal(1) : player.t.shards.add(1).pow(new Decimal(0.5).mul(hasUpgrade("t",13)?3:1).mul(hasUpgrade("p",33)?2:1)).mul(hasChallenge("t",21)?1e8:1)):1)
        mult = mult.mul(hasUpgrade("t",21)?1e15:1)
        mult = mult.mul(hasChallenge("t",11)?1e50:1)
        mult = mult.mul(hasUpgrade("p",34)?1e100:1)
        mult = mult.mul(buyableEffect("p",13))
        mult = mult.pow(hasUpgrade("a",31)?1.1:1)
        mult = mult.pow(inChallenge("t",42) || inChallenge("t",52)?0.05:1)
        mult = mult.pow(hasUpgrade("t",34)?1.2:1)
        mult = mult.mul(inChallenge("t",51) || inChallenge("t",52) ? new Decimal(1) : player.r.quarkEnergy.add(1).pow(new Decimal(2.5).add(hasUpgrade("r",14)?player.r.total.log10().div(10):0)))
        mult = mult.mul(buyableEffect("a",13))
        mult = mult.mul(inChallenge("r",12)?0:1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "a", description: "A: Reset for ascension points", unlocked(){return player.p.total.gte(1000) || player.a.total.gte(1) || player.t.total.gte(1) || player.r.total.gte(1)}, onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    automate(){
      if (player.a.points.lte(0)) return
      if (player.a.auto) {
        addBuyables("a",11,player.a.points.dividedBy(1e300).times(new Decimal(1e20).pow(inChallenge("t",22) || inChallenge("t",52)?5:1)).dividedBy((new Decimal(1e20).pow(inChallenge("t",22) || inChallenge("t",52)?5:1)).pow(getBuyableAmount("a",11).plus(1))).plus(1).log(new Decimal(1e20).pow(inChallenge("t",22) || inChallenge("t",52)?5:1)).floor())
        if(hasChallenge("t",22) && !inChallenge("r",21) && !inChallenge("r",31)){addBuyables("p",13,player.p.points.dividedBy("1e20000").times(1e20).dividedBy(new Decimal(1e20).pow(getBuyableAmount("p",13).plus(1))).plus(1).log(1e20).floor())}
      }
      if (player.a.auto2) {
        addBuyables("a",12,player.a.points.dividedBy("1e60000").times(new Decimal("1e1000")).dividedBy((new Decimal("1e1000")).pow(getBuyableAmount("a",12).plus(1))).plus(1).log(new Decimal("1e1000")).floor())
      }
      if (player.a.auto3) {
        addBuyables("a",13,player.a.points.dividedBy("1e800000").times(new Decimal("1e4000")).dividedBy((new Decimal("1e4000")).pow(getBuyableAmount("a",13).plus(1))).plus(1).log(new Decimal("1e4000")).floor())
      }
      if (player.t.points.lte(0)) return
      if (player.t.auto) {
        addBuyables("t",11,player.t.points.times(new Decimal(1.5)).dividedBy(new Decimal(2.5).pow(getBuyableAmount("t",11).plus(1))).plus(1).log(2.5).floor());
        addBuyables("t",12,player.t.points.dividedBy(10).times(4).dividedBy(new Decimal(5).pow(getBuyableAmount("t",12).plus(1))).plus(1).log(5).floor());
      }
    },
    branches: ["p"],
    layerShown(){return player.p.total.gte(1000) || player.a.total.gte(1) || player.t.total.gte(1) || player.r.total.gte(1)},
    doReset(layer){
      if (layer=="p")return
        let keep = []
      if (layer=="a")return
        let keep2 = []
      if (layer=="t"){
        if (hasMilestone("t", 1)) keep.push("milestones")
        if (hasMilestone("t", 2)) keep.push("upgrades")
      }
      if (layer=="r"){
        if (!hasMilestone("r",2)) player.a.auto = false;
        if (!hasMilestone("r",2)) player.a.auto2 = false;
        if (!hasMilestone("r",2)) player.t.auto = false;
        if (hasMilestone("r",0)) keep.push("upgrades")
        if (hasMilestone("r",1)) keep.push("milestones")
      }
      layerDataReset("a",keep)
    },
    upgrades: {
      11: {
        title: "Divine Power",
        description: "Multiply point gain by 10.",
        cost: new Decimal(1),
      },
      12: {
        title: "Ascension Bonus",
        description: "Gain more prestige points based on total ascension points.",
        cost: new Decimal(2),
        unlocked(){return hasUpgrade("a",11) || hasUpgrade("a",12) || player.t.total.gte(1)},
        effect(){return inChallenge("t",11) || inChallenge("t",52) ? new Decimal(1) : player.a.total.pow(hasUpgrade("a",15)?0.6:0.5).add(1).gte(1e120) ? (hasUpgrade("p",23) ? new Decimal(1e200).pow(hasUpgrade("a",15)?0.6:0.5).add(1).mul(player.a.total.pow(hasUpgrade("t",22)?0.25:0.1).add(1)) : new Decimal(1e120)) : player.a.total.pow(hasUpgrade("a",15)?0.6:0.5).add(1)},
        effectDisplay(){return `x${format(this.effect())}`}
      },
      13: {
        title: "Ascended Points",
        description: "Gain more ascension points based on points. (hardcaps at 25x)",
        cost: new Decimal(50),
        unlocked(){return hasUpgrade("a",11) || hasUpgrade("a",13) || player.t.total.gte(1)},
        effect(){return new Decimal(player.points).gte(1e24) ? new Decimal(25) : player.points.add(1).log10().add(1)},
        effectDisplay(){return `x${format(this.effect())}`}
      },
      14: {
        title: "Prestige Bonus Enhancement",
        description: "<b>Prestige Bonus</b> uses a better formula.",
        cost: new Decimal(1000),
        unlocked(){return hasMilestone("a",1) || hasUpgrade("a",14) || player.t.total.gte(1)},
      },
      15: {
        title: "Ascension Bonus Enhancement",
        description: "<b>Ascension Bonus</b> uses a better formula.",
        cost: new Decimal(2e10),
        unlocked(){return hasMilestone("a",2) || hasUpgrade("a",15) || player.t.total.gte(1)},
      },
      21: {
        title: "Buyable Unlock II",
        description: "Unlock a second buyable.",
        cost: new Decimal(5e11),
        unlocked(){return hasUpgrade("a",15) || hasUpgrade("a",21) || player.t.total.gte(1)},
      },
      22: {
        title: "Upgrade Unlock",
        description: "Unlock some new prestige upgrades.",
        cost: new Decimal(1e100),
        unlocked(){return hasUpgrade("a",15) || hasUpgrade("a",22) || player.t.total.gte(1)},
      },
      23: {
        title: "Small Ascension Multiplier",
        description: "Multiply ascension point gain by 1000.",
        cost: new Decimal(1e275),
        unlocked(){return hasUpgrade("a",15) || hasUpgrade("a",23) || player.t.total.gte(1)},
      },
      24: {
        title: "Transcended Points",
        description: "Gain more transcension points based on points.",
        cost: new Decimal("1e315"),
        unlocked(){return hasUpgrade("t",15) || hasUpgrade("a",24)},
        effect(){return player.points.add(1).log10().add(1).cbrt()},
        effectDisplay(){return `x${format(this.effect())}`}
      },
      25: {
        title: "Buyable Unlock III",
        description: "Unlock a buyable for Ascension.",
        cost: new Decimal("1e315"),
        unlocked(){return hasUpgrade("t",15) || hasUpgrade("a",25)},
      },
      31: {
        title: "ASCENDED",
        description: "Ascension points ^1.1.",
        cost: new Decimal("1e61400"),
        unlocked(){return hasUpgrade("t",31) || hasUpgrade("a",31)},
      },
      32: {
        title: "Shard Multiplier",
        description: "Gain more shards based on transcension points. (hardcaps at 1e200x)",
        cost: new Decimal("1e62425"),
        unlocked(){return hasUpgrade("t",31) || hasUpgrade("a",32)},
        effect(){return player.t.points.root(100).add(1).gte("1e200") ? new Decimal(1e200) : player.t.points.root(100).add(1)},
        effectDisplay(){return `x${format(this.effect())}`}
      },
      33: {
        title: "Buyable Unlock IV",
        description: "Unlock a second buyable for Ascension.",
        cost: new Decimal("1e62800"),
        unlocked(){return hasUpgrade("t",31) || hasUpgrade("a",33)},
      },
      34: {
        title: "Buyable Boost",
        description: "The 2nd ascension buyable is cheaper.",
        cost: new Decimal("1e67400"),
        unlocked(){return hasUpgrade("t",31) || hasUpgrade("a",34)},
      },
      35: {
        title: "Inflation II",
        description: "<b>Self-Synergy</b> uses an even better formula.",
        cost: new Decimal("1e113000"),
        unlocked(){return hasUpgrade("t",31) || hasUpgrade("a",35)},
      },
      41: {
        title: "Buyable Unlock V",
        description: "Unlock a third buyable for Ascension.",
        cost: new Decimal("1e850000"),
        unlocked(){return hasUpgrade("p",45) || hasUpgrade("a",41)},
      },
      42: {
        title: "Another Gift Bonus",
        description: "Gain 1,000,000x more gifts. This should help on the journey to max your spirits.",
        cost: new Decimal("1e5500000"),
        unlocked(){return hasUpgrade("p",45) || hasUpgrade("a",42)},
      },
      43: {
        title: "Another Shard Exponent",
        description: "Shards ^1.25. It's fun when numbers go up.",
        cost: new Decimal("1e5700000"),
        unlocked(){return hasUpgrade("p",45) || hasUpgrade("a",43)},
      },
      44: {
        title: "Softcap Extinguisher",
        description: "Weaken the shards softcap.",
        cost: new Decimal("1e8010000"),
        unlocked(){return hasUpgrade("p",45) || hasUpgrade("a",44)},
      },
      45: {
        title: "One Last Gift Multiplier",
        description: "Gain 1,000,000,000x more gifts again. I promise, this is the last one.",
        cost: new Decimal("1e9410000"),
        unlocked(){return hasUpgrade("p",45) || hasUpgrade("a",45)},
      },
    },
    buyables: {
      11: {
        title: "Point Booster",
        cost(x) {return new Decimal(1e20).pow(new Decimal(x).mul(inChallenge("t",22) || inChallenge("t",52)?5:1)).times(1e300)},//x is the amount of buyables you have
        canAfford() { return player.a.points.gte(this.cost())},
        buy() {
           player.a.points = player.a.points.sub(this.cost())
           setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        display() {return `Multiply point gain by 1e10 every time you buy this!\nTimes Bought: ${format(getBuyableAmount(this.layer, this.id))}\nCost: ${format(this.cost())}\nEffect: ${format(this.effect())}x point gain`},
        unlocked(){return hasUpgrade("a",25)},
        effect(x) { 
          mult2 = new Decimal(x).gte(3000) ? new Decimal(1e10).pow(3000).mul(new Decimal(5e4).pow(new Decimal(x).sub(3000))) : new Decimal(1e10).pow(x)
          return new Decimal(mult2)} //x is the amount of buyables you have
      },
      12: {
        title: "Point Booster II",
        cost(x) {return new Decimal(hasUpgrade("a",34)?"1e1000":"1e2000").pow(new Decimal(x)).times("1e60000")},//x is the amount of buyables you have
        canAfford() { return player.a.points.gte(this.cost())},
        buy() {
           player.a.points = player.a.points.sub(this.cost())
           setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        display() {return `Multiply point gain by 1e250 and shard gain by 100 every time you buy this!\nTimes Bought: ${format(getBuyableAmount(this.layer, this.id))}\nCost: ${format(this.cost())}\nEffect: ${format(this.effect())}x point gain`},
        unlocked(){return hasUpgrade("a",33)},
        effect(x) { 
          mult2 = new Decimal(x).gte(100) ? new Decimal(1e250).pow(100).mul(new Decimal(1e125).pow(new Decimal(x).sub(100))) : new Decimal(1e250).pow(x)
          return new Decimal(mult2)} //x is the amount of buyables you have
      },
      13: {
        title: "Ascension Point Booster",
        cost(x) {return new Decimal("1e4000").pow(new Decimal(x)).times("1e800000")},//x is the amount of buyables you have
        canAfford() { return player.a.points.gte(this.cost())},
        buy() {
           player.a.points = player.a.points.sub(this.cost())
           setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        display() {return `Multiply ascension point gain by 1e200 every time you buy this!\nTimes Bought: ${format(getBuyableAmount(this.layer, this.id))}\nCost: ${format(this.cost())}\nEffect: ${format(this.effect())}x ascension point gain`},
        unlocked(){return hasUpgrade("a",41)},
        effect(x) { 
          mult2 = new Decimal(x).gte(1000) ? new Decimal(1e200).pow(100).mul(new Decimal(1e10).pow(new Decimal(x).sub(1000))) : new Decimal(1e200).pow(x)
          return new Decimal(mult2)} //x is the amount of buyables you have
      },
  },
    milestones: {
    0: {
        requirementDescription: "10 ascension points",
        effectDescription: "Keep prestige upgrades on reset.",
        done() { return player.a.points.gte(10) }
    },
    1: {
        requirementDescription: "500 ascension points",
        effectDescription: "Automate the prestige buyable.",
        done() { return player.a.points.gte(500) },
        toggles: [
          ["p","auto"]
        ]
    },
    2: {
        requirementDescription: "1e9 ascension points",
        effectDescription: "Gain 100% of prestige point gain every second.",
        done() { return player.a.points.gte(1e9) },
    },
    3: {
        requirementDescription: "1e100 ascension points",
        effectDescription: "Automate the 2nd prestige buyable.",
        done() { return player.a.points.gte(1e100) },
        unlocked() { return hasUpgrade("a",21) || hasMilestone("a",3) || player.t.total.gte(1) || player.r.total.gte(1) },
        toggles: [
          ["p","auto2"]
        ]
    },
  }
})
addLayer("t", {
    name: "transcension", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "T", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    shards: new Decimal(0),
    }},
    passiveGeneration(){
      return hasMilestone("r", 5) ? 1 : 0
    },
    tabFormat: [
    "main-display",
    "prestige-button",
    ["display-text", () => `You have ${format(player.a.points)} ascension points`],
    ["display-text", () => `You have ${format(player.t.shards)} shards, multiplying ${hasUpgrade("t",14)?`point, prestige point, and ascension point`:`point and prestige point`} gain by ${format(inChallenge("t",21) || inChallenge("t",41) || inChallenge("t",52) ? new Decimal(1) : player.t.shards.add(1).pow(new Decimal(0.5).mul(hasUpgrade("t",13)?3:1).mul(hasUpgrade("p",33)?2:1)).mul(hasChallenge("t",21)?1e8:1))}x<br><br>`],
    "clickables",
    "milestones",
    "buyables",
    "upgrades",
    "challenges",
    ],
    color: "#9803FC",
    requires: new Decimal(1e280), // Can be a function that takes requirement increases into account
    resource: "transcension points", // Name of prestige currency
    baseResource: "ascension points", // Name of resource prestige is based on
    baseAmount() {return player.a.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.015, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        mult = mult.mul(hasUpgrade("p",24)?3:1)
        mult = mult.mul(hasUpgrade("a",24)?upgradeEffect("a",24):1)
        mult = mult.mul(hasUpgrade("p",31)?1e10:1)
        mult = mult.mul(hasUpgrade("p",32)?upgradeEffect("p",32):1)
        mult = mult.pow(hasUpgrade("t",25)?1.2:1)
        mult = mult.pow(hasUpgrade("t",34)?1.5:1)
        mult = mult.mul(hasUpgrade("r",11)?10:1)
        mult = mult.mul(inChallenge("t",51) || inChallenge("t",52) ? new Decimal(1) : player.r.quarkEnergy.add(1).pow(new Decimal(2.5).add(hasUpgrade("r",14)?player.r.total.log10().div(10):0)))
        mult = mult.mul(hasUpgrade("r",15)?upgradeEffect("r",15):1)
        mult = mult.mul(inChallenge("r",12)?0:1)
        mult = mult.pow(1+(challengeCompletions("r",12)/5))
        mult = mult.pow(hasUpgrade("t",44)?1.5:1)
        mult = mult.mul(hasUpgrade("sp",24)?"1e1000000000000":1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "t", description: "T: Reset for transcension points", unlocked(){return player.a.points.gte(1e280) || player.t.total.gte(1) || player.r.total.gte(1)}, onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    branches: ["a"],
    layerShown(){return player.a.points.gte(1e280) || player.t.total.gte(1) || player.r.total.gte(1)},
    doReset(layer){
      if (layer=="p")return
        let keep = []
      if (layer=="a")return
        let keep2 = []
      if (layer=="t")return
        let keep3 = []
      if (layer=="r"){
        if (!hasMilestone("r",2)) player.t.auto = false;
        if (hasMilestone("r",2)) keep.push("milestones")
        if (hasMilestone("r",3)) keep.push("upgrades")
        if (hasMilestone("r",4)) keep.push("challenges")
      }
      layerDataReset("t",keep)
    },
    upgrades: {
      11: {
        title: "Transcendental Power",
        description: "Multiply prestige point gain by 1,000,000.",
        cost: new Decimal(1),
        unlocked(){return player.t.total.gte(2) || hasUpgrade("t",11)},
      },
      12: {
        title: "Transcension Bonus",
        description: "Gain more ascension points based on total transcension points.",
        cost: new Decimal(1),
        unlocked(){return player.t.total.gte(2) || hasUpgrade("t",12)},
        effect(){return player.t.total.pow(hasUpgrade("t",24)?1.1:0.9).add(1)},
        effectDisplay(){return `x${format(this.effect())}`}
      },
      13: {
        title: "Shard Refinery",
        description: "The multiplier from shards is cubed.",
        cost: new Decimal(5),
        unlocked(){return player.t.total.gte(8) || hasUpgrade("t",13)},
      },
      14: {
        title: "Divine Shards",
        description: "Shards now multiply ascension point gain.",
        cost: new Decimal(10),
        unlocked(){return player.t.total.gte(8) || hasUpgrade("t",14)},
      },
      15: {
        title: "Upgrade Unlock II",
        description: "Unlock 2 new prestige upgrades and 2 new ascension upgrades.",
        cost: new Decimal(30),
        unlocked(){return hasUpgrade("t",14) || hasUpgrade("t",15)},
      },
      21: {
        title: "Yet Another Multiplier",
        description: "Multiply ascension point gain by 1e15.",
        cost: new Decimal(2000),
        unlocked(){return hasUpgrade("p",25) || hasUpgrade("t",21)},
      },
      22: {
        title: "Inflation",
        description: "Weaken the softcap for <b>Ascension Bonus</b>.",
        cost: new Decimal(10000),
        unlocked(){return hasUpgrade("t",21) || hasUpgrade("t",22)},
      },
      23: {
        title: "A New Mechanic",
        description: "Unlock Challenges!",
        cost: new Decimal(1.5e10),
        unlocked(){return hasUpgrade("t",22) || hasUpgrade("t",23)},
      },
      24: {
        title: "Transcension Bonus Enhancement",
        description: "<b>Transcension Bonus</b> uses a better formula.",
        cost: new Decimal("1e946"),
        unlocked(){return hasChallenge("t",32) || hasUpgrade("t",24)},
      },
      25: {
        title: "Hyper Transcension",
        description: "Transcension points ^1.2.",
        cost: new Decimal("1e956"),
        unlocked(){return hasChallenge("t",32) || hasUpgrade("t",25)},
      },
      31: {
        title: "Upgrade Unlock III",
        description: "Unlock 5 new ascension upgrades.",
        cost: new Decimal("1e964"),
        unlocked(){return hasUpgrade("t",25) || hasUpgrade("t",31)},
      },
      32: {
        title: "Additional Challenges",
        description: "Unlock 2 new challenges.",
        cost: new Decimal("1e1024"),
        unlocked(){return hasUpgrade("t",25) || hasUpgrade("t",32)},
      },
      33: {
        title: "True Transcension",
        description: "Shards ^1.2.",
        cost: new Decimal("1e2600"),
        unlocked(){return hasUpgrade("a",35) || hasUpgrade("t",33)},
      },
      34: {
        title: "Running Out of Ideas",
        description: "Ascension points ^1.2 and transcension points ^1.5.",
        cost: new Decimal("1e2850"),
        unlocked(){return hasChallenge("t",42) || hasUpgrade("t",34)},
      },
      35: {
        title: "Paradigm Shift",
        description: "UNLOCK A NEW PRESTIGE LAYER.",
        cost: new Decimal("1e3000"),
        unlocked(){return player.t.shards.gte("1e1000") || hasUpgrade("t",35)},
      },
      41: {
        title: "Gift Exponent",
        description: "Gifts ^1.1.",
        cost: new Decimal("1e68038500"),
        unlocked(){return challengeCompletions("r",22) >= 2 || hasUpgrade("t",41)},
      },
      42: {
        title: "It's Too Strong!",
        description: "Weaken that really strong shards softcap.",
        cost: new Decimal("1e1000000000"),
        unlocked(){return challengeCompletions("r",22) >= 4 || hasUpgrade("t",42)},
      },
      43: {
        title: "Small Point Exponent II",
        description: "You've become enlightened. Points ^1.001.",
        cost: new Decimal("1e2500000000"),
        unlocked(){return challengeCompletions("r",22) >= 6 || hasUpgrade("t",43)},
      },
      44: {
        title: "SUPER TRANSCENDED",
        description: "Transcension points ^1.5. These are pretty unoriginal upgrades, but they provide a boost.",
        cost: new Decimal("1e4000000000"),
        unlocked(){return challengeCompletions("r",22) >= 8 || hasUpgrade("t",44)},
      },
      45: {
        title: "The Last Transcension Upgrade",
        description: "Prestige points ^1.01. This might be good.",
        cost: new Decimal("1e5000000000"),
        unlocked(){return challengeCompletions("r",22) >= 10 || hasUpgrade("t",45)},
      },
    },
    buyables: {
      11: {
        title: "Shard Generator",
        cost(x) {return new Decimal(1).mul(new Decimal(2.5).pow(x)).floor()},
        canAfford() { return player.t.points.gte(this.cost())},
        buy() {
           player.t.points = player.t.points.sub(this.cost())
           setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        display() {return `Generate shards using this shard generator! Generate more shards with more generator levels.\nLevel: ${format(getBuyableAmount(this.layer, this.id))}\nCost: ${format(this.cost())}\nEffect: +${format(this.effect())} shards/sec`},
        effect(x) { 
          mult2 = new Decimal(x)
          mult2 = mult2.mul(buyableEffect("t",12))
          mult2 = mult2.mul(hasChallenge("t",21)?1e8:1)
          mult2 = mult2.mul(hasUpgrade("a",32)?upgradeEffect("a",32):1)
          mult2 = mult2.mul(new Decimal(100).pow(getBuyableAmount("a",12)))
          mult2 = mult2.mul(hasChallenge("t",41)?1e20:1)
          mult2 = mult2.pow(hasUpgrade("t",33)?1.2:1)
          mult2 = mult2.mul(hasUpgrade("r",11)?100000:1)
          mult2 = mult2.mul(inChallenge("t",51) || inChallenge("t",52) ? new Decimal(1) : player.r.quarkEnergy.add(1).pow(new Decimal(2.5).add(hasUpgrade("r",14)?player.r.total.log10().div(10):0)))
          mult2 = mult2.mul(hasUpgrade("r",15)?upgradeEffect("r",15):1)
          mult2 = mult2.mul(hasUpgrade("r",25)?1e50:1)
          mult2 = mult2.pow(buyableEffect("r",11))
          mult2 = mult2.pow(new Decimal(1).div(new Decimal(1.5).pow(player.r.charge.mul(10)))) //charge
          mult2 = mult2.mul(hasUpgrade("r",22)?1e10:1)
          mult2 = mult2.pow(inChallenge("t",41) || inChallenge("t",52)?0.2:1)
          mult2 = mult2.pow(hasChallenge("t",52)?1.1:1)
          mult2 = mult2.pow(hasUpgrade("a",43)?1.25:1)
          mult2 = mult2.mul(inChallenge("r",12)?0:1)
          mult2 = mult2.pow(challengeCompletions("r",21) > 7 ? 1.7 : 1+(challengeCompletions("r",21)/10))
          mult2 = inChallenge("r",22) || inChallenge("r",31) ? mult2.pow(0.01) : mult2.mul(new Decimal(1))
          mult2 = player.t.shards.gte("1e7500") && !inChallenge("r",22) && !inChallenge("r",31) ? (hasUpgrade("a",44) ? mult2.pow(new Decimal(0.75)).mul("1e5625") : mult2.pow(0.5).mul("1e3750")) : mult2;
          mult2 = player.t.shards.gte("1e150000000") ? (mult2.pow(0.5).mul("1e75000000")) : mult2;
          mult2 = player.t.shards.gte("1e2500000000") ? (hasUpgrade("t",42) ? mult2.pow(0.5).mul("1e1250000000") : mult2.pow(0.1).mul("1e250000000")) : mult2;
          return new Decimal(mult2)}
      },
      12: {
        title: "Shard Doubler",
        cost(x) {return new Decimal(10).mul(new Decimal(5).pow(x)).floor()},
        canAfford() { return player.t.points.gte(this.cost())},
        buy() {
           player.t.points = player.t.points.sub(this.cost())
           setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        display() {return `Double shard gain every time you buy this!\nTimes bought: ${format(getBuyableAmount(this.layer, this.id))}\nCost: ${format(this.cost())}\nEffect: ${format(this.effect())}x shards`},
        unlocked(){return hasUpgrade("p",25)},
        effect(x) { 
          mult2 = new Decimal(x).gte(200) ? new Decimal(2).pow(200).mul(new Decimal(1.25).pow(new Decimal(x).sub(200))) : new Decimal(2).pow(x)
          return new Decimal(mult2)}
      },
    },
    milestones: {
    0: {
        requirementDescription: "3 total transcension points",
        effectDescription: "Keep prestige upgrades on reset.",
        done() { return player.t.total.gte(3) }
    },
    1: {
        requirementDescription: "4 total transcension points",
        effectDescription: "Keep ascension milestones on reset.",
        done() { return player.t.total.gte(4) },
    },
    2: {
        requirementDescription: "5 total transcension points",
        effectDescription: "Keep ascension upgrades on reset.",
        done() { return player.t.total.gte(5) },
    },
    3: {
        requirementDescription: "8 total transcension points",
        effectDescription: "Gain 100% of ascension point gain per second.",
        done() { return player.t.total.gte(8) },
    },
    4: {
        requirementDescription: "12 total transcension points",
        effectDescription: "Buy max buyables.",
        done() { return player.t.total.gte(12) },
    },
    5: {
        requirementDescription: "1e40 transcension points",
        effectDescription: "Automate the ascension buyable and all future prestige buyables.",
        done() { return player.t.points.gte(1e40) },
        unlocked(){return hasChallenge("t",12) || hasMilestone("t",5)},
        toggles: [
          ["a","auto"]
        ]
    },
    6: {
        requirementDescription: "1e2000 transcension points",
        effectDescription: "Automate the 2nd ascension buyable and shard buyables.",
        done() { return player.t.points.gte("1e2000") },
        unlocked(){return hasUpgrade("a",35) || hasMilestone("t",6)},
        toggles: [
          ["a","auto2"],
          ["t","auto"]
        ]
    },
  },
    challenges: {
    11: {
        name: "Impotence",
        challengeDescription: "The multiplier from <b>Ascension Bonus</b> is 1x.",
        goalDescription: "Reach 1e215 points.",
        rewardDescription: "Gain 1e50x more ascension points.",
        canComplete: function() {return player.points.gte("1e215")},
        unlocked(){return hasUpgrade("t",23)}
    },
    12: {
        name: "Time Dilation",
        challengeDescription: "Points are ^0.75.",
        goalDescription: "Reach 1e660 points.",
        rewardDescription: "Points ^1.05, and unlock 5 new prestige upgrades.",
        canComplete: function() {return player.points.gte("1e660")},
        unlocked(){return hasUpgrade("t",23)}
    },
    21: {
        name: "No Shards",
        challengeDescription: "Shards are useless.",
        goalDescription: "Reach 1e9000 points.",
        rewardDescription: "Gain 100,000,000x more shards.",
        canComplete: function() {return player.points.gte("1e9000")},
        unlocked(){return hasUpgrade("t",23)}
    },
    22: {
        name: "Higher Costs",
        challengeDescription: "The ascension buyable scales significantly faster.",
        goalDescription: "Reach 1e7280 points.",
        rewardDescription: "Unlock the 3rd prestige buyable.",
        canComplete: function() {return player.points.gte("1e7280")},
        unlocked(){return hasUpgrade("t",23)}
    },
    31: {
        name: "Anti-Prestigious",
        challengeDescription: "Prestige points are ^0.1.",
        goalDescription: "Reach 1e2870 points.",
        rewardDescription: "Prestige points ^1.05.",
        canComplete: function() {return player.points.gte("1e2870")},
        unlocked(){return hasUpgrade("t",23)}
    },
    32: {
        name: "Financial Recession",
        challengeDescription: "Points are ^0.01.",
        goalDescription: "Reach 2.00e37 points.",
        rewardDescription: "Unlock 2 new transcension upgrades.",
        canComplete: function() {return player.points.gte("2e37")},
        unlocked(){return hasUpgrade("t",23)}
    },
    41: {
        name: "No Shards II",
        challengeDescription: "Shards are useless, and points are ^0.1.",
        goalDescription: "Reach 1e190 points.",
        rewardDescription: "Gain 1e20x more shards.",
        canComplete: function() {return player.points.gte("1e190")},
        unlocked(){return hasUpgrade("t",32)}
    },
    42: {
        name: "Anti-Ascension",
        challengeDescription: "Ascension points are ^0.05.",
        goalDescription: "Reach 1e360,000 points.",
        rewardDescription: "Unlock 2 new transcension upgrades. (Hey, this is unoriginal, Challenge 6 already used this reward!)",
        canComplete: function() {return player.points.gte("1e360000")},
        unlocked(){return hasUpgrade("t",32)}
    },
    51: {
        name: "Power Outage",
        challengeDescription: "Quark Energy does nothing, and shards ^0.2. (This challenge is super weak)",
        goalDescription: "Reach 1e765,000 points.",
        rewardDescription: "Unlock 5 new prestige upgrades, and quark energy ^1.1.",
        canComplete: function() {return player.points.gte("1e765000")},
        unlocked(){return hasUpgrade("r",35)}
    },
    52: {
        name: "Sadistic",
        challengeDescription: "Challenges 1-9 are all applied at once.",
        goalDescription: "Reach 100,000 points.",
        rewardDescription: "Shards ^1.1.",
        canComplete: function() {return player.points.gte("100000")},
        unlocked(){return hasUpgrade("r",35)}
    },
  },
    update(diff) {
      player.t.shards = player.t.shards.add(buyableEffect("t", 11).mul(diff))
    },
})
addLayer("r", {
    name: "reincarnation", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "R", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    quarkEnergy: new Decimal(0),
    charge: new Decimal(0),
    gifts: new Decimal(0),
    }},
    passiveGeneration(){
      return hasMilestone("r", 7) ? 1 : 0
    },
    tabFormat: [
    "main-display",
    "prestige-button",
    ["display-text", () => `You have ${format(player.t.shards)} shards<br><br>`],
    "milestones",
    () => hasUpgrade("r",31) ? ["display-text", `You have ${format(player.r.gifts)} sacrificial gifts.<br>When you are in reincarnation charge level 1, you generate sacrificial gifts.<br>These gifts can be spent on spirits, which are buyables that cap at 100 levels.`] : "",
    "buyables",
    "upgrades",
    ["bar", "bigBar"],
    () => hasUpgrade("r",13) ? ["display-text", `<span style="font-size: 20px;">You have ${format(player.r.quarkEnergy)} quark energy, multiplying all previous currencies by ${format(inChallenge("t",51) || inChallenge("t",52) ? new Decimal(1) : player.r.quarkEnergy.pow(new Decimal(1.5).add(hasUpgrade("r",14)?player.r.total.log10().div(10):0).plus(1)))}.</span><br>Your reincarnation charge is making point gain and shard gain ^${format(new Decimal(1).div(new Decimal(1.5).pow(player.r.charge.mul(10))))}.<br>You will generate quark energy based on your reincarnation charge and your shards, but be careful, point gain and shard gain will be reduced from your charge!<br><b>Note: Increasing/decreasing charge WILL cause a reincarnation reset without any bonus. You also need at least 1e50 shards to start generating quark energy.</b>`] : "",
    "clickables",
    ["display-text", () => `<br><br>`],
    "challenges",
    ],
    color: "green",
    requires: new Decimal("1e1000"), // Can be a function that takes requirement increases into account
    resource: "quarks", // Name of prestige currency
    baseResource: "shards", // Name of resource prestige is based on
    baseAmount() {return player.t.shards}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.01, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        mult = mult.mul(hasUpgrade("r",21)?upgradeEffect("r",21):1)
        mult = mult.pow(hasUpgrade("r",25)?2:1)
        mult = mult.mul(hasUpgrade("r",42)?upgradeEffect("r",42):1)
        if(mult.gte("1e2500")){mult=new Decimal(10).pow(mult.log10().pow(0.5))}
        mult = mult.mul(hasUpgrade("r",44)?upgradeEffect("r",44):1)
        mult = mult.pow(1+(challengeCompletions("r",31)/2))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 3, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "r", description: "R: Reincarnate for quarks", unlocked(){return hasUpgrade("t",35) || player.r.total.gte(1)}, onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    branches: ["t"],
    layerShown(){return hasUpgrade("t",35) || player.r.total.gte(1)},
    upgrades: {
      11: {
        title: "The Next Level",
        description: "Multiply point gain by 1000x, shard gain by 1e5x, and transcension point gain 10x.",
        cost: new Decimal(1),
      },
      12: {
        title: "Small Point Exponent",
        description: "You're starting to regain your memories of your past lives...points are ^1.001 from your new knowledge.",
        cost: new Decimal(8),
        unlocked(){return hasMilestone("r",5) || hasUpgrade("r",12)}
      },
      13: {
        title: "A New Mechanic II",
        description: "Unlock Quark Energy.",
        cost: new Decimal(10),
        unlocked(){return hasUpgrade("r",12) || hasUpgrade("r",13)}
      },
      14: {
        title: "Consolidated Energy",
        description: "Total quarks add to the quark energy multiplier exponent.",
        cost: new Decimal(10),
        unlocked(){return hasUpgrade("r",13) || hasUpgrade("r",14)},
        effect(){return player.r.total.log10().div(10)},
        effectDisplay(){return `+${format(this.effect())}`}
      },
      15: {
        title: "Reincarnation Bonus",
        description: "Total quarks boost transcension point gain and shard gain.",
        cost: new Decimal(15),
        unlocked(){return hasUpgrade("r",14) || hasUpgrade("r",15)},
        effect(){return player.r.total.pow(2).gte(1e100) ? (hasUpgrade("p",43) ? (player.r.total.pow(2).gte("1e2000") ? new Decimal("1e2000") : new Decimal(1e100).mul(player.r.total.div(1e50).pow(1.5))) : new Decimal(1e100)) : player.r.total.pow(2)},
        effectDisplay(){return `x${format(this.effect())}`}
      },
      21: {
        title: "Reincarnated Points",
        description: "Reusing old ideas repeatedly is fun! Gain more quarks based on points.",
        cost: new Decimal(15),
        unlocked(){return hasUpgrade("r",15) || hasUpgrade("r",21)},
        effect(){return player.points.add(1).log10().add(1).cbrt().div(10)},
        effectDisplay(){return `x${format(this.effect())}`}
      },
      22: {
        title: "Better Conductors",
        description: "Gain more quark energy based on total quarks. (hardcaps at 100,000,000x)",
        cost: new Decimal(200),
        unlocked(){return hasUpgrade("r",15) || hasUpgrade("r",22)},
        effect(){return player.r.total.root(hasUpgrade("r",34)?3:5).gte(1e8) ? new Decimal(1e8) : player.r.total.root(hasUpgrade("r",34)?3:5)},
        effectDisplay(){return `x${format(this.effect())}`}
      },
      23: {
        title: "Cleansing The World",
        description: "Gain 1e10x more shards, this multiplier is unaffected by reincarnation charge.",
        cost: new Decimal(250),
        unlocked(){return hasUpgrade("r",22) || hasUpgrade("r",23)},
      },
      24: {
        title: "Another Quark Energy Boost",
        description: "Make the formula for generating quark energy better.",
        cost: new Decimal(400),
        unlocked(){return hasUpgrade("r",22) || hasUpgrade("r",24)},
      },
      25: {
        title: "Exceptional Exponents",
        description: "I'm bored, square quark gain and multiply shard gain by 1e50.",
        cost: new Decimal(500),
        unlocked(){return hasUpgrade("r",24) || hasUpgrade("r",25)},
      },
      31: {
        title: "A New Mechanic III",
        description: "Unlock Spirits.",
        cost: new Decimal(25000),
        unlocked(){return hasUpgrade("r",25) || hasUpgrade("r",31)},
      },
      32: {
        title: "Gift Sale",
        description: "Gain 100x more sacrificial gifts.",
        cost: new Decimal(2000000),
        unlocked(){return hasUpgrade("r",31) || hasUpgrade("r",32)},
      },
      33: {
        title: "Reincarnated Gifts",
        description: "Gain more sacrificial gifts based on quark energy.",
        cost: new Decimal(1e9),
        unlocked(){return hasUpgrade("r",31) || hasUpgrade("r",33)},
        effect(){return player.r.quarkEnergy.root(7)},
        effectDisplay(){return `x${format(this.effect())}`}
      },
      34: {
        title: "Even Better Conductors",
        description: "<b>Better Conductors</b> uses a better formula.",
        cost: new Decimal(1.5e10),
        unlocked(){return hasUpgrade("r",33) || hasUpgrade("r",34)},
      },
      35: {
        title: "Old Mechanic, New Unlock",
        description: "Unlock 2 new challenges.",
        cost: new Decimal(5e10),
        unlocked(){return hasUpgrade("r",33) || hasUpgrade("r",35)},
      },
      41: {
        title: "A New Mechanic IV",
        description: "Unlock reincarnation challenges.",
        cost: new Decimal("1e3910"),
        unlocked(){return hasUpgrade("a",45) || hasUpgrade("r",41)},
      },
      42: {
        title: "4200 Blaze It",
        description: "Gain more quarks based on prestige points.",
        cost: new Decimal("1e4200"),
        unlocked(){return hasUpgrade("r",41) || hasUpgrade("r",42)},
        effect(){return player.p.points.root(1000000)},
        effectDisplay(){return `x${format(this.effect())}`}
      },
      43: {
        title: "More Gifts",
        description: "Ok, seriously, THIS is the last multiplier. Gain more gifts based on quarks.",
        cost: new Decimal("1.111e111111"),
        unlocked(){return hasUpgrade("r",42) || hasUpgrade("r",43)},
        effect(){return player.r.points.log(10)},
        effectDisplay(){return `x${format(this.effect())}`}
      },
      44: {
        title: "What Happened To My Production?",
        description: "I had to put a really tough softcap on your shards, sorry about that. Gain more quarks based on points.",
        cost: new Decimal("1e8000000"),
        unlocked(){return challengeCompletions("r",12) >= 10 || hasUpgrade("r",44)},
        effect(){return player.points.root(1000000)},
        effectDisplay(){return `x${format(this.effect())}`}
      },
      45: {
        title: "Inflation III",
        description: "Make the Shards Spirit more effective.",
        cost: new Decimal("1e8660000"),
        unlocked(){return challengeCompletions("r",22) >= 5 || hasUpgrade("r",45)},
      },
      51: {
        title: "All You Are Going To Do Is Get Back There",
        description: "Get back there.",
        cost: new Decimal("1e22000000"),
        unlocked(){return player.r.total.gte("1e22000000") || hasUpgrade("r",51)},
      },
    },
    buyables: {
      11: {
        title: "Shards Spirit",
        cost(x) {return new Decimal(3).pow(x)},//x is the amount of buyables you have
        canAfford() { return player.r.gifts.gte(this.cost())},
        purchaseLimit: 50,
        buy() {
           player.r.gifts = player.r.gifts.sub(this.cost())
           setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        display() {return `Exponentiate shards by ^${hasUpgrade("p",41)?(hasUpgrade("r",45)?1.03:1.02):1.01} per level.<br>Level: ${format(getBuyableAmount(this.layer, this.id))}/50<br>Cost: ${format(this.cost())}\nEffect: ^${format(this.effect())} shards`},
        unlocked(){return hasUpgrade("r",31)},
        effect(x) { 
          mult2 = new Decimal(hasUpgrade("p",41)?(hasUpgrade("r",45)?1.03:1.02):1.01).pow(x)
          return new Decimal(mult2)} //x is the amount of buyables you have
      },
      12: {
        title: "Quarks Spirit",
        cost(x) {return new Decimal(4).pow(x).mul(10000)},//x is the amount of buyables you have
        canAfford() { return player.r.gifts.gte(this.cost())},
        purchaseLimit: 100,
        buy() {
           player.r.gifts = player.r.gifts.sub(this.cost())
           setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        display() {return `Double quark gain per level.<br>Level: ${format(getBuyableAmount(this.layer, this.id))}/100<br>Cost: ${format(this.cost())}\nEffect: ${format(this.effect())}x quarks`},
        unlocked(){return hasUpgrade("r",32)},
        effect(x) { 
          mult2 = getBuyableAmount("r",12).gte(15) ? new Decimal(2).pow(15).mul(new Decimal(1.25).pow(new Decimal(x).sub(15))) : new Decimal(2).pow(x)
          return new Decimal(mult2)} //x is the amount of buyables you have
      },
      13: {
        title: "Energy Spirit",
        cost(x) {return new Decimal(5).pow(x).mul(100000)},//x is the amount of buyables you have
        canAfford() { return player.r.gifts.gte(this.cost())},
        purchaseLimit: 100,
        buy() {
           player.r.gifts = player.r.gifts.sub(this.cost())
           setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        display() {return `Triple quark energy gain per level.<br>Level: ${format(getBuyableAmount(this.layer, this.id))}/100<br>Cost: ${format(this.cost())}\nEffect: ${format(this.effect())}x energy`},
        unlocked(){return hasUpgrade("r",34)},
        effect(x) { 
          mult2 = getBuyableAmount("r",13).gte(12) ? new Decimal(3).pow(12).mul(new Decimal(1.5).pow(new Decimal(x).sub(12))) : new Decimal(3).pow(x)
          return new Decimal(mult2)} //x is the amount of buyables you have
      },
      21: {
        title: "Point Spirit",
        cost(x) {return new Decimal(10).pow(x).mul(1e69)},//x is the amount of buyables you have
        canAfford() { return player.r.gifts.gte(this.cost())},
        purchaseLimit: 20,
        buy() {
           player.r.gifts = player.r.gifts.sub(this.cost())
           setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        display() {return `Exponentiate points with this spirit! +0.01 to exponent per level.<br>Level: ${format(getBuyableAmount(this.layer, this.id))}/20<br>Cost: ${format(this.cost())}\nEffect: ^${format(this.effect())} points`},
        unlocked(){return hasChallenge("r",21)},
        effect(x) { 
          mult2 = new Decimal(1).add(getBuyableAmount("r",21)/100)
          return new Decimal(mult2)} //x is the amount of buyables you have
      },
  },
    milestones: {
    0: {
        requirementDescription: "2 total quarks",
        effectDescription: "Keep prestige & ascension upgrades on reset.",
        done() { return player.r.total.gte(2) }
    },
    1: {
        requirementDescription: "3 total quarks",
        effectDescription: "Keep ascension milestones on reset.",
        done() { return player.r.total.gte(3) },
    },
    2: {
        requirementDescription: "4 total quarks",
        effectDescription: "Keep transcension milestones on reset.",
        done() { return player.r.total.gte(4) },
    },
    3: {
        requirementDescription: "5 total quarks",
        effectDescription: "Keep transcension upgrades on reset.",
        done() { return player.r.total.gte(5) },
    },
    4: {
        requirementDescription: "6 total quarks",
        effectDescription: "Keep challenge completions on reset.",
        done() { return player.r.total.gte(6) },
    },
    5: {
        requirementDescription: "8 total quarks",
        effectDescription: "Gain 100% of transcension point gain per second.",
        done() { return player.r.total.gte(8) },
    },
    6: {
        requirementDescription: "1e100 quarks",
        effectDescription: "Automate the 3rd ascension buyable.",
        done() { return player.r.points.gte(1e100) },
        unlocked() { return hasUpgrade("a",41) },
        toggles: [
          ["a","auto3"]
        ]
    },
    7: {
        requirementDescription: "1e180,000 quarks",
        effectDescription: "Gain 100% of quark gain per second.",
        done() { return player.r.points.gte("1e180000") },
        unlocked() { return hasUpgrade("r",43) },
    },
  },
  challenges: {
    11: {
        name: "What's The Point?",
        challengeDescription: "You start with 10 points, but points do not generate.",
        goalDescription: function() {return `Reach ${format(tmp.r.challenges[11].goal)} transcension points.`},
        rewardDescription: function() {return `Exponentiate points based on completions. Currently: ^${1+(challengeCompletions("r",11)/10)}<br>Completions: ${challengeCompletions("r",11)}/10`},
        completionLimit: 10,
        canComplete: function() {return player.t.points.gte(tmp.r.challenges[11].goal)},
        unlocked(){return hasUpgrade("r",41)},
        onEnter(){player.points = new Decimal(10)},
        goal() {
    return [
        new Decimal("1e180283"),
        new Decimal("1e184546"),
        new Decimal("1e222630"),
        new Decimal("1e226089"),
        new Decimal("1e309538"),
        new Decimal("1e512042"),
        new Decimal("1e629507"),
        new Decimal("1e2663814"),
        new Decimal("1e3138864"),
        new Decimal("1e10782587"),
        new Decimal(Infinity)
    ][challengeCompletions("r", 11)]
    },
    },
    12: {
        name: "Back to Basics",
        challengeDescription: "You cannot gain prestige points, ascension points, transcension points, and shards, but point gain is squared.",
        goalDescription: function() {return `Reach ${format(tmp.r.challenges[12].goal)} points.`},
        rewardDescription: function() {return `Exponentiate transcension points based on completions. Currently: ^${1+(challengeCompletions("r",12)/5)}<br>Completions: ${challengeCompletions("r",12)}/10`},
        completionLimit: 10,
        canComplete: function() {return player.points.gte(tmp.r.challenges[12].goal)},
        unlocked(){return hasUpgrade("r",41)},
        goal() {
    return [
        new Decimal("1e356461"),
        new Decimal("1e460474"),
        new Decimal("1e477025"),
        new Decimal("1e1032046"),
        new Decimal("1e1227832"),
        new Decimal("1e1381373"),
        new Decimal("1e8599550"),
        new Decimal("1e16624937"),
        new Decimal("1e160488091"),
        new Decimal("1e1724000000"),
        new Decimal(Infinity)
    ][challengeCompletions("r", 12)]
    },
    },
    21: {
        name: "No Buyables",
        challengeDescription: "Prestige buyables cannot be bought.",
        goalDescription: function() {return `Reach ${format(tmp.r.challenges[21].goal)} transcension points.`},
        rewardDescription: function() {return `On first completion, unlock a new Spirit. Also, exponentiate shards based on completions. Currently: ^${challengeCompletions("r",21) > 7 ? 1.7 : 1+(challengeCompletions("r",21)/10)}<br>Completions: ${challengeCompletions("r",21)}/10`},
        completionLimit: 10,
        canComplete: function() {return player.t.points.gte(tmp.r.challenges[21].goal)},
        unlocked(){return hasUpgrade("r",41)},
        goal() {
    return [
        new Decimal("1e399503"),
        new Decimal("1e472207"),
        new Decimal("1e972792"),
        new Decimal("1e1442182"),
        new Decimal("1e15116546"),
        new Decimal("1e42011137"),
        new Decimal("1e48173985"),
        new Decimal("1e52147280"),
        new Decimal("1e425292138"),
        new Decimal("1e479678334"),
        new Decimal(Infinity)
    ][challengeCompletions("r", 21)]
    },
    },
    22: {
        name: "(softcapped)",
        challengeDescription: "The shard softcap starts instantly and is more powerful.",
        goalDescription: function() {return `Reach ${format(tmp.r.challenges[22].goal)} transcension points.`},
        rewardDescription: function() {return `Unlock a new transcension upgrade for every 2 completions.<br>Completions: ${challengeCompletions("r",22)}/10`},
        completionLimit: 10,
        canComplete: function() {return player.t.points.gte(tmp.r.challenges[22].goal)},
        unlocked(){return hasUpgrade("r",41)},
        goal() {
    return [
        new Decimal("1e37503897"),
        new Decimal("1e47336955"),
        new Decimal("1e425000000"),
        new Decimal("1e475000000"),
        new Decimal("1e485000000"),
        new Decimal("1e666000000"),
        new Decimal("1e750000000"),
        new Decimal("1e850000000"),
        new Decimal("1e1250000000"),
        new Decimal("1e1400000000"),
        new Decimal(Infinity)
    ][challengeCompletions("r", 22)]
    },
    },
    31: {
        name: "SADISTIC CHALLENGE II",
        challengeDescription: "Reincarnation challenges 1, 3, and 4 are all applied at once, and you are stuck in 100% reincarnation charge!",
        goalDescription: function() {return `Reach ${format(tmp.r.challenges[31].goal)} transcension points.`},
        rewardDescription: function() {return `Exponentiate quarks based on completions. Currently: ^${1+(challengeCompletions("r",31)/2)}<br>Completions: ${challengeCompletions("r",31)}/10`},
        completionLimit: 10,
        canComplete: function() {return player.t.points.gte(tmp.r.challenges[31].goal)},
        unlocked(){return challengeCompletions("r",21) >= 10},
        onEnter(){return player.points = new Decimal(10); player.r.charge = new Decimal(1)},
        goal() {
    return [
        new Decimal("1e575000000"),
        new Decimal("1e659358530"),
        new Decimal("1e1070000000"),
        new Decimal("1e1145000000"),
        new Decimal("1e1300000000"),
        new Decimal("1e1410000000"),
        new Decimal("1e1430000000"),
        new Decimal("1e1475000000"),
        new Decimal("1e1500000000"),
        new Decimal("1e1550000000"),
        new Decimal(Infinity)
    ][challengeCompletions("r", 31)]
    },
    },
  },
  bars: {
    bigBar: {
        direction: 3,
        width: 500,
        height: 75,
        progress() { return player.r.charge },
        display: "Percentage of reincarnation charge",
        unlocked() {return hasUpgrade("r",13)},
        fillStyle() { return {"background-color": "blue"} }
    },
  },
  clickables: {
    11: {
        display() {return "Increase reincarnation charge"},
        onClick() {player.r.charge = player.r.charge.add(0.1); player.r.charge = player.r.charge.mul(10).ceil().div(10); doReset("r", true)},
        canClick() {return player.r.charge.mul(10).ceil().div(10).lt(1) && !inChallenge("r",31)},
        unlocked() {return hasUpgrade("r",13)}
    },
    12: {
        display() {return "Decrease reincarnation charge"},
        onClick() {player.r.charge = player.r.charge.sub(0.1); player.r.charge = player.r.charge.mul(10).floor().div(10); doReset("r", true)},
        canClick() {return player.r.charge.mul(10).floor().div(10).gt(0) && !inChallenge("r",31)},
        unlocked() {return hasUpgrade("r",13)}
    },
  },
  update(diff) {
      if(player.r.charge.gt(0) && player.t.shards.gte(1e50)) player.r.quarkEnergy = player.r.quarkEnergy.gte("1.797e308") ? player.r.quarkEnergy = new Decimal("1.797e308") : player.r.quarkEnergy.add(new Decimal(hasUpgrade("r",24)?(hasUpgrade("p",44)?1000:8):2.5).pow(player.r.charge.mul(10)).mul(player.t.shards.root(50)).mul(hasUpgrade("r",22)?upgradeEffect("r",22):1).mul(buyableEffect("r",13)).pow(hasChallenge("t",41)?1.1:1).mul(diff))
    if(player.r.charge.lt(0.1)) player.r.charge = new Decimal(0)
    if(player.r.charge.eq(0.1) && hasUpgrade("r",31)) player.r.gifts = player.r.gifts.add(player.t.shards.add(1).log10().add(1).mul(diff).mul(hasUpgrade("r",32)?100:1).mul(hasUpgrade("r",33)?upgradeEffect("r",33).mul(hasUpgrade("p",42)?1000:1):1).mul(hasUpgrade("a",42)?1000000:1).mul(hasUpgrade("a",45)?1e9:1).mul(hasUpgrade("r",43)?upgradeEffect("r",43):1).pow(hasUpgrade("t",41)?1.1:1))
    },
})
addLayer("sp", {
    name: "super-prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "SP", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#0086C4",
    requires: new Decimal("1e3e12"), // Can be a function that takes requirement increases into account
    resource: "super-prestige points", // Name of prestige currency
    baseResource: "prestige points", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.000000000001, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "s", description: "S: Reset for super-prestige points", unlocked(){return hasUpgrade("r",51)}, onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return hasUpgrade("r",51)},
  branches: ["p"],
    upgrades: {
      11: {
        title: "Point Multiplier II",
        description: "Multiply point gain by e1.000e11.",
        cost: new Decimal(1),
      },
      12: {
        title: "Buyable Unlock VI",
        description: "Unlock a buyable.",
        cost: new Decimal(10000000),
        unlocked(){return hasUpgrade("sp",11) || hasUpgrade("sp",12)}
      },
      13: {
        title: "Prestige Enhancement II",
        description: "Weaken the prestige point softcap.",
        cost: new Decimal(5e12),
        unlocked(){return hasUpgrade("sp",11) || hasUpgrade("sp",13)}
      },
      14: {
        title: "Super-Prestige Bonus",
        description: "Gain more prestige points based on total super-prestige points.",
        cost: new Decimal(5e14),
        unlocked(){return hasUpgrade("sp",13) || hasUpgrade("sp",14)},
        effect(){return player.sp.total.pow(5e10).gte("1e1e13") ? new Decimal("1e1e13") : player.sp.total.pow(5e10)},
        effectDisplay(){return `x${format(this.effect())}`}
      },
      15: {
        title: "Short & Simple II",
        description: "Multiply point gain by e5.000e12. These upgrades seem familiar...",
        cost: new Decimal(2e16),
        unlocked(){return hasUpgrade("sp",14) || hasUpgrade("sp",15)}
      },
      21: {
        title: "This isn't Inflation IV, but it's a good upgrade",
        description: "<b>Self-Synergy</b> uses an even better formula.",
        cost: new Decimal(1.5e19),
        unlocked(){return hasUpgrade("sp",14) || hasUpgrade("sp",21)},
      },
      22: {
        title: "Prestige Exponential II",
        description: "Square prestige point gain (keep in mind there's a softcap!).",
        cost: new Decimal(1e22),
        unlocked(){return hasUpgrade("sp",14) || hasUpgrade("sp",22)},
      },
      23: {
        title: "Softcap Repellent",
        description: "Weaken the prestige point softcap more.",
        cost: new Decimal(3e30),
        unlocked(){return hasUpgrade("sp",14) || hasUpgrade("sp",23)},
      },
      24: {
        title: "Transcendental Tripler?",
        description: "Gain e1.000e9x more transcension points.",
        cost: new Decimal(2.5e44),
        unlocked(){return hasUpgrade("sp",23) || hasUpgrade("sp",24)},
      },
      25: {
        title: "The Last Upgrade",
        description: "Points ^1.01.",
        cost: new Decimal(1e51),
        unlocked(){return hasUpgrade("sp",24) || hasUpgrade("sp",25)},
      },
    },
  buyables: {
      11: {
        title: "Prestige Point Hyperbooster",
        cost(x) {return new Decimal(100).pow(x).mul(1e10)},//x is the amount of buyables you have
        canAfford() { return player.sp.points.gte(this.cost())},
        buy() {
           player.sp.points = player.sp.points.sub(this.cost())
           setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        display() {return `Multiply prestige point gain by e1.000e11 every time you buy this!<br>Level: ${format(getBuyableAmount(this.layer, this.id))}<br>Cost: ${format(this.cost())}\nEffect: ${format(this.effect())}x prestige points`},
        unlocked(){return hasUpgrade("sp",12)},
        effect(x) { 
          mult2 = new Decimal("1e1e11").pow(x)
          return new Decimal(mult2)} //x is the amount of buyables you have
      },
  },
  milestones: {
    0: {
        requirementDescription: "1e15 super-prestige points",
        effectDescription: "Keep prestige upgrades on reset.",
        done() { return player.sp.points.gte(1e15) }
    },
  },
})
