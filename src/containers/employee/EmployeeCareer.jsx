// get employment records
contract.methods.getEmpRecordsCount().call({from: user.address}).then(count => {
  for (let i = 0; i < Number(count); i++) {
    contract.methods.empRecordsOf(user.address, i).call((e, record) => {
      if (record[0]) {
        contract.methods.orgInfo(record[0]).call((e, org) => {
          const arr = this.state.empRecords.slice();
          arr.push({
            orgName: org[0],
            position: record[1],
            date: getDate(new Date(Number(record[2]))),
            status: record[3]
          });
          this.setState({
            empRecords: arr
          });
        });
      }
    });
  }
})

if (this.state.empRecords && this.state.empRecords.length > 0) {
  empRecords = <div>
    <h3>Ваш послужной список</h3>
    <ul> {
      this.state.empRecords.map((r, i) => {
        const status = Number(r.status);
        const text = status === 0 ? 'приняты на должность'
          : 'уволены с должности';
        return (
          <li key={i}>
            <p>{r.date} вы были {text} {r.position} в {r.orgName}</p>
          </li>
        );
      })
    } </ul>
  </div>
}