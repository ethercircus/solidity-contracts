var PublicationRegister = artifacts.require("./PublicationRegister.sol");

contract('PublicationRegister', function(accounts) {
  it("should get true back upon registerting new user", function() {	
    var publicationRegister;
    return PublicationRegister.deployed().then(function(instance) {
      publicationRegister = instance;	    
      return publicationRegister.createPublication("slush-pile", "empty", 1, 0, {from: accounts[0]});
    }).then(function() {
      return publicationRegister.checkNameTaken.call("slush-pile");
    }).then(function(nameTaken) {
      assert.equal(nameTaken, true, "publication was not created");	    
    });
  });
});
