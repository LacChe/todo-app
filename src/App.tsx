import { IonApp, IonFab, IonFabButton, IonIcon, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import './App.css';
import Menu from './components/Menu';
import { Redirect, Route } from 'react-router';
import { add } from 'ionicons/icons';
import { useContext } from 'react';
import { Context } from './dataManagement/ContextProvider';

setupIonicReact();

const App: React.FC = () => {
  const { currentProjectId } = useContext(Context);
  return (
    <IonApp>
      <IonFab
        className={['settings', 'search'].includes(currentProjectId) ? 'hidden' : ''}
        vertical="bottom"
        horizontal="end"
      >
        <IonFabButton onClick={() => document.getElementById('open-add-task-modal')?.click()}>
          <IonIcon icon={add}></IonIcon>
        </IonFabButton>
      </IonFab>
      <IonReactRouter>
        <IonRouterOutlet>
          {/*
          <Route exact path="/">
            <div>login / data loading</div>
          </Route>
        */}
          <Route exact path="/">
            <Redirect to="/app" />
          </Route>
          <Route path="/app" component={Menu} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
