var Survey = artifacts.require("Survey");

module.exports = function(deployer) {
  deployer.deploy(Survey);
  // deployer.deploy(Survey, "Surveyname2", "SurveyURL2", 3);
  // deployer.deploy(Survey, "Surveyname3", "SurveyURL3", 3);
};
