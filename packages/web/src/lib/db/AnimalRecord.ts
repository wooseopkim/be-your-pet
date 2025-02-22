type Required =
  | "age"
  | "orgNm"
  | "sexCd"
  | "careNm"
  | "kindCd"
  | "weight"
  | "careTel"
  | "colorCd"
  | "popfile"
  | "careAddr"
  | "chargeNm"
  | "filename"
  | "happenDt"
  | "neuterYn"
  | "noticeNo"
  | "noticeEdt"
  | "noticeSdt"
  | "officetel"
  | "desertionNo"
  | "happenPlace"
  | "specialMark"
  | "processState";
type Optional = "noticeComment";

export type AnimalRecord = {
  id: number;
  body: Record<Required, string> & Record<Optional, string | undefined>;
};
