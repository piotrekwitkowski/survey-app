// var Survey = artifacts.require("Survey");
//var Participate = artifacts.require("Participate");
var Master = artifacts.require("Master");

module.exports = function(deployer) {
  deployer.deploy(Master);
  // deployer.deploy(Survey, "Surveyname2", "SurveyURL2", 3);
  // deployer.deploy(Survey, "Surveyname3", "SurveyURL3", 3);
  //deployer.deploy(Participate, "hello", "hello");
};
