import {execFileSync} from 'node:child_process';
import {join} from 'node:path';
import {here} from './capture.mjs';
for(const script of ['capture-setup.mjs','capture-code.mjs','capture-runtime.mjs','capture-suite.mjs','capture-performance.mjs','capture-annotation.mjs','manifest.mjs']) {
 console.log(`\nRunning ${script}`);
 execFileSync(process.execPath,[join(here,script)],{stdio:'inherit',env:process.env});
}
