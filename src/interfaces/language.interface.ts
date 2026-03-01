import { type BaseEntity } from "@/interfaces/base-entity.interface";

export interface Language extends BaseEntity {
  englishName: string;
  nativeName: string;
  code: string;
}
