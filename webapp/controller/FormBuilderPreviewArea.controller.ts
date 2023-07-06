import MessageBox from 'sap/m/MessageBox';
import { formBuilderState } from '../formbuilder/State';
import BaseController from './BaseController';
import Button from 'sap/m/Button';
import FlexBox from 'sap/m/FlexBox';
import VBox from 'sap/m/VBox';

export default class FormBuilderPreviewAreaController extends BaseController {
  onInit() {
    this.connectState(formBuilderState);

    formBuilderState.set({
      onBeforeRender: (_, content) => content.addItem(this.createAddNewElementButton()),
      onRenderElement: (element, context, control, elementIndex) => {
        return new VBox({
          items: [
            new FlexBox({
              justifyContent: 'End',
              items: [
                new Button({
                  icon: 'sap-icon://slim-arrow-up',
                  press: () => formBuilderState.get().moveElementUp(elementIndex),
                }).addStyleClass('sapUiTinyMarginEnd'),
                new Button({
                  icon: 'sap-icon://slim-arrow-down',
                  press: () => formBuilderState.get().moveElementDown(elementIndex),
                }).addStyleClass('sapUiTinyMarginEnd'),
                new Button({
                  icon: 'sap-icon://edit',
                  press: () => formBuilderState.get().setElementToEdit(elementIndex),
                }).addStyleClass('sapUiTinyMarginEnd'),
                new Button({
                  icon: 'sap-icon://delete',
                  press: () => formBuilderState.get().deleteElement(elementIndex),
                }),
              ],
            }).addStyleClass('sapUiTinyMarginBottom'),

            control,
            this.createAddNewElementButton(elementIndex + 1),
          ],
        });
      },
    });
  }

  createAddNewElementButton(elementIndex = 0) {
    return new FlexBox({
      justifyContent: 'Center',
      alignItems: 'Center',
      items: [
        new Button({
          text: 'Add New Element',
          type: 'Transparent',
          icon: 'sap-icon://add',
          press: () => formBuilderState.get().showAddElementDialog(elementIndex),
        }).addStyleClass('sapUiSmallMargin'),
      ],
    });
  }

  onPreviousPagePress() {
    formBuilderState.get().goBackward();
  }

  onNextPagePress() {
    formBuilderState.get().goForward();
  }

  onSubmitPress() {
    if (formBuilderState.get().submit()) {
      MessageBox.success(
        'The form would have been submitted successfully. You can see the console output for details about the final form engine state.',
        { title: 'Form Submitted Successfully' },
      );

      console.group('📄 Submitted Form state: ');
      console.info(formBuilderState.get().state);
      console.groupEnd();
    } else {
      MessageBox.error(
        'The form would not have been submitted. You can see the console output for details about the final form engine state.',
        { title: 'Form Submission Failed' },
      );

      console.group('📄 Submitted Form state: ');
      console.info(formBuilderState.get().state);
      console.groupEnd();
    }
  }
}
