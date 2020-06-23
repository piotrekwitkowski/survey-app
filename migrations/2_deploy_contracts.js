var Survey = artifacts.require("Survey");
var Participate = artifacts.require("Participate");

module.exports = function(deployer) {
  deployer.deploy(Survey);
  // deployer.deploy(Survey, "Surveyname2", "SurveyURL2", 3);
  // deployer.deploy(Survey, "Surveyname3", "SurveyURL3", 3);
  deployer.deploy(Participate, "hello", "hello");
};
