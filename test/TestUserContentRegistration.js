var UserContentRegister = artifacts.require("./UserContentRegister.sol");

contract('UserContentRegister', function(accounts) {
  //********************
  //1) User registration
  //********************
  it("Test Registering a new user", function() {	
    var contentRegister;
    
    return UserContentRegister.deployed().then(function(instance) {
      contentRegister = instance;	    
      return contentRegister.registerNewUser("harry", "empty", {from: accounts[0]});
    })
    
    .then(function() {
      return contentRegister.registered.call(accounts[0]);
    }).then(function(registered) {
      assert.equal(registered, true, "call to registered on user name did not return true");	    
    })
    
    .then(function() {
      return contentRegister.numUsers.call();
    }).then(function(numUsers) {
      assert.equal(numUsers, 1, "num users was not updated");    
    })
    
    .then(function() {
      return contentRegister.getUserAddress.call("harry");
    }).then(function(address) {
      assert.equal(address, accounts[0], "get user address did not return correct address for new user name");    
    });

  });
  //********************
  //2) Updating user data
  //********************
  it("Updating User Data test", function() {	
    var contentRegister;
    return UserContentRegister.deployed().then(function(instance) {
      contentRegister = instance;	    
      return contentRegister.updateMetaData("harryp.com", {from: accounts[0]});
    })

    .then(function() {
      return contentRegister.userIndex.call(accounts[0]);
    })
    .then(function(userObject) {
      assert.equal(userObject[1], "harryp.com", "meta data was not updated correctly");	    
    })

    .then(function() {
      return contentRegister.updateMetaData("p.com", {from: accounts[1]});
    })
    .then(function() {
      return contentRegister.userIndex.call(accounts[1]);
    })
    .then(function(userObject) {
      assert.notEqual(userObject[1], "p.com", "meta data updated on unregistered user");	    
    });


  });
  //********************
  //3) Posting Content
  //********************
  it("Posting content tests", function() {	
    var contentRegister;
    return UserContentRegister.deployed().then(function(instance) {
      contentRegister = instance;	    
      return contentRegister.publishContent("QmRd4yyBvzd63srGDF8c7uMf8Sif7JBmVzALVjJz343gSF", {from: accounts[0]});
    })
    
    .then(function() {
      return contentRegister.userIndex.call(accounts[0]);
    }).then(function(user) {
      assert.equal(user[2], 1, "user num content was not increased");	    
    })

    .then(function() {
      return contentRegister.getUserContent.call(accounts[0], 0);
    }).then(function(content) {
      assert.equal(content, "QmRd4yyBvzd63srGDF8c7uMf8Sif7JBmVzALVjJz343gSF", "published content is not being returned correctly");	    
    });

  });
});
