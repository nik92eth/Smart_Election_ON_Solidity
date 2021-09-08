pragma solidity 0.4.25;

contract Election {
    // Model a Candidate
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }
    //store accounts that have voted already
    mapping(address=>bool) public voters;
    // Store Candidates
    // Fetch Candidate
    mapping(uint => Candidate) public candidates;
    // Store Candidates Count
    uint public candidatesCount;

    // voted event
    event votedEvent (
        uint indexed _candidateID
    );

    constructor () public {
        addCandidate("Candidate 1");
        addCandidate("Candidate 2");
    }

    function addCandidate (string _name) private {
        candidatesCount ++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    function vote(uint _candidateID) public{
        //require that the address hasn't voted before 
        require(!voters[msg.sender]);

        //require a valid cnadidate 
        require(_candidateID>0 && _candidateID<= candidatesCount);

        //record the voter has voted already
        voters[msg.sender] = true;

        // update candidate vot count 
        candidates[_candidateID].voteCount++;

        //trigger voted event
        emit votedEvent(_candidateID);
    }




}