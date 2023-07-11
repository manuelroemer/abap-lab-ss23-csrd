/* eslint-disable @typescript-eslint/no-this-alias */
import Tree from 'sap/m/Tree';
import Control from 'sap/ui/core/Control';
import RenderManager from 'sap/ui/core/RenderManager';
import { FormSchemaExpressionOrPrimitive, FormSchemaExpressionType } from '../formengine/Schema';
import { State, createState } from '../utils/State';
import Context from 'sap/ui/model/Context';
import CustomTreeItem from 'sap/m/CustomTreeItem';
import HBox from 'sap/m/HBox';
import Input from 'sap/m/Input';
import { isPrimitive } from '../formengine/SchemaUtils';
import Select from 'sap/m/Select';
import ListItem from 'sap/ui/core/ListItem';
import FlexItemData from 'sap/m/FlexItemData';
import StepInput from 'sap/m/StepInput';
import CheckBox from 'sap/m/CheckBox';

interface ExpressionTreeEditorState {
  items: {
    // This is nested because sap.m.Tree doesn't feel like rendering top-level items.
    root: ExpressionTreeItem;
  };
  types: Array<{
    type: ExtendedExpressionType;
    displayName: string;
  }>;
}

interface ExpressionTreeItem {
  itemId: number;
  type?: ExtendedExpressionType;
  id?: string;
  value?: any;
  left?: ExpressionTreeItem;
  right?: ExpressionTreeItem;
  expression?: ExpressionTreeItem;
}

/**
 * Extends the form schema expression types with all supported primitive types.
 * Necessary for the editor, e.g., for the type selects.
 */
type ExtendedExpressionType = FormSchemaExpressionType | 'null' | 'string' | 'number' | 'boolean';

/**
 * A custom control which leverages the `sap.m.Tree` to display an editor-like tree that modifies
 * {@link FormSchemaExpressionOrPrimitive} objects.
 *
 * The internal `sap.m.Tree` uses data-binding for displaying the tree items because that seems
 * to be the only way to add/update/remove tree items. It doesn't, for example, work via the
 * `tree.addItem(...)` method.
 * @namespace csrdreporting.controls
 */
export default class ExpressionTreeEditor extends Control {
  static readonly metadata = {
    properties: {
      expressionTree: { type: 'any', defaultValue: null },
    },
    aggregations: {
      _tree: { type: 'sap.m.Tree', multiple: false, visibility: 'hidden' },
    },
  };

  static renderer = (rm: RenderManager, control: ExpressionTreeEditor) => {
    rm.openStart('div', control);
    rm.openEnd();
    rm.renderControl(control.getTree());
    rm.close('div');
  };

  private lastItemId = 0;
  private state!: State<ExpressionTreeEditorState>;

  private getTree() {
    return this.getAggregation('_tree') as Tree;
  }

  init() {
    this.state = createState<ExpressionTreeEditorState>(
      () => ({
        items: {
          root: { itemId: this.nextItemId(), type: 'null' },
        },
        types: [
          { type: 'null', displayName: 'null' },
          { type: 'string', displayName: 'string' },
          { type: 'number', displayName: 'number' },
          { type: 'boolean', displayName: 'boolean' },
          { type: 'value', displayName: 'value' },
          { type: 'ref', displayName: 'ref' },
          { type: 'not', displayName: '! (not)' },
          { type: 'and', displayName: '&& (and)' },
          { type: 'or', displayName: '|| (or)' },
          { type: 'eq', displayName: '== (eq)' },
          { type: 'ne', displayName: '!= (ne)' },
          { type: 'lt', displayName: '< (lt)' },
          { type: 'le', displayName: '<= (le)' },
          { type: 'gt', displayName: '> (gt)' },
          { type: 'ge', displayName: '>= (ge)' },
        ],
      }),
      { name: 'ExpressionTreeEditor' },
    );

    const tree = new Tree({ showNoData: false }).expandToLevel(Number.MAX_SAFE_INTEGER);
    tree.setModel(this.state.model);
    tree.bindAggregation('items', { path: '/items', factory: this.treeItemFactory.bind(this) });
    this.setAggregation('_tree', tree);
  }

  setExpressionTree(expressionTree?: FormSchemaExpressionOrPrimitive | null) {
    this.setProperty('expressionTree', expressionTree);
    this.state.set({
      items: {
        root: this.mapExpressionToTreeItem(expressionTree),
      },
    });
  }

  treeItemFactory(id: string, context: Context): Control {
    const treeItem = context.getObject() as ExpressionTreeItem;

    const handleTypeChange = (nextType: ExtendedExpressionType) => {
      this.replaceItem(treeItem.itemId, (previous) => {
        // This handler must, essentially, create an entirely new tree item when called.
        // This is because the different types are largely incompatible.
        // Subtrees can only be kept for compatible operators (unary/binary).
        if (nextType === 'null') {
          return { itemId: previous.itemId, type: 'null' };
        }

        if (nextType === 'string') {
          return { itemId: previous.itemId, type: 'string', value: '' };
        }

        if (nextType === 'number') {
          return { itemId: previous.itemId, type: 'number', value: 0 };
        }

        if (nextType === 'boolean') {
          return { itemId: previous.itemId, type: 'boolean', value: false };
        }

        if (nextType === 'value' || nextType === 'ref') {
          return { itemId: previous.itemId, type: nextType, id: '' };
        }

        if (nextType === 'not') {
          return {
            itemId: previous.itemId,
            type: 'not',
            expression: {
              itemId: this.nextItemId(),
              type: 'null',
            },
          };
        }

        return {
          ...previous,
          type: nextType,
          left: previous.left ?? { itemId: this.nextItemId(), type: 'null' },
          right: previous.right ?? { itemId: this.nextItemId(), type: 'null' },
        };
      });
    };

    const handleValueChange = (nextValue: string) => {
      this.replaceItem(treeItem.itemId, (previous) => ({ ...previous, value: nextValue }));
    };

    const handleIdChange = (nextValue: string) => {
      this.replaceItem(treeItem.itemId, (previous) => ({ ...previous, id: nextValue }));
    };

    return new CustomTreeItem(id, {
      content: new HBox({
        width: '100%',
        items: [
          new Select({
            selectedKey: treeItem.type,
            change: (e) => handleTypeChange(e.getParameter('selectedItem').getKey()),
          })
            .bindItems({
              path: '/types',
              template: new ListItem()
                .bindProperty('key', { path: 'type' })
                .bindProperty('text', { path: 'displayName' }),
            })
            .addStyleClass('sapUiTinyMarginEnd'),

          new Input({
            value: `${treeItem.id}`,
            visible: 'id' in treeItem,
            change: (e) => handleIdChange(e.getParameter('value')),
          }).setLayoutData(new FlexItemData({ growFactor: 1 })),

          new Input({
            value: `${treeItem.value}`,
            visible: 'value' in treeItem && (treeItem.type === 'value' || treeItem.type === 'string'),
            placeholder: 'Value...',
            change: (e) => handleValueChange(e.getParameter('value')),
          }).setLayoutData(new FlexItemData({ growFactor: 1 })),

          new StepInput({
            value: +treeItem.value,
            visible: 'value' in treeItem && treeItem.type === 'number',
            placeholder: 'Value...',
            change: (e) => handleValueChange(e.getParameter('value')),
          }).setLayoutData(new FlexItemData({ growFactor: 1 })),

          new CheckBox({
            selected: !!treeItem.value,
            visible: 'value' in treeItem && treeItem.type === 'boolean',
            text: treeItem.value ? 'True' : 'False',
            select: (e) => handleValueChange(e.getParameter('selected')),
          }).setLayoutData(new FlexItemData({ growFactor: 1 })),
        ],
      }),
    });
  }

  private nextItemId() {
    return this.lastItemId++;
  }

  private replaceItem(
    itemId: number,
    replace: (previous: ExpressionTreeItem) => ExpressionTreeItem | ExpressionTreeItem,
  ) {
    const impl = (current: ExpressionTreeItem) => {
      // If we've found the item with the current ID, return the new replacement.
      if (current.itemId === itemId) {
        return typeof replace === 'function' ? replace(current) : replace;
      }

      // Otherwise, return the same item, but try to find the item to replace within its child tree items.
      const next = { ...current };
      if (next.left) {
        next.left = impl(next.left);
      }

      if (next.right) {
        next.right = impl(next.right);
      }

      if (next.expression) {
        next.expression = impl(next.expression);
      }

      return next;
    };

    const nextRoot = impl(this.state.get().items.root);
    const nextExpressionTree = this.mapTreeItemToExpression(nextRoot);
    this.setExpressionTree(nextExpressionTree);
  }

  private mapExpressionToTreeItem(expression?: FormSchemaExpressionOrPrimitive): ExpressionTreeItem {
    if (expression === null || expression === undefined) {
      return { itemId: this.nextItemId(), type: 'null' };
    }

    if (isPrimitive(expression)) {
      return {
        itemId: this.nextItemId(),
        type: typeof expression as ExtendedExpressionType,
        value: expression,
      };
    }

    if (expression.type === 'value' || expression.type === 'ref') {
      return {
        itemId: this.nextItemId(),
        type: expression.type,
        id: expression.id,
      };
    }

    if (expression.type === 'not') {
      return {
        itemId: this.nextItemId(),
        type: expression.type,
        expression: this.mapExpressionToTreeItem(expression.expression),
      };
    }

    return {
      itemId: this.nextItemId(),
      type: expression.type,
      left: this.mapExpressionToTreeItem(expression.left),
      right: this.mapExpressionToTreeItem(expression.right),
    };
  }

  private mapTreeItemToExpression(treeItem?: ExpressionTreeItem): FormSchemaExpressionOrPrimitive {
    if (!treeItem || treeItem.type === undefined) {
      return null;
    }

    if (treeItem.type === 'null') {
      return null;
    }

    if (treeItem.type === 'string' || treeItem.type === 'number' || treeItem.type === 'boolean') {
      return treeItem.value;
    }

    if (treeItem.type === 'value' || treeItem.type === 'ref') {
      return { type: treeItem.type, id: treeItem.id ?? '' };
    }

    if (treeItem.type === 'not') {
      return { type: 'not', expression: this.mapTreeItemToExpression(treeItem.expression) };
    }

    return {
      type: treeItem.type,
      left: this.mapTreeItemToExpression(treeItem.left),
      right: this.mapTreeItemToExpression(treeItem.right),
    };
  }
}
