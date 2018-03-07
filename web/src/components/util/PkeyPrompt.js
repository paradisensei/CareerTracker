import React from 'react';

import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';

class PkeyPrompt extends React.Component {

  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <Dialog fullWidth
              open={true}>
        <DialogTitle>Добро пожаловать</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Нам нужен ваш секретный ключ для асимметричного шифрования
          </DialogContentText>
          <TextField autoFocus margin="dense" name="pkey"
                     label="Секретный ключ" fullWidth
                     onChange={handleInputChange.bind(this)}/>
        </DialogContent>
        <DialogActions>
          <Button color="primary"
                  onClick={handleSubmit.bind(this)}>
            Вперед
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

function handleInputChange(event) {
  this.setState({
    [event.target.name]: event.target.value
  });
}

function handleSubmit() {
  this.props.setPkey(this.state.pkey);
}

export default PkeyPrompt;