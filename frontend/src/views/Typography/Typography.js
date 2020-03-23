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
import {getAccountInfo} from  '../../actions/account'
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
  }

  componentDidMount() {
    const {user} = this.props;
    this.props.getAccounts(user);
  }

  handleOnChange = (event) => {
    const {user} = this.props;
    this.props.getAccountInfo(user, event.target.value);
    //this.props.refreshToken(user);
  }

  render(){
    const { classes } = this.props;
    var accounts = []
    var tblState = []
    var tblInstruments = []
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
      var instruments = this.props.accounts.accountInfo.instruments.d
      instruments.forEach( instrument => {
        tblInstruments.push([instrument.name, instrument.description, instrument.minQty, instrument.maxQty, instrument.qtyStep, instrument.pipSize, instrument.pipValue, instrument.minTick, instrument.lotSize, instrument.baseCurrency, instrument.quoteCurrency, instrument.marginRate, instrument.type])
      }
      )
    } catch (err) {

    }
    console.log(accountState);
    return (
          <Card>
            <CardHeader color="success">
              <h4 className={classes.cardTitleWhite}>Accounts</h4>
              <p className={classes.cardCategoryWhite}>
              Get a list of accounts owned by the user.
              </p>
            </CardHeader>
            <CardBody>
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
              <CustomTabs
                title="Account:"
                headerColor="primary"
                tabs={[
                  {
                    tabName: "Orders",
                    tabIcon: BugReport,
                    tabContent: (
                      <Tasks
                        checkedIndexes={[0, 3]}
                        tasksIndexes={[0, 1, 2, 3]}
                        tasks={bugs}
                      />
                    )
                  },
                  {
                    tabName: "Positions",
                    tabIcon: Code,
                    tabContent: (
                      <Tasks
                        checkedIndexes={[0]}
                        tasksIndexes={[0, 1]}
                        tasks={website}
                      />
                    )
                  },
                  {
                    tabName: "Executions",
                    tabIcon: Cloud,
                    tabContent: (
                      <Tasks
                        checkedIndexes={[1]}
                        tasksIndexes={[0, 1, 2]}
                        tasks={server}
                      />
                    )
                  },
                  {
                    tabName: "Orders History",
                    tabIcon: Cloud,
                    tabContent: (
                      <Tasks
                        checkedIndexes={[1]}
                        tasksIndexes={[0, 1, 2]}
                        tasks={server}
                      />
                    )
                  }
                ]}
              />
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
  return {
    user, 
    accounts
  };
}

const mapDispatchToProps = dispatch => {
  return {
    getAccounts: (user) => {
      dispatch(getAccounts(user))
    },
    getAccountInfo: (user, accountId) => {
      dispatch(getAccountInfo(user, accountId))
    }
  }
}

const connectedAccount = connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Account));
export { connectedAccount as Account };