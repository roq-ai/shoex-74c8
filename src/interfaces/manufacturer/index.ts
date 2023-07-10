import { QualityControlInterface } from 'interfaces/quality-control';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface ManufacturerInterface {
  id?: string;
  description?: string;
  image?: string;
  name: string;
  created_at?: any;
  updated_at?: any;
  user_id: string;
  tenant_id: string;
  quality_control?: QualityControlInterface[];
  user?: UserInterface;
  _count?: {
    quality_control?: number;
  };
}

export interface ManufacturerGetQueryInterface extends GetQueryInterface {
  id?: string;
  description?: string;
  image?: string;
  name?: string;
  user_id?: string;
  tenant_id?: string;
}
