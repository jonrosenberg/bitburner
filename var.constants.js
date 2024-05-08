/** @param {NS} ns */
export const reservedHomeRam = 50;
export const hack_percent = .1;
export const ServerBaseGrowthRate =  1.03;
export const ServerMaxGrowthRate = 1.0035;
export const BitNodeMultipliers = {
	ServerGrowthRate: 1
};
// hwgw
export const hwgw_amp = {
  targets: 1,// required ready targets needed for batch
  time: 1, // wait time divided by this number
  num_simultaneous_batches: 4,
};

/** 
Here is the list of values you can use to replace {format}
@param {number[]=} codes - (default: [0]) 
@returns {string=}
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
  bgDarkBlue: 40,
  bgOrange: 41,
  bgBlue: 42,
  bgTurquoise: 43,
  bgGray: 44,
  bgIndigo: 45,
  bgLightGray: 46,
  bgWhite: 47,
  FireflyDarkBlue: 40,
  Orange: 41,
  MarbleBlue: 42,
  GreyishTurquoise: 43,
  Gray: 44,
  Indigo: 45,
  LightGray: 46,
  White: 47,
}