pragma solidity ^0.4.17;

contract CampaignFactory {
    address[] public campaigns;
    
    function createCampaign(uint minimum, string name, string description) public {
        address newCampaign = new Campaign(minimum, name, description, msg.sender);
        campaigns.push(newCampaign);
    }
    
    function getCampaigns() public view returns (address[]) {
        return campaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        mapping(address => bool) approvals;
        uint approvalCount;
    }
    
    address public manager;
    uint public minContribution;
    mapping(address => bool) public approvers;
    uint public approversCount;
    Request[] public requests;
    string public title;
    string public about;
    
    modifier restricted() {
        require(manager == msg.sender);
        _;
    }
    
    function Campaign(uint minimum, string name, string desc, address creator) public {
        manager = creator;
        minContribution = minimum;
        title = name;
        about = desc;
    }
    
    function contribute() public payable {
        require(msg.value > minContribution);
        
        approvers[msg.sender] = true;
        approversCount++;
    }
    
    function createRequest(string description, uint value, address recipient) public restricted {
        Request memory newRequest = Request({
           description: description,
           value: value,
           recipient: recipient,
           complete: false,
           approvalCount: 0
        });
        
        requests.push(newRequest);
    }
    
    function approveRequest(uint index) public {
        require(approvers[msg.sender]);
        
        Request storage request = requests[index];
        require(!request.approvals[msg.sender]);
        
        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }
    
    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];
        
        require(!request.complete);
        require(request.approvalCount > (approversCount / 2));
        
        request.recipient.transfer(request.value);
        request.complete = true;
    }

    function getSummary() public view returns (uint, uint, uint, uint, address, string, string) {
        return (
            minContribution,
            this.balance,
            requests.length,
            approversCount,
            manager,
            title,
            about
        );
    }

    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }
}