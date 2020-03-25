import React from "react";
// @material-ui/core components
import { withStyles } from "@material-ui/core/styles";
import { connect } from 'react-redux';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import { Redirect } from 'react-router'
import {getUpdatedToken} from 'helpers/utils'

import { getAccounts } from '../../actions/account'
import { getConfig } from '../../actions/config'
import { placeOrder } from '../../actions/trading'
import { getTradingInfor } from '../../actions/trading'

// core components
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import BugReport from "@material-ui/icons/BugReport";
import Code from "@material-ui/icons/Code";
import Cloud from "@material-ui/icons/Cloud";

import NativeSelect from '@material-ui/core/NativeSelect';
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Tasks from "components/Tasks/Tasks.js";
import CustomTabs from "components/CustomTabs/CustomTabs.js";
import { bugs, website, server } from "variables/general.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CardFooter from "components/Card/CardFooter";

const styles = {
  formControl: {
    margin: 5,
    minWidth: 200,
  },
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
      alertMessage: "",
      alertOpen: false,
      open: false,
      accountId: "",
      instrumentId: "",
      quantity: 10,
      side: "buy",
      type: "limit"
    }
  }

  componentDidMount() {
    const { user } = this.props;
    this.props.getAccounts(user);
    this.props.getConfig(user);
  }

  handleOnChange = (event) => {
    const { user } = this.props;
    this.setState(
      { accountId: event.target.value }
    )
    this.props.getTradingInfor(user, event.target.value)
  }

  handleInstrumentOnChange = (event) => {
    this.setState(
      { instrumentId: event.target.value }
    )
    //this.props.refreshToken(user);
  }

  handleClickOpen = () => {
    if (this.state.accountId == "" || this.state.instrumentId == "") {
      this.setState(
        {
          alertOpen: true,
          alertMessage: "Please select accountId and instrumentId"
        })
    } else {
      this.setState({
        open: true
      })
    }
  };

  handleClose = () => {
    this.setState({
      open: false,
    })
  };

  handlePlaceOrder = () => {
    const { user } = this.props;
    this.props.placeOrder(user, this.state)
    this.setState({
      open: false
    })
  }

  handleAlertClose = () => {
    this.setState({
      alertOpen: false,
    })
  };

  render() {
    console.log(this.props.trading)
    const { classes } = this.props;
    const { user } = this.props;
    var accounts = []
    var tblState = []
    var instruments = []
    var tblOrders = []
    try {
      var accountState = this.props.accounts.accountInfo.state.d
      tblState.push([accountState.balance, accountState.equity, accountState.unrealizedPl, JSON.stringify(accountState.amData)]);
    } catch (err) {
    }
    try {
      accounts = this.props.accounts.accounts.d
    }
    catch (err) {
      //getUpdatedToken()
    }
    try {
      instruments = this.props.config.mapping.symbols
    } catch (err) {
    }
    try {
      var orders = this.props.trading.orders.d
      orders.forEach(order => {
        tblOrders.push([order.id, order.instrument, order.qty, order.side, order.type, order.filledQty, order.avgPrice, order.limitPrice, order.stopPrice, order.parentId, order.parentType, order.duration, order.status, order.lastModified])
      })
    } catch (err) {
    }
    console.log(tblOrders);
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
                      <InputLabel htmlFor="age-native-helper">Account</InputLabel>
                      <NativeSelect
                        inputProps={{
                          name: 'age',
                          id: 'age-native-helper',
                        }}
                        onChange={(event) => this.handleOnChange(event)}
                      >
                        <option aria-label="None" value="" />
                        {accounts.map(item => {
                          return <option value={item.id} key={item.id}>{item.name}</option>;
                        })}
                      </NativeSelect>
                      <FormHelperText>Select account</FormHelperText>
                    </FormControl>
                  </GridItem>
                  <GridItem xs={4} sm={4} md={4}>
                  </GridItem>
                  <GridItem xs={3} sm={3} md={3}>
                    <FormControl className={classes.formControl}>
                      <InputLabel htmlFor="age-native-helper">Instrument</InputLabel>
                      <NativeSelect
                        inputProps={{
                          name: 'age',
                          id: 'age-native-helper',
                        }}
                        onChange={(event) => this.handleInstrumentOnChange(event)}
                      >
                        <option aria-label="None" value="" />
                        {instruments.map(item => {
                          return <option value={item.f[0]} key={item.f[0]}>{item.s}</option>;
                        })}
                      </NativeSelect>
                      <FormHelperText>Select instrument</FormHelperText>
                    </FormControl>

                  </GridItem>
                  <GridItem xs={3} sm={3} md={3}>
                  </GridItem>
                </GridContainer>
              </CardBody>
              <CardFooter>
                <div>
                  <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
                    Place Order
                  </Button>

                </div>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={12}>
           <Card>
                <CardHeader color="info">
                  <h4 className={classes.cardTitleWhite}>Orders</h4>
                </CardHeader>
                <CardBody>
                  <Table
                    tableHeaderColor="warning"
                    tableHead={["Id", "Instrument", "Qty", "Side", "Type", "FilledQty", "AvgPrice", "LimitPrice", "StopPrice", "ParentId", "ParentType", "Duration", "Status", "LastModified"]}
                    tableData={tblOrders}
                  />
                </CardBody>
              </Card>
          </GridItem>
        </GridContainer>
        <Dialog
          open={this.state.alertOpen}
          onClose={this.handleAlertClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Alert</DialogTitle>
          <DialogContent>
            {this.state.alertMessage}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleAlertClose} color="primary" autoFocus>
              Ok
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Place order</DialogTitle>
          <DialogContent>
            <GridContainer>
              <GridItem xs={12} sm={12} md={6}>
                <CustomInput
                  labelText="Account Id"
                  id="accountId"
                  formControlProps={{
                    fullWidth: true
                  }}
                  disabled="true"
                  value={this.state.accountId}
                />
              </GridItem>
              <GridItem xs={12} sm={12} md={6}>
                <CustomInput
                  labelText="Instrument Id"
                  id="instrumentId"
                  formControlProps={{
                    fullWidth: true
                  }}
                  disabled="true"
                  value={this.state.instrumentId}
                />
              </GridItem>
            </GridContainer>
            <GridContainer>
              <GridItem xs={12} sm={12} md={6}>
                <TextField
                  id="standard-number"
                  label="Quantity"
                  type="number"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={this.state.quantity}
                />
              </GridItem>
              <GridItem xs={12} sm={12} md={6}>
                <TextField
                  id="standard-number"
                  label="Side"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={this.state.side}
                />
              </GridItem>
            </GridContainer>
            <GridContainer>
              <GridItem xs={12} sm={12} md={12}>
                <CustomInput
                  labelText="Type"
                  id="city"
                  formControlProps={{
                    fullWidth: true
                  }}
                  disabled="true"
                  value={this.state.type}
                />
              </GridItem>
            </GridContainer>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
                </Button>
            <Button onClick={this.handlePlaceOrder} color="primary">
              Ok
                </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { accounts } = state;
  const { config } = state;
  const { user } = state.auth;
  const { trading } = state
  return {
    user,
    accounts,
    config,
    trading
  };
}

const mapDispatchToProps = dispatch => {
  return {
    getAccounts: (user) => {
      dispatch(getAccounts(user))
    },
    getConfig: (user) => {
      dispatch(getConfig(user))
    },
    placeOrder: (user, order) => {
      dispatch(placeOrder(user, order))
    },
    getTradingInfor: (user, accountId) => {
      dispatch(getTradingInfor(user, accountId))
    }
  }
}
const connectedMaps = connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Maps));
export { connectedMaps as Maps };