export type Tshirt = {
  id: string;
  title: string;
  series: string;
  character: string | null;
  manufacturer: string | null;
  purchase_date: string | null;
  purchase_place: string | null;
  purchase_price: number | null;
  size: string | null;
  condition: string | null;
  memo: string | null;
  image_url: string | null;
  thumb_url: string | null;
  created_at: string;
  updated_at: string;
};

export type WearLog = {
  id: string;
  tshirt_id: string;
  worn_at: string;
  created_at: string;
};
