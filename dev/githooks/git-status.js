/* eslint-disable */
/**
 * Gets common git status info
 */

const ChildProcess = require('child_process');
const Moment = require('moment');
const Exec = command => ChildProcess.execSync(command).toString();

const branch = Exec(`git rev-parse --abbrev-ref HEAD`);
const commit = {
  hash: Exec(`git log --pretty=format:"%H" -1`),
  full: Exec(`git log -1`),
  message: Exec(`git log --pretty=format:"%B" -1`),
  time: Moment(Exec(`git show -s --format=%ct -1`), 'X'),
};
const now = Moment();

module.exports = {
  branch,
  commit,
  now,
};
