import React from "react";
// @material-ui/core components
import { withStyles } from "@material-ui/core/styles";
import { connect } from 'react-redux';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import { getAccounts } from '../../actions/account'
import { getAccountInfo } from '../../actions/account'
// core components
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import { getConfig, getMapping } from '../../actions/config'
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Tasks from "components/Tasks/Tasks.js";
import CustomTabs from "components/CustomTabs/CustomTabs.js";
import { bugs, website, server } from "variables/general.js";
import NativeSelect from '@material-ui/core/NativeSelect';

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

class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accountId: "",
      instrumentId: ""
    }
  }

  componentDidMount() {
    const { user } = this.props;
    this.props.getAccounts(user);
    this.props.getConfig(user);
  }

  handleOnChange = (event) => {
    const { user } = this.props;
    this.setState({
      accountId: event.target.value
    })
    this.props.getAccountInfo(user, event.target.value, this.state.instrumentId);
  }

  handleOnInstrumentChange = (event) => {
    const { user } = this.props;
    this.setState({
      instrumentId: event.target.value
    })
    if (this.state.accountId != "") {
      this.props.getAccountInfo(user, this.state.accountId, event.target.value);
    }
  }

  render() {
    const { classes } = this.props;
    var accounts = []
    var tblState = []
    var tblInstruments = []
    var tblOrders = []
    var tblPositions = []
    var tblOrdersHistory = []
    var listInstruments = []
    var tblExecutions = []
    try {
      var accountState = this.props.accounts.accountInfo.state.d
      tblState.push([accountState.balance, accountState.equity, accountState.unrealizedPl, JSON.stringify(accountState.amData)]);
    } catch (err) {
    }
    try {
      accounts = this.props.accounts.accounts.d
    }
    catch (err) {
    }
    try {
      var instruments = this.props.accounts.accountInfo.instruments.d
      instruments.forEach(instrument => {
        tblInstruments.push([instrument.name, instrument.description, instrument.minQty, instrument.maxQty, instrument.qtyStep, instrument.pipSize, instrument.pipValue, instrument.minTick, instrument.lotSize, instrument.baseCurrency, instrument.quoteCurrency, instrument.marginRate, instrument.type])
      }
      )
    } catch (err) {
    }
    try {
      var orders = this.props.accounts.accountInfo.orders.d
      orders.forEach(order => {
        tblOrders.push([order.id, order.instrument, order.qty, order.side, order.type, order.filledQty, order.avgPrice, order.limitPrice, order.stopPrice, order.parentId, order.parentType, order.duration, order.status, order.lastModified])
      }
      )
    } catch (err) {
    }
    try {
      var positions = this.props.accounts.accountInfo.positions.d
      positions.forEach(position => {
        tblPositions.push([position.id, position.instrument, position.qty, position.side, position.avgPrice, position.unrealizedPl, JSON.stringify(position.customFields)])
      }
      )
    } catch (err) {
    }
    try {
      var ordersHistory = this.props.accounts.accountInfo.ordersHistory.d
      ordersHistory.forEach(order => {
        tblOrdersHistory.push([order.id, order.instrument, order.qty, order.side, order.type, order.filledQty, order.avgPrice, order.limitPrice, order.stopPrice, order.parentId, order.parentType, order.duration, order.status, order.lastModified])
      }
      )
    } catch (err) {
    }
    try {
      listInstruments = this.props.config.mapping.symbols
    } catch (err) {
    }
    try {
      var executions = this.props.accounts.accountInfo.d
      executions.forEach(position => {
        tblExecutions.push([position.id, position.instrument, position.price, position.time, position.qty, position.side])
      })
    } catch (err) {
    }
    return (
      <Card>
        <CardHeader color="success">
          <h4 className={classes.cardTitleWhite}>Accounts</h4>
          <p className={classes.cardCategoryWhite}>
            Get a list of accounts owned by the user.
              </p>
        </CardHeader>
        <CardBody>
          <GridContainer>
            <GridItem xs={12} sm={12} md={6}>
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
            <GridItem xs={12} sm={12} md={6}>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="age-native-helper">Instrument</InputLabel>
                <NativeSelect
                  inputProps={{
                    name: 'age',
                    id: 'age-native-helper',
                  }}
                  onChange={(event) => this.handleOnInstrumentChange(event)}
                >
                  <option aria-label="None" value="" />
                  {listInstruments.map(item => {
                    return <option value={item.f[0]} key={item.f[0]}>{item.s}</option>;
                  })}
                </NativeSelect>
                <FormHelperText>Select instrument</FormHelperText>
              </FormControl>
            </GridItem>
          </GridContainer>
        </CardBody>
        <div>
          <GridContainer>
            <GridItem xs={12} sm={12} md={6}>
              <Card>
                <CardHeader color="warning">
                  <h4 className={classes.cardTitleWhite}>State</h4>
                  <p className={classes.cardCategoryWhite}>
                    Get account information.
                  </p>
                </CardHeader>
                <CardBody>
                  <Table
                    tableHeaderColor="warning"
                    tableHead={["Balance", "Equity", "UnrealizedPl", "AmData"]}
                    tableData={tblState}
                  />
                </CardBody>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={12} md={6}>
              <Card>
                <CardHeader color="warning">
                  <h4 className={classes.cardTitleWhite}>Executions</h4>
                  <p className={classes.cardCategoryWhite}>
                    Get the orders that were executed during the current session for the account. It is expected that BSC returns orders filled/cancelled/rejected during current session.
                    </p>
                </CardHeader>
                <CardBody>
                  <Table
                    tableHeaderColor="warning"
                    tableHead={["Id", "Instrument", "Price", "Time", "Qty", "Side"]}
                    tableData={tblExecutions}
                  />
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                <CardHeader color="info">
                  <h4 className={classes.cardTitleWhite}>Orders</h4>
                  <p className={classes.cardCategoryWhite}>
                    Get current session orders for the account. It also includes working orders from previous sessions. Filled/cancelled/rejected orders should be included in the list till the end of the session.
                  </p>
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
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                <CardHeader color="primary">
                  <h4 className={classes.cardTitleWhite}>Orders History</h4>
                  <p className={classes.cardCategoryWhite}>
                    Get order history for an account. It is expected that returned orders will have a final status (rejected, filled, cancelled) </p>
                </CardHeader>
                <CardBody>
                  <Table
                    tableHeaderColor="warning"
                    tableHead={["Id", "Instrument", "Qty", "Side", "Type", "FilledQty", "AvgPrice", "LimitPrice", "StopPrice", "ParentId", "ParentType", "Duration", "Status", "LastModified"]}
                    tableData={tblOrdersHistory}
                  />
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem xs={12} sm={12} md={6}>
              <Card>
                <CardHeader color="primary">
                  <h4 className={classes.cardTitleWhite}>Positions</h4>
                  <p className={classes.cardCategoryWhite}>
                    Get positions for an account.
                  </p>
                </CardHeader>
                <CardBody>
                  <Table
                    tableHeaderColor="warning"
                    tableHead={["Id", "Instrument", "Qty", "Side", "AvgPrice", "UnrealizedPnl", "CustomFields"]}
                    tableData={tblPositions}
                  />
                </CardBody>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={12} md={6}>
              <Card>
                <CardHeader color="primary">
                  <h4 className={classes.cardTitleWhite}>Executions</h4>
                  <p className={classes.cardCategoryWhite}>
                    Get the orders that were executed during the current session for the account. It is expected that BSC returns orders filled/cancelled/rejected during current session.
                  </p>
                </CardHeader>
                <CardBody>
                  <Table
                    tableHeaderColor="warning"
                    tableHead={["Id", "Instrument", "Qty", "Side", "AvgPrice", "UnrealizedPnl", "CustomFields"]}
                    tableData={tblPositions}
                  />
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                <CardHeader color="warning">
                  <h4 className={classes.cardTitleWhite}>Instruments</h4>
                  <p className={classes.cardCategoryWhite}>
                    Get the list of the instruments that are available for trading with the specified account.
                  </p>
                </CardHeader>
                <CardBody>
                  <Table
                    tableHeaderColor="warning"
                    tableHead={["Name", "Description", "MinQty", "MaxQty", "QtyStep", "PipSize", "PipValue", "MinTick", "LotSize", "Base Currency", "Quote Currency", "Margin rate", "Type"]}
                    tableData={tblInstruments}
                  />
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
      </Card>
    );
  }
}

function mapStateToProps(state) {
  const { accounts } = state;
  const { user } = state.auth;
  const { config } = state;
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
    },
    getAccountInfo: (user, accountId, instrumentId) => {
      dispatch(getAccountInfo(user, accountId, instrumentId))
    }
  }
}

const connectedAccount = connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Account));
export { connectedAccount as Account };