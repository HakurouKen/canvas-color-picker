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

	describe('Promise',function(){
		describe('Promise.prototype.then',function(){
			it('should resolve correctly',function(done){
				var promise = new Helpers.Promise(function(resolve,reject){
					setTimeout(function(){
						resolve('resolved');
					},100);
				});

				promise.then(function(value){
					assert.equal('resolved',value);
					done();
				},function(){})
			});

			it('should be chainable',function(done){
				var promise = new Helpers.Promise(function(resolve,reject){
					setTimeout(function(){
						resolve('resolved');
					},100);
				});

				promise.then(function(value){
					assert.equal('resolved',value);
					return value + ' chain';
				}).then(function(value){
					assert.equal('resolved chain',value);
					done();
				},function(){});
			});

			it('should catch rejected correctly',function(done){
				var promise = new Helpers.Promise(function(resolve,reject){
					setTimeout(function(){
						reject('rejected');
					},100);
				});

				promise.then(function(value){},function(reason){
					assert.equal(reason,'rejected');
					done();
				});
			});

			it('should pass the rejected status',function(done){
				var promise = new Helpers.Promise(function(resolve,reject){
					setTimeout(function(){
						reject('rejected');
					},100);
				});

				promise.then(function(value){

				}).then(function(value){

				}).then(function(value){

				},function(reason){
					assert.equal(reason,'rejected');
					done();
				})
			});
		});

		describe('Promise.prototype.catch',function(){
			it('should catch rejected correctly',function(done){
				var promise = new Helpers.Promise(function(resolve,reject){
					setTimeout(function(){
						reject('resolved');
					},100);
				});

				promise.catch(function(reason){
					done();
				});
			});

			it('should pass the rejected status',function(done){
				var promise = new Helpers.Promise(function(resolve,reject){
					setTimeout(function(){
						reject('rejected');
					},100);
				});

				promise.then(function(){

				}).catch(function(reason){
					assert.equal('rejected',reason);
					done();
				});				
			});
		});

		describe('Promise.resolve',function(done){
			it('should return a resolved Promise Object, resolved with value given',function(){
				Promise.resolve('resolved').then(function(value){
					assert.equal('resolved',value);
					done();
				})
			})
		});

		describe('Promise.reject',function(done){
			it('should return a rejected Promise Object, rejected with reason given',function(){
				Promise.reject('rejected').catch(function(reason){
					assert.equal('rejected',reason);
					done();
				});
			})
		});

		describe('Promise.all',function(){
			it('should return a Promise Object, resolving when all promise resolved',function(done){
				var p1 = new Promise(function(resolve,reject){
					setTimeout(function(){
						resolve('promise 1');
					},100);
				}),
				p2 = new Promise(function(resolve,reject){
					setTimeout(function(){
						resolve('promise 2');
					},200);
				});
			
				Promise.all([p1,p2]).then(function(results){
					assert.deepEqual(['promise 1','promise 2'],results);
					done();
				})
			});
		});

		describe('Promise.race',function(){
			it('should return a Promise, resolving when the first promise resolved',function(done){
				var p1 = new Promise(function(resolve,reject){
					setTimeout(function(){
						resolve('promise 1');
					},100);
				});
				var p2 = new Promise(function(resolve,reject){
					setTimeout(function(){
						resolve('promise 2');
					},500);
				});

				Promise.race([p1,p2]).then(function(value){
					assert.equal('promise 1',value);
					done();
				});
			});
		});
	});

});
