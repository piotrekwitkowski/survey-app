var Survey = artifacts.require("Survey");

module.exports = function(deployer) {
  deployer.deploy(Survey, "Surveyname", "SurveyURL", 3);
};
