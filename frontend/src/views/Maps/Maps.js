import React from "react";
// @material-ui/core components
import { withStyles } from "@material-ui/core/styles";
import { connect } from 'react-redux';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import {getAccounts} from  '../../actions/account'
import {getConfig} from  '../../actions/config'
// core components
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import BugReport from "@material-ui/icons/BugReport";
import Code from "@material-ui/icons/Code";
import Cloud from "@material-ui/icons/Cloud";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Tasks from "components/Tasks/Tasks.js";
import CustomTabs from "components/CustomTabs/CustomTabs.js";
import { bugs, website, server } from "variables/general.js";

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CardFooter from "components/Card/CardFooter";

const styles = {
  typo: {
    paddingLeft: "25%",
    marginBottom: "40px",
    position: "relative"
  },
  note: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    bottom: "10px",
    color: "#c0c1c2",
    display: "block",
    fontWeight: "400",
    fontSize: "13px",
    lineHeight: "13px",
    left: "0",
    marginLeft: "20px",
    position: "absolute",
    width: "260px"
  },
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  }
};

class Maps extends React.Component { 
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      accountID: "",
      instrumentID: ""
    }
  }

  componentDidMount() {
    const {user} = this.props;
    this.props.getAccounts(user);
    this.props.getConfig(user);
  }

  handleOnChange = (event) => {
    const {user} = this.props;
    this.setState(
      {accountID: event.target.value}
    )
    //this.props.refreshToken(user);
  }

  handleInstrumentOnChange = (event) => {
    const {user} = this.props;
    this.setState(
      {instrumentID: event.target.value}
    )
    //this.props.refreshToken(user);
  }

  handleClickOpen = () => {
    this.setState({
      open: true
    })
  };

  handleClose = () => {
    this.setState({
      open: false,
    })
  };

  render(){
    const { classes } = this.props;
    var accounts = []
    var tblState = []
    var instruments = []
    try {
      var accountState = this.props.accounts.accountInfo.state.d
      tblState.push([accountState.balance, accountState.equity, accountState.unrealizedPl, JSON.stringify(accountState.amData)]);
    } catch(err) {
    }
    try {
      accounts = this.props.accounts.accounts.d
    }
    catch(err) {
    }
    try {
      instruments = this.props.config.mapping.symbols
    } catch (err) {
    }
    return (
        <div>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
                <Card>
                  <CardHeader color="success">
                    <h4 className={classes.cardTitleWhite}>Accounts</h4>
                    <p className={classes.cardCategoryWhite}>
                    Get a list of accounts owned by the user.
                    </p>
                  </CardHeader>
                  <CardBody>
                    <GridContainer>
                    <GridItem xs={2} sm={2} md={2}>
                      <FormControl className={classes.formControl}>
                        <InputLabel id="demo-simple-select-helper-label">Account</InputLabel>
                          <Select
                            xs={12} sm={12} md={12}
                            labelId="demo-simple-select-helper-label"
                            id="demo-simple-select-helper"
                            onChange={(event) => this.handleOnChange(event)}
                          >
                          {accounts.map(item => {
                            return <MenuItem value={item.id} key={item.id}>{item.name}</MenuItem>;
                          })}
                        </Select>
                        <FormHelperText>Select account</FormHelperText>
                      </FormControl>  
                    </GridItem>
                    <GridItem xs={4} sm={4} md={4}>
                        <h5>Account id: {this.state.accountID}</h5>
                    </GridItem>
                    <GridItem xs={3} sm={3} md={3}>
                    <FormControl className={classes.formControl}>
                        <InputLabel id="demo-simple-select-helper-label">Instrument</InputLabel>
                          <Select
                            xs={12} sm={12} md={12}
                            labelId="demo-simple-select-helper-label"
                            id="demo-simple-select-helper"
                            onChange={(event) => this.handleInstrumentOnChange(event)}
                          >
                          {instruments.map(item => {
                            return <MenuItem value={item.f[0]} key={item.f[0]}>{item.s}</MenuItem>;
                          })}
                        </Select>
                        <FormHelperText>Select account</FormHelperText>
                      </FormControl>  
                    </GridItem>
                    <GridItem xs={3} sm={3} md={3}>
                    <h5>Instrument id: {this.state.instrumentID}</h5>
                    </GridItem>
                    </GridContainer>
                        
                  </CardBody>
                  <CardFooter>
                      <div>
                        <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
                          Place Order
                        </Button>
                        <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
                          <DialogTitle id="form-dialog-title">Place order</DialogTitle>
                          <DialogContent>
                            <DialogContentText>
                              Place a new order.
                            </DialogContentText>
                            <TextField
                              autoFocus
                              margin="dense"
                              id="name"
                              label="Email Address"
                              type="email"
                              fullWidth
                            />
                          </DialogContent>
                          <DialogActions>
                            <Button onClick={this.handleClose} color="primary">
                              Cancel
                            </Button>
                            <Button onClick={this.handleClose} color="primary">
                              Ok
                            </Button>
                          </DialogActions>
                        </Dialog>
                      </div>
                  </CardFooter>
                </Card>
            </GridItem>
          </GridContainer>    
      </div>  
    );
  }
}

function mapStateToProps(state) {
  console.log(state)
  const { accounts } = state;
  const { config } = state;
  const { user } = state.auth;
  return {
    user, 
    accounts,
    config
  };
}

const mapDispatchToProps = dispatch => {
  return {
    getAccounts: (user) => {
      dispatch(getAccounts(user))
    },
    getConfig: (user) => {
      dispatch(getConfig(user))
    }
  }
}
const connectedMaps = connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Maps));
export { connectedMaps as Maps };