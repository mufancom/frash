import {dependencyManager} from './dependency-manager';

export type AutorunDisposer = () => void;

export function autorun(this: any, runnable: Function): AutorunDisposer {
  let dispose = false;

  let handlerWrapper = {
    handler: (): void => {
      if (!dispose) {
        dependencyManager.beginCollect(handlerWrapper.handler, handlerWrapper);
        runnable();
        dependencyManager.endCollect();
      }
    },
  };

  handlerWrapper.handler();

  let disposer: AutorunDisposer = () => {
    dispose = true;
  };

  return disposer;
}
