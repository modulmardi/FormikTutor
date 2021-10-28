import { MSGraphClient } from "@microsoft/sp-http";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { convertCyrillicToOdata } from "./odataCyrillycConverter";

export const imageToSiteAssetsUploader = (
  context: WebPartContext,
  listName: string,
  file: File,
  callback: (listAssetsFolderName) => void
) => {
  let listAssetsFolderName: any;
  let assetsDriveId: any;

  context.msGraphClientFactory
    .getClient()
    .then((client: MSGraphClient): MSGraphClient => {
      client
        .api(`/sites/root/lists('${listName}')/id`)
        .get(
          (
            getListAssetsFolderNameError,
            data: { "@odata.context": string; value: string }
          ) => {
            if (getListAssetsFolderNameError) {
              throw getListAssetsFolderNameError;
            }
            console.log("1_1,", listAssetsFolderName, assetsDriveId);
            listAssetsFolderName = data.value;
            return client;
          }
        );
      return client;
    })
    .then((client: MSGraphClient): MSGraphClient => {
      client.api(`/sites/root/drives?select=weburl,system,name,id`).get(
        (
          getAssetsDriveIdError,
          data: {
            "@odata.context": string;
            value: {
              id: string;
              name: string;
              webUrl: string;
              system: object;
            }[];
          }
        ) => {
          if (getAssetsDriveIdError) {
            throw getAssetsDriveIdError;
          }
          console.log(
            data.value.find((drive) => drive.name == "Site Assets").id
          );
          console.log("2_1,", listAssetsFolderName, assetsDriveId);

          assetsDriveId = data.value.find(
            (drive) => drive.name == "Site Assets"
          ).id;
          return client;
        }
      );
      return client;
    })
    .then((client: MSGraphClient): void => {
      console.log("3_1,", listAssetsFolderName, assetsDriveId);

      client
        .api(
          `drives/b!fIkjxDG0pUigdi3jehr6aQ096O3ruPFHqLWrxY6OU-MDPFAQ2AvrQ4etL8kCOrYc/root:/Lists/42d011e6-5077-4888-8148-e856c0b9a5ff/${file.name}:/content`
        )
        .header("Content-Type", "image/*")
        .put(file)
        .then((value) => {
          console.log("RRRRRRRRRRRRRRRRRRRRRRRRRRRRRR", value);
        });
    })
    .then(() => {console.log(';;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;',listAssetsFolderName); callback(listAssetsFolderName)});
};

export const valuesToListUploader = (
  context: WebPartContext,
  listName: string,
  value: object,
  mapper: {}
) => {
  let dto: any = {};
  const odataColumnMap = new Map<string, number>();
  for (const field in mapper) {
    if (Object.prototype.hasOwnProperty.call(mapper, field)) {
      let fieldName = convertCyrillicToOdata(mapper[field]);
      odataColumnMap.set(fieldName, odataColumnMap.get(fieldName) + 1 || 0);
      fieldName += odataColumnMap.get(fieldName)
        ? odataColumnMap.get(fieldName) - 1
        : "";
      if (value[field] instanceof File) {
        const file = value[field] as File;
        imageToSiteAssetsUploader(
          context,
          listName,
          file,
          (listAssetsFolderName) => {
            dto[fieldName] = `{"type":"thumbnail","fileName":"${
              file.name
            }","nativeFile":{},"fieldName":"${fieldName}","serverUrl":"${
              context.pageContext.site.absoluteUrl.match(/https:\/\/.*\.com/)[0]
            }","serverRelativeUrl":"/SiteAssets/Lists/${listAssetsFolderName}/${
              file.name
            }"}`;
            console.log(dto, value);
            console.log('FFFFFFFFFFFFFFFFFFFFf', listAssetsFolderName);

          }
        );
      } else {
        console.log(dto);
        if (value[field] !== "") dto[fieldName] = value[field];
      }
    }
  }
  context.msGraphClientFactory.getClient().then((client) =>
    client
      .api(`/sites/root/lists/${listName}/items`)
      .header("Content-Type", "application/json")
      .post({
        fields: dto,
      })
      .then((value) => {
        console.log(value);
      })
  );
};

// const getAssetsDriveId = async (client: MSGraphClient) => {
//   await client.api(`/sites/root/drives?select=weburl,system,name,id`).get(
//     (
//       getAssetsDriveIdError,
//       data: {
//         "@odata.context": string;
//         value: {
//           id: string;
//           name: string;
//           webUrl: string;
//           system: object;
//         }[];
//       }
//     ) => {
//       if (getAssetsDriveIdError) {
//         throw getAssetsDriveIdError;
//       }
//       console.log(data.value.find((drive) => drive.name == "Site Assets").id);

//       return data.value.find((drive) => drive.name == "Site Assets").id;
//     }
//   );
// };

// const getListAssetsFolderName: = async (
//   client: MSGraphClient,
//   listName: string
// ) => {
//   return await client
//     .api(`/sites/root/lists('${listName}')/id`)
//     .get(
//       (
//         getListAssetsFolderNameError,
//         data: { "@odata.context": string; value: string }
//       ) => {
//         if (getListAssetsFolderNameError) {
//           throw getListAssetsFolderNameError;
//         }
//         return data.value;
//       }
//     );
// };

/*


{
    "fields": {
        "Title": "Имя",
        "_x0412__x043e__x0437__x0440__x04": 1,
        "E_x002d_mail": "lol@mail.ru",
        "Password": "qwer",
        "_x0414__x0430__x0442__x0430__x04": "2021-10-28T07:00:00Z",
        "photo":
         ""type":"thumbnail","fileName":"изображение_2021-10-27_211212.png","nativeFile":{},"fieldName":"image","serverUrl":"https://marachdv.sharepoint.com","serverRelativeUrl":"/SiteAssets/Lists/undefined/изображение_2021-10-27_211212.png""



        "{"fileName":"qwer.png","serverRelativeUrl":"/SiteAssets/Lists/42d011e6-5077-4888-8148-e856c0b9a5ff/qwer.png","id":"3bf105ac-ea5a-4d27-9630-64da8552c61b","serverUrl":"https://marachdv.sharepoint.com","thumbnailRenderer":{"spItemUrl":"https://marachdv.sharepoint.com:443/_api/v2.1/drives/b!fIkjxDG0pUigdi3jehr6aQ096O3ruPFHqLWrxY6OU-MDPFAQ2AvrQ4etL8kCOrYc/items/01QMGXWGNMAXYTWWXKE5GZMMDE3KCVFRQ3","fileVersion":1,"sponsorToken":"L0xpc3RzL1NPa3xwaG90b3wx"},"type":"thumbnail","fieldName":"photo"}"
    }
}
*/
