if (!RPG) var RPG = {};
if (typeof exports != 'undefined') {
    Object.merge(RPG,require('../../../server/Log/Log.njs'));
    Object.merge(RPG,require('../../Character/Character.js'));
    Object.merge(RPG,require('../../optionConfig.js'));
    module.exports = RPG;
}

/**
 * The GeneratorBaseClass defines the the minimum requirements for a Generator
 * this Class is extened by all generators
 */
RPG.GeneratorBaseClass = new Class({

    /**
     * The name of the generator for access
     * Should be added to RPG.Generators to define available generators
     */
    name : '',

    /**
     * Option Constraints which are used to define what options this generator
     * uses to generate the content.
     *
     * The random funcion uses these constraints to generate random options.
     * keep that in mind when defining them
     *
     * Example :
     *    {
     *        property : {
     *            name : ["a-zA-Z1-9",1,10],
     *            size : [0,1,10]
     *        }
     *    }
     *
     * All constraints require the below:
     */
    constraints : {
    //	properties : {
    //	    name : ["/^[a-zA-Z0-9_.]+$/",1,15,'g'],
    //	    seed : [0,99999999999,Math.floor((Math.random() * (99999999999 - 1) + 1))],
    //	    Difficulty : Object.keys(RPG.Difficulty),
    //	    level : [1,100,1]
    //	}
    },

    /**
     * random uses the constraints object to generate random options then calls generate
     *
     *
     * This parent method creates a universe for the generated content to go into
     *
     * once the content has been generated we will callback. MUST proved a callback. app will appear to hang if no callback is made
     *
     * callback({
     *	    options : {},  //the random options tha were created
     *	    universe : {}, //the universe object created by random which may be merged into another universe
     *	    generated : {} //the object returned from the generate function
     *   })
     */
    random : function(mapName,options,rand,callback){
	rand = rand || RPG.Random;

	//create an empty universe
	var universe = {
	    maps : {}
	};

	//add a map for this generator to the universe
	var map = universe.maps[mapName] = {};

	//set the map options:
	map.options = {
	    property : {
		mapName : mapName,
		author : 'Generated'
	    }
	};

	//merge 'incoming options' with 'random options' so we can override some random ones if so desired
	var randOptions = Object.merge(
	    RPG.optionCreator.random(this.constraints,rand),
	    options
	    );


	//merge difficulty options
	Object.merge(
	    randOptions,
	    RPG.difficultyVal(randOptions.properties.Difficulty,'Generator.'+this.name) || {}
	    );

	//add an entry in the map for the generator used to create the map
	map.options.generator = {};

	//populate the generators options
	map.options.generator[this.name] = {
	    options : randOptions
	};

	//generate the actual map and callback with the results
	this.generate(map.options.generator[this.name].options,rand,function(generated){
	    map.tiles = generated.tiles;
	    map.cache = generated.cache;
	    callback({
		options : randOptions,
		universe : universe,
		generated : generated
	    });
	}.bind(this));
    },

    /**
     * Takes options created from this.constraints and generates content
     *
     * callback must be provided and callback must be invoked by generate
     * app will appear to hang if no callback is made
     *
     * The object being sent back through the callback NEEDS to contain at minimum:
     * {
     *     tiles : {}, //map tiles
     *     cache : {}, //map cache
     *     possibleStartLocations : [] //array of points where the user can enter the universe
     * }
     */
    generate : function(options,rand,callback){
	callback({});
    }
});



/**
 * A List of available Map Generators and their required input
 */
RPG.Generators = {
    Terrain : {
	require :{
	    js : ['/common/Map/Generators/Terrain.js','/common/Map/Generators/diamond-square.js','/common/Map/Generators/Words.js']
	}
    },
    Dungeon : {
	require :{
	    js : ['/common/Map/Generators/Dungeon.js','/common/Map/Generators/Maze.js','/common/Map/Generators/Words.js']
	}
    },
    House : {
	require :{
	    js : ['/common/Map/Generators/House.js','/common/Map/Generators/Words.js']
	}
    },
    Maze : {
	require :{
	    js : ['/common/Map/Generators/Maze.js','/common/Map/Generators/Words.js']
	}
    }
}