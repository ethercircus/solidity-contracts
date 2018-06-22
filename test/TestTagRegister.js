var TagRegister = artifacts.require("./TagRegister.sol");
var PublicationRegister = artifacts.require("./PublicationRegister.sol");
var UserContentRegister = artifacts.require("./UserContentRegister.sol");
var publicationRegister;
var contentRegister;
var tagRegister;

contract('TagRegister', function(accounts) {
//********************
//1) Tag Creation
//********************
  it("Tag Creation", function() {	
    return TagRegister.deployed().then(function(instance) {
      tagRegister = instance;	    
      return tagRegister.createTag("tag-1", {from: accounts[0]});
    }).then(function() {
      return tagRegister.checkTagTaken.call("tag-1");
    }).then(function(tagTaken) {
      assert.equal(tagTaken, true, "tag was not created");	    
    });
  });
//********************
//2) Tagging Content
//********************
  it("Tagging Content", function() {	
    return UserContentRegister.deployed().then(function(instance) {
      contentRegister = instance;
      return contentRegister.registerNewUser("cameron", "empty", {from: accounts[1]});
    })

    .then(function() {
      return PublicationRegister.deployed().then(function(instance) {
        publicationRegister = instance;
      })
    })

    .then(function() {
      publicationRegister.createPublication("slushPile", "empty", 1, 0, {from: accounts[1]});
     })

    .then(function() {
      contentRegister.publishContent("QmRd4yyBvzd63srGDF8c7uMf8Sif7JBmVzALVjJz343gSF", {from: accounts[1]});
     })

    .then(function() {
       publicationRegister.publishContent(0, 0, {from: accounts[1]})
     })

    .then(function() {
       tagRegister.tagContent("tag-1", 0, 0, {from: accounts[1]})
     })

    .then(function() {
      return tagRegister.getTagContent.call("tag-1", 0);
    }).then(function(tagContent) {
      assert.equal(tagContent, "QmRd4yyBvzd63srGDF8c7uMf8Sif7JBmVzALVjJz343gSF", "content was not tagged");	    
    });

  });
});
