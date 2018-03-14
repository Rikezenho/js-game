let walkableTiles = [
    {
		x: 0,
		y: 0,
		type: tiles.grass,
    },
    {
		x: 1,
		y: 0,
		type: tiles.grass,
    },
    {
		x: 2,
		y: 0,
		type: tiles.grass,
    },
    {
		x: 0,
		y: 1,
		type: tiles.grass,
    },
    {
		x: 1,
		y: 1,
		type: tiles.grass,
    },
    {
		x: 2,
		y: 1,
		type: tiles.grass,
    },
    {
		x: 0,
		y: 2,
		type: tiles.grass,
    },
    {
		x: 1,
		y: 2,
		type: tiles.grass,
    },
    {
		x: 2,
		y: 2,
		type: tiles.grass,
	},
	// caminho para fora
    {
		x: 3,
		y: 2,
		type: tiles.grass,
    },
    {
		x: 4,
		y: 2,
		type: tiles.grass,
    },
    {
		x: 5,
		y: 2,
		type: tiles.grass,
    },
    {
		x: 6,
		y: 2,
		type: tiles.grass,
    },
    {
		x: 7,
		y: 2,
		type: tiles.grass,
	},
];

let itemTiles = [
	{
		x: 1,
		y: 1,
		zIndex: 1,
		type: items.trunk,
    },
    {
		x: 7,
		y: 2,
		zIndex: 1,
		isItem: true,
		onReach: (pos) => {
			window.player.addItem(items.necklace);
			window.worldMap.removeItem(pos, items.necklace);
		},
		type: items.necklace,
	},
];

let notWalkableTiles = [
	{
		x: 3,
		y: 0,
		type: tiles.water,
	},
    {
		x: 3,
		y: 1,
		type: tiles.water,
    },

	{
		x: 4,
		y: 0,
		type: tiles.water,
	},
    {
		x: 4,
		y: 1,
		type: tiles.water,
    },

	{
		x: 5,
		y: 0,
		type: tiles.water,
	},
    {
		x: 5,
		y: 1,
		type: tiles.water,
    },

	{
		x: 6,
		y: 0,
		type: tiles.water,
	},
    {
		x: 6,
		y: 1,
		type: tiles.water,
    },

	{
		x: 7,
		y: 0,
		type: tiles.water,
	},
    {
		x: 7,
		y: 1,
		type: tiles.water,
    },
];

let globalMap = [].concat(walkableTiles, notWalkableTiles, itemTiles);
