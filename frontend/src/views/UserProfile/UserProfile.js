import React from "react";
// @material-ui/core components
import { withStyles } from "@material-ui/core/styles";
import { connect } from 'react-redux';
import InputLabel from "@material-ui/core/InputLabel";
import {refreshToken} from  '../../actions/auth'
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import avatar from "assets/img/faces/marc.jpg";

const styles = {
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

class UserProfile extends React.Component { 
  constructor(props) {
    super(props);
  }

  handleRefreshClick = (user) => {
    this.props.refreshToken(user);
  }

  render(){
    const { classes } = this.props;
    const { user } = this.props;
    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color="success">
                <h4 className={classes.cardTitleWhite}>Edit Profile</h4>
                <p className={classes.cardCategoryWhite}>Complete your profile</p>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}> 
                    <CustomInput
                      labelText="Username"
                      id="username"
                      formControlProps={{
                        fullWidth: true
                      }}
                      disabled="true"
                      value={user.firstName}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Email address"
                      id="email-address"
                      formControlProps={{
                        fullWidth: true
                      }}
                      disabled="true"
                      value={user.email}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <CustomInput
                      labelText="Token"
                      id="first-name"
                      formControlProps={{
                        fullWidth: true
                      }}
                      disabled="true"
                      value={user.bsc_token}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <CustomInput
                      labelText="Expired date"
                      id="city"
                      formControlProps={{
                        fullWidth: true
                      }}
                      disabled="true"
                      value={user.expires_in}
                    />
                  </GridItem>
                </GridContainer>
              </CardBody>
              <CardFooter>
                <Button color="primary" onClick={() => { window.location.href = process.env.REACT_APP_AUTH_URL}}>Update Token</Button>
                <Button color="primary" onClick={() => this.handleRefreshClick(user)}>Refresh Token</Button>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
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
    refreshToken: (user) => {
      dispatch(refreshToken(user))
    }
  }
}

const connectedUserProfile = connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(UserProfile));
export { connectedUserProfile as UserProfile };