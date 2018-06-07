var UserContentRegister = artifacts.require("./UserContentRegister.sol");

contract('UserContentRegister', function(accounts) {
  it("should get true back upon registerting new user", function() {	
    var contentRegister;
    return UserContentRegister.deployed().then(function(instance) {
      contentRegister = instance;	    
      return contentRegister.registerNewUser("harry", "empty", {from: accounts[0]});
    }).then(function() {
      return contentRegister.registered.call(accounts[0]);
    }).then(function(registered) {
      assert.equal(registered, true, "user was not registered");	    
    });
  });
});
