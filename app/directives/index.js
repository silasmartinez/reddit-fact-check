/**
 * Created by silasmartinez on 8/3/15.
 */

export default ngModule => {
  require('./hello/my-hello')(ngModule);
  require('./posts/post-list')(ngModule);
  require('./post/post-view')(ngModule);
  require('./page-heading/page-heading')(ngModule);
  require('./reddits/reddit-list')(ngModule);
};
