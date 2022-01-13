import { patch } from '@vizality/patcher';
import { getModule } from '@vizality/webpack';

export default (Module, ...PatchArgs) => {
  if (Module instanceof Function.bind()) {
    const openContextMenuLazy = patch(getModule(m => m.openContextMenuLazy), 'openContextMenuLazy', args => {
      const _function = args[1];
      args[1] = async (...args) => {
        const func = await _function(...args);

        const _Module = Module();
        if (_Module) {
          openContextMenuLazy();

          patch(_Module, ...PatchArgs);
        }

        return func;
      };
    }, 'before');
  } else {
    console.warn(Module, 'is not a bound function');
  }
};
