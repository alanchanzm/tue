import { ASSET_TYPES } from '@/shared/constants';

function initAssetRegisters(Vue: Vue) {
  for (let type of ASSET_TYPES) {
    Vue[type] = function() {};
  }
}

export { initAssetRegisters };
