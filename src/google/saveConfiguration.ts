import { GOOGLE_DRIVE_API_KEY } from "./constants";
import { Field, FieldInfo } from './types';

export async function addFields<T extends Field>(spreadsheetId: string, fields: Array<{ name: string, column: number, def: T }>): Promise<Array<FieldInfo<T>>> {
  const res = await gapi.client.sheets.spreadsheets.batchUpdate({
    key: GOOGLE_DRIVE_API_KEY,
    spreadsheetId,
    resource: {
      requests: fields.map(fieldInfo => ({
        createDeveloperMetadata: {
          developerMetadata: {
            location: {
              dimensionRange: {
                sheetId: 0,
                dimension: 'COLUMNS',
                startIndex: fieldInfo.column,
                endIndex: fieldInfo.column + 1,
              },
            },
            metadataKey: fieldInfo.name,
            metadataValue: JSON.stringify(fieldInfo.def),
            visibility: 'PROJECT',
          },
        },
      })),
    },
  });

  // @ts-ignore
  return res.result.replies.map((reply) => {
    // @ts-ignore
    const metadata = reply.createDeveloperMetadata.developerMetadata;
    return {
      // @ts-ignore
      id: metadata.metadataId,
      // @ts-ignore
      name: metadata.metadataKey,
      // @ts-ignore
      column: metadata.location.dimensionRange.startIndex,
      // @ts-ignore
      def: JSON.parse(metadata.metadataValue),
    };
  });

  // // @ts-ignore
  // const fieldId = res.result.replies[0].createDeveloperMetadata.developerMetadata.metadataId as number;
  // return {
  //   id: fieldId,
  //   column,
  //   def,
  // };
}

export async function updateField<T extends Field>(spreadsheetId: string, info: FieldInfo<T>) {
  const res = await gapi.client.sheets.spreadsheets.batchUpdate({
    key: GOOGLE_DRIVE_API_KEY,
    spreadsheetId,
    resource: {
      requests:[
        {
          updateDeveloperMetadata: {
            developerMetadata: {
              metadataId: info.id,
              location: {
                dimensionRange: {
                  sheetId: 0,
                  dimension: 'COLUMNS',
                  startIndex: info.column,
                  endIndex: info.column + 1,
                },
              },
              metadataKey: info.name,
              metadataValue: JSON.stringify(info.def),
              visibility: 'PROJECT',
            },
          },
        },
      ],
    },
  });
  console.log('Result', res.result);
}

export async function removeField(spreadsheetId: string, id: number) {
  await gapi.client.sheets.spreadsheets.batchUpdate({
    key: GOOGLE_DRIVE_API_KEY,
    spreadsheetId,
    resource: {
      requests: [
        {
          deleteDeveloperMetadata: {
            dataFilter: {
              developerMetadataLookup: {
                metadataId: id,
              },
            },
          }
        }
      ]
    }
  })
};

// export async function saveConfiguration(spreadsheetId: string, configuration: Configuration) {
//   // Save the configuration information as developer metadata
//   await gapi.client.sheets.spreadsheets.batchUpdate({
//     spreadsheetId,
//     resource: {
//       requests: [
//         {
//           updateDeveloperMetadata: {
//             developerMetadata: {
//               metadataId: 1,
//               metadataKey: 'config',
//               metadataValue: JSON.stringify(configuration),
//               visibility: 'PROJECT',
//             },
//           },
//         },
//       ]
//     }
//   });
// }
