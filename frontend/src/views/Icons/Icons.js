import React from "react";
// @material-ui/core components
import { withStyles, withTheme } from "@material-ui/core/styles";
import { connect } from 'react-redux';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import {getAccounts} from  '../../actions/account'
import {getQuotes} from  '../../actions/marketData'
import {getConfig, getMapping} from  '../../actions/config'
import {getMarketData} from 'reducers'
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

class MarketData extends React.Component { 
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const {user} = this.props;
    this.props.getConfig(user);
  }

  handleOnChange = (event) => {
    const {user} = this.props;
    this.props.getQuotes(user, event.target.value);
    //this.props.refreshToken(user);
  }

  render(){
    const { classes } = this.props;
    var accounts = []
    var tblQuotes = []
    var tblDepth = []
    var instruments = []
    try {
      instruments = this.props.config.mapping.symbols
    } catch (err) {

    }
    try {
      var quotes = this.props.marketData.quotes.d
      quotes.forEach(quote => {
          tblQuotes.push([quote.v.ch.toString(), quote.v.chp.toString(), quote.v.lp.toString(), quote.v.open_price.toString(), quote.v.high_price.toString(), quote.v.low_price.toString(), quote.v.prev_close_price.toString(), quote.v.volume.toString()])
        }
      )
      //tblQuotes.push([accountState.balance, accountState.equity, accountState.unrealizedPl, JSON.stringify(accountState.amData)]);
    } catch(err) {
    }
    try {
      var depth = this.props.marketData.depth.d.d;
      var asks = depth.asks;
      var bids = depth.bids;
      var maxLen = asks.length;
      for(var i=0; i< maxLen; i++){
        tblDepth.push([bids[i], asks[i]])
      }
      console.log(tblDepth);
    }
    catch(err) {
    }
    return (
          <Card>
            <CardHeader color="success">
              <h4 className={classes.cardTitleWhite}>Market Data</h4>
              <p className={classes.cardCategoryWhite}>
              Get a market data.
              </p>
            </CardHeader>
            <CardBody>
            <div>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-helper-label">Instrument</InputLabel>
            <Select
              xs={12} sm={12} md={12}
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              onChange={(event) => this.handleOnChange(event)}
            >
              {instruments.map(item => {
                return <MenuItem value={item.f[0]} key={item.f[0]}>{item.s}</MenuItem>;
              })}
            </Select>
            <FormHelperText>Select instrument</FormHelperText>
          </FormControl>       
        </div>
         
        </CardBody>
        <div>
          <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
              <Card>
                <CardHeader color="warning">
                  <h4 className={classes.cardTitleWhite}>Quotes</h4>
                  <p className={classes.cardCategoryWhite}>
                    Get current prices of the instrument.
                  </p>
                </CardHeader>
                <CardBody>
                  <Table
                    tableHeaderColor="warning"
                    tableHead={["Ch", "Chp", "Lp", "Open_price", "High_price", "Low_price", "Pre_close_price", "Volume"]}
                    tableData={tblQuotes}
                  />
                </CardBody>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                <CardHeader color="primary">
                  <h4 className={classes.cardTitleWhite}>Depth</h4>
                  <p className={classes.cardCategoryWhite}>
                  Get current depth of market for the instrument. Optional.
                  </p>
                </CardHeader>
                <CardBody>
                  <Table
                    tableHeaderColor="warning"
                    tableHead={["Bids", "Asks"]}
                    tableData={tblDepth}
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
  const {marketData} = state;
  return {
    user, 
    accounts,
    config,
    marketData
  };
}

const mapDispatchToProps = dispatch => {
  return {
    getConfig: (user) => {
      dispatch(getConfig(user))
    },
    getAccounts: (user) => {
      dispatch(getAccounts(user))
    },
    getQuotes: (user, symbol) => {
      dispatch(getQuotes(user, symbol))
    }
  }
}

const connectedMarketData = connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(MarketData));
export { connectedMarketData as MarketData };