/* @flow strict-local */
import { connect } from 'react-redux';

import React, { PureComponent } from 'react';

import type { Auth, Dispatch, GlobalState, ApiServerSettings } from '../types';
import { getAuth, getSettings, getCurrentServerSettings } from '../selectors';
import { Notice, OptionRow, Screen } from '../common';
import { toggleMobilePushSettings } from '../api';
import { settingsChange } from '../actions';

type Props = {
  auth: Auth,
  dispatch: Dispatch,
  serverSettings: ApiServerSettings,
  offlineNotification: boolean,
  onlineNotification: boolean,
  streamNotification: boolean,
};

class NotificationsScreen extends PureComponent<Props> {
  props: Props;

  handleOfflineNotificationChange = () => {
    const { auth, dispatch, offlineNotification } = this.props;
    toggleMobilePushSettings({
      auth,
      opp: 'offline_notification_change',
      value: !offlineNotification,
    });
    dispatch(settingsChange('offlineNotification', !offlineNotification));
  };

  handleOnlineNotificationChange = () => {
    const { auth, dispatch, onlineNotification } = this.props;
    toggleMobilePushSettings({
      auth,
      opp: 'online_notification_change',
      value: !onlineNotification,
    });
    dispatch(settingsChange('onlineNotification', !onlineNotification));
  };

  handleStreamNotificationChange = () => {
    const { auth, dispatch, streamNotification } = this.props;
    toggleMobilePushSettings({
      auth,
      opp: 'stream_notification_change',
      value: !streamNotification,
    });
    dispatch(settingsChange('streamNotification', !streamNotification));
  };

  render() {
    const {
      offlineNotification,
      onlineNotification,
      serverSettings,
      streamNotification,
    } = this.props;

    return (
      <Screen title="Notifications">
        <Notice
          visible={serverSettings.push_notifications_enabled === false}
          text="Notifications not enabled server-side!"
        />
        <OptionRow
          label="Notifications when offline"
          defaultValue={offlineNotification}
          onValueChange={this.handleOfflineNotificationChange}
        />
        <OptionRow
          label="Notifications when online"
          defaultValue={onlineNotification}
          onValueChange={this.handleOnlineNotificationChange}
        />
        <OptionRow
          label="Stream notifications"
          defaultValue={streamNotification}
          onValueChange={this.handleStreamNotificationChange}
        />
      </Screen>
    );
  }
}

export default connect((state: GlobalState) => ({
  auth: getAuth(state),
  serverSettings: getCurrentServerSettings(state),
  offlineNotification: getSettings(state).offlineNotification,
  onlineNotification: getSettings(state).onlineNotification,
  streamNotification: getSettings(state).streamNotification,
}))(NotificationsScreen);
