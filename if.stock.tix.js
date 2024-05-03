import BaseStock from "./if.stock" ;

export default class TIXStock extends BaseStock {
  /** @param {NS} ns */
	constructor (ns, ticker) {
		super();
		this.ns = ns;
		this._ticker = ticker;
	}

	get maxShares() { return this.ns.stock.getMaxShares(this.ticker); }
	
	get price() { 
		return {
			bull: this.ns.stock.getAskPrice(this.ticker),
			bear: this.ns.stock.getBidPrice(this.ticker)
		}
	}
	
  get commision() { return this.ns.stock.getConstants().StockMarketCommission }

	get position() { 
		let pos = this.ns.stock.getPosition(this.ticker);
    let fee = pos[0] == 0 ? 0 : this.commision
    
		return {
			bull: pos[0],
			bullPrice: pos[1],
      bullSpent: (pos[0]*pos[1])+fee,
			bear: pos[2],
			bearPrice: pos[3],
      bearSpent: (pos[2]*pos[3])+fee,
			value: pos[0] * this.price.bull + (pos[2] * this.price.bear - (pos[2] * this.price.bear - pos[2] * this.price.bull))
		}
	}
  get gains() {
    let gains = this.ns.stock.getSaleGain(this.ticker, this.position.bull,"Long");
    if (gains) {
      return gains;
    } else {
      return 0;
    }
  }
  // get orderInfo() {
  //   let orders = this.ns.stock.getOrders()[this.ticker]
  //   let shares = 0;
  //   for (let o of orders) {
  //     shares += o.shares;
      
  //   }
  //   // The “Order type” property can have one of the following four values: 
  //   // "Limit Buy Order", "Limit Sell Order", "Stop Buy Order", "Stop Sell Order". 
  //   // Note that the order book will only contain information for stocks that you actually have orders in.
  //   let type = orders[0].type;
  //   let price = orders[0].price;
  //   let position = orders[0].position;
  //   return {
  //     shares: shares,
  //     type: orders[0].type,
  //     price: orders[0].price,
  //     position: orders[0].position
  //   }
  // }
	
	_golong(shares) {
    return this.ns.stock.buyStock(this.ticker, shares) * shares
		// return this.ns.stock.buy(this.ticker, shares) * shares
	}

	max_long() { 
		let shares = (this.ns.getServerMoneyAvailable("home") - 100000) / this.price.bull
		shares = Math.floor(Math.min(shares, this.maxShares - this.position.bull))
		if (shares * this.price.bull > 1000000) {
			return this._golong(shares)
		}
	}
	
	longCost(shares) { return (shares * this.price.bull) + 100000 }
	
	unbuy(shares=this.position.bull) {
    let pos = this.position;
    let fee = pos.bull == 0 ? 0 : this.commision
    let unbuyPrice = this.ns.stock.sellStock(this.ticker, shares);
    let unbuyReturned = (unbuyPrice * pos.bull) - fee
    return {
      shares: pos.bull,
      buyPrice: pos.bullPrice,
      buySpent: pos.bullSpent,
      price: unbuyPrice,
      returned: unbuyReturned,
      net: unbuyReturned - pos.bullSpent
    }
		// return this.ns.stock.sell(this.ticker, shares);
	}

	async updateCache(repeat=true, kv=new Map()) {
	do {
		let getters = this.listGetters(this)
		for (let o of Object.keys(getters)) {
			if (!kv.has(getters[o])) {
				kv.set(getters[o], this[getters[o]])
			}
		}
		await super.updateCache(false, kv)
		if (repeat) {
			await this.ns.asleep(6000); // base server update rate is 60s. we'll call faster updates when we need them.
		}

	} while (repeat)
	}
}