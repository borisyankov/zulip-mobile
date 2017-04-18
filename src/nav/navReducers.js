/* @flow */
import type { NavigationState, Action } from '../types';
import { navigateToAccountPicker, navigateBack } from './navActions';
import AppNavigator from './AppNavigator';
import {
  INIT_ROUTES,
  INITIAL_FETCH_COMPLETE,
  ACCOUNT_SWITCH,
  SET_AUTH_TYPE,
  LOGIN_SUCCESS,
  LOGOUT,
} from '../constants';

const firstAction = AppNavigator.router.getActionForPathAndParams('loading');
const tempNavState = AppNavigator.router.getStateForAction(firstAction);
const secondAction = AppNavigator.router.getActionForPathAndParams('main');
const initialState = AppNavigator.router.getStateForAction(
  secondAction,
  tempNavState,
);

// const initialState = {
//   index: 0,
//   routes: [
//     { key: 'main', routeName: 'main' },
//     { key: 'loading', routeName: 'loading' },
//   ],
// };

export default (state: NavigationState = initialState, action: Action): NavigationState => {
  switch (action.type) {
    case INIT_ROUTES:
      return state;
  //     return StateUtils.reset(
  //       state,
  //       action.routes.map(route => ({ key: route }))
  //     );
    case ACCOUNT_SWITCH:
      return state;
  //     return StateUtils.reset(
  //       state,
  //       [{ key: 'main' }]
  //     );
    case SET_AUTH_TYPE:
      return state;
    case LOGIN_SUCCESS:
    case INITIAL_FETCH_COMPLETE:
      return AppNavigator.router.getStateForAction(navigateBack(), state);
    case LOGOUT: {
      return AppNavigator.router.getStateForAction(
        navigateToAccountPicker(),
        state,
      );
    }
    default:
      return AppNavigator.router.getStateForAction(action, state);
  }
};
