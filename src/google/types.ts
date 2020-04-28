export type Field = {
  type: string,
}

export type FieldInfo<T extends Field> = {
  /**
   * The developerMetadataId stored in the sheet to identify
   * the column for this particular field
   */
  id: number,

  /**
   * The column number associated with this field on the spreadsheet
   */
  column: number,

  /**
   * The name of the field as given by the user
   */
  name: string,

  /**
   * The field definition object
   */
  def: T,
};

export type Fields = Array<FieldInfo<any>>;

export type Record = {
  _id?: number,
  [fieldName: string]: any,
}
