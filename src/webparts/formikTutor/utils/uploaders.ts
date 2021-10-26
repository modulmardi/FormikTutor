import { MSGraphClient } from "@microsoft/sp-http";
import { WebPartContext } from "@microsoft/sp-webpart-base";

export const imageToSiteAssetsUploader = async (
  context: WebPartContext,
  listName: string,
  fileName: string,
  file: File
) => {
  const client = await context.msGraphClientFactory.getClient();
  const listAssetsFolderName = await getListAssetsFolderName(client, listName);
  const assetsDriveId = await getAssetsDriveId(client);
  await client
    .api(
      `drives/${assetsDriveId}/root:/Lists/${listAssetsFolderName}/${fileName}:/content`
    )
    .header("Content-Type", "image/*")
    .put(file)
    .then((value) => {
      console.log(value);
    });
};

export const valuesToListUploader = (context: WebPartContext,) => {};

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
