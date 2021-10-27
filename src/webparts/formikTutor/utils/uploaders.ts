import { MSGraphClient } from "@microsoft/sp-http";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { convertCyrillicToOdata } from "./odataCyrillycConverter";

export const imageToSiteAssetsUploader = async (
  context: WebPartContext,
  listName: string,
  file: File
) => {
  const client = await context.msGraphClientFactory.getClient();
  const listAssetsFolderName = await getListAssetsFolderName(client, listName);
  const assetsDriveId = await getAssetsDriveId(client);
  await client
    .api(
      `drives/${assetsDriveId}/root:/Lists/${listAssetsFolderName}/${file.name}:/content`
    )
    .header("Content-Type", "image/*")
    .put(file)
    .then((value) => {
      console.log(value);
    });
  return listAssetsFolderName;
};

export const valuesToListUploader = async (
  context: WebPartContext,
  listName: string,
  value: object,
  mapper: {}
) => {
  let dto: { [field: string]: string };

  for (const field in mapper) {
    if (Object.prototype.hasOwnProperty.call(mapper, field)) {
      let fieldName = convertCyrillicToOdata(mapper[field]);
      if (value[field] instanceof File) {
        const file = value[field] as File;
        const listAssetsFolderName = imageToSiteAssetsUploader(
          context,
          listName,
          file
        );
        dto[fieldName] = `
        "type":"thumbnail",
        "fileName":"${file.name}",
        "nativeFile":{},
        "fieldName":"image",
        "serverUrl":"${
          context.pageContext.site.absoluteUrl.match(/https:\/\/.*\.com/)[0]
        }",
        "serverRelativeUrl":"/SiteAssets/Lists/${listAssetsFolderName}/${
          file.name
        }"`;
      } else dto[fieldName] = value[field];
    }
  }
  const client = await context.msGraphClientFactory.getClient();
  await client
    .api(`/sites/root/lists/%${listName}/items`)
    .header("Content-Type", "application/json")
    .put({
      fields: dto,
    })
    .then((value) => {
      console.log(value);
    });
};

const getAssetsDriveId = async (client: MSGraphClient) => {
  try {
    return await client
      .api(`/sites/root/drives?select=weburl,system,name,id`)
      .get(
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
          return data.value.find((drive) => drive.name == "Site Assets").id;
        }
      );
  } catch (getAssetsDriveIdError) {
    console.log(getAssetsDriveIdError);
  }
};
async function getListAssetsFolderName(
  client: MSGraphClient,
  listName: string
) {
  try {
    return await client
      .api(`/sites/root/lists/${listName}/id`)
      .get(
        (
          getListAssetsFolderNameError,
          data: { "@odata.context": string; value: string }
        ) => {
          if (getListAssetsFolderNameError) {
            throw getListAssetsFolderNameError;
          }
          return data.value;
        }
      );
  } catch (getListAssetsFolderNameError) {
    console.log(getListAssetsFolderNameError);
  }
}
