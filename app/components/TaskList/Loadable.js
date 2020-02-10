/**
 *
 * Asynchronously loads the component for TaskList
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
