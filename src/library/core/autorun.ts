import {dependencyManager} from './dependency-manager';

export function autorun(handler: Function): void {
  dependencyManager.beginCollect(handler);
  handler();
  dependencyManager.endCollect();
}
