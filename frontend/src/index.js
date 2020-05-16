import './index.css';
import * as serviceWorker from './serviceWorker';
import render from "./render";
import state from "./state";
render(state);

serviceWorker.unregister();
