import React from "react";
// @material-ui/core components
import { withStyles } from "@material-ui/core/styles";
import { connect } from 'react-redux';
import _ from 'lodash';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import { Redirect } from 'react-router'
import { getUpdatedToken } from 'helpers/utils'
import { formatDatetime } from 'helpers/utils'
import { getAccounts } from '../../actions/account'
import { checkToken } from '../../actions/auth'
import { getConfig } from '../../actions/config'
import { placeOrder } from '../../actions/trading'
import { getTradingInfor } from '../../actions/trading'
import { cancelOrder } from '../../actions/trading'
import { editOrder } from '../../actions/trading'
import { closePosition } from '../../actions/trading'
// core components
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import MaterialTable from 'material-table';

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
      order: {
        accountId: "",
        instrument: "",
        qty: 10,
        side: "buy",
        type: "market",
        limitPrice: undefined,
        stopPrice: undefined,
        durationType: undefined,
        durationDateTime: undefined,
        stopLoss: undefined,
        takeProfit: undefined,
        requestId: undefined,
      },
      position: {
        accountId: "",
        positionId: undefined,
        stopLoss: undefined,
        takeProfit: undefined
      },
      deleteId: "",
      action: "",
      orderColumns: [
        { title: 'Id', field: 'id' },
        { title: 'Instrument', field: 'instrument' },
        { title: 'Qty', field: 'qty', type: 'numeric' },
        { title: 'Side', field: 'side' },
        { title: 'Type', field: 'type' },
        { title: 'FilledQty', field: 'filledQty', type: 'numeric' },
        { title: 'AvgPrice', field: 'avgPrice', type: 'numeric' },
        { title: 'LimitPrice', field: 'limitPrice', type: 'numeric' },
        { title: 'StopPrice', field: 'stopPrice', type: 'numeric' },
        { title: 'ParentId', field: 'parentId', type: 'numeric' },
        { title: 'Duration', field: 'duration', type: 'numeric' },
        { title: 'Status', field: 'status' },
        {
          field: 'lastModified',
          title: 'LastModified',
          render: rowData => formatDatetime(rowData.lastModified)
        }
      ],
      positionColumns: [
        { title: 'Id', field: 'id' },
        { title: 'Instrument', field: 'instrument' },
        { title: 'Qty', field: 'qty', type: 'numeric' },
        { title: 'Side', field: 'side' },
        { title: 'AvgPrice', field: 'avgPrice' },
        { title: 'UnrealizedPl', field: 'unrealizedPl', type: 'numeric' },
        { title: 'CustomFields', field: 'customFields1', type: 'string' },
        { title: 'TableData', field: 'tableData1'},
      ],
      data: [
      ]
    }
  }

  componentDidMount() {
    const { user } = this.props;
    this.props.checkToken(user);
    this.props.getAccounts(user);
    this.props.getConfig(user);
  }

  handleOnChange = (event) => {
    const { user } = this.props;
    this.state.order.accountId = event.target.value;
    this.setState(
      { order: this.state.order }
    )
    this.props.getTradingInfor(user, event.target.value)
  }

  handleInstrumentOnChange = (event) => {
    this.state.order.instrument = event.target.value;
    this.setState(
      { order: this.state.order }
    )
    //this.props.refreshToken(user);
  }

  handleClickOpen = () => {
    if (this.state.order.accountId == "" || this.state.order.instrument == "") {
      this.setState(
        {
          alertOpen: true,
          alertMessage: "Please select account and instrument"
        })
    } else {
      this.setState({
        open: true,
        action: "place"
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
    var callback = (data) => {

      if (data.order_status.s == "error") {

        this.setState({
          open: false,
          alertOpen: true,
          alertMessage: data.order_status.errmsg
        })
      } else {
        this.setState({
          open: false,
          alertOpen: true,
          alertMessage: this.state.action + " order successfully"
        })
      }
    }
    if (this.state.action == "place"){
      this.props.placeOrder(user, this.state.order, callback)
    } else {
      this.props.editOrder(user, this.state.order, callback)
    }
    this.setState({
      open: false
    })
  }

  handleFormChange = (field, event) => {
    this.state.order[field] = event.target.value;
    
    this.setState({
      order: this.state.order
      }
    )
  }

  handleAlertClose = () => {
    const { user } = this.props;
    if (this.state.action == "delete") {
      var callback = (data) => {

         if (data.order_status.s == "error") {

          this.setState({
            open: false,
            alertOpen: true,
            alertMessage: data.order_status.errmsg
          })
        } else {
          this.setState({
            open: false,
            alertOpen: true,
            alertMessage: "Cancel order successfully"
          })
        }
      }
      this.setState({
        action: ""
      })
      this.props.cancelOrder(user, this.state.order.accountId, this.state.order.orderId, callback)
    } else if (this.state.action == "close"){
      var callback = (data) => {
        if (data.position_status.s == "error") {

         this.setState({
           open: false,
           alertOpen: true,
           alertMessage: data.position_status.errmsg
         })
       } else {
         this.setState({
           open: false,
           alertOpen: true,
           alertMessage: "close position successfully"
         })
       }
     }
     this.setState({
       action: ""
     })
     this.props.closePosition(user, this.state.order.accountId, this.state.position.positionId, callback)      
    }
    this.setState({
      alertOpen: false,
    })

    this.props.getTradingInfor(user, this.state.order.accountId)
  };

  render() {
    const { classes } = this.props;
    const { user } = this.props;
    const { orderStatus } = this.props.trading;
    var accounts = []
    var tblState = []
    var instruments = []
    var tblOrders = []
    var tblPositions = [];
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
        tblOrders.push([order.id, order.instrument, order.qty, order.side, order.type, order.filledQty, order.avgPrice, order.limitPrice, order.stopPrice, order.parentId, order.duration, order.status, formatDatetime(order.lastModified)])
      })
    } catch (err) {
    }
    try {
      var positions = this.props.trading.positions.d
      positions.forEach(position => {
        tblPositions.push([position.id, position.instrument, position.qty, position.side, position.avgPrice, position.unrealizedPl, position.customFields])
      })
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
                <MaterialTable
                  title="Orders"
                  columns={this.state.orderColumns}
                  data={orders}
                  actions={[
                    {
                      icon: 'edit',
                      tooltip: 'Edit order',
                      onClick: (event, rowData) => {
                        var accountId = this.state.order.accountId;
                        this.state.order = _.clone(rowData);
                        this.state.order.accountId = accountId;
                        this.state.order.orderId = rowData.id;
                        this.setState({
                          action: "edit",
                          order: this.state.order,
                          open: true
                        })
                      }
                    },
                    {
                      icon: 'delete',
                      tooltip: 'Delete order',
                      onClick: (event, rowData) => {
                        this.state.order.orderId = rowData.id;
                        this.setState({
                          action: "delete",
                          order: this.state.order,
                          alertOpen: true,
                          alertMessage: "Do you want to cancel order: " + rowData.id.toString()
                        })
                      }
                    }
                  ]}
                />
              </CardBody>
            </Card>
          </GridItem> 
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>Positions</h4>
              </CardHeader>
              <CardBody>
                <MaterialTable
                  title="Positions"
                  columns={this.state.positionColumns}
                  data={positions}
                  actions={[
                    {
                      icon: 'close',
                      tooltip: 'Close position',
                      onClick: (event, rowData) => {
                        this.state.position.positionId = rowData.id;
                        this.setState({
                          action: "close",
                          position: this.state.position,
                          alertOpen: true,
                          alertMessage: "Do you want to close position: " + rowData.id.toString()
                        })
                      }
                    }
                  ]}
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
          <DialogTitle id="form-dialog-title">{this.state.action} order</DialogTitle>
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
                  value={this.state.order.accountId}
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
                  value={this.state.order.instrument}
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
                  onChange={(event) => this.handleFormChange("qty", event)}
                  value={this.state.order.qty}
                />
              </GridItem>
              <GridItem xs={12} sm={12} md={6}>
                <InputLabel htmlFor="age-native-helper">Side</InputLabel>
                <NativeSelect
                  inputProps={{
                    name: 'side',
                    id: 'side-native-helper',
                  }}
                  onChange={(event) => this.handleFormChange("side", event)}
                  value={this.state.order.side}
                >
                  <option key="buy" value="buy" >Buy</option>
                  <option key="sell" value="sell" >Sell</option>
                </NativeSelect>
              </GridItem>
            </GridContainer>
            <GridContainer>  
              <GridItem xs={12} sm={12} md={6}>
                <InputLabel htmlFor="age-native-helper">Type</InputLabel>
                <NativeSelect
                  inputProps={{
                    name: 'type',
                    id: 'type-native-helper',
                  }}
                  onChange={(event) => this.handleFormChange("type", event)}
                  value={this.state.order.type}
                >
                  <option key="market" value="market" >market</option>
                  <option key="stop" value="stop" >stop</option>
                  <option key="limit" value="limit" >limit</option>
                  <option key="stoplimit" value="stoplimit" >stoplimit</option>
                </NativeSelect>
              </GridItem>
            </GridContainer>
            <GridContainer>
              <GridItem xs={12} sm={12} md={6}>
                <TextField
                  id="standard-number"
                  label="LimitPrice"
                  type="number"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={(event) => this.handleFormChange("limitPrice", event)}
                  value={this.state.order.limitPrice}
                />
              </GridItem>
              <GridItem xs={12} sm={12} md={6}>
                <TextField
                  id="standard-number"
                  label="StopPrice"
                  type="number"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={(event) => this.handleFormChange("stopPrice", event)}
                  value={this.state.order.stopPrice}
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
    checkToken: (user) => {
      dispatch(checkToken(user))
    },
    getConfig: (user) => {
      dispatch(getConfig(user))
    },
    placeOrder: (user, order, callback) => {
      dispatch(placeOrder(user, order, callback))
    },
    editOrder: (user, order, callback) => {
      dispatch(editOrder(user, order, callback))
    },
    cancelOrder: (user, accountId, orderId, callback) => {
      dispatch(cancelOrder(user, accountId, orderId, callback))
    },
    closePosition: (user, accountId, positionId, callback) => {
      dispatch(closePosition(user, accountId, positionId, callback))
    },
    getTradingInfor: (user, accountId) => {
      dispatch(getTradingInfor(user, accountId))
    }
  }
}
const connectedMaps = connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Maps));
export { connectedMaps as Maps };