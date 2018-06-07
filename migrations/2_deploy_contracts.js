var UserContentRegister = artifacts.require("./UserContentRegister.sol");

module.exports = function(deployer) {
  deployer.deploy(UserContentRegister);
};
