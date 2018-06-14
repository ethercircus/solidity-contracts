var PublicationRegister = artifacts.require("./PublicationRegister.sol");
var UserContentRegister = artifacts.require("./UserContentRegister.sol");
var publicationRegister;
var contentRegister;

contract('PublicationRegister', function(accounts) {
  //********************
  //1) Publication Creation
  //********************
  it("Creating a new Publication", function() {
    return PublicationRegister.deployed().then(function(instance) {
      publicationRegister = instance;	    
      return publicationRegister.createPublication("slush-pile", "empty", 1, 0, {from: accounts[0]});
    }).then(function() {
      return publicationRegister.checkNameTaken.call("slush-pile");
    }).then(function(nameTaken) {
      assert.equal(nameTaken, true, "publication was not created");	    
    });
  });
  //********************
  //2) Content Publishing
  //********************
  it("Content Publishing", function() {
    return UserContentRegister.deployed().then(function(instance) {
      contentRegister = instance;    
      return contentRegister.registerNewUser("cameron", "empty", {from: accounts[1]});
    })

   .then(function() {
     contentRegister.publishContent("QmRd4yyBvzd63srGDF8c7uMf8Sif7JBmVzALVjJz343gSF", {from: accounts[1]});
   })

    .then(function() { 
      publicationRegister.publishContent(0, 0, {from: accounts[1]})
    })

    .then(function() {
      return publicationRegister.getContent.call(0, 0);
    })
    
    .then(function(content) {
      assert.equal(content, "QmRd4yyBvzd63srGDF8c7uMf8Sif7JBmVzALVjJz343gSF", "publication was not created");	    
    });
  });
  //********************
  //3) Supporting Post
  //********************
  it("Supporting Post", function() {
    return publicationRegister.supportPost(0, 0, "Thanks for reading everyone!", {from: accounts[0], gas: 1000000, value: web3.toWei(2, "finney")})
  
    .then(function() {
      return publicationRegister.checkAuthorClaim.call(0, accounts[1]);
      //return publicationRegister.getContentRevenue.call(0, 0)
    })
    
    .then(function(claim) {
      assert.equal(claim, web3.toWei(2, "finney"), "author claim did not go up correctly");
      //assert.equal(revenue, 50, "author claim did not go up correctly");
    });
  });

  //********************
  //4) Withdrawing Claims
  //********************
  it("Withdrawing Claims", function() {
    var startBalance = web3.fromWei(web3.eth.getBalance(accounts[1]), "finney");
    return publicationRegister.withdrawAuthorClaim(0, {from: accounts[1]})

    .then(function() {
      return publicationRegister.getContentRevenue.call(0, 0)
    })
    .then(function(revenue) {
      assert.equal(revenue, web3.toWei(2, "finney"), "author claim did not go up correctly");
      var newBalance = web3.eth.getBalance(accounts[1]);
      assert.notEqual(startBalance + 0, web3.fromWei(newBalance, "finney") + 0, "balance did not go up correctly");
    })

    .then(function() {
      return publicationRegister.checkAuthorClaim.call(0, accounts[1]);
    })

    .then(function(claim) {
      assert.equal(claim, 0, "author claim did not go down");
    });	    
  });
});
