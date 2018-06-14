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
      return contentRegister.registerNewUser("harry", "empty", {from: accounts[0]});
    })

   .then(function() {
     contentRegister.publishContent("QmRd4yyBvzd63srGDF8c7uMf8Sif7JBmVzALVjJz343gSF", {from: accounts[0]});
   })

    .then(function() { 
      publicationRegister.publishContent(0, 0, {from: accounts[0]})
    })

    .then(function() {
      return publicationRegister.getContent.call(0, 0);
    }).then(function(content) {
      assert.equal(content, "QmRd4yyBvzd63srGDF8c7uMf8Sif7JBmVzALVjJz343gSF", "publication was not created");	    
    });
  });
  //********************
  //3) Supporting Post
  //********************
  it("Supporting Post", function() {
  });
  //********************
  //4) Withdrawing Claims
  //********************
  it("Withdrawing Claims", function() {
  });
});
