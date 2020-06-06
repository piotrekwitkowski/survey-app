var Survey = artifacts.require("Survey");

module.exports = function(deployer) {
  deployer.deploy(Survey, "123", "123", 3);
};
