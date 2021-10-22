import { Version } from "@microsoft/sp-core-library";
import {
  IPropertyPaneConfiguration
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import * as strings from "FormikTutorWebPartStrings";
import * as React from "react";
import * as ReactDom from "react-dom";
import FormikTutorApp from "./components/FormikTutorApp";
import { IFormikTutorProps } from "./components/IFormikTutorProps";

export interface IFormikTutorWebPartProps {
  description: string;
}

export default class FormikTutorWebPart extends BaseClientSideWebPart<IFormikTutorWebPartProps> {
  public render(): void {
    const element: React.ReactElement<IFormikTutorProps> = React.createElement(
      FormikTutorApp,
      {
        //description: this.properties.description
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription,
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                // PropertyPaneTextField("description", {
                //   label: strings.DescriptionFieldLabel,
                // }),
              ],
            },
          ],
        },
      ],
    };
  }
}