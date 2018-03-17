pragma solidity ^0.4.20;

/**
 * @title CareerTracker
 * @dev   A contract to track career
*/
contract CareerTracker {

    // This is a type for a single employment record.
    struct EmpRecord {
        address org;
        string position;
        uint timestamp;
        string comment;
        EmploymentStatus status;
    }

    enum EmploymentStatus { In, Out, Fired }

    // employee's address -> hash of employee's information on IPFS
    mapping (address => string) public employeeInfo;
    // A dynamically-sized array containing employees' addresses
    address[] public employees;

    // organization's address -> hash of organization's information on IPFS
    mapping (address => string) public orgInfo;
    // A dynamically-sized array containing organizations' addresses
    address[] public orgs;

    // employee address -> employee's employment history
    mapping (address => EmpRecord[]) public empRecordsOf;

    // organization address -> organization's employees
    mapping (address => address[]) public employeesOf;

    modifier newUser() {
        require(bytes(employeeInfo[msg.sender]).length == 0);
        require(bytes(orgInfo[msg.sender]).length == 0);
        _;
    }

    /// Add new employee
    function newEmployee(string employee) public newUser {
        employeeInfo[msg.sender] = employee;
        employees.push(msg.sender);
    }

    /// Add new organization
    function newOrg(string org) public newUser {
        orgInfo[msg.sender] = org;
        orgs.push(msg.sender);
    }

    /// Make a decision on particular offer
    function considerOffer(uint index, bool approve, string _empSig) public {
        Offer storage offer = offersOf[msg.sender][index];
        if (approve) {
            EmpRecord[] memory records = empRecordsOf[msg.sender];

            // can accept offer only if unemployed
            uint len = records.length;
            if (len > 0) {
                require(records[len - 1].status != EmploymentStatus.In);
            }
            offer.empSig = _empSig;
            offer.status = OfferStatus.Approved;
            empRecordsOf[msg.sender].push(EmpRecord({
                org: offer.org,
                position: offer.position,
                timestamp: now,
                comment: '',
                status: EmploymentStatus.In
            }));
        } else {
            offer.status = OfferStatus.Declined;
        }
    }

    /// Get organization's employees' addresses
    function getStaff() public constant returns (address[]) {
        return employeesOf[msg.sender];
    }

    /// Get other employees' addresses
    function getEmployees() public constant returns (address[]) {
        return employees;
    }

    /// Get organizations' addresses
    function getOrgs() public constant returns (address[]) {
        return orgs;
    }

    /// Get employment records count
    function getEmpRecordsCount() public constant returns(uint) {
        return empRecordsOf[msg.sender].length;
    }

}
