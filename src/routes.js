import {createAppContainer, createStackNavigator} from 'react-navigation';

import Feed from './screens/Feed';

const Routes = createAppContainer(
  createStackNavigator({
    Feed,
  }),
);

export default Routes;
