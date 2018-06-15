const $gameWrapper = $('.game-wrapper');
const $canvas = $('.canvas');

const $window = $(window);
const $document = $(document);
const $body = $('body');

const Utils = {
	backgroundToStyle(element = {}) {
		let addStyle = '';
		if (element.backgroundColor) {
			addStyle += `background-color: ${element.backgroundColor};`;
		}
		if (element.backgroundImage) {
			addStyle += `background-image: url(${element.backgroundImage});`;
		}
		return addStyle;
	},
	getRandomInt(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min)) + min;
	}
};

class WorldMap {
	constructor(options = {}) {
		this.defaults = {
			zIndex: 0,
			tileSize: 32
		};

		if (options.random) {
			this.currentMap = this.generateRandomMap(40, 15);
		} else {
			this.currentMap = globalMap;
		}

		this.renderMap();
	}

	generateRandomMap(width, height) {
		let finalMap = [];
		let firstTile = true; // primeiro square sempre andável

		xloop:
		for (let counterX = 0; counterX < width; counterX++) {

			yloop:
			for (let counterY = 0; counterY < height; counterY++) {
				if (firstTile) {
					finalMap[finalMap.length] = {
						x: 0,
						y: 0,
						type: tiles.grass,
					};
					firstTile = false;
				} else {
					finalMap[finalMap.length] = {
						x: counterX,
						y: counterY,
						type: false,
					};
				}
			}

		}

		// to-do: inteligência para sempre criar caminhos andáveis
		let tilesKeys = Object.keys(tiles);

		for (let i = 0; i < finalMap.length; i++) {
			if (!finalMap[i].type) {
				let randomTile = tilesKeys[Math.floor(Math.random() * tilesKeys.length)];
				finalMap[i].type = tiles[randomTile];
			}
		}

		finalMap.forEach((tile) => {
			const { x, y } = tile;
			const tileUp = finalMap.filter(el => el.x === x && el.y === y - 1);
			const tileRight = finalMap.filter(el => el.x === x + 1 && el.y === y);
			const tileDown = finalMap.filter(el => el.x === x && el.y === y + 1);
			const tileLeft = finalMap.filter(el => el.x === x - 1 && el.y === y);
			const tilesOnSides = [tileUp, tileRight, tileDown, tileLeft];
			const onlyRealTiles = tilesOnSides.filter((tile) => tile.length);

			let hasAtLeastOneWalkableTileOnSides = false;

			for (let i = 0; i < onlyRealTiles.length; i++) {
				if (onlyRealTiles[i] && onlyRealTiles[i].type && !onlyRealTiles[i].type.notWalkable) {
					hasAtLeastOneWalkableTileOnSides = true;
				}
			}

			if (!hasAtLeastOneWalkableTileOnSides) {
				const getOneOfThem = Utils.getRandomInt(0, onlyRealTiles.length);
				const onlyWalkableTypes = tilesKeys.filter((thisTile) => !tiles[thisTile].notWalkable);
				const randomTile = onlyWalkableTypes[Math.floor(Math.random() * onlyWalkableTypes.length)];

				onlyRealTiles[getOneOfThem].type = onlyWalkableTypes[randomTile];
			}
		});

		return finalMap;
	}

	renderMap() {
		$canvas.html('');

		this.currentMap.map((el) => {
			let x = el.x * this.defaults.tileSize;
			let y = el.y * this.defaults.tileSize;
			let zIndex = el.zIndex || this.defaults.zIndex;

			let tile = el.type;
			let addStyle = Utils.backgroundToStyle(el.type);

			$canvas.append(`
			<div class="tile"
			style="top:${y}px; left:${x}px; z-index:${zIndex}; ${addStyle}">
			</div>`);
		});
	}


	hasTile(pos) {
		const findTile = this.currentMap.filter((el) => {
			return (el.x == pos.x && el.y == pos.y);
		});

		if (findTile.length) {
			return true;
		} else {
			return false;
		}
	}

	hasItem(pos) {
		const findItems = this.currentMap.filter((el) => {
			return (el.x == pos.x && el.y == pos.y && el.isItem == true);
		});

		if (findItems.length) {
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
		const findTile = this.currentMap.filter((el, index) => {
			var condition = (el.x == pos.x && el.y == pos.y && (el.type || {}) == item);
			if (condition) {
				findIndex = index;
			}
			return condition;
		});
		if (findTile.length) {
			this.currentMap.splice(findIndex, 1);
		}
		this.renderMap();
	}

	isWalkable(pos) {
		const findNotWalkable = this.currentMap.filter((el) => {
			return (el.x == pos.x && el.y == pos.y && (el.type || {}).notWalkable);
		});

		if (findNotWalkable.length) {
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
		this.isOnMovement = false;

		this.movePlayer(this.position);
		this.renderInventory();
		this.listeners();
	}

	listeners() {
		$window.on('keydown', (e) => {
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

		if (!this.isOnMovement) {
			const newPosition = {
				x: pos.x,
				y: pos.y,
			};

			if (!worldMap.hasTile(newPosition) || !worldMap.isWalkable(newPosition)) {
				return false;
			};

			worldMap.hasItem(newPosition);

			this.isOnMovement = true;

			if (newPosition.x !== this.position.x) this.position.x = newPosition.x;
			if (newPosition.y !== this.position.y) this.position.y = newPosition.y;

			this.$player.css({
				top: this.position.y * worldMap.defaults.tileSize,
				left: this.position.x * worldMap.defaults.tileSize,
			});
			this.isOnMovement = false;
		}
	}

	addItem(item) {
		console.log(`${this.name} acaba de receber o item ${item.name}!`);
		this.items[this.items.length] = item;
		this.renderInventory();
	}

	renderInventory() {
		if (!this.items.length) {
			this.$inventory.html('');
		}
		for (let i = 0; i < this.items.length; i++) {
			let item = this.items[i];
			let addStyle = Utils.backgroundToStyle(item);

			this.$inventory.append(
				`<div class="player-item" style="${addStyle}" title="${item.name}"></div>`
			);
		}
	}
}

document.querySelector('.preMapStart').addEventListener('click', (e) => {
	e.preventDefault();

	window.worldMap = new WorldMap();
	window.player = new Player({
		name: 'Teste',
		position: {
			x: 0,
			y: 0,
		},
	});
});

document.querySelector('.randomMapStart').addEventListener('click', (e) => {
	e.preventDefault();

	window.worldMap = new WorldMap({
		random: true,
	});
	window.player = new Player({
		name: 'Teste',
		position: {
			x: 0,
			y: 0,
		},
	});
});
