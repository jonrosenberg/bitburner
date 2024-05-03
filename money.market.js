import BaseStock from "if.stock";
import TIXStock from "if.stock.tix";
import FourSigmaTIXStock from "if.stock.4s";
import PrettyTable from "src.prettytable";
import {stockExtenderLimit, stockExtenderShort } from "if.stock.short";

const stock_list = ["ECP", "MGCP", "BLD", "CLRK", "OMTK", "FSIG", "KGI", "FLCM", "STM", "DCOMM", "HLS", "VITA", "ICRS", "UNV", "AERO", "OMN", "SLRS", "GPH", "NVMD", "WDS", "LXO", "RHOC", "APHE", "SYSC", "CTK", "NTLK", "OMGA", "FNS", "JGN", "SGC", "CTYS", "MDYN", "TITN"]

const ACL = {
	WSE: 1, 	// 00000001
	TIX: 2, 	// 00000010
	WSE4S: 4, 	// 00000100
	TIX4S: 8, 	// 00001000
	LIMIT: 16, 	// 00010000
	SHORT: 32, 	// 00100000
}

/** @param {NS} ns **/
export async function main(ns) {
  // const stock_list = ns.stock.getSymbols();
  
	let permissions = 0;
	permissions += ACL.WSE * ns.stock.hasWSEAccount();
	permissions += ACL.TIX * ns.stock.hasTIXAPIAccess(); 
	permissions += ACL.WSE4S * ns.stock.has4SData();
	permissions += ACL.TIX4S * ns.stock.has4SDataTIXAPI(); 
	permissions += ACL.LIMIT * false; //ns.stock.hasWSEAccount();
	permissions += ACL.SHORT * false; //ns.stock.hasWSEAccount();
	
	ns.clearLog();
	ns.print("Initializing Stock Market with following parameters: ")
	ns.print("WSE: ", !!(permissions & ACL.WSE))
	ns.print("TIX: ", !!(permissions & ACL.TIX))
	ns.print("WSE4S: ", !!(permissions & ACL.WSE4S))
	ns.print("TIX4S: ", !!(permissions & ACL.TIX4S))
  ns.print("LIMIT: ", !!(permissions & ACL.LIMIT))
	ns.print("SHORT: ", !!(permissions & ACL.SHORT))
    
	
  let stocks = [];
  let totalNet = 0;
  let numExits = 0;
  
  for (let s of stock_list) {
    stocks.push(new BaseStock(ns, s))
  }
  ns.tail()
  // for (let s of stocks) {
  //     ns.print(s.id)
  //     await s.updateCache(false);
  // }
  
	if (!(permissions & ACL.WSE)) { return }

  if (permissions & ACL.TIX) {
      stocks = [];
      for (let s of stock_list) {
          stocks.push(new TIXStock(ns, s))
      }
  }

  if (permissions & ACL.TIX4S) {
      stocks = [];
      for (let s of stock_list) {
          stocks.push(new FourSigmaTIXStock(ns, s))
      }
  }

  if (permissions & ACL.WSE4S) {}

  if (permissions & ACL.SHORT) {
    for (let s of stocks) {
      s = stockExtenderShort(ns, s)
    }
  }

  if (permissions & ACL.LIMIT) {
    for (let s of stocks) {
      s = stockExtenderLimit(ns, s)
    }
  }

  for (let s of stocks) {
    s.updateCache().catch(console.error)
  }

  while(true) {

    if (permissions & ACL.TIX4S) {
      // automatically buys and sells stocks based on
      // forecast data
      // stocks.sort((a,b) => b.forecast - a.forecast)
      if (permissions & ACL.SHORT) {
        // absolute value calculations for forecasts
        stocks.sort((a,b) => b.absoluteForecast - a.absoluteForecast)
      } else {
        stocks.sort((a,b) => b.forecast - a.forecast)
      }
      for (let st of stocks) {
        try {
          if (st.forecast < .534) { 
            let unbuyRes = st.unbuy();
            totalNet += unbuyRes.net;
            if (unbuyRes.price != 0) { ++numExits;}
          }
          if (st.forecast > .466) { 
            let unsellRes = st.unsell();
            totalNet += unsellRes.net;
            if (unsellRes.price != 0) { ++numExits;}
          }
        } catch {}
      }

      for (let st of stocks) {
        try {
          // if (st.forecast > .560) { st.max_long(); }
          if (st.forecast > .535) { 
            st.max_long();
          }
          if (st.forecast < .465) { 
            st.max_short();
          }
        } catch {}
      }
    }

		ns.clearLog();
		let pt = new PrettyTable();
		let rows = [];
		let headers = ["TICK", "CAST", "POS", "PROFIT", "GAINS"];
		for (let s of stocks) {
      let profit = 0;
      if(s.position.value != 0) {
        profit = (s.gains/s.position.bullSpent)-1
      }
			rows.push(
				[
					s.ticker, 
					ns.formatNumber(s.forecast),
          ns.formatNumber(s.position.bullSpent),
					// ns.formatNumber(s.position.value),
          // ns.formatNumber(s.position.bull),
          ns.formatPercent(profit),
          ns.formatNumber(s.gains-s.position.bullSpent)
				]
			)
		}
		pt.create(headers, rows);
		ns.print(pt.print());
    let totalProfit = 0;
    let totalSpent = 0;
    for (let s of stocks) {
      totalSpent += s.position.bullSpent;
      totalProfit += s.gains;
    }
    
    ns.print("total spent: "+ns.formatNumber(totalSpent));
    ns.print("total gains: "+ns.formatNumber(totalProfit-totalSpent));
    ns.print("total profit: "+ns.formatPercent(totalProfit/totalSpent-1));
    ns.print("total net: "+ns.formatNumber(totalNet));
    ns.print(`total # exits: ${numExits}`);
    await ns.sleep(6000);
	}

}