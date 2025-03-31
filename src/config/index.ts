import { tools } from './tools';
import { models } from './models';
import { menus } from './menus';

const IntroductionPrimaryKeys = ['tools', 'models'];

const IntroductionSecondaryKeys = [
  ...Object.keys(tools),
  ...Object.keys(models),
];

export {
  tools,
  models,
  menus,
  IntroductionPrimaryKeys,
  IntroductionSecondaryKeys,
};
