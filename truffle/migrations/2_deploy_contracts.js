var ownable = artifacts.require("./ownable.sol");
var circuitbreaker = artifacts.require("./circuitbreaker.sol");
var pandafactory = artifacts.require("./pandafactory.sol");
var pandaownership = artifacts.require("./pandaownership.sol");


module.exports = function(deployer) {
  deployer.deploy(ownable);
  deployer.deploy(pandafactory);
  deployer.deploy(pandaownership);
  deployer.deploy(circuitbreaker);
};
