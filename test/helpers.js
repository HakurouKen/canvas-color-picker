var assert = require('assert'),
	Helpers = require('../canvas-color-picker').helpers;

describe('Helpers',function(){
	describe('Helpers.type',function(){
	    it('should return the type(internal [[class]]) of the object',function(){
	    	assert.equal('undefined',Helpers.type(undefined));

	    	assert.equal('null',Helpers.type(null));
	    	
	    	assert.equal('boolean',Helpers.type(true));
	    	assert.equal('boolean',Helpers.type(new Boolean(false)));
	    	
	    	assert.equal('string',Helpers.type('test string'));
	    	assert.equal('string',Helpers.type(new String('test string')));
	    	
	    	assert.equal('function',Helpers.type(function(){return;}));
			assert.equal('function',Helpers.type(new Function('return;')));

	    	assert.equal('regexp',Helpers.type(/test regexp/));
	    	assert.equal('regexp',Helpers.type(new RegExp('test regexp')));

	    	assert.equal('object',Helpers.type({}));
	    });
	});

	describe('Helpers.toArray',function(){
		it('should change the array-like object to array',function(){
			assert.deepEqual([1,2,3],Helpers.toArray({
				"0": 1,
				"1": 2,
				"2": 3,
				length: 3
			}))
		});
	});

	describe('Helpers.noop',function(){
		it('should be a empty function',function(){
			assert.equal('function',Helpers.type(Helpers.noop));
			assert.equal('function(){}',Helpers.noop.toString().replace(/\s/g,''));
		})
	});

	describe('Helpers.extend',function(){
		it('should extend the source object to destination object',function(){
			var dest = {key1: 'value1' , key2:'value2'};
			Helpers.extend(dest,{key2: 'another value2',key3: 'another value3'});
			assert.deepEqual({
				key1: 'value1',
				key2: 'another value2',
				key3: 'another value3'
			},dest);

			var dest2 = {key1: 'value1' , key2:'value2'};
			Helpers.extend(false,dest2,{key2: 'another value2',key3: 'another value3'});
			assert.deepEqual({
				key1: 'value1',
				key2: 'another value2',
				key3: 'another value3'
			},dest2);
		});

		it('should be able to deep copy the source object',function(){
			var dest = {
				key: {
					inner: 'inner'
				},
				outer: 'outer'
			};

			Helpers.extend(true,dest,{
				key: {
					inner: 'inner text',
					inner2: 'I\'m inner too'
				}
			})

			assert.deepEqual({
				key: {
					inner: 'inner text',
					inner2: 'I\'m inner too'
				},
				outer: 'outer'
			},dest);
		});

		it('should return the dest object',function(){
			var dest = {
				key: {
					inner: 'inner'
				},
				outer: 'outer'
			};

			assert.deepEqual({
				key: {
					inner: 'inner text',
					inner2: 'I\'m inner too'
				},
				outer: 'outer'
			},Helpers.extend(true,dest,{
				key: {
					inner: 'inner text',
					inner2: 'I\'m inner too'
				}
			}));
		});
	});

	describe('Helpers.rgb2Hex',function(){
		it('should return hex color',function(){
			assert.equal('#000000',Helpers.rgb2Hex(0,0,0));
			assert.equal('#10F0CC',Helpers.rgb2Hex(16,240,204));
		});

		it('should padding with 0 when value is less than 0x10',function(){
			assert.equal('#0F0E0D',Helpers.rgb2Hex(15,14,13));
		});

		it('should accept object/array/r,g,b seprated params',function(){
			assert.equal('#0FF0CC',Helpers.rgb2Hex({r:15,g:240,b:204}));
			assert.equal('#0FF0CC',Helpers.rgb2Hex([15,240,204]));
			assert.equal('#0FF0CC',Helpers.rgb2Hex(15,240,204));
		});

		it('should return nearest number when number is out of range [0,255]',function(){
			assert.equal('#FF00CC',Helpers.rgb2Hex(256,-3,204));
		})
	});

	describe('Helpers.hex2Rgb',function(){
		it('should return converted rgb color array',function(){
			assert.deepEqual([1,2,3],Helpers.hex2Rgb('#010203'));
			assert.deepEqual([15,204,240],Helpers.hex2Rgb('#0FCCF0'));
		});

		it('should accept 3 or 6 digit hex, with or without "#" ',function(){
			assert.deepEqual([17,255,170],Helpers.hex2Rgb('#1FA'));
			assert.deepEqual([17,34,51],Helpers.hex2Rgb('123'));
		});

		
	});

});
