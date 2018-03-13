const $gameWrapper = $('.game-wrapper');
const $canvas = $('.canvas');

const $window = $(window);
const $document = $(document);
const $body = $('body');

const Utils = {
	backgroundToStyle: (element) => {
		let addStyle = '';
		if (element.backgroundColor) {
			addStyle += `background-color: ${element.backgroundColor};`;
		}
		if (element.backgroundImage) {
			addStyle += `background-image: url(${element.backgroundImage});`;
		}
		return addStyle;
	}
};

class WorldMap {
	constructor() {
		this.defaults = {
			zIndex: 0,
			tileSize: 32
		};

		this.renderMap();
	}

	renderMap() {
		$canvas.html('');
		globalMap.map((el) => {
			let x = el.x * this.defaults.tileSize;
			let y = el.y * this.defaults.tileSize;
			let zIndex = el.zIndex || this.defaults.zIndex;
			let type = el.type;
			let addStyle = Utils.backgroundToStyle(el.type);

			$canvas.append(`
			<div class="tile"
			style="top:${y}px; left:${x}px; z-index:${zIndex}; ${addStyle}">
			</div>`);
		});
	}


	hasTile(pos) {
		const findTile = globalMap.filter((el) => {
			return (el.x == pos.x && el.y == pos.y);
		});

		if (findTile.length) {
			return true;
		} else {
			return false;
		}
	}

	hasItem(pos) {
		const findItems = globalMap.filter((el) => {
			return (el.x == pos.x && el.y == pos.y && el.isItem == true);
		});

		if (findItems.length) {
			console.log(findItems);
			for (let i = 0; i < findItems.length; i++) {
				if (typeof findItems[i].onReach === 'function') {
					findItems[i].onReach(pos);
				}
			}

			return true;
		} else {
			return false;
		}
	}

	removeItem(pos, item) {
		let findIndex = -1;
		const findTile = globalMap.filter((el, index) => {
			var condition = (el.x == pos.x && el.y == pos.y && el.type == item);
			if (condition) {
				findIndex = index;
			}
			return condition;
		});
		if (findTile.length) {
			globalMap.splice(findIndex,1);
		}
		this.renderMap();
	}

	isWalkable(pos) {
		const findBlock = globalMap.filter((el) => {
			return (el.x == pos.x && el.y == pos.y && el.notWalkable);
		});

		if (findBlock.length) {
			return false;
		} else {
			return true;
		}
	}
}

class Player {
	constructor(options = {}) {
		this.$player = $('.player');
		this.$inventory = $('.player-inventory');

		this.health = options.health || 100;
		this.name = options.name || 'Player';
		this.position = {
			x: (options.position || {}).x || 0,
			y: (options.position || {}).y || 0,
		};
		this.items = [];

		this.movePlayer(this.position);
		this.renderInventory();
		this.listeners();
	}

	listeners() {
		$window.on('keyup', (e) => {
			if (e.keyCode == 37) { // left
				this.movePlayer({
					x: this.position.x - 1,
					y: this.position.y,
				});
			}
			if (e.keyCode == 38) { // top
				this.movePlayer({
					x: this.position.x,
					y: this.position.y - 1,
				});
			}
			if (e.keyCode == 39) { // right
				this.movePlayer({
					x: this.position.x + 1,
					y: this.position.y,
				});
			}
			if (e.keyCode == 40) { // bottom
				this.movePlayer({
					x: this.position.x,
					y: this.position.y + 1,
				});
			}
			console.log(this.position);
		});
	}

	movePlayer(pos) {
		if (!this.$player.length) {
			$gameWrapper.append(`<div class="player"><div class="player-name">${this.name}</div></div>`);
		}
		this.$player = $('.player');

		const newPosition = {
			x: pos.x,
			y: pos.y,
		};

		if (!worldMap.hasTile(newPosition) || !worldMap.isWalkable(newPosition)) {
			return false;
		};

		worldMap.hasItem(newPosition);

		if (newPosition.x !== this.position.x) this.position.x = newPosition.x;
		if (newPosition.y !== this.position.y) this.position.y = newPosition.y;

		this.$player.css({
			top: this.position.y * worldMap.defaults.tileSize,
			left: this.position.x * worldMap.defaults.tileSize,
		});
	}

	addItem(item) {
		console.log(`${this.name} acaba de receber o item ${item.name}!`);
		this.items[this.items.length] = item;
		this.renderInventory();
	}

	renderInventory() {
		for (let i = 0; i < this.items.length; i++) {
			let item = this.items[i];
			let addStyle = Utils.backgroundToStyle(item);

			this.$inventory.append(
				`<div class="player-item" style="${addStyle}" title="${item.name}"></div>`
			);
		}
	}
}

window.worldMap = new WorldMap();
window.player = new Player({
	name: 'Teste'
});
