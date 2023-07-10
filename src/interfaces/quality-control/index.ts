import { ManufacturerInterface } from 'interfaces/manufacturer';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface QualityControlInterface {
  id?: string;
  status: string;
  comments?: string;
  manufacturer_id?: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;

  manufacturer?: ManufacturerInterface;
  user?: UserInterface;
  _count?: {};
}

export interface QualityControlGetQueryInterface extends GetQueryInterface {
  id?: string;
  status?: string;
  comments?: string;
  manufacturer_id?: string;
  user_id?: string;
}
