var UserContentRegister = artifacts.require("./UserContentRegister.sol");
var PublicationRegister = artifacts.require("./PublicationRegister.sol");
var TagRegister = artifacts.require("./TagRegister.sol");

var userContentRegisterInstance;

module.exports = function(deployer) {
  deployer.deploy(UserContentRegister)
  .then(() => UserContentRegister.deployed())
  .then(_instance => userContentRegisterInstance = _instance)
  .then(_ => deployer.deploy(PublicationRegister, userContentRegisterInstance.address))
  .then(_ => deployer.deploy(TagRegister, userContentRegisterInstance.address));
};
