/**
 * https://www.reddit.com/r/Bitburner/comments/177xpp9/stock_manipulation_not_working/
 * https://www.reddit.com/r/Bitburner/comments/sdkkx6/is_trading_and_influencing_the_stock_market_worth/
 * https://www.reddit.com/r/Bitburner/comments/ucdshn/my_bitburner_stock_trading_script/
 * 
 * https://www.reddit.com/r/Bitburner/comments/16xtjem/super_simple_stock_script_that_prints_money/
 *  
Super simple stock script that prints money without 4S Market Data
Edit: With couple hours more running, it doesn't appear to print money as fast as I thought. I'm still up 50x in less than 4 hours, but another person in comments basically broke even in an hour, so YMMV.

Edit2: At 16 hours 47 min, I'm at $135B, so approx 500x from 250M. This is with all the huge bugs and flaws that people have pointed out, including having it check for ticks every 5 seconds instead of 6 (lol). Somehow it keeps chugging along, even though it can't deal with max shares, and doesn't do any shorting. Will try and revise this script with the suggestions in the comments and test how it does.

I roughly estimate this script to 5x your money maybe double your money every hour (on BN8), without needing 4S Market API .I'm proud of this because it's stupidly simple and yet high yielding, and I think there's some lucky charm to why it works so well. I'm a non-coder who used ChatGPT to code this. (It wasn't perfect coder, but almost. I had to fix a couple super minor bugs and give it a list of all the ns.stock functions.)

Script: https://pastebin.com/7CBSaHtQ

Description of algorithm: Basically just buy, swap, or sell stocks as needed every 10th tick. Every 10th tick, rank the stocks based on the # of upticks (price increases) they had over the last 10 ticks. (will need to store price changes of each stock last 10 ticks).

- Buy the stock with the highest number of upticks (If player has more than $10M in funds). If there is a tie between multiple stocks, pick the one with the highest estimated volatility (average of absolute values of % change over the last 10 ticks). Buy max shares.
- Sell a stock if it has 4 or less upticks over the last 10 ticks. Sell max shares.
- Swap a stock (sell current stock and buy new stock) if you own a stock, and there is another stock with at least double the estimated volatility of owned stock and at least 7 upticks over last 10 ticks. Buy and sell max # of shares.

This code completely ignores the bullorbear flip, but still performs well because of it's simplicity and short memory window of 10 ticks. Perhaps it could be improved by increasing this to 12 ticks.

i've only run it for a couple hours, but I've had multiple individual buy/sell roundtrips of over 100% gains before it sells a stock, and usually less than 5% losses at most. It cuts losers quickly and lets winners run.
 * @param {NS} ns 
 * */
export async function main(ns) {
	const stockHistory = new Map();
	const stockIncreases = new Map();
	const stockVolatility = new Map();
	const stocks = ns.stock.getSymbols();

	for (const stock of stocks) {
		stockHistory.set(stock, []);
		stockIncreases.set(stock, 0);
		stockVolatility.set(stock, []);
	}

	let updateCount = 0;

	async function updateStocks() {
		updateCount++;
		ns.tprint(`Update count: ${updateCount}`);

		for (const stock of stocks) {
			const stockPrice = ns.stock.getPrice(stock);
			const history = stockHistory.get(stock);
			const volatility = stockVolatility.get(stock);
			const position = ns.stock.getPosition(stock);

			if (position[0] > 0) {
				ns.tprint(`Currently owning ${position[0]} shares of ${stock}.`);
			}

			if (history.length > 0 && history[history.length - 1] !== 0) {
				const lastPrice = history[history.length - 1];
				const percentageChange = ((stockPrice - lastPrice) / lastPrice) * 100;
				volatility.push(Math.abs(percentageChange));

				if (percentageChange > 0) {
					const increases = stockIncreases.get(stock) + 1;
					stockIncreases.set(stock, increases);
				}

				ns.print(`${stock} - % Change: ${percentageChange.toFixed(2)}`);
			}

			history.push(stockPrice);
			if (history.length > 10) {
				history.shift();
				volatility.shift();
			}
		}

		if (updateCount % 10 === 0) {
			const sortedStocks = Array.from(stockIncreases.entries())
				.sort((a, b) => b[1] - a[1] ||
					average(stockVolatility.get(b[0])) -
					average(stockVolatility.get(a[0])));

			ns.tprint("Stocks ranked by number of increases and volatility:");
			for (const [stock, increases] of sortedStocks) {
				ns.tprint(`${stock} - Increases: ${increases}, Avg Volatility: ${average(stockVolatility.get(stock)).toFixed(2)}%`);
			}

			for (const stock of stocks) {
				const position = ns.stock.getPosition(stock);
				const playerMoney = ns.getServerMoneyAvailable("home") - 100000;

				if (position[0] > 0) {
					const increases = stockIncreases.get(stock);

					if (increases < 5) {
						ns.stock.sellStock(stock, position[0]);
						ns.tprint(`Sold all ${position[0]} shares of ${stock} due to less than 5 increases in the last 10 updates.`);
						continue;  // Continue to the next iteration to avoid buying immediately after selling
					}

					const ownedVolatility = average(stockVolatility.get(stock));
					const higherVolatilityStocks = sortedStocks.filter(([s, inc]) =>
						average(stockVolatility.get(s)) > 2 * ownedVolatility && inc >= 7);

					if (higherVolatilityStocks.length > 0) {
						ns.stock.sellStock(stock, position[0]);
						ns.tprint(`Sold all ${position[0]} shares of ${stock} to buy a higher volatility stock.`);

						higherVolatilityStocks.sort((a, b) => average(stockVolatility.get(b[0])) - average(stockVolatility.get(a[0])));
						const [newStock,] = higherVolatilityStocks[0];
						const sharesToBuy = Math.floor(playerMoney / ns.stock.getAskPrice(newStock));
						ns.stock.buyStock(newStock, sharesToBuy);
						ns.tprint(`Bought ${sharesToBuy} shares of ${newStock} with higher volatility.`);
					}
				} else if (playerMoney > 10000000) {
					const [topStock,] = sortedStocks[0];
					const sharesToBuy = Math.floor(playerMoney / ns.stock.getAskPrice(topStock));
					ns.stock.buyStock(topStock, sharesToBuy);
					ns.tprint(`Bought ${sharesToBuy} shares of ${topStock} - Increases: ${stockIncreases.get(topStock)}, Avg Volatility: ${average(stockVolatility.get(topStock)).toFixed(2)}%`);
				}
			}

			for (const stock of stocks) {
				stockIncreases.set(stock, 0);
			}
		}

		await ns.sleep(5000);
	}

	while (true) {
		await updateStocks();
	}

	function average(arr) {
		if (arr.length === 0) return 0;
		const sum = arr.reduce((a, b) => a + b, 0);
		return sum / arr.length;
	}
}
