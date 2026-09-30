import { withCapture } from './capture.mjs';
const scenes = ['home','account','connect','azure','github','mcp-apis','configuration','logs','neutral-home','neutral-configuration'];
await withCapture({fixture:'setup-fixture.js'}, async ({evaluate,waitFor,capture}) => {
  await waitFor('window.websiteSetupReady');
  for(const scene of scenes){
    const metrics=await evaluate(`websiteSetup.open(${JSON.stringify(scene)})`);
    if(metrics.errors.length)throw new Error(JSON.stringify(metrics.errors));
    await capture('workbench-'+scene);
  }
});
