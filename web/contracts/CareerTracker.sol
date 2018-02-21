pragma solidity ^0.4.18;

//* @title A contract to track career. */
contract CareerTracker {

    // This is a type for a single offer.
    struct Offer {
        address org;
        string position;
        uint timestamp;
        OfferStatus status;
    }

    enum OfferStatus { No, Approved, Declined }

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

    // employee address -> employee's offers
    mapping (address => Offer[]) public offersOf;

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

    /// Make an offer to particular employee
    function makeOffer(address employee, string position) public {
        address[] memory empls = employeesOf[msg.sender];
        for (uint i = 0; i < empls.length; i++) {
            require(empls[i] != employee);
        }
        offersOf[employee].push(Offer({
            org: msg.sender,
            position: position,
            timestamp: now,
            status: OfferStatus.No
        }));
    }

    /// Make a decision on particular offer
    function considerOffer(uint index, bool approve) public {
        Offer storage offer = offersOf[msg.sender][index];
        if (approve) {
            EmpRecord[] memory records = empRecordsOf[msg.sender];

            // can accept offer only if unemployed
            uint len = records.length;
            if (len > 0) {
              require(records[len - 1].status != EmploymentStatus.In);
            }

            offer.status = OfferStatus.Approved;
            empRecordsOf[msg.sender].push(EmpRecord({
                org: offer.org,
                position: offer.position,
                timestamp: now,
                comment: '',
                status: EmploymentStatus.In
            }));
            employeesOf[offer.org].push(msg.sender);
        } else {
            offer.status = OfferStatus.Declined;
        }
    }

    /// Add recommendation comment for your employee
    function comment(address employee, string comment) public {
        uint last = empRecordsOf[employee].length - 1;
        EmpRecord storage record = empRecordsOf[employee][last];

        // check employee's org
        require(msg.sender == record.org);
        // create or update recommendation comment
        record.comment = comment;
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

    /// Get offers count
    function getOffersCount() public constant returns(uint) {
        return offersOf[msg.sender].length;
    }

    /// Get employment records count
    function getEmpRecordsCount() public constant returns(uint) {
        return empRecordsOf[msg.sender].length;
    }

}