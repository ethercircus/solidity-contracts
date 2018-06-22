var UserContentRegister = artifacts.require("./UserContentRegister.sol");
var PublicationRegister = artifacts.require("./PublicationRegister.sol");
var TagRegister = artifacts.require("./TagRegister.sol");
var StringBytes32Util = artifacts.require("./StringBytes32Util.sol");

var stringBytes32UtilInstance;
var userContentRegisterInstance;
var publicationRegisterInstance;

module.exports = function(deployer) {
  deployer.deploy(StringBytes32Util)
  .then(() => StringBytes32Util.deployed())
  .then(_instance => stringBytes32UtilInstance = _instance)

  .then(_ => deployer.deploy(UserContentRegister, stringBytes32UtilInstance.address))
  .then(() => UserContentRegister.deployed())
  .then(_instance => userContentRegisterInstance = _instance)

  .then(_ => deployer.deploy(PublicationRegister, userContentRegisterInstance.address, stringBytes32UtilInstance.address))
  .then(() => PublicationRegister.deployed())
  .then(_instance => publicationRegisterInstance = _instance)

  .then(_ => deployer.deploy(TagRegister, publicationRegisterInstance.address, stringBytes32UtilInstance.address));
};
