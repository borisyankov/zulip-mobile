/* @flow */
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { NOT_FOUND_USER } from '../constants';
import type { Auth } from '../types';
import boundActions from '../boundActions';
import { getAuth } from '../account/accountSelectors';
import { Screen } from '../common';
import AccountDetails from './AccountDetails';
import { getCurrentRoute } from '../nav/routingSelectors';


class AccountDetailsScreen extends Component {

  props: {
    auth: Auth,
    email: string,
    avatarUrl: string,
    users: Object[],
    orientation: string,
    fetchMessages: () => void,
    doNarrow: (string) => void,
    popRoute: (string) => void,
  };
  user: Object;

  componentWillMount() {
    // props.email gets reset during navigation slide out (on back)
    // so we cache value to prevent an exception
    this.user = this.props.users.find(x => x.email === this.props.email) || NOT_FOUND_USER;
  }

  render() {
    const { auth, fetchMessages, doNarrow, navigateBack, orientation } = this.props;
    const { email, fullName, avatarUrl, status } = this.user;
    const title = {
      text: '{_}',
      values: {
        _: this.user.fullName,
      },
    };

    return (
      <Screen title={title}>
        <AccountDetails
          auth={auth}
          fullName={fullName}
          email={email}
          avatarUrl={avatarUrl}
          status={status}
          fetchMessages={fetchMessages}
          doNarrow={doNarrow}
          navigateBack={navigateBack}
          orientation={orientation}
        />
      </Screen>
    );
  }
}

export default connect(
  (state) => ({
    auth: getAuth(state),
    users: state.users,
    email: getCurrentRoute(state).data,
    orientation: state.app.orientation
  }),
  boundActions,
)(AccountDetailsScreen);
