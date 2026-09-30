import {withCapture,shellHtml} from './capture.mjs';
await withCapture({fixture:'runtime-suite.js',html:await shellHtml('<div id="runtimeFixtureRoot"></div>')},async({waitFor,capture,evaluate})=>{
 await waitFor('window.suiteReady');await capture('workbench-test-suite');
 await evaluate("testSuiteFixtureApp.openLocation({profileId:1,view:'profile'})");await capture('workbench-test-suite-profile');
});
