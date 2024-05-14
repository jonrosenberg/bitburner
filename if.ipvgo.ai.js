import BaseIPvGo from "./if.ipvgo"

export default class AiIPvGo extends BaseIPvGo {
  /** @param {NS} ns */
	constructor(ns) {
		super();
		this.ns = ns;
	}

  get moveOptions() {
    const availableSpaces = this.findDisputedTerritory();
  }

  get findDisputedTerritory() {
    return null;
  }

}
