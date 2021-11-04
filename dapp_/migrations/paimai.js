var myContract = artifacts.require('./paimai.sol');
module.exports = function(deployer) {
	deployer.deploy(myContract);
}
