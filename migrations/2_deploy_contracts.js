var Survey = artifacts.require("Survey");

module.exports = function(deployer) {
  console.log('1234567')
  deployer.deploy(Survey, "Surveyname1", "SurveyURL1", 3);
  deployer.deploy(Survey, "Surveyname2", "SurveyURL2", 3);
  deployer.deploy(Survey, "Surveyname3", "SurveyURL3", 3);
};
