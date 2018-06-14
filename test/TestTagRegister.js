var TagRegister = artifacts.require("./TagRegister.sol");

contract('TagRegister', function(accounts) {
  it("Test Description", function() {	
    var tagRegister;
    return TagRegister.deployed().then(function(instance) {
      tagRegister = instance;	    
      return tagRegister.createTag("poop", {from: accounts[0]});
    }).then(function() {
      return tagRegister.checkTagTaken.call("poop");
    }).then(function(tagTaken) {
      assert.equal(tagTaken, true, "tag was not created");	    
    });
  });
});
