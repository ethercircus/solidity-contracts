var StringBytes32Util = artifacts.require("./StringBytes32Util.sol");

contract('StringBytes32Util', function(accounts) {
//********************
//1) Tag Creation
//********************
  it("Tag Creation", function() {	
    return StringBytes32Util.deployed().then(function(instance) {
      var util = instance;	    
      return util.stringToBytes32Tuple("tag-1", {from: accounts[0]});
    }).then(function(bytesOne) {
      assert.equal(bytesOne[1], 0, "shits broke");	    
    });
  });
});
