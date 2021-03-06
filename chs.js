/*

 @name    : 锅巴汉化 - Web汉化插件
 @author  : 麦子、JAR、小蓝、好阳光的小锅巴
 @version : V0.6.1 - 2019-07-09
 @website : http://www.g8hh.com

*/

//1.汉化杂项
var cnItems = {
    _OTHER_: [],

    //未分类：
    'Save': '保存',
    'Export': '导出',
    'Import': '导入',
    'Settings': '设置',
    'Achievements': '成就',
    'Statistics': '统计',
    'Changelog': '更新日志',
    'Hotkeys': '快捷键',
    'ALL': '全部',
    'Default': '默认',
    'AUTO': '自动',
    'default': '默认',
    "ascension points": "飞升点",
    "but the formula for that upgrade is (softcapped)": "但是那个升级的公式受到软上限的影响",
    "Another Gift Bonus": "另一个礼物奖励",
    "Another Shard Exponent": "另一个碎片指数",
    "ASCENDED": "飞升",
    "Ascension Bonus": "飞升奖励",
    "Ascension Bonus Enhancement": "飞升奖励增强",
    "Ascension Point Booster": "飞升点助推器",
    "Ascension Point Doubler": "飞升点加倍器",
    "Automate the 2nd prestige buyable": "自动购买第二个转生重复购买项",
    "Automate the prestige buyable": "自动购买第一个转生重复购买项",
    "Benevolence": "仁慈",
    "Buyable Boost": "重复购买项助推器",
    "Buyable Unlock": "重复购买项解锁",
    "Buyable Unlock II": "重复购买项解锁2",
    "Buyable Unlock III": "重复购买项解锁3",
    "Buyable Unlock IV": "重复购买项解锁4",
    "Buyable Unlock V": "重复购买项解锁5",
    "Buyable Unlock VI": "重复购买项解锁6",
    "Challenges 1-9 are all applied at once": "同时激活挑战1-9",
    "Completed": "已完成",
    "transcension points": "超越点",
    "Divine Power": "神圣的力量",
    "Divine Shards": "神圣的碎片",
    "Double ascension point gain every time you buy this!": "购买该购买项时加倍飞升点获取!",
    "Double shard gain every time you buy this!": "购买该购买项时加倍碎片获取!",
    "A": "A",
    "A New Mechanic": "一个新的机制",
    "A New Mechanic II": "一个新的机制2",
    "A New Mechanic III": "一个新的机制3",
    "A New Mechanic IV": "一个新的机制4",
    "Additional Challenges": "附加挑战",
    "All You Are Going To Do Is Get Back There": "你要做的就是回到那里",
    "Another Quark Energy Boost": "另一个夸克能量助推器",
    "Anti-Ascension": "反飞升",
    "Anti-Prestigious": "反声望",
    "Ascended Points": "让点数飞升",
    "Ascension points ^1.1.": "飞升点获取^1.1",
    "Ascension points ^1.2 and transcension points ^1.5.": "飞升点获取^1.2并且超越点获取^1.5",
    "Ascension points are ^0.05.": "现在飞升点获取为^0.05",
    "Automate the 2nd ascension buyable and shard buyables.": "自动购买第二个飞升重复购买项和碎片重复购买项",
    "Automate the 2nd prestige buyable.": "自动购买第二个声望重复购买项",
    "Automate the 3rd ascension buyable.": "自动购买第三个飞升重复购买项",
    "Automate the ascension buyable and all future prestige buyables.": "自动购买第一个飞升重复购买项和以后所有的声望重复购买项",
    "Automate the prestige buyable.": "自动购买第一个声望重复购买项",
    "Back to Basics": "回到基础",
    "Better Conductors": "更好的导体",
    "Buy max buyables.": "购买最大的重复购买项",
    "Cleansing The World": "清洁这个世界",
    "Completions": "完成次数",
    "Consolidated Energy": "合并能量",
    "Currently": "当前",
    "Decrease reincarnation charge": "减少再生费用",
    "Double quark gain per level.": "每级加倍夸克获取",
    "Energy Spirit": "能源的精神",
    "Even Better Conductors": "更好的导体",
    "Even More Upgrades": "更多的升级",
    "Exceptional Exponents": "理想化指数",
    "Exponentiate points based on completions.": "根据完成情况使点数受到指数加成",
    "Exponentiate points with this spirit! +0.01 to exponent per level.": "用这种精神为点数加成!每级使点数+0.01指数。",
    "Exponentiate quarks based on completions.": "根据完成情况使夸克受到指数加成",
    "Exponentiate shards by ^1.03 per level.": "每级按^1.03使碎片受到指数加成",
    "Exponentiate transcension points based on completions.": "根据完成度使超越点受到指数加成",
    "Financial Recession": "金融衰退",
    "G": "G",
    "Gain 1,000,000,000x more gifts again. I promise, this is the last one.": "礼物获取再次x1,000,000,000，我保证，这是最后一个了",
    "Gain 1,000,000x more gifts. This should help on the journey to max your spirits.": "礼物获取x1,000,000.这应该有助于最大限度地提高你的精神",
    "Gain 100,000,000x more shards.": "碎片获取x100,000,000",
    "Gain 100% of ascension point gain per second.": "每秒获取100%的飞升点",
    "Gain 100% of prestige point gain every second.": "每秒获取100%的声望点",
    "Gain 100% of quark gain per second.": "每秒获取100%的夸克",
    "Gain 100% of transcension point gain per second.": "每秒获取100%的超越点",
    "Gain 1000x more sacrificial gifts.": "献祭礼物获取x1,000",
    "Gain 100x more sacrificial gifts.": "献祭礼物获取x100",
    "Gain 1e10x more shards, this multiplier is unaffected by reincarnation charge.": "碎片获取x1e10，这个加成不被转生充能减益",
    "Gain 1e10x more transcension points.": "超越点获取x1e10",
    "Gain 1e20x more shards.": "碎片获取x1e20",
    "Gain 1e50x more ascension points.": "飞升点获取x1e50",
    "Gain 3x more transcension points.": "超越点获取x3",
    "Gain more ascension points based on points. (hardcaps at 25x)": "基于点数加成飞升点获取(硬上限在x25)",
    "Gain more ascension points based on total transcension points.": "基于总共超越点加成飞升点获取",
    "Gain more points based on points.": "基于点数加成点数获取",
    "Gain more points based on total prestige points.": "基于总共声望点加成点数获取",
    "Gain more prestige points based on total ascension points.": "基于总共飞升点加成声望点获取",
    "Gain more quark energy based on total quarks. (hardcaps at 100,000,000x)": "基于总共夸克加成夸克能量获取(硬上限在x100,000,000)",
    "Gain more quarks based on prestige points.": "基于声望点加成夸克获取",
    "Gain more sacrificial gifts based on quark energy.": "基于夸克能量加成献祭礼物获取",
    "Gain more shards based on transcension points. (hardcaps at 1e200x)": "基于超越点加成碎片获取",
    "Gain more transcension points based on points.": "基于点数加成超越点获取",
    "Generate shards using this shard generator! Generate more shards with more generator levels.": "用这个碎片生产器生产碎片！用更高的生产器等级生产更多碎片",
    "Get back there.": "回到那里",
    "Gain e1.000e9x more transcension points.": "超越点获取xe1.000e9",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",

    //树游戏
    'Loading...': '加载中...',
    'ALWAYS': '一直',
    'HARD RESET': '硬重置',
    'Export to clipboard': '导出到剪切板',
    'INCOMPLETE': '不完整',
    'HIDDEN': '隐藏',
    'AUTOMATION': '自动',
    'NEVER': '从不',
    'ON': '打开',
    'OFF': '关闭',
    'SHOWN': '显示',
    'Play Again': '再次游戏',
    'Keep Going': '继续',
    'The Modding Tree Discord': '模型树Discord',
    'You have': '你有',
    'It took you {{formatTime(player.timePlayed)}} to beat the game.': '花费了 {{formatTime(player.timePlayed)}} 时间去通关游戏.',
    'Congratulations! You have reached the end and beaten this game, but for now...': '恭喜你！ 您已经结束并通关了本游戏，但就目前而言...',
    'Main Prestige Tree server': '主声望树服务器',
    'Reach {{formatWhole(ENDGAME)}} to beat the game!': '达到 {{formatWhole(ENDGAME)}} 去通关游戏!',
    'Loading... (If this takes too long it means there was a serious error!)←': '正在加载...（如果时间太长，则表示存在严重错误！）←',
    'Main\n\t\t\t\tPrestige Tree server': '主\n\t\t\t\t声望树服务器',
    'The Modding Tree\n\t\t\t\t\t\t\tDiscord': '模型树\n\t\t\t\t\t\t\tDiscord',
    'Please check the Discord to see if there are new content updates!': '请检查 Discord 以查看是否有新的内容更新！',
    'aqua': '水色',
    'AUTOMATION, INCOMPLETE': '自动化，不完整',
    'LAST, AUTO, INCOMPLETE': '最后，自动，不完整',
    'NONE': '无',
    'P: Reset for': 'P: 重置获得',
    '': '',
    '': '',

}


//需处理的前缀
var cnPrefix = {
    "(-": "(-",
    "(+": "(+",
    "(": "(",
    "-": "-",
    "+": "+",
    " ": " ",
    ": ": "： ",
    "\n": "",
    "                   ": "",
    "                  ": "",
    "                 ": "",
    "                ": "",
    "               ": "",
    "              ": "",
    "             ": "",
    "            ": "",
    "           ": "",
    "          ": "",
    "         ": "",
    "        ": "",
    "       ": "",
    "      ": "",
    "     ": "",
    "    ": "",
    "   ": "",
    "  ": "",
    " ": "",
    //树游戏
    "Show Milestones: ": "显示里程碑：",
    "Autosave: ": "自动保存: ",
    "Offline Prod: ": "离线生产: ",
    "Completed Challenges: ": "完成的挑战: ",
    "High-Quality Tree: ": "高质量树贴图: ",
    "Offline Time: ": "离线时间: ",
    "Theme: ": "主题: ",
    "Anti-Epilepsy Mode: ": "抗癫痫模式：",
    "In-line Exponent: ": "直列指数：",
    "Single-Tab Mode: ": "单标签模式：",
    "Time Played: ": "已玩时长：",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
}

//需处理的后缀
var cnPostfix = {
    ":": "：",
    "：": "：",
    ": ": "： ",
    "： ": "： ",
    "/s)": "/s)",
    "/s": "/s",
    ")": ")",
    "%": "%",
    "                   ": "",
    "                  ": "",
    "                 ": "",
    "                ": "",
    "               ": "",
    "              ": "",
    "             ": "",
    "            ": "",
    "           ": "",
    "          ": "",
    "         ": "",
    "        ": "",
    "       ": "",
    "      ": "",
    "     ": "",
    "    ": "",
    "   ": "",
    "  ": "",
    " ": " ",
    "\n": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
}

//需排除的，正则匹配
var cnExcludeWhole = [
    /^(\d+)$/,
    /^([\d\.]+)e(\d+)$/,
    /^([\d\.]+)$/,
    /^([\d\.,]+)$/,
    /^([\d\.]+)e([\d\.,]+)$/,
    /^[\u4E00-\u9FA5]+$/
];
var cnExcludePostfix = [
]

//正则替换，带数字的固定格式句子
//纯数字：(\d+)
//逗号：([\d\.,]+)
//小数点：([\d\.]+)
//原样输出的字段：(.+)
//换行加空格：\n(.+)
var cnRegReplace = new Map([
    [/^(\d+) ascension points$/, '$1 飞升点'],
    [/^(\d+) quarks$/, '$1 夸克'],
    [/^You have (.+) points$/, '你有 $1 点数'],
    [/^Next at (.+) points$/, '下一个在 $1 点数'],
	[/^([\d\.]+)\/sec$/, '$1\/秒'],
    [/^requires ([\d\.]+) more research points$/, '需要$1个研究点'],
    [/^(\d+) Royal points$/, '$1 皇家点数'],
    [/^Cost: (\d+) RP$/, '成本：$1 皇家点数'],
    [/^Usages: (\d+)\/$/, '用途：$1\/'],
    [/^workers: (\d+)\/$/, '工人：$1\/'],

]);