# Simple template based report generator
1. Uses mark down for defining the template
2. Uses special fields DATE, NAME, DOB, GENDER, MARRIED for
   special values like age, he/his/him, Mr/Ms/Mrs.
3. Use special fields for date formatting YYYY, YY, MMM, MM,
   Do, DD, ddd, dddd, etc.
4. Use suffix for displaying list values as ordered(1.) or
   unordered(*) list.
5. Use suffix for formatting number (#:0.0)

## Notes
1. All data is stored in local storage
2. Template is divided into `markdown` and `structure` in
   `config` key.
   (array of field definitions)
3. Record id is incremented serially, based on the last
   entered record.
4. `records` key keep track of all the record ids
5. Each record is stored with `rec-<num>` key.
