import React from "react";
// @material-ui/core components
import { withStyles } from "@material-ui/core/styles";
import { connect } from 'react-redux';
import {getConfig, getMapping} from  '../../actions/config'
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0"
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF"
    }
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1"
    }
  }
};

class TableList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentDidMount() {
    const {user} = this.props;
    this.props.getConfig(user);
  }

  render(){
    const {classes} = this.props;
    const {config} = this.props;
    
    var accountManager = []
    var durations = []
    var pullingInterval = []
    var symbols = []
    var fields = []

    var tblAccountManager = [];
    var tblDuration = [];
    var tblPullingInterval = []
    var tblSymbols = [];

    try {
      accountManager = config.config.d.accountManager
      durations = config.config.d.durations
      pullingInterval = config.config.d.pullingInterval

      symbols = config.mapping.symbols
      fields = config.mapping.field

      accountManager.forEach(account => {
        tblAccountManager.push([account.id, account.title, JSON.stringify(account.columns)])
      });
      
      durations.forEach(duration => {
        tblDuration.push([duration.id, duration.title, JSON.stringify(duration.columns)])
      });
 
      tblPullingInterval = [[pullingInterval.accountManager, pullingInterval.history, pullingInterval.orders, pullingInterval.postions, pullingInterval.quotes]]
    
      symbols.forEach(symbol =>{
        tblSymbols.push([symbol.s, JSON.stringify(symbol.f)])
      })
    }
    catch(err) {
    }
    
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Configuration</h4>
              <p className={classes.cardCategoryWhite}>
                Get localized configuration.
              </p>
            </CardHeader>
            <CardBody>
              <h4>Account Manager</h4>
              <Table
                tableHeaderColor="primary"
                tableHead={["Id", "Title", "Columns"]}
                tableData={tblAccountManager}
              />
              <h4>Duration</h4>
              <Table
                tableHeaderColor="primary"
                tableHead={["Id", "Title", "Columns"]}
                tableData={tblDuration}
              />
              <h4>Pulling Interval</h4>
              <Table
                tableHeaderColor="primary"
                tableHead={["Account Manager", "History", "Orders", "Positions", "Quotes"]}
                tableData={tblPullingInterval}
              />
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader plain color="primary">
              <h4 className={classes.cardTitleWhite}>
                Mapping
              </h4>
              <p className={classes.cardCategoryWhite}>
              Return all BSC instruments.
              </p>
            </CardHeader>
            <CardBody>
              <Table
                tableHeaderColor="primary"
                tableHead={["ID", "Name"]}
                tableData={tblSymbols}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}

function mapStateToProps(state) {
  const { user } = state.auth;
  const { config } = state;
  return {
      user,
      config
  };
}

const mapDispatchToProps = dispatch => {
  return {
    getConfig: (user) => {
      dispatch(getConfig(user))
    },
    getMapping: (user) => {
      dispatch(getMapping(user))
    }
  }
}

const connectedTableList = connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(TableList));
export { connectedTableList as TableList };