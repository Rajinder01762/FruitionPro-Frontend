import { action } from '../../../store/actions/action'
import { SELECT_ORGANIZATION } from '../../../store/actionTypes';

export const selectOrganization = (body) => action({
  types : [SELECT_ORGANIZATION.REQUEST,SELECT_ORGANIZATION.SUCCESS],
  payload : {
    request : {
      url: 'organization/create',
      data : body,
      method : 'POST'
    }
  }
});