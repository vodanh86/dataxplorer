import React from 'react';
import queryString from 'query-string';
import { Menu } from '../_components';
import Navbar from "../components/Navbars/Navbar.js";
import Footer from "../components/Footer/Footer.js";
import Sidebar from "../components/Sidebar/Sidebar.js";
import { connect } from 'react-redux';
import { userActions } from '../_actions';
import {updateToken} from  '../actions/auth'
import logo from "../assets/img/reactlogo.png";
import bgImage from "../assets/img/sidebar-2.jpg";
import routes from "../routes.js";
import { withStyles } from "@material-ui/core/styles";
import { Switch, Route, Redirect } from "react-router-dom";
import styles from "../assets/jss/material-dashboard-react/layouts/adminStyle.js";

const switchRoutes = (
  <Switch>
    {routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      }
      return null;
    })}
    <Redirect from="/" to="/admin/dashboard" />
  </Switch>
);

class Admin extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        image: bgImage,
        color: "blue"
      }
    }
    componentDidMount() {
        //this.props.dispatch(userActions.getAll());
    }

    render() {
        const { user } = this.props;
        //const [image, setImage] = React.useState(bgImage);
        let params = queryString.parse(this.props.location.search);
        const { classes } = this.props;
        const handleDrawerToggle = () => {
        //  setMobileOpen(!mobileOpen);
        };
        const mainPanel = React.createRef();
        const getRoute = () => {
          return window.location.pathname !== "/admin/maps";
        };
        //const [mobileOpen, setMobileOpen] = React.useState(false);
        //const [color, setColor] = React.useState("blue");
        if(params.code) {
          this.props.updateToken(user, params.code);
        } 
        return (
            <div className={classes.wrapper}>
              <Sidebar
                routes={routes}
                logoText={"Hi, " + user.firstName}
                logo={logo}
                image={this.state.image}
                handleDrawerToggle={handleDrawerToggle}
                //open={mobileOpen}
                color={this.state.color}
              />
              <div className={classes.mainPanel} ref={mainPanel}>
                <Navbar
                  routes={routes}
                  handleDrawerToggle={handleDrawerToggle}
                />
                {/* On the /maps route we want the map to be on full screen - this is not possible if the content and conatiner classes are present because they have some paddings which would make the map smaller */}
                {getRoute() ? (
                  <div className={classes.content}>
                    <div className={classes.container}>{switchRoutes}</div>
                  </div>
                ) : (
                  <div className={classes.map}>{switchRoutes}</div>
                )}
                {getRoute() ? <Footer /> : null}
              </div>
            </div>
          )
    }
}

function mapStateToProps(state) {
  const { user } = state.auth;
  return {
      user
  };
}

const mapDispatchToProps = dispatch => {
  return {
    updateToken: (user, code) => {
      dispatch(updateToken(user, code))
    }
  }
}

const connectedAdmin = connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Admin));
export { connectedAdmin as Admin };
