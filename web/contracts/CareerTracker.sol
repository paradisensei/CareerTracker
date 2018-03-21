pragma solidity ^0.4.20;

import "./Ownable.sol";
import "./Contract.sol";

/**
 * @title CareerTracker
 * @dev   A contract to track career
*/
contract CareerTracker is Ownable {

    // employee's address -> hash of employee's information on IPFS
    mapping (address => string) public employeeInfo;
    // A dynamically-sized array containing employees' addresses
    address[] public employees;

    // organization's address -> hash of organization's information on IPFS
    mapping (address => string) public orgInfo;
    // A dynamically-sized array containing organizations' addresses
    address[] public orgs;

    // employee address -> employee's employment history
    mapping (address => address[]) public empContractsOf;

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

    /// Publish new employment contract
    function publishContract(
        address emp, address org,
        string secretDetails, string publicDetails,
        string orgSig, string empSig
    )
        public onlyOwner returns (address)
    {
        Contract c = new Contract(
            org, secretDetails, publicDetails, orgSig, empSig
        );
        empContractsOf[emp].push(c);
        employeesOf[org].push(emp);
        return c;
    }

    /// Get organization's employees' addresses
    function getStaff() public constant returns (address[]) {
        return employeesOf[msg.sender];
    }

    /// Get employees' addresses
    function getEmployees() public constant returns (address[]) {
        return employees;
    }

    /// Get organizations' addresses
    function getOrgs() public constant returns (address[]) {
        return orgs;
    }

    /// Get number of employment records
    function getEmpContractsCount() public constant returns(uint) {
        return empContractsOf[msg.sender].length;
    }

}
