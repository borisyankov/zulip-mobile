/* @flow */
import { NotificationsAndroid, PendingNotifications } from 'react-native-notifications';

import type { Auth, Actions } from '../types';
import config from '../config';
import { registerPush } from '../api';
import { logErrorRemotely } from '../utils/logging';
import { getNarrowFromNotificationData } from './notificationsCommon';

export const addNotificationListener = (notificationHandler: (notification: Object) => void) => {
  NotificationsAndroid.setNotificationOpenedListener(notificationHandler);
};

export const removeNotificationListener = (
  notificationHandler: (notification: Object) => void,
) => {};

export const initializeNotifications = (auth: Auth, saveTokenPush: Actions.saveTokenPush) => {
  NotificationsAndroid.setRegistrationTokenUpdateListener(async deviceToken => {
    try {
      const result = await registerPush(auth, deviceToken);
      saveTokenPush(deviceToken, result.msg, result.result);
    } catch (e) {
      logErrorRemotely(e, 'failed to register GCM');
    }
  });
};

export const refreshNotificationToken = () => {
  NotificationsAndroid.refreshToken();
};

export const handlePendingNotifications = (notificationData: Object, actions: Actions) => {
  if (!notificationData || !notificationData.getData) {
    return;
  }

  const data = notificationData.getData();
  config.startup.notification = data;
  if (data) {
    actions.doNarrow(getNarrowFromNotificationData(data), data.zulip_message_id);
  }
};

export const handleInitialNotification = async (actions: Actions) => {
  const data = await PendingNotifications.getInitialNotification();
  handlePendingNotifications(data, actions);
};
