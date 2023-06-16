import { CompanyInterface } from 'interfaces/company';
import { GetQueryInterface } from 'interfaces';

export interface MaterialInterface {
  id?: string;
  finis_code: string;
  description: string;
  sourcing_provider: string;
  availability: boolean;
  company_id?: string;
  created_at?: any;
  updated_at?: any;

  company?: CompanyInterface;
  _count?: {};
}

export interface MaterialGetQueryInterface extends GetQueryInterface {
  id?: string;
  finis_code?: string;
  description?: string;
  sourcing_provider?: string;
  company_id?: string;
}
