import { MSGraphClient } from "@microsoft/sp-http";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { convertCyrillicToOdata } from "./odataCyrillycConverter";

export const imageToSiteAssetsUploader = async (
  context: WebPartContext,
  listName: string,
  file: File,
  callback: (listAssetsFolderName) => void
) => {
  const client = await context.msGraphClientFactory.getClient();
  getAssetsDriveId(client, listName, getListAssetsFolderName, file, callback);
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
            console.log("FFFFFFFFFFFFFFFFFFFFf", listAssetsFolderName);
          }
        );
      } else {
        console.log(dto);
        if (value[field] !== "") dto[fieldName] = value[field];
      }
    }
  }
  setTimeout(
    () =>
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
      ),
    10000
  );
};

const getAssetsDriveId = (
  client: MSGraphClient,
  listName,
  getListAssetsFolderName,
  file,
  callback
) => {
  let id: string;
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
      console.log(data.value.find((drive) => drive.name == "Site Assets").id);

      id = data.value.find((drive) => drive.name == "Site Assets").id;
      getListAssetsFolderName(
        client,
        listName,
        id,
        imagePutter,
        file,
        callback
      );
    }
  );

  return id;
};

const getListAssetsFolderName = (
  client: MSGraphClient,
  listName: string,
  id,
  imagePutter,
  file,
  callback
) => {
  let dataValue: string;
  console.log(`/sites/root/lists('${listName}')/id`);
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
        dataValue = data.value;
        imagePutter(client, id, dataValue, file, callback);
      }
    );
};

const imagePutter = (
  client: MSGraphClient,
  assetsDriveId,
  listAssetsFolderName,
  file,
  callback
) => {
  console.log(
    `drives/${assetsDriveId}/root:/Lists/${listAssetsFolderName}/${file.name}:/content`
  );

  client
    .api(
      `drives/${assetsDriveId}/root:/Lists/${listAssetsFolderName}/${file.name}:/content`
    )
    .header("Content-Type", "image/*")
    .put(file, callback(listAssetsFolderName));
};

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
