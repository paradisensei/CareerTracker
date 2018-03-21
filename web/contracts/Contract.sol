pragma solidity ^0.4.20;

/**
 * @title Contract
 * @dev   A contract encapsulates employment relationship info
*/
contract Contract {

    address public org;

    string public secretDetails;
    string public publicDetails;
    
    string public orgSig;
    string public empSig;

    function Contract(
        address _org,
        string _secretDetails,
        string _publicDetails,
        string _orgSig,
        string _empSig
    )
        public
    {
        org = _org;
        secretDetails = _secretDetails;
        publicDetails = _publicDetails;
        orgSig = _orgSig;
        empSig = _empSig;
    }

    function verify() public pure returns (bool) {
        return true;    
    }

    enum EmploymentStatus { In, Out, Fired }

    // add employment status & comment-recommendation

}
