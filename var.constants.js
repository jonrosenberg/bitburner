/** @param {NS} ns */
export const reservedHomeRam = 200;
export const hack_percent = .1;
export const ServerBaseGrowthRate =  1.03;
export const ServerMaxGrowthRate = 1.0035;
export const BitNodeMultipliers = {
	ServerGrowthRate: 1
};
// hwgw
export const hcns = {
  targets: .5,// required ready targets needed for batch
  time: 100, // wait time divided by this number
  num_simultaneous_batches: 8,
  batch_lag: 160,
};

/**
 * function info
 */
export const bin = {
  hk:{
    id: "bin.thk.js",
    ram: 1.7,
    runtimeMult: 1.0,
  },
  wk:{
    id: "bin.twk.js",
    ram: 1.75,
    runtimeMult: 4.0,
  },
  gr:{
    id: "bin.tgr.js",
    ram: 1.75,
    runtimeMult: 3.2,
  },
  sh:{
    id: "bin.sh.js",
    ram: 4,
    runtime: 10000,
  },
}


/**
 * Convert miliseconds into time string format
 * @param {number} miliseconds 
 * @returns {string} format "101h 13m 00s 012ms" 
 */
export const msToTime = (s) => {
  // Pad to 2 or 3 digits, default is 2
  var pad = (n, z = 2) => ('00' + n).slice(-z);
  const t = [s/3.6e6|0, (s%3.6e6)/6e4|0, (s%6e4)/1000|0, s%1000] 
  return (t[0] >= 100 ? t[0] + 'h ' : t[0] ? pad(t[0]) + 'h ':'') + (t[1] ? pad(t[1]) + 'm ':'') + (t[2] ? t[2] + 's ':'') + (s%1000 != 0 ? pad(t[3], 3) + 'ms':'0');
}


/** 
Here is the list of values you can use to replace {format}
@param {number[]=} codes - (default: [0]) 
@returns {string}
0: Normal
1: Bold
4: Underline

Text Colors
30: Gray
31: Red
32: Green
33: Yellow
34: Blue
35: Pink
36: Cyan
37: White

Background Colors
40: Firefly dark blue
41: Orange
42: Marble blue
43: Greyish turquoise
44: Gray
45: Indigo
46: Light gray
47: White

See docutmentation: https://gist.github.com/kkrypt0nn/a02506f3712ff2d1c8ca7c9e0aed7c06?permalink_comment_id=4146163
**/
export const ansi = (codes=[0]) => {
  return `\u001b[${codes.join(';')}m`;
}

export const fmt = {
  // Custom color coding.
  Normal: 0,
  Bold: 1,
  Underline: 4,
  Gray: 30,
  Red: 31,
  Green: 32,
  Yellow: 33,
  Blue: 34,
  Pink: 35,
  Cyan: 36,
  White: 37,
  bgDarkBlue: 40, // FireflyDarkBlue: 40,
  bgOrange: 41, // Orange: 41,
  bgBlue: 42, // MarbleBlue: 42,
  bgTurquoise: 43, // GreyishTurquoise: 43,
  bgGray: 44, // Gray: 44,
  bgIndigo: 45, // Indigo: 45,
  bgLightGray: 46, // LightGray: 46,
  bgWhite: 47, // White: 47,
}