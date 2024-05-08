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
  
  for (let st of stocks) {
    try {
      st.unbuy();
      st.unsell();
    } catch {}
  }
  
}