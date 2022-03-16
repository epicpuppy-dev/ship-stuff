/*
hp = health
rg = regen
ac = acceleration
ms = max speed
rs = rotation speed
fr = fire rate
ls = laser speed
dg = damage
*/
shop
    //ENGINE UPGRADES
    .register(new item(
        "engine", "Start Engine", ["Start up the engine systems", "- Gain the ability to move", "Point your mouse in a direction", "and use [LEFT CLICK] to move"]
        , 0, [], function () {unlocks.move = true;}, {ac: [20, "a"], ms: [200, "a"], rs: [135, "a"]}
    ))
    .register(new item(
        "drive1", "Nuclear Drive", ["Boost in agility"]
        , 3, ["engine"], function () {}, {ac: [2, "a"], ms: [25, "a"], rs: [15, "a"]}
    ))
    .register(new item(
        "drive2", "Fusion Drive", ["Big boost in agility"]
        , 5, ["drive1"], function () {}, {ac: [4, "a"], ms: [50, "a"], rs: [30, "a"]}
    ))
    .register(new item(
        "drive3", "Antimatter Drive", ["Massive boost in agility"]
        , 9, ["drive2"], function () {}, {ac: [0.25, "m"], ms: [0.25, "m"], rs: [0.25, "m"]}
    ))
    
    //ABILITIES
    .register(new item(
        "dash", "Dash Warp",
        ["Ability: [Z] Dash", "Gives an instant burst of speed", "- Base Cooldown: 6 seconds", "- Base Power: Velocity +180px/s"]
        , 5, ["engine"], function () {unlocks.abilities.dash = true;}, {ac: [1, "a"], ms: [15, "a"]}
    ))
    .register(new item(
        "burst", "Burst Blast",
        ["Ability: [X] Burst", "Instantly fires many projectiles",
        "- Base Cooldown: 8 seconds", "- Base Amount: 20 projectiles", "- Base Radius: 40 degrees"]
        , 5, ["laser"], function () {unlocks.abilities.burst = true;}, {fr: [0.5, "a"], ls: [20, "a"], dg: [2, "a"]}
    ))
    .register(new item(
        "shield", "Shield Core",
        ["Ability: [C] Shield", "Gives temporary damage immunity", "- Base Cooldown: 20 seconds", "- Base Duration: 2 seconds"]
        , 9, ["hull1"], function () {unlocks.abilities.shield = true;}, {hp: [20, "a"]}
    ))
    .register(new item(
        "freeze", "Freeze Reactor",
        ["Ability: [V] Freeze", "Temporarily freezes all enemies", "- Base Cooldown: 20 seconds", "- Base Duration: 3 seconds"]
        , 9, ["hull1"], function () {unlocks.abilities.freeze = true;}, {}
    ))
    
    //ABILITY UPGRADES - DASH
    .register(new item(
        "warp1", "Nuclear Warp", ["Upgrades dash ability", "", "-0.5s cooldown", "+50px/s power", "+0.5 dash charges"]
        , 7, ["dash"], function () {abilities.dash.reload -= 25; abilities.dash.power += 50; abilities.dash.overcharge += 0.5;}, {}
    ))
    .register(new item(
        "warp2", "Fusion Warp", ["Upgrades dash ability", "", "-0.5s cooldown", "+55px/s power", "+0.5 dash charges"]
        , 12, ["warp1"], function () {abilities.dash.reload -= 25; abilities.dash.power += 55; abilities.dash.overcharge += 0.5;}, {}
    ))
    .register(new item(
        "warp3", "Antimatter Warp", ["Upgrades dash ability", "", "-0.5s cooldown", "+55px/s power", "+0.5 dash charges"]
        , 16, ["warp2"], function () {abilities.dash.reload -= 25; abilities.dash.power += 55; abilities.dash.overcharge += 0.5;}, {}
    ))
    .register(new item(
        "warp4", "White Hole Warp", ["Upgrades dash ability", "", "-0.5s cooldown", "+60px/s power", "+0.5 dash charges"]
        , 20, ["warp3"], function () {abilities.dash.reload -= 25; abilities.dash.power += 60; abilities.dash.overcharge += 0.5;}, {}
    ))
    
    //ABILITY UPGRADES - BURST
    .register(new item(
        "blast1", "Nuclear Blast", ["Upgrades burst ability", "", "-0.5s cooldown", "+10 shots", "+10 degrees radius"]
        , 7, ["burst"], function () {
            abilities.burst.reload -= 25; abilities.burst.count += 10; abilities.burst.radius += 5; abilities.burst.overcharge += 0.5;}, {}
    ))
    .register(new item(
        "blast2", "Fusion Blast", ["Upgrades burst ability", "", "-0.5s cooldown", "+10 shots", "+10 degrees radius"]
        , 12, ["blast1"], function () {
            abilities.burst.reload -= 25; abilities.burst.count += 10; abilities.burst.radius += 5; abilities.burst.overcharge += 0.5;}, {}
    ))
    .register(new item(
        "blast3", "Antimatter Blast", ["Upgrades burst ability", "", "-0.5s cooldown", "+10 shots", "+10 degrees radius"]
        , 16, ["blast2"], function () {
            abilities.burst.reload -= 25; abilities.burst.count += 10; abilities.burst.radius += 5; abilities.burst.overcharge += 0.5;}, {}
    ))
    .register(new item(
        "blast4", "Black Hole Blast", ["Upgrades burst ability", "", "-0.5s cooldown", "+10 shots", "+10 degrees radius"]
        , 20, ["blast3"], function () {
            abilities.burst.reload -= 25; abilities.burst.count += 10; abilities.burst.radius += 5; abilities.burst.overcharge += 0.5;}, {}
    ))
    
    //ABILITY UPGRADES - SHIELD
    .register(new item(
        "core1", "Nuclear Core", ["Upgrades shield ability", "", "-1s cooldown", "+0.2s duration"]
        , 11, ["shield"], function () {abilities.shield.reload -= 50; abilities.shield.duration += 10;}, {}
    ))
    .register(new item(
        "core2", "Fusion Core", ["Upgrades shield ability", "", "-1s cooldown", "+0.2s duration"]
        , 15, ["core1"], function () {abilities.shield.reload -= 50; abilities.shield.duration += 10;}, {}
    ))
    .register(new item(
        "core3", "Antimatter Core", ["Upgrades shield ability", "", "-1s cooldown", "+0.3s duration"]
        , 20, ["core2"], function () {abilities.shield.reload -= 50; abilities.shield.duration += 15;}, {}
    ))
    .register(new item(
        "core4", "White Hole Core", ["Upgrades shield ability", "", "-1s cooldown", "+0.3s duration"]
        , 26, ["core3"], function () {abilities.shield.reload -= 50; abilities.shield.duration += 15;}, {}
    ))
    
    //ABILITY UPGRADES - FREEZE
    .register(new item(
        "reactor1", "Nuclear Reactor", ["Upgrades freeze ability", "", "-1s cooldown", "+0.5s duration"]
        , 11, ["freeze"], function () {abilities.freeze.reload -= 50; abilities.freeze.duration += 25;}, {}
    ))
    .register(new item(
        "reactor2", "Fusion Reactor", ["Upgrades freeze ability", "", "-1s cooldown", "+0.5s duration"]
        , 15, ["reactor1"], function () {abilities.freeze.reload -= 50; abilities.freeze.duration += 25;}, {}
    ))
    .register(new item(
        "reactor3", "Antimatter Reactor", ["Upgrades freeze ability", "", "-1s cooldown", "+0.5s duration"]
        , 20, ["reactor2"], function () {abilities.freeze.reload -= 50; abilities.freeze.duration += 25;}, {}
    ))
    .register(new item(
        "reactor", "White Hold Reactor", ["Upgrades freeze ability", "", "-1s cooldown", "+0.5s duration"]
        , 26, ["reactor3"], function () {abilities.freeze.reload -= 50; abilities.freeze.duration += 25;}, {}
    ))
    
    //OVERCLOCK
    .register(new item(
        "overclock1", "Nuclear Overclock", ["Stuff goes faster"]
        , 3, ["laser", "engine"], function () {}, {ac: [0.1, "m"], ms: [0.15, "m"], fr: [0.2, "m"]}
    ))
    .register(new item(
        "overclock2", "Fusion Overclock", ["Stuff goes much faster"]
        , 9, ["overclock1", "drive1", "combat1"], function () {}, {ac: [0.2, "m"], ms: [0.25, "m"], fr: [0.3, "m"]}
    ))
    .register(new item(
        "overclock3", "Antimatter Overclock", ["Sutff goes much much faster"]
        , 17, ["overclock2", "drive3", "combat3"], function () {}, {ac: [0.3, "m"], ms: [0.35, "m"], fr: [0.4, "m"]}
    ))
    
    //PHASER UPGRADES
    .register(new item(
        "laser", "Start Phaser", ["Start up the laser system", "- Gain the ability to shoot", "Fire with [SPACE]"]
        , 1, ["engine"], function () {unlocks.weapon = true;}, {fr: [2, "a"], ls: [200, "a"]}
    ))
    .register(new item(
        "combat1", "Nuclear Phaser", ["Boost in combat"]
        , 4, ["laser"], function () {}, {fr: [0.5, "a"], ls: [40, "a"], dg: [5, "a"]}
    ))
    .register(new item(
        "combat2", "Fusion Phaser", ["Big boost in combat"]
        , 8, ["combat1"], function () {}, {fr: [1.5, "a"], ls: [50, "a"], dg: [10, "a"]}
    ))
    .register(new item(
        "combat3", "Antimatter Phaser", ["Massive boost in combat"]
        , 12, ["combat2"], function () {}, {fr: [0.3, "m"], ls: [0.3, "m"], dg: [0.3, "m"]}
    ))
    .register(new item(
        "combat4", "Black Hole Phaser", ["Massive boost in combat"]
        , 16, ["combat3"], function () {}, {fr: [0.4, "m"], ls: [0.4, "m"], dg: [0.4, "m"]}
    ))
    .register(new item(
        "asteroids", "Start Targeting", ["Start up the targeting system", "- Asteroids start to appear", "- Asteroids give xp when destroyed"]
        , 2, ["laser"], function () {unlocks.asteroids = true;}, {dg: [5, "a"]}
    ))
    .register(new item(
        "enemies", "Start Antennae", ["Start up the antenna system", "- Enemies start to appear", "- Enemies give more xp than asteroids"]
        , 4, ["asteroids"], function () {unlocks.enemies = true;}, {ls: [25, "a"], dg: [3, "a"]}
    ))
    
    //RATE MODS
    .register(new item(
        "rate1", "Rate Module I", ["Increased fire rate"]
        , 6, ["combat1"], function () {}, {fr: [1, "a"]}
    ))
    .register(new item(
        "rate2", "Rate Module II", ["Increased fire rate"]
        , 10, ["combat2", "rate1"], function () {}, {fr: [1.5, "a"]}
    ))
    .register(new item(
        "rate3", "Rate Module III", ["Increased fire rate"]
        , 15, ["combat3", "rate2"], function () {}, {fr: [0.35, "m"]}
    ))
    .register(new item(
        "rate4", "Rate Module IV", ["Increased fire rate"]
        , 20, ["combat4", "rate3"], function () {}, {fr: [0.5, "m"]}
    ))
    
    //DAMAGE MODS
    .register(new item(
        "damage1", "Damage Module I", ["Increased damage"]
        , 6, ["combat1"], function () {}, {dg: [8, "a"]}
    ))
    .register(new item(
        "damage2", "Damage Module II", ["Increased damage"]
        , 10, ["combat2", "damage1"], function () {}, {dg: [12, "a"]}
    ))
    .register(new item(
        "damage3", "Damage Module III", ["Increased damage"]
        , 15, ["combat3", "damage2"], function () {}, {dg: [0.35, "m"]}
    ))
    .register(new item(
        "damage4", "Damage Module IV", ["Increased damage"]
        , 20, ["combat4", "damage3"], function () {}, {dg: [5, "m"]}
    ))
    
    //HULL UPGRADES
    .register(new item(
        "hull1", "Iron Hull", []
        , 3, ["asteroids"], function () {}, {hp: [25, "a"]}
    ))
    .register(new item(
        "hull2", "Steel Hull", []
        , 6, ["hull1"], function () {}, {hp: [50, "a"]}
    ))
    .register(new item(
        "hull3", "Titanium Hull", []
        , 9, ["hull2"], function () {}, {hp: [75, "a"]}
    ))
    .register(new item(
        "hull4", "Iridium Hull", []
        , 12, ["hull3"], function () {}, {hp: [100, "a"]}
    ))
    .register(new item(
        "hull5", "Atomic Hull", []
        , 15, ["hull4"], function () {}, {hp: [0.5, "m"]}
    ))
    
    //NANOBOT UPGRADES
    .register(new item(
        "nano1", "Nanobot Repairs", ["Nanobots passively repair hull"]
        , 4, ["hull1"], function () {}, {rg: [2.5, "a"]}
    ))
    .register(new item(
        "nano2", "Nanobot Welders", []
        , 8, ["nano1"], function () {}, {rg: [5, "a"]}
    ))
    .register(new item(
        "nano3", "Nanobot Control Tower", []
        , 12, ["nano2"], function () {}, {rg: [10, "a"]}
    ))
    .register(new item(
        "nano4", "Atomic Nanobots", []
        , 16, ["nano3"], function () {}, {rg: [20, "a"]}
    ));