import {dependencyManager} from './dependency-manager';

export type AutorunDisposer = () => void;

export function autorun(handler: Function): AutorunDisposer {
  let dispose = false;

  let handlerWrapper = (): void => {
    if (!dispose) {
      handler();
    }
  };

  dependencyManager.beginCollect(handlerWrapper);
  handlerWrapper();
  dependencyManager.endCollect();

  let disposer: AutorunDisposer = () => {
    dispose = true;
  };

  return disposer;
}
