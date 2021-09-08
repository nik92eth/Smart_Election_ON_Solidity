var Election = artifacts.require("./Election.sol")

contract("Election",function(accounts){
    var electionInstnace;

    it("intializes with two candidates" , function(){

        return Election.deployed().then(function(instance){
            return instance.candidatesCount();
        }).then(function(count){
            assert.equal(count,2);
        });

    });

    it("it initializes the candiates with the correct values" , function(){

        return Election.deployed().then(function(instance){
            electionInstnace = instance;
            return electionInstnace.candidates(1);
        }).then(function(candiate){
            assert.equal(candiate[0],1,"contains the correct id");
            assert.equal(candiate[1],"Candidate 1","contains the correct name");
            assert.equal(candiate[2],0,"contains the correct vote count");
            return electionInstnace.candidates(2);
        }).then(function(candiate){
            assert.equal(candiate[0],2,"contains the correct id");
            assert.equal(candiate[1],"Candidate 2","contains the correct name");
            assert.equal(candiate[2],0,"contains the correct vote count");

        });
    });

    it("allows a voter to cast a vote", function(){
        return Election.deployed().then(function(instance){
            electionInstnace = instance;
            candiateID = 1;
            return electionInstnace.vote(candiateID , {from:accounts[0]});
        }).then(function(receipt){
            return electionInstnace.voters(accounts[0]);
        }).then(function(voted){
            assert(voted,"the voter was marked as voted");
            return electionInstnace.candidates(candiateID);
        }).then(function(candidate){
            var voteCount = candidate[2];
            assert.equal(voteCount,1,"increment the candidate's vote count");
        })  
    });

    it("throws an exception for invald candidates", function(){
        return Election.deployed().then(function(instance){
            electionInstnace = instance;
            return electionInstnace.vote(99,{from:accounts[1]})
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf('revert')>=0,"error message must contain revert");
            return electionInstnace.candidates(1)
        }).then(function(candidate1){
            var voteCount = candidate1[2];
            assert.equal(voteCount,1,"candidate 1 did not recieve any votes");
            return electionInstnace.candidates(2);
        }).then(function(candidate2){
            var voteCount = candidate2[2];
            assert.equal(voteCount,0,"candidates 2 did not receive any votes");
        });
    });

    it("throws an exception for double voting", function() {
        return Election.deployed().then(function(instance) {
          electionInstance = instance;
          candidateID = 2;
          electionInstance.vote(candidateID, { from: accounts[1] });
          return electionInstance.candidates(candidateID);
        }).then(function(candidate) {
          var voteCount = candidate[2];
          assert.equal(voteCount, 1, "accepts first vote");
          // Try to vote again
          return electionInstance.vote(candidateID, { from: accounts[1] });
        }).then(assert.fail).catch(function(error) {
            assert(error.message, 'error message must contain revert');
          return electionInstance.candidates(1);
        }).then(function(candidate1) {
          var voteCount = candidate1[2];
          assert.equal(voteCount, 1, "candidate 1 did not receive any votes");
          return electionInstance.candidates(2);
        }).then(function(candidate2) {
          var voteCount = candidate2[2];
          assert.equal(voteCount, 1, "candidate 2 did not receive any votes");
        });
    });

});