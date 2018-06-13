var UserContentRegister = artifacts.require("./UserContentRegister.sol");
var PublicationRegister = artifacts.require("./PublicationRegister.sol");

var userContentRegisterInstance;

module.exports = function(deployer) {
  deployer.deploy(UserContentRegister)
  .then(() => UserContentRegister.deployed())
  .then(_instance => deployer.deploy(PublicationRegister, _instance.address));
};
