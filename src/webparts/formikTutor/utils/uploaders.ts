import { WebPartContext } from "@microsoft/sp-webpart-base";

export const imageToSiteAssetsUploader = (
  context: WebPartContext,
  listName: string,
  fileName: string,
  file: File
) => {
  let listAssetsFolderName: string;
  let assetsDriveId: string;
  context.msGraphClientFactory
    .getClient()
    .then((client) => {
      client
        .api(`/sites/root/lists/${listName}/id`)
        .get(
          (
            getListAssetsFolderNameError,
            data: { "@odata.context": string; value: string }
          ) => {
            if (getListAssetsFolderNameError) {
              throw getListAssetsFolderNameError;
            }
            listAssetsFolderName = data.value;
          }
        )
        .then(() =>
          client
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
                assetsDriveId = data.value.find(
                  (drive) => drive.name == "Site Assets"
                ).id;
              }
            )
            .then(() =>
              client
                .api(
                  `drives/${assetsDriveId}/root:/Lists/${listAssetsFolderName}/${fileName}:/content`
                )
                .header("Content-Type", "image/*")
                .put(file)
            )
        );
    })
    .catch((error) => console.log(error));
};

export const valuesToListUploader = () => {};
